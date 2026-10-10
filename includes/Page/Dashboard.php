<?php

namespace FLWP\Page;

use FLWP\Database\FormFeedback;
use FLWP\EnvironmentChecks;

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
			$feedback_db = new FormFeedback();
			$stats = $feedback_db->get_stats();

			$this->data = [
				'stats' => $stats,
			];

			parent::render();
		}
	}
}
