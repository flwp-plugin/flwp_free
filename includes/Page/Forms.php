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

		$data = [
			'isDelete' => false,
			'isDuplicate' => false,
			'formNotFound' => false,
			'form_table' => $form_table,
		];

		if (!empty($_GET['nonce']) && wp_verify_nonce($_GET['nonce'], 'flwp_admin_nonce')) {
			$data['isDelete'] = (bool) absint(wp_unslash($_GET['delete_success'] ?? 0));
			$data['isDuplicate'] = (bool) absint($_GET['duplicate_success'] ?? 0);
			$data['formNotFound'] = (bool) absint($_GET['form_not_found'] ?? 0);
		}

        $this->data = $data;

        parent::render();
    }
}
