<?php

namespace FLWP\Helper;

use FLWP\Database\Entity\Form;

class FormHelper {

    protected const PREVIEW_VERSION = 'preview';

    protected const LIVE_VERSION = 'live';

    public function getVersionForUser() {
        $version = self::LIVE_VERSION;
        if (current_user_can('manage_options')) {
            $version = self::PREVIEW_VERSION;
        }

        return $version;
    }

    /**
     * Ermittelt die korrekten Formulardaten (Preview oder Live) basierend auf dem Benutzerstatus.
     * 
     * @param Form $form Das Formular-Entity-Objekt.
     * @return array Die JSON-Daten des Formulars.
     */
    public function get_current_form_version_data(Form $form): array {
        $version = $this->getVersionForUser();

        return [
            'version' => $version,
            'data' => ($version === self::PREVIEW_VERSION ? $form->getPreviewData() : $form->getLiveData())
        ];
    }

    /**
     * Prüft, ob ein Formular angezeigt werden darf.
     * 
     * Kriterien:
     * - Status muss 2 (live) oder 3 (admin-only) sein.
     *
     * @param Form $form Das Formular-Entity-Objekt.
     * @return bool True, wenn das Formular angezeigt werden darf.
     */
    public function should_display_form(Form $form): bool {
        $is_admin_only = $form->getStatus() === 3;
        if ($is_admin_only) {
            return current_user_can('manage_options');
        }

        // Grundvoraussetzung: Status muss 2 sein
        if ($form->getStatus() !== 2) {
            return false;
        }

        $formVersionData = $this->get_current_form_version_data($form);
        if (empty($formVersionData['data'])) {
            return false;
        }

        $form_data = json_decode($formVersionData['data'], true);
        if (empty($form_data)) {
            return false;
        }

        // Cookie-Check (Backend-seitiges Ausblenden nach Submit/Close)
        $settings = $form_data['settings'] ?? [];
        $globalData = $settings['display']['globalData']['main'] ?? [];
        $scope = $globalData['cookieScope'] ?? 'domain';
        
        $formId = $form->getId();
        $pathKey = '';

        if ($scope === 'page') {
            $currentPath = wp_parse_url(sanitize_url(['REQUEST_URI'] ?? ''), PHP_URL_PATH) ?: '';
            $pathKey = '_' . hash('crc32b', $currentPath);
        }
        
        $submitCookie = "flwp_submitted_{$formId}{$pathKey}";
        $closeCookie = "flwp_closed_{$formId}{$pathKey}";
        
        if (isset($_COOKIE[$submitCookie]) || isset($_COOKIE[$closeCookie])) {
            return false;
        }

        return true;
    }

    /**
     * Durchläuft alle Input-Felder des Formulars (Step 1 und Step 2).
     *
     * @param array $form_json Die Formular-Konfiguration als Array.
     * @param bool $only_with_value Ob nur Felder mit existierendem Value zurückgegeben werden sollen.
     * @return array Liste der Input-Felder mit id, type, label und value.
     */
    public function get_form_input_fields(array $form_json, bool $only_with_value = false): array {
        $input_fields = [];
        $config_helper = new ConfigHelper();
        $field_configs = $config_helper->get_field_types_config();

        $steps = $form_json['steps'] ?? [];

        // Step 1
        if (isset($steps['step1']) && is_array($steps['step1'])) {
            foreach ($steps['step1'] as $element) {
                $processed = $this->process_element($element, $field_configs, $only_with_value);
                if ($processed) {
                    $input_fields[] = $processed;
                }
            }
        }

        // Step 2
        if (isset($steps['step2']) && is_array($steps['step2'])) {
            foreach ($steps['step2'] as $elements) {
                if (is_array($elements)) {
                    foreach ($elements as $element) {
                        $processed = $this->process_element($element, $field_configs, $only_with_value);
                        if ($processed) {
                            $input_fields[] = $processed;
                        }
                    }
                }
            }
        }

        return $input_fields;
    }

    /**
     * Generiert die Anfangsdaten für das Formular, welche während des installieren des Plugins in die DB eingetragen werden sollen.
     *
     * @return array Die Anfangsdaten für das Formular.
     */
    public function generate_initial_form_data(): array
    {
        $configHelper = new ConfigHelper();

        $formData = [
            [
                'title' => esc_html__('admin.initial_form.in_content.title', 'flwp'),
                'formStepDataType' => 'default',
                'settingsOverwrite' => [
                    'settings' => [
						'display' => [
							'displayType' => 'in-content',
							'displaySubType' => 'shortcode'
						]
                    ]
                ]
            ],
            [
                'title' => esc_html__('admin.initial_form.feedback_button.title', 'flwp'),
                'formStepDataType' => 'feedback-button',
                'settingsOverwrite' => [
                    'settings' => [
						'display' => [
							'displayType' => 'overlay',
							'displaySubType' => 'feedback-button',
							'subTypeData' => [
								'feedback-button' => [
									'globalData' => [
										'spacing' => [
											'position' => 'bottom-right',
										]
									]
								]
							]
						],
                    ]
                ]
            ],
            [
                'title' => esc_html__('admin.initial_form.exit_intent.title', 'flwp'),
                'formStepDataType' => 'exit-intent',
                'settingsOverwrite' => [
                    'settings' => [
						'display' => [
							'displayType' => 'overlay',
							'displaySubType' => 'modal',
							'subTypeData' => [
								'modal' => [
									'trigger' => 'exit-intent',
									'triggerData' => [
										'exitIntent' => [
											'delay' => '5s'
										]
									],
									'globalData' => [
										'main' => [
											'showBackdrop' => true
										]
									]
								]
							],
						]
                    ]
                ]
            ]
        ];

        $preparedInitialFormData = [];
        foreach ($formData as $form) {
            $formConfigData = $configHelper->get_default_form_config($form['formStepDataType']);
            if (empty($formConfigData)) {
                continue;
            }

            $formConfigData['settings']['main']['title'] = $form['title'];

            if (!empty($form['settingsOverwrite'])) {
                $formConfigData = array_replace_recursive(
                    $formConfigData,
                    $form['settingsOverwrite']
                );
            }

            $preparedInitialFormData[] = $formConfigData;
        }

        return $preparedInitialFormData;
    }

	public function get_form_type_name(string $form_type): string {
		return $this->get_form_type_name_mapping()[$form_type] ?? ucfirst($form_type);
	}

    public function clean_form_data_for_storage(array $decoded_data): array {
        if (!isset($decoded_data['settings']['display']['subTypeData'])) {
            return $decoded_data;
        }

        $activeSubType = $decoded_data['settings']['display']['displaySubType'] ?? 'modal';

        foreach (array_keys($this->get_form_type_name_mapping()) as $type) {
            if ($type !== $activeSubType && isset($decoded_data['settings']['display']['subTypeData'][$type])) {
                unset($decoded_data['settings']['display']['subTypeData'][$type]);
            }
        }

        return $decoded_data;
    }

    public function enrich_form_data_with_defaults(array $decoded_data): array {
        if (!isset($decoded_data['settings']['display']['subTypeData'])) {
            return $decoded_data;
        }

        $config_helper = new ConfigHelper();
        $default_config = $config_helper->get_default_form_config();
        $default_subTypeData = $default_config['settings']['display']['subTypeData'];

        $activeSubType = $decoded_data['settings']['display']['displaySubType'] ?? 'modal';

        foreach ($default_subTypeData as $type => $data) {
            if ($type !== $activeSubType) {
                $decoded_data['settings']['display']['subTypeData'][$type] = $data;
            }
        }

        return $decoded_data;
    }

	public function get_form_type_name_mapping(): array {
		return [
			'modal'           => esc_html__('admin.form_type.modal.name', 'flwp'),
			'slide-in'        => esc_html__('admin.form_type.slide-in.name', 'flwp'),
			'feedback-button' => esc_html__('admin.form_type.feedback-button.name', 'flwp'),
			'shortcode'       => esc_html__('admin.form_type.shortcode.name', 'flwp'),
			'pre-content'     => esc_html__('admin.form_type.pre-content.name', 'flwp'),
			'post-content'    => esc_html__('admin.form_type.post-content.name', 'flwp'),
		];
	}

    /**
     * Verarbeitet ein einzelnes Element und gibt die Daten zurück, wenn es ein User-Input-Feld ist.
     *
     * @param array $element Das zu verarbeitende Element.
     * @param array $field_configs Die Konfiguration der Feldtypen.
     * @param bool $only_with_value Ob nur Felder mit existierendem Value zurückgegeben werden sollen.
     * @return array|null Die Felddaten oder null, wenn kein Input-Feld.
     */
    private function process_element(array $element, array $field_configs, bool $only_with_value): ?array {
        $type = $element['type'] ?? '';
        
        // Prüfen ob es ein User-Input-Feld ist (laut ConfigHelper)
        if (!isset($field_configs[$type]) || empty($field_configs[$type]['userinput'])) {
            return null;
        }

        $has_value = isset($element['value']) && $element['value'] !== '';

        if ($only_with_value && !$has_value) {
            return null;
        }

        return [
            'id'    => $element['id'] ?? '',
            'type'  => $type,
            'label' => $element['label'] ?? '',
            'value' => $element['value'] ?? ''
        ];
    }
}
