<?php

namespace FLWP;

use FLWP\Database\Form;
use FLWP\Database\FormFeedback;
use FLWP\Helper\IndexBuilder;
use FLWP\Page\About;
use FLWP\Page\Affiliate;
use FLWP\Page\Dashboard;
use FLWP\Page\Export;
use FLWP\Page\Feedbacks;
use FLWP\Page\FormBuilder;
use FLWP\Page\Forms;

class Admin {
    public function __construct() {
        add_action('admin_menu', [$this, 'add_menu_page']);
        add_action('admin_init', [$this, 'handle_admin_actions']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_filter('admin_footer_text', [$this, 'add_admin_footer_text']);
        
        // AJAX Handlers
        add_action('wp_ajax_flwp_render_form_builder_templates', [$this, 'ajax_render_form_builder_templates']);
        add_action('wp_ajax_flwp_get_chart_recent_feedbacks', [$this, 'ajax_get_chart_recent_feedbacks']);
        add_action('wp_ajax_flwp_save_form_data', [$this, 'ajax_save_form_data']);
        add_action('wp_ajax_flwp_update_form_status', [$this, 'ajax_update_form_status']);
    }

    public function add_menu_page() {
		if (!EnvironmentChecks::check()) {
			return;
		}

		$icon_svg = 'data:image/svg+xml;base64,' . base64_encode(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#fff" d="M320 544C461.4 544 576 436.5 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304C64 358.3 83.2 408.3 115.6 448.5L66.8 540.8C62 549.8 63.5 560.8 70.4 568.3C77.3 575.8 88.2 578.1 97.5 574.1L215.9 523.4C247.7 536.6 282.9 544 320 544zM192 272C209.7 272 224 286.3 224 304C224 321.7 209.7 336 192 336C174.3 336 160 321.7 160 304C160 286.3 174.3 272 192 272zM320 272C337.7 272 352 286.3 352 304C352 321.7 337.7 336 320 336C302.3 336 288 321.7 288 304C288 286.3 302.3 272 320 272zM416 304C416 286.3 430.3 272 448 272C465.7 272 480 286.3 480 304C480 321.7 465.7 336 448 336C430.3 336 416 321.7 416 304z"/></svg>'
		);

        add_menu_page(
            'FLWP Feedback',
            'FLWP',
            'manage_options',
            'flwp-dashboard',
            function() { (new Dashboard())->render(); },
            $icon_svg,
            30
        );

        add_submenu_page(
            'flwp-dashboard',
           esc_html__('admin.menu.dashboard', 'flwp'),
           esc_html__('admin.menu.dashboard', 'flwp'),
            'manage_options',
            'flwp-dashboard',
            '__return_null'
        );

        add_submenu_page(
            'flwp-dashboard',
           esc_html__('admin.menu.all_forms', 'flwp'),
           esc_html__('admin.menu.all_forms', 'flwp'),
            'manage_options',
            'flwp-forms',
            function() { (new Forms())->render(); }
        );

        add_submenu_page(
            'flwp-dashboard',
           esc_html__('admin.menu.add_form', 'flwp'),
           esc_html__('admin.menu.add_form', 'flwp'),
            'manage_options',
            'flwp-form-builder',
            function() { (new FormBuilder())->render(); }
        );

        add_submenu_page(
            'flwp-dashboard',
           esc_html__('admin.menu.feedback_list', 'flwp'),
           esc_html__('admin.menu.feedback_list', 'flwp'),
            'manage_options',
            'flwp-form-feedbacks',
            function() { (new Feedbacks())->render(); }
        );

        add_submenu_page(
            'flwp-dashboard',
           esc_html__('admin.menu.export', 'flwp'),
           esc_html__('admin.menu.export', 'flwp'),
            'manage_options',
            'flwp-export',
            function() { (new Export())->render(); }
        );

        add_submenu_page(
            'flwp-dashboard',
           esc_html__('admin.menu.about', 'flwp'),
           esc_html__('admin.menu.about', 'flwp'),
            'manage_options',
            'flwp-about',
            function() { (new About())->render(); }
        );
    }

    public function enqueue_assets($hook) {
		if (strpos($hook, 'page_flwp') === false) {
			return;
		}

        if (!EnvironmentChecks::check()) {
            return;
        }

//		$formHelper = new \FLWP\Database\Form();
//		$formHelper->create_initial_forms();

		$languageHelper = new \FLWP\Helper\LanguageHelper();
        $currentLocale = $languageHelper->get_current_locale();

        wp_enqueue_style('flwp-font-awesome', FLWP_PLUGIN_URL . 'assets/css/external/font-awesome.min.css');
        wp_enqueue_style('flwp-admin-style', FLWP_PLUGIN_URL . 'assets/css/dist/flwp-admin.css', [], FLWP_VERSION);

        switch (true) {
            case $hook === 'flwp_page_flwp-form-builder':
                wp_enqueue_style('flwp-form-builder-style', FLWP_PLUGIN_URL . 'assets/css/dist/flwp-form-builder.css', [], FLWP_VERSION);
                wp_enqueue_style('flwp-form-frontend-style', FLWP_PLUGIN_URL . 'assets/css/dist/flwp-form-frontend.css', ['flwp-form-builder-style'], FLWP_VERSION);

                wp_enqueue_script('flwp-sortable-js', FLWP_PLUGIN_URL . 'assets/js/external/sortable.min.js', [], '1.15.7');
                
                $this->enqueue_flwp_admin_script('flwp-form-builder-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-form-builder.js', [], FLWP_VERSION);
                $this->enqueue_flwp_admin_script('flwp-form-frontend-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-form-frontend.js', ['flwp-form-builder-script'], FLWP_VERSION);
                break;
            case ($hook === 'flwp_page_flwp-form-feedbacks' || $hook === 'flwp_page_flwp-export'):
                wp_enqueue_style('flwp-form-frontend-style', FLWP_PLUGIN_URL . 'assets/css/dist/flwp-form-frontend.css', [], FLWP_DB_VERSION);

                $this->enqueue_flwp_admin_script('flwp-admin-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-admin.js', [], FLWP_VERSION);
                $this->enqueue_flwp_admin_script('flwp-form-frontend-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-form-frontend.js', [], FLWP_VERSION);

                wp_localize_script('flwp-admin-script', 'flwpAdmin', [
					'locale' => $currentLocale,
                    'ajaxurl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('flwp_admin_nonce'),
                ]);
                break;
            case ($hook === 'flwp_page_flwp-forms'):
                $this->enqueue_flwp_admin_script('flwp-admin-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-admin.js', [], FLWP_VERSION);
                break;
            case ($hook === 'flwp_page_flwp-about'):
                wp_enqueue_script('common');
                wp_enqueue_script('wp-lists');
                wp_enqueue_script('postbox');
                $this->enqueue_flwp_admin_script('flwp-admin-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-admin.js', [], FLWP_VERSION);
                break;
            case ($hook === 'toplevel_page_flwp-dashboard'):
                wp_enqueue_script('flwp-chart-js', FLWP_PLUGIN_URL . 'assets/js/external/chart.min.js', [], '4.0.0');
                wp_enqueue_script('flwp-sortable-js', FLWP_PLUGIN_URL . 'assets/js/external/sortable.min.js', [], '1.15.0');

                $this->enqueue_flwp_admin_script('flwp-admin-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-admin.js', [], FLWP_VERSION);

                wp_localize_script('flwp-admin-script', 'flwpAdmin', [
					'locale' => $currentLocale,
                    'ajaxurl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('flwp_admin_nonce'),
                ]);
                break;
        }
    }

    public function handle_admin_actions() {
		if (!EnvironmentChecks::check()) {
			wp_safe_redirect(admin_url('admin.php?page=flwp-forms'));
			exit;
		}

		if (isset($_GET['page']) && $_GET['page'] === 'flwp-forms' && isset($_GET['action']) && isset($_GET['id'])) {
			if (!isset($_GET['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['nonce'])), 'flwp_admin_nonce')) {
				wp_safe_redirect(admin_url('admin.php?page=flwp-forms'));
				exit;
			}

            $form_db = new Form();
            $id = (int) $_GET['id'];

            if ( $_GET['action'] === 'duplicate' ) {
                $new_id = $form_db->duplicate_form( $id );
                if ( $new_id ) {
					wp_safe_redirect( admin_url( 'admin.php?page=flwp-forms&duplicate_success=1' ) );
                    exit;
                }
            } elseif ( $_GET['action'] === 'delete' ) {
                if ( $form_db->delete_form( $id ) ) {
					wp_safe_redirect( admin_url( 'admin.php?page=flwp-forms&delete_success=1' ) );
                    exit;
                }
            }
        }

        if ( isset( $_GET['page'] ) && $_GET['page'] === 'flwp-form-builder' && isset( $_GET['id'] ) ) {
			if (!isset($_GET['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['nonce'])), 'flwp_admin_nonce')) {
				wp_safe_redirect(admin_url('admin.php?page=flwp-forms'));
				exit;
			}

            $form_db = new Form();
            $id = (int) $_GET['id'];
            if ( $id && !$form_db->get_form( $id ) ) {
				wp_safe_redirect( admin_url( 'admin.php?page=flwp-forms&form_not_found=1' ) );
                exit;
            }
        }
    }

    public function ajax_save_form_data() {
        check_ajax_referer('flwp_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(esc_html__('Permission denied', 'flwp'));
        }

		$form_id = isset($_POST['form_id']) ? absint($_POST['form_id']) : 0;
		$raw_data = (isset($_POST['form_data']) && is_string($_POST['form_data'])) ? wp_unslash($_POST['form_data']) : '';
		$type = isset($_POST['type']) && is_string($_POST['type']) ? sanitize_key(wp_unslash($_POST['type'])) : 'preview';

		if (!in_array($type, ['preview', 'live'], true)) {
			wp_send_json_error('Invalid save type.', 400);
		}

		if (empty($raw_data)) {
			wp_send_json_error(esc_html__('Missing data', 'flwp'), 400);
		}

		$decoded_data = json_decode($raw_data, true);
		if (empty($decoded_data) || is_array($decoded_data) === false) {
			wp_send_json_error(esc_html__('Invalid data', 'flwp'));
		}

		$valid_form_fields = [
			'headline',
			'description',
			'textarea',
			'button',
			'rating',
		];

		$sanitizer = new \FLWP\Helper\FormDataSanitizer(
			$valid_form_fields
		);

		$sanitizedFormDataDecoded = $sanitizer->sanitize($decoded_data);
		if (is_wp_error($sanitizedFormDataDecoded)) {
			wp_send_json_error(
				[
					'message' => __('Invalid form configuration. Please check your form settings.', 'flwp'),
					'code'    => $sanitizedFormDataDecoded->get_error_code(),
				],
				400
			);
		}

		$sanitizedFormData = wp_json_encode($sanitizedFormDataDecoded);

        $form_name = $sanitizedFormDataDecoded['settings']['main']['title'] ?? esc_html__('admin.db.default_new_form_name', 'flwp');

        $form_db = new Form();
        $result = $form_db->update_form_data($form_id, $sanitizedFormData, $type, $form_name);

        if ($result !== false) {
            // Rebuild targeting index
            $index_builder = new IndexBuilder();
            $index_builder->rebuild();

            $response = ['message' => esc_html__('Form data saved successfully', 'flwp')];
            if ($form_id === 0) {
                $response['new_id'] = $result;
            }
            wp_send_json_success($response);
        } else {
            wp_send_json_error(esc_html__('Failed to save form data', 'flwp'));
        }
    }

    public function ajax_update_form_status() {
        check_ajax_referer('flwp_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(esc_html__('Permission denied', 'flwp'));
        }

        $form_id = isset($_POST['form_id']) ? (int) $_POST['form_id'] : 0;
        $status  = isset($_POST['status']) ? (int) $_POST['status'] : 0;

        if (!$form_id || !$status) {
            wp_send_json_error(esc_html__('Missing data', 'flwp'));
        }

        $form_db = new Form();
        $success = $form_db->update_form_status($form_id, $status);

        if ($success !== false) {
            // Rebuild targeting index
            $index_builder = new IndexBuilder();
            $index_builder->rebuild();

            wp_send_json_success(['message' => esc_html__('Status updated successfully', 'flwp')]);
        } else {
            wp_send_json_error(esc_html__('Failed to update status', 'flwp'));
        }
    }

    public function ajax_render_form_builder_templates() {
        check_ajax_referer('flwp_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(esc_html__('Permission denied', 'flwp'));
        }

        $templates = [
            'fields',
            'general',
            'display',
            'styles',
            'targeting',
            'confirmation',
            'notification',
            'tracking',
        ];

        $rendered = [];

        foreach ($templates as $tmpl) {
            $php_file  = FLWP_PLUGIN_PATH . 'templates/admin/form-builder/' . $tmpl . '.php';

            ob_start();
            if (!file_exists($php_file)) {
                continue;
            }

            include $php_file;

            $rendered[$tmpl] = ob_get_clean();
        }

        wp_send_json_success([
             'templates' => $rendered,
             'html'      => implode("\n\n", $rendered),
         ]);
    }

    public function ajax_get_chart_recent_feedbacks() {
        check_ajax_referer('flwp_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(esc_html__('Permission denied', 'flwp'));
        }

        $feedback_db = new FormFeedback();
        $feedbacks = $feedback_db->get_feedbacks(['range' => 'last_30_days', 'limit' => 500]);

        $formatted_feedback = [];
        foreach ($feedbacks as $entity) {
            $data = $entity->toArray();
            // Map created to time for JS chart compatibility
            $data['time'] = $data['created'];
            $formatted_feedback[] = $data;
        }

        wp_send_json_success([
            'feedback' => $formatted_feedback
        ]);
    }

    /**
     * Adds a "Thank You" message to the admin footer content.
     *
     * @param string $content Current admin footer content.
     * @return string New admin footer content.
     */
    public function add_admin_footer_text( $content ): string {
        $screen = get_current_screen();

        if ( ! $screen || false === strpos( $screen->base, 'flwp' ) ) {
            return (string) $content;
        }

        if ( ! is_string( $content ) ) {
            $content = '';
        }

		$content .= sprintf(
			esc_html__( 'admin.notice.thank_you', 'flwp' ),
		    '<a href="' . esc_url( 'https://flwp.de/' ) . '" target="_blank" rel="noopener noreferrer">FLWP</a>'
		);

        return $content;
    }

	private function enqueue_flwp_admin_script($handle, $file, $deps = [], $version = FLWP_VERSION) {
		$deps[] = 'wp-i18n';

		wp_enqueue_script($handle, $file, $deps, $version, true);
		wp_set_script_translations($handle, 'flwp', FLWP_PLUGIN_PATH . 'languages/');
	}
}
