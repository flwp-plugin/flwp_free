<?php

namespace FLWP\Page;

/**
 * Feedbacks Page class.
 */
class Feedbacks extends Page {

    /**
     * @return string
     */
    protected function get_template_path(): string {
		return FLWP_PLUGIN_PATH . 'templates/admin/flwp-form-feedback-list.php';
    }

    /**
     * Prepares data for the feedback list page.
     */
    public function render() {
		if (!empty($_GET['filter_action']) && (!isset($_GET['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['nonce'])), 'flwp_admin_nonce'))) {
			wp_safe_redirect(admin_url('admin.php?page=flwp-form-feedbacks'));
			exit;
		}

        parent::render();
    }
}
