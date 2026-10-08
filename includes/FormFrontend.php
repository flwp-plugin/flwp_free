<?php

namespace FLWP;

use FLWP\Database\Form as FormDB;
use FLWP\Database\FormFeedback;
use FLWP\Helper\FormHelper;
use FLWP\Helper\IndexBuilder;
use FLWP\Helper\LanguageHelper;

class FormFrontend {

    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 100);
        add_shortcode('flwp_form', [$this, 'render_form_shortcode']);
        add_action('wp_footer', [$this, 'render_footer_forms']);
        add_filter('the_content', [$this, 'auto_append_in_content']);

        add_action('wp_ajax_flwp_get_forms_data', [$this, 'ajax_get_forms_data']);
        add_action('wp_ajax_nopriv_flwp_get_forms_data', [$this, 'ajax_get_forms_data']);

        add_action('wp_ajax_flwp_submit_feedback', [$this, 'ajax_submit_feedback']);
        add_action('wp_ajax_nopriv_flwp_submit_feedback', [$this, 'ajax_submit_feedback']);
    }

    public function enqueue_assets() {
        $formHelper = new FormHelper();
        $langHelper = new LanguageHelper();

        wp_enqueue_style('flwp-font-awesome', FLWP_PLUGIN_URL . 'assets/css/external/font-awesome.min.css');
        wp_enqueue_style('flwp-form-frontend-style', FLWP_PLUGIN_URL . 'assets/css/dist/flwp-form-frontend.css', [], FLWP_DB_VERSION);

        wp_enqueue_script('flwp-form-frontend-script', FLWP_PLUGIN_URL . 'assets/js/dist/flwp-form-frontend.js', ['wp-i18n'], FLWP_VERSION, true);
		wp_set_script_translations('flwp-form-frontend-script', 'flwp', FLWP_PLUGIN_PATH . 'languages/');

        $currentPath = wp_parse_url(sanitize_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '')), PHP_URL_PATH) ?: '';
        $pathHash = hash('crc32b', $currentPath);

        wp_localize_script('flwp-form-frontend-script', 'flwpFormFrontend', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flwp_form_nonce'),
            'version' => $formHelper->getVersionForUser(),
            'pluginVersion' => FLWP_VERSION,
            'pathHash' => $pathHash,
            'locale' => $langHelper->get_current_locale(),
			'postType' => get_post_type(),
			'isFrontpage' => is_front_page()
        ]);
    }

    /**
     * [flwp_form id="1"]
     */
    public function render_form_shortcode($atts) {
        if (empty($atts['id']) || is_numeric($atts['id']) === false) {
            return '';
        }

        $formId = (int) $atts['id'];

        return $this->get_in_content_form_html('shortcode', $formId)['html'];
    }

    public function auto_append_in_content($content) {
        if ((!is_main_query() || !in_the_loop() || is_admin())
			&& !is_front_page())
		{
            return $content;
        }

        $formData = $this->get_in_content_form_html('in-content');

        $preContentHtml = $formData['pre-content'] ?? '';
        $postContentHtml = $formData['post-content'] ?? '';

        return $preContentHtml . $content . $postContentHtml;
    }

    private function to_px($value, string $unit): float
    {
        if ($value === null) {
            return 0.0;
        }
        if (is_string($value)) {
            $value = trim($value);
            if ($value === '' || strtolower($value) === 'auto') {
                return 0.0;
            }
        }
        if (!is_numeric($value)) {
            return 0.0;
        }
        $num = (float) $value;
        switch (strtolower($unit)) {
            case 'px':
                return $num;
            case 'rem':
            case 'em':
                return $num * 16.0; // Basis 16px
            default:
                return $num; // Fallback: als px behandeln
        }
    }

    private function get_incontent_extra_height_px(array $formData): float
    {
        $globalDataSpacing = $formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing'] ?? null;
        if (!$globalDataSpacing || (!isset($globalDataSpacing['padding']) && !isset($globalDataSpacing['margin']))) {
            return 90.0; // Fallback wie bisher
        }

        $sum = 0.0;

        if (!empty($globalDataSpacing['padding']) && is_array($globalDataSpacing['padding'])) {
            $p = $globalDataSpacing['padding'];
            $unit = $p['unit'] ?? 'px';
            $sum += $this->to_px($p['top'] ?? 0, $unit);
            $sum += $this->to_px($p['bottom'] ?? 0, $unit);
        }

        if (!empty($globalDataSpacing['margin']) && is_array($globalDataSpacing['margin'])) {
            $m = $globalDataSpacing['margin'];
            $unit = $m['unit'] ?? 'px';
            $sum += $this->to_px($m['top'] ?? 0, $unit);
            $sum += $this->to_px($m['bottom'] ?? 0, $unit);
        }

        return $sum;
    }

    private function get_box_model_styles(array $boxObj): string
    {
        if (empty($boxObj)) {
            return '';
        }

        $unit = $boxObj['unit'] ?? 'px';
        $sides = ['top', 'right', 'bottom', 'left'];
        $values = [];

        foreach ($sides as $side) {
            $val = $boxObj[$side] ?? '0';
            if ($val === 'auto') {
                $values[] = 'auto';
            } elseif ($val === '' || $val === null) {
                $values[] = '0';
            } elseif (is_numeric($val)) {
                $values[] = $val . $unit;
            } else {
                $values[] = $val;
            }
        }

        return implode(' ', $values);
    }

    /**
     * Bestimmt das aktive Formular für die aktuelle Seite basierend auf dem Targeting-Index.
     * Wird für die Anzeigetypen 'feedback-button', 'exit-intent' genutzt
     */
    public function render_footer_forms() {
        // 1. Alle für diese Seite qualifizierten Overlay-Formulare laden
        $preparedFormData = $this->get_prepared_form_data(['overlay'], false);
        $overlaysConfig = [];

        if (!empty($preparedFormData['overlay'])) {
            foreach ($preparedFormData['overlay'] as $entry) {
                $formData = $entry['formData'];
                $settings = $formData['settings'] ?? [];
				$displaySubType = $settings['display']['displaySubType'] ?? 'modal';
                $displaySubTypeData = $settings['display']['subTypeData'][$displaySubType] ?? [];
                $clickConf = $displaySubTypeData['triggerData']['click'] ?? [];

                // Nur die für das JS-Handling relevanten Daten extrahieren
                $overlaysConfig[] = [
                    'id'          => $entry['id'],
                    'formUpdated' => $entry['formUpdated'],
                    'name'        => $settings['main']['title'] ?? esc_html__('admin.db.default_form_name', 'flwp'),
                    'trigger'     => $displaySubTypeData['trigger'] ?? 'click', // click, exit-intent, delay, scroll
					'displaySubType' => $displaySubType,
                    'globalData' => [
                        'position'          => $displaySubTypeData['globalData']['spacing']['position'] ?? 'center',
                        'closeDays'         => $displaySubTypeData['globalData']['main']['cookieCloseDays'] ?? 1,
                        'submitDays'        => $displaySubTypeData['globalData']['main']['cookieSubmitDays'] ?? 30,
                        'cookieScope'       => $displaySubTypeData['globalData']['main']['cookieScope'] ?? 'domain',
                        'overlayWidth'      => $displaySubTypeData['globalData']['spacing']['overlayWidth'] ?? '',
                        'showBackdrop'      => $displaySubTypeData['globalData']['main']['showBackdrop'] ?? true,
                        'allowBodyScroll'   => $displaySubTypeData['globalData']['main']['allowBodyScroll'] ?? true,
                        'closeOnBackdrop'   => $displaySubTypeData['globalData']['main']['closeOnBackdrop'] ?? true,
                        'closeOnEsc'        => $displaySubTypeData['globalData']['main']['closeOnEsc'] ?? true,
                        'hideHeader'        => $displaySubTypeData['globalData']['main']['hideHeader'] ?? false,
                        'hideFooter'        => $displaySubTypeData['globalData']['main']['hideFooter'] ?? false,
                    ],
                    // Spezifische Einstellungen je nach Trigger-Typ
                    'triggerSettings' => [
                        'clickSelector' => $clickConf['selector'] ?? '',
                        'hideOnClose'   => !empty($clickConf['hideOnClose']),
                        'hideOnSubmit'  => !empty($clickConf['hideOnSubmit']),
						'useStandard'   => $displaySubType === "feedback-button",
                        'feedbackButton' => $displaySubTypeData,
                        'delaySeconds'  => $displaySubTypeData['triggerData']['delay']['seconds'] ?? 5,
                        'scrollType'    => $displaySubTypeData['triggerData']['scroll']['type'] ?? 'end',
                        'scrollPercent' => $displaySubTypeData['triggerData']['scroll']['percent'] ?? 50,
                        'exitIntentDelay' => $displaySubTypeData['triggerData']['exitIntent']['delay'] ?? 'immediate',
                    ],
                    'style' => [
                        'customClasses' => $settings['main']['customClasses'] ?? '',
                        'headerIndicator' => $displaySubTypeData['globalData']['design']['headerIndicator'] ?? 'title',
                        'headerTitle' => $displaySubTypeData['globalData']['design']['headerTitle'] ?? '',
                        'showFooterText' => isset($displaySubTypeData['globalData']['design']['showFooterText']) ? (bool)$displaySubTypeData['globalData']['design']['showFooterText'] : true,
                        'customFooterText' => $displaySubTypeData['globalData']['design']['customFooterText'] ?? esc_html__('admin.frontend.default_footer_text', 'flwp'),
                    ],
					'targeting' => $formData['targeting'] ?? [],
                ];
            }
        }

        // Wenn keine Overlays aktiv sind, müssen wir auch kein Skript oder Template ausgeben
        if (empty($overlaysConfig)) {
            return '';
        }

        // 2. Die Daten als globales JSON-Objekt für JS über wp_localize_script bereitstellen (saubere WordPress-Methode)
        wp_localize_script('flwp-form-frontend-script', 'flwpActiveOverlayData', [
            'overlayData' => json_encode($overlaysConfig)
        ]);

        include FLWP_PLUGIN_PATH . 'templates/frontend/flwp-form-footer.php';

        return '';
    }

    private function get_in_content_form_html(string $type = 'shortcode', int $form_id = 0) {
        $inContentFormData = [
            'html' => ''
        ];

        if (in_array($type, ['shortcode', 'in-content']) === false) {
            return $inContentFormData;
        }

        $singleForm = $type === 'shortcode';
        $preparedFormData = $this->get_prepared_form_data([$type], $singleForm, $form_id);
        if (empty($preparedFormData[$type])) {
            return $inContentFormData;
        }

        $preparedInContentFormData = [
            'html' => '',
            'pre-content' => '',
            'post-content' => '',
        ];

        foreach ($preparedFormData[$type] as $entry) {
            $formData = $entry['formData'];
            $formUpdated = $entry['formUpdated'];
            switch ($type) {
                case 'shortcode':
                    $preparedInContentFormData['html'] = $this->get_shortcode_template($type, $type, $formData, $formUpdated);
                    break;
                case 'in-content':
                    $formType = 'pre-content';
                    if ($formData['settings']['display']['subTypeData']['shortcode']['autoPosition'] === 'bottom') {
                        $formType = 'post-content';
                    }

                    $typeHtml = $this->get_shortcode_template($type, $formType, $formData, $formUpdated);
                    $preparedInContentFormData[$formType] .= $typeHtml;
                    break;
            }
        }

        return $preparedInContentFormData;
    }

    private function get_shortcode_template(string $type, string $formType, array $formData, string $formUpdated = '')
    {
        $inlineStyles = [];

        $formMinHeight = null;
		$formMaxWidth = null;
        if (!empty($formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['minHeight'])) {
            $extra = $this->get_incontent_extra_height_px($formData); // padding/margin
            $formMinHeight = (float)$formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['minHeight'] + $extra;
        }

        if (isset($formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['customMinHeight'])
			&& $formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['customMinHeight'] >= 0) {
            $formMinHeight = (float)$formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['customMinHeight'];
        }

        if (is_numeric($formMinHeight)) {
            $inlineStyles[] = "min-height: {$formMinHeight}px";
        }

		if (!empty($formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['maxWidth'])) {
            $formMaxWidth = (float)$formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing']['maxWidth'];
        }

        if ($formMaxWidth) {
            $inlineStyles[] = "max-width: {$formMaxWidth}px";
        }

        // Padding & Margin Inline-Styles
        $globalDataSpacing = $formData['settings']['display']['subTypeData']['shortcode']['globalData']['spacing'] ?? null;
		$globalDataDesign = $formData['settings']['display']['subTypeData']['shortcode']['globalData']['design'] ?? null;
        if ($globalDataSpacing) {
			if (!empty($globalDataSpacing['padding'])) {
				$padding = $this->get_box_model_styles($globalDataSpacing['padding']);
				if ($padding) {
					$inlineStyles[] = "padding: $padding";
				}
			}

			if (!empty($globalDataSpacing['margin'])) {
				$margin = $this->get_box_model_styles($globalDataSpacing['margin']);
				if ($margin) {
					$inlineStyles[] = "margin: $margin";
				}
			}
		}

        $customClasses = '';
        if (!empty($formData['settings']['main']['customClasses'])) {
            $customClasses = $formData['settings']['main']['customClasses'];
        }

        ob_start();
        include FLWP_PLUGIN_PATH . 'templates/frontend/flwp-form-in-content.php';

        return ob_get_clean();
    }

    private function get_prepared_form_data(array $types, bool $singleForm = false, int $target_form_id = 0)
    {
        $preparedFormData = [];
        $index_builder = new IndexBuilder();

		$isAdmin = current_user_can('manage_options');
		$indexStatus = $isAdmin ? 'preview' : 'live';

        // Wir fragen mehrere Typen ab
        $targeting_results = $index_builder->get_form_ids($types, $indexStatus);
        if (empty($targeting_results)) {
            return [];
        }

        $form_db = new FormDB();

        foreach ($targeting_results as $type => $formIds) {
            if (empty($formIds)) {
                continue;
            }

            if ($singleForm) {
                if ($type === 'shortcode' && $target_form_id > 0) {
                    if (!in_array($target_form_id, $formIds)) {
                        continue;
                    }
                    $formIds = [$target_form_id];
                } else {
                    $formIds = [$formIds[0]];
                }
            }

            foreach ($formIds as $formId) {
                $form = $form_db->get_form($formId);
                if (!$form) {
                    continue;
                }

                $form_helper = new FormHelper();
                if (!$form_helper->should_display_form($form)) {
                    continue;
                }

                $formVersionData = $form_helper->get_current_form_version_data($form);
                if (empty($formVersionData['data'])) {
                    continue;
                }

                $formData = json_decode($formVersionData['data'], true);
                if (empty($formData)) {
                    continue;
                }

                if (empty($preparedFormData[$type])) {
                    $preparedFormData[$type] = [];
                }

                $preparedFormData[$type][] = [
                    'id'          => $formId,
                    'version'     => $formVersionData['version'],
                    'formUpdated' => gmdate('YmdHis', strtotime($form->getUpdated())),
                    'formData'    => $formData,
                ];
            }
        }

        return $preparedFormData;
    }

    public function ajax_get_forms_data() {
        if (!check_ajax_referer('flwp_form_nonce', 'nonce', false)) {
            wp_send_json_error('Invalid nonce', 403);
        }

        $form_ids = isset($_POST['form_ids']) ? array_map('intval', (array)$_POST['form_ids']) : [];

        if (empty($form_ids)) {
            wp_send_json_success([]);
        }

        $form_db = new FormDB();
        $results = [];

        $form_helper = new FormHelper();
        foreach ($form_ids as $id) {
            $form = $form_db->get_form($id);
            if ($form && $form_helper->should_display_form($form)) {
                $formVersionData = $form_helper->get_current_form_version_data($form);
                $form_data = json_decode($formVersionData['data'], true);
                if ($form_data) {
                    $results[$id] = [
                        'formId'      => $id,
                        'version'     => $formVersionData['version'],
                        'formUpdated' => gmdate('YmdHis', strtotime($form->getUpdated())),
                        'formData'    => $form_data,
                    ];
                }
            }
        }

        wp_send_json_success($results);
    }

    public function ajax_submit_feedback() {
        if (!check_ajax_referer('flwp_form_nonce', 'nonce', false)) {
            wp_send_json_error('Invalid nonce', 403);
        }

        $form_id = isset($_POST['form_id']) ? (int) $_POST['form_id'] : 0;
		$answers_raw = isset($_POST['answers']) ? sanitize_textarea_field(wp_unslash($_POST['answers'])) : '';
        $active_step2_trigger_id = isset($_POST['active_step2_trigger_id']) ? sanitize_text_field(wp_unslash($_POST['active_step2_trigger_id'])) : '';

        if (!$form_id || empty($answers_raw)) {
            wp_send_json_error('Missing data', 400);
        }

        $answers = json_decode($answers_raw, true);
        if (!is_array($answers)) {
            wp_send_json_error('Invalid answers format', 400);
        }

        $form_db = new FormDB();
        $form = $form_db->get_form($form_id);

        if (!$form) {
            wp_send_json_error('Form not found', 404);
        }

        $form_helper = new FormHelper();
        
        $formVersionData = $form_helper->get_current_form_version_data($form);
        $decodedFormVersionData = json_decode($formVersionData['data'], true);
        if (empty($decodedFormVersionData['steps'])) {
            wp_send_json_error('Invalid form structure', 500);
        }

        // Honeypot check
        if (isset($decodedFormVersionData['settings']['main']['honeypot']) && $decodedFormVersionData['settings']['main']['honeypot'] !== false) {
            if (!empty($_POST['flwp_hp_field'])) {
                wp_send_json_success('Feedback saved (hp)');
                exit;
            }
        }

        // Map answers for easier lookup
        $answers_map = [];
        foreach ($answers as $answer) {
            if (isset($answer['elementId'])) {
                $answers_map[$answer['elementId']] = $answer['value'] ?? '';
            }
        }

        // Mix answers into steps
        if (isset($decodedFormVersionData['steps']['step1']) && is_array($decodedFormVersionData['steps']['step1'])) {
            foreach ($decodedFormVersionData['steps']['step1'] as $key => $element) {
                if (isset($answers_map[$element['id']])) {
                    $decodedFormVersionData['steps']['step1'][$key]['value'] = $answers_map[$element['id']];
                }
            }
        }

        if (isset($decodedFormVersionData['steps']['step2']) && is_array($decodedFormVersionData['steps']['step2'])) {
            foreach ($decodedFormVersionData['steps']['step2'] as $trigger_id => $elements) {
                if (is_array($elements)) {
                    foreach ($elements as $key => $element) {
                        if (isset($answers_map[$element['id']])) {
                            $elements[$key]['value'] = $answers_map[$element['id']];
                        }
                    }
                    $decodedFormVersionData['steps']['step2'][$trigger_id] = $elements;
                }
            }
        }

        // Save to database
        $form_feedback_db = new FormFeedback();

        $tracking_payload = [];
        if (!empty($_POST['tracking_data'])) {
            $tracking_payload = json_decode(sanitize_textarea_field(wp_unslash($_POST['tracking_data'])), true) ?: [];
        }

		$formType = sanitize_text_field(wp_unslash($_POST['form_type'] ?? 'shortcode'));

        $success = $form_feedback_db->add_feedback([
            'form_id'       => $form_id,
            'form_type'     => $formType,
            'feedback_data' => [
                'title' => $decodedFormVersionData['settings']['main']['title'] ?? '',
                'steps' => $decodedFormVersionData['steps'] ?? [],
                'active_step2_trigger_id' => $active_step2_trigger_id,
            ],
            'tracking_data' => $tracking_payload
        ]);

        if ($success) {
            $this->send_notification_email($decodedFormVersionData, $formType);
            wp_send_json_success(esc_html__('admin.notification.feedback_saved', 'flwp'));
        } else {
            wp_send_json_error(esc_html__('admin.notification.database_error', 'flwp'), 500);
        }
    }

    private function send_notification_email(array $form_json, string $form_type) {
        $notification = $form_json['notification'] ?? [];
        if (empty($notification['enabled'])) {
            return;
        }

        $to = $notification['recipient'] ?? '';
        if (empty($to)) {
            $to = get_option('admin_email');
        }

        if (!is_email($to)) {
            return;
        }

        $subject = $notification['subject'] ?? esc_html__('admin.notification.subject', 'flwp');
        $sender_name = $notification['senderName'] ?? get_bloginfo('name');
        $sender_email = $notification['senderEmail'] ?? get_option('admin_email');
        
        $locale = get_locale();
        $template_path = plugin_dir_path(__FILE__) . '../templates/frontend/email/feedback-confirmation-' . $locale . '.html';

        if (!file_exists($template_path)) {
            $template_path = plugin_dir_path(__FILE__) . '../templates/frontend/email/feedback-confirmation-en_EN.html';
        }

        if (file_exists($template_path)) {
            $body_tpl = file_get_contents($template_path);
        } else {
            $body_tpl = esc_html__('admin.notification.email_body', 'flwp');
        }
        
        $all_fields_text = "";
        $reply_to = "";

        $form_helper = new FormHelper();
        $input_fields = $form_helper->get_form_input_fields($form_json, true);

        foreach ($input_fields as $field) {
			$separator = ' ';
			if (in_array(substr($field['label'], -1), ['?', ':']) === false) {
				$separator = ': ';
			}
            $all_fields_text .= $field['label'] . $separator . $field['value'] . "<br>";
        }

        $replacements = [
            '{feedback_values}' => $all_fields_text,
            '{form_name}' => $form_json['settings']['main']['title'] ?? esc_html__('admin.notification.default_form_name', 'flwp'),
            '{form_type}' => $form_helper->get_form_type_name($form_json['settings']['display']['displaySubType'] ?? 'shortcode'),
            '{form_id}' => $form_json['id'] ?? '-',
            '{date}' => date_i18n(get_option('date_format')),
            '{time}' => date_i18n(get_option('time_format')) . ' ' . esc_html__('admin.notification.time_suffix', 'flwp'),
            '{page_url}' => sanitize_url(wp_unslash($_SERVER['HTTP_REFERER'] ?? ''))
        ];

        $body = strtr($body_tpl, $replacements);

        $headers = [
			'Content-Type: text/html; charset=UTF-8',
            'From: ' . $sender_name . ' <' . $sender_email . '>'
        ];

        if (!empty($reply_to)) {
            $headers[] = 'Reply-To: ' . $reply_to;
        }

        wp_mail($to, $subject, $body, $headers);
    }
}
