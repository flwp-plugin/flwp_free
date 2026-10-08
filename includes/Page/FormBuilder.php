<?php

namespace FLWP\Page;

use FLWP\Database\Form;
use FLWP\Helper\ConfigHelper;
use FLWP\Helper\FormHelper;
use FLWP\Helper\LanguageHelper;

/**
 * Form Builder Page class.
 */
class FormBuilder extends Page {

    /**
     * @return string
     */
    protected function get_template_path(): string {
        return FLWP_PLUGIN_PATH . 'templates/admin/flwp-form-builder.php';
    }

    /**
     * Prepares data for the form builder page.
     */
    public function render() {
        $configHelper = new ConfigHelper();

		$langugageHelper = new LanguageHelper();
		$currentLocale = $langugageHelper->get_current_locale();

        $form_id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $form_data = json_encode($configHelper->get_default_form_config(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $form_updated = '';
		$form_saved = null;
		$form_published = null;

        if ($form_id) {
            $form_db = new Form();
            $form = $form_db->get_form($form_id);

            if ($form) {
                $form_helper = new FormHelper();
                $formVersionData = $form_helper->get_current_form_version_data($form);
                if ($formVersionData) {
                    $decoded_form_data = json_decode($formVersionData['data'], true);
                    if (!empty($decoded_form_data)) {
                        $decoded_form_data = $form_helper->enrich_form_data_with_defaults($decoded_form_data);
                        $form_data = json_encode($decoded_form_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                    }
                }
                $form_updated = gmdate('YmdHis', strtotime($form->getUpdated()));
				if (!empty($form->getLastSaved())) {
					$form_saved = \DateTime::createFromFormat('Y-m-d H:i:s', $form->getLastSaved(), wp_timezone());
				}
				if (!empty($form->getLastPublished())) {
					$form_published = \DateTime::createFromFormat('Y-m-d H:i:s', $form->getLastPublished(), wp_timezone());
				}
            }
        }

		wp_localize_script('flwp-form-builder-script', 'flwpFormBuilder', [
			'locale'                 => $currentLocale,
			'ajaxurl'                => admin_url('admin-ajax.php'),
		    'nonce'                  => wp_create_nonce('flwp_admin_nonce'),
		    'fieldTypesConfig'       => $configHelper->get_field_types_config(),
		    'formTemplates'          => $configHelper->get_form_templates(),
		    'formId'                 => $form_id,
		    'formData'               => $form_data,
		    'formUpdated'            => $form_updated,
		    'formSavedTimestamp'     => $form_saved ? $form_saved->getTimestamp() : null,
		    'formPublishedTimestamp' => $form_published ? $form_published->getTimestamp() : null,
		    'pluginVersion'          => FLWP_VERSION,
		    'pluginUrl'              => FLWP_PLUGIN_URL,
		    'isPro'                  => flwp_fs()->can_use_premium_code__premium_only() ? 1 : 0,
		    'upgradeUrl'             => flwp_fs()->get_upgrade_url(),
			'can_use_premium_code'   => flwp_fs()->can_use_premium_code__premium_only(),
		]);

        $this->data = [
            'formId'   => $form_id,
            'formData' => !empty($decoded_form_data) ? $decoded_form_data : [],
            'formSaved'     => $form_saved,
            'formPublished' => $form_published,
        ];

        parent::render();
    }
}
