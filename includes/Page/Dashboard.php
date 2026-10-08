<?php

namespace FLWP\Page;

use FLWP\Database\FormFeedback;
use FLWP\EnvironmentChecks;
use FLWP\Lists\FormFeedbackListTable;

/**
 * Dashboard Page class.
 */
class Dashboard extends Page {

    /**
     * @return string
     */
    protected function get_template_path(): string {
        return FLWP_PLUGIN_PATH . 'templates/admin/flwp-dashboard.php';
    }

    /**
     * Prepares data for the dashboard.
     */
    public function render() {
		if (EnvironmentChecks::check()) {
			$section = sanitize_text_field(wp_unslash($_GET['section'] ?? 'start'));

			$feedback_db = new FormFeedback();
			$stats = $feedback_db->get_stats();

			$this->data = [
				'section' => $section,
				'stats'   => $stats,
			];

			parent::render();
		}
    }
}
