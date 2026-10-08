<?php

namespace FLWP\Page;

/**
 * Export Page class.
 */
class Export extends Page {

    /**
     * @return string
     */
    protected function get_template_path(): string {
		return FLWP_PLUGIN_PATH . 'templates/admin/flwp-export.php';
    }

    /**
     * Prepares data for the export page.
     */
    public function render() {
		$form_db = new \FLWP\Database\Form();
		$forms = $form_db->get_forms(['limit' => 999, 'orderby' => 'flwp_fd_name', 'order' => 'ASC']);

        $this->data = [
            'forms' => $forms,
        ];

        parent::render();
    }
}
