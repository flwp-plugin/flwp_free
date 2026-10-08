<?php

namespace FLWP\Page;

use FLWP\Lists\FormListTable;

/**
 * Forms List Page class.
 */
class Forms extends Page {

    /**
     * @return string
     */
    protected function get_template_path(): string {
        return FLWP_PLUGIN_PATH . 'templates/admin/flwp-form-list.php';
    }

    /**
     * Prepares data for the forms page.
     */
    public function render() {

        $form_table = new FormListTable();
        $form_table->prepare_items();

        $this->data = [
            'form_table' => $form_table,
			'nonce' => wp_create_nonce('flwp_admin_nonce')
        ];

        parent::render();
    }
}
