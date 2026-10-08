<?php

namespace FLWP\Export;

use FLWP\Database\FormFeedback;
use FLWP\Database\Form;
use FLWP\Helper\FormHelper;

class Csv {

    /**
     * Exportiert Feedback-Daten als CSV mit Semikolon als Trennzeichen.
     *
     * @return void
     */
    public static function exportFeedback($args = []) {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Permission denied', 'flwp'));
        }

        // Performance-Optimierung für große Exporte
        ignore_user_abort(true);
        if (function_exists('set_time_limit')) {
            @set_time_limit(0);
        }

        $feedback_db = new FormFeedback();
        
        // Filter-Parameter aufbereiten
        $query_args = [
            'limit'      => 10000,
            'range'      => !empty($args['range']) ? $args['range'] : '',
            'status'     => (!empty($args['status']) && $args['status'] !== 'all') ? $args['status'] : '',
            'start_date' => !empty($args['start_date']) ? $args['start_date'] : '',
            'end_date'   => !empty($args['end_date']) ? $args['end_date'] : '',
        ];

        if (!empty($args['form_id']) && $args['form_id'] !== 'all') {
            if (is_numeric($args['form_id'])) {
                $query_args['form_id'] = (int) $args['form_id'];
            } elseif (is_string($args['form_id']) && strpos($args['form_id'], ',') !== false) {
                $query_args['form_id'] = array_map('intval', explode(',', $args['form_id']));
            }
        }

        $feedbacks = $feedback_db->get_feedbacks($query_args);

        // Output Buffer bereinigen, um korrupte CSVs zu vermeiden
        if (ob_get_contents()) {
            ob_clean();
        }

        $filename = 'flwp-export-' . gmdate('Y-m-d-H-i-s') . '.csv';

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');

        // UTF-8 BOM für korrekte Anzeige in Excel
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        if (empty($feedbacks)) {
            fputcsv($output, [esc_html__('admin.export.csv.no_data_found', 'flwp')], ';');
            fclose($output);
            exit;
        }

        // Header vorbereiten
        $headers = [
			esc_html__('admin.export.csv.id', 'flwp'),
			esc_html__('admin.export.csv.timestamp', 'flwp'),
			esc_html__('admin.export.csv.form_id', 'flwp'),
			esc_html__('admin.export.csv.type', 'flwp'),
			esc_html__('admin.export.csv.status', 'flwp')
        ];

        // Tracking Header
        $tracking_headers = [
            'tracking_url'             => esc_html__('admin.export.csv.tracking_url', 'flwp'),
            'tracking_language'        => esc_html__('admin.export.csv.tracking_language', 'flwp'),
            'tracking_screen_res_w'    => esc_html__('admin.export.csv.tracking_screen_res_w', 'flwp'),
            'tracking_screen_res_h'    => esc_html__('admin.export.csv.tracking_screen_res_h', 'flwp'),
            'tracking_viewport_w'      => esc_html__('admin.export.csv.tracking_viewport_w', 'flwp'),
            'tracking_viewport_h'      => esc_html__('admin.export.csv.tracking_viewport_h', 'flwp'),
            'tracking_timezone'        => esc_html__('admin.export.csv.tracking_timezone', 'flwp'),
            'tracking_device_type'     => esc_html__('admin.export.csv.tracking_device_type', 'flwp'),
            'tracking_time_on_page'    => esc_html__('admin.export.csv.tracking_time_on_page', 'flwp'),
        ];

        // Alle unique Element-IDs aus den Feedbacks sammeln für dynamische Spalten
        $dynamic_fields = []; // [ 'id' => 'label' ]
        $form_db = new Form();
        $form_helper = new FormHelper();
        $processed_forms = [];

        foreach ($feedbacks as $feedback) {
            $form_id = $feedback->getFormId();
            if (!in_array($form_id, $processed_forms)) {
                $form_data_row = $form_db->get_form($form_id);
                if ($form_data_row && !empty($form_data_row->getLiveData())) {
                    $form_json = json_decode($form_data_row->getLiveData(), true);
                    if ($form_json) {
                        $input_fields = $form_helper->get_form_input_fields($form_json);
                        foreach ($input_fields as $field) {
                            if (!isset($dynamic_fields[$field['id']])) {
                                $dynamic_fields[$field['id']] = ($field['label'] ?: $field['id']) . ' (' . $field['id'] . ')';
                            }
                        }
                    }
                }
                $processed_forms[] = $form_id;
            }
        }

        $all_headers = array_merge($headers, array_values($tracking_headers), array_values($dynamic_fields));
        fputcsv($output, $all_headers, ';');

        foreach ($feedbacks as $feedback) {
            $data = $feedback->getDecodedFeedbackData();
            $row = [
                $feedback->getId(),
                $feedback->getCreated(),
                $feedback->getFormId(),
                $feedback->getFormType(),
                $feedback->getStatus()
            ];

            // Tracking Werte hinzufügen
            $row[] = $feedback->getTrackingPageUrl();
            $row[] = $feedback->getTrackingLanguage();
            $row[] = $feedback->getTrackingScreenResW();
            $row[] = $feedback->getTrackingScreenResH();
            $row[] = $feedback->getTrackingViewportW();
            $row[] = $feedback->getTrackingViewportH();
            $row[] = $feedback->getTrackingTimezone();
            $row[] = $feedback->getTrackingDeviceType();
            $row[] = $feedback->getTrackingTimeOnPage();

            // Dynamische Werte zuordnen
            $active_step2_trigger_id = $data['active_step2_trigger_id'] ?? '';
            foreach (array_keys($dynamic_fields) as $element_id) {
                $value = '';
                if (isset($data['steps'])) {
                    // Step 1
                    if (isset($data['steps']['step1']) && is_array($data['steps']['step1'])) {
                        foreach ($data['steps']['step1'] as $element) {
                            if (isset($element['id']) && $element['id'] === $element_id) {
                                $value = self::formatValue($element['value'] ?? '');
                                
                                // Highlight active step 2 trigger if no value is set
                                if ($value === '' && !empty($active_step2_trigger_id) && $element['id'] === $active_step2_trigger_id) {
                                    $value = '1';
                                }
                                break;
                            }
                        }
                    }

                    // Step 2
                    if ($value === '' && isset($data['steps']['step2']) && is_array($data['steps']['step2'])) {
                        foreach ($data['steps']['step2'] as $trigger_id => $fields) {
                            // Wenn ein active_step2_trigger_id gesetzt ist, nur diese Felder berücksichtigen
                            if (!empty($active_step2_trigger_id) && $trigger_id !== $active_step2_trigger_id) {
                                continue;
                            }

                            if (is_array($fields)) {
                                foreach ($fields as $element) {
                                    if (isset($element['id']) && $element['id'] === $element_id) {
                                        $value = self::formatValue($element['value'] ?? '');
                                        break 2;
                                    }
                                }
                            }
                        }
                    }
                }
                $row[] = $value;
            }

            fputcsv($output, $row, ';');
        }

        fclose($output);
        exit;
    }

    /**
     * Formatiert den Wert für die CSV-Ausgabe.
     */
    private static function formatValue($value) {
        if (is_array($value)) {
            return implode(', ', $value);
        }
        return (string) $value;
    }
}
