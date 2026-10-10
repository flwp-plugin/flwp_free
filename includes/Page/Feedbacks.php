<?php

namespace FLWP\Page;

use FLWP\Lists\FormFeedbackListTable;

/**
 * Feedbacks Page class.
 */
class Feedbacks extends Page {

	/**
	 * @return string
	 */
	protected function get_template_path(): string {
		$templatePath = FLWP_PLUGIN_PATH . 'templates/admin/flwp-form-feedback-list.php';

		return $templatePath;
	}

	/**
	 * Prepares data for the feedback list page.
	 */
	public function render() {
		$feedback_table = new FormFeedbackListTable();
		$feedback_table->prepare_items();

		$this->data = [
			'feedback_table' => $feedback_table,
		];

		parent::render();
	}
}
