<?php

namespace FLWP\Export;

use FLWP\Database\Form as FormDB;
use FLWP\Database\FormFeedback as FeedbackDB;

class Json {

    /**
     * Importiert Plugin-Einstellungen aus einer JSON-Datei.
     *
     * @return bool|array Die importierten Einstellungen oder false bei Fehler.
     */
    public static function import() {
        if (!current_user_can('manage_options')) {
            return false;
        }

        if (empty($_FILES['import_file']['tmp_name'])) {
            return false;
        }

		$filename = sanitize_file_name(($_FILES['import_file']['name'] ?? ''));
		$tmpFilename = sanitize_file_name($_FILES['import_file']['tmp_name']);

        $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
        if (strtolower($file_extension) !== 'json') {
            return false;
        }

        $content = file_get_contents($tmpFilename);
        if (empty($content)) {
            return false;
        }

        $config = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($config)) {
            return false;
        }

        return $config;
    }

    /**
     * Exportiert ein oder mehrere Formulare als JSON.
     *
     * @param string $id Kommagetrennte Liste von IDs.
     */
    public function exportAllForms($id = '') {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['error' => 'Permission denied']);
        }

        $form_db = new FormDB();
        $export_data = [];
        $filename = 'flwp-forms-export-' . gmdate('Y-m-d-H-i-s') . '.json';

        if (!empty($id)) {
            $ids = array_map('intval', explode(',', $id));
            foreach ($ids as $val) {
                if (is_numeric($val) === false || $val <= 0) {
                    continue;
                }
                $form = $form_db->get_form($val);
                if ($form) {
                    $export_data[] = $form->toArray();
                }
            }

            if (empty($export_data)) {
                $export_data = [];
            }
        }

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);

        echo json_encode($export_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Exportiert Feedback-Einträge eines oder mehrerer Formulare als JSON.
     *
     * @param string $id Kommagetrennte Liste von Formular-IDs.
     * @param array $filters Optionale Filter (range, status, start_date, end_date).
     */
    public function exportAllFeedback($id = '', $filters = []) {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['error' => 'Permission denied']);
        }

        $feedbacks = [];
        $export_data = [];
        $filename = 'flwp-feedback-export-' . gmdate('Y-m-d-H-i-s') . '.json';

        if (!empty($id)) {
            $query_args = [
                'limit' => 10000,
            ];

            $query_args['form_id'] = array_map('intval', explode(',', $id));

            if (!empty($filters['range'])) {
                $query_args['range'] = $filters['range'];
            }

            if (!empty($filters['status']) && $filters['status'] !== 'all') {
                $query_args['status'] = $filters['status'];
            }

            if (!empty($filters['start_date'])) {
                $query_args['start_date'] = $filters['start_date'];
            }

            if (!empty($filters['end_date'])) {
                $query_args['end_date'] = $filters['end_date'];
            }

            $feedback_db = new FeedbackDB();
            $feedbacks = $feedback_db->get_feedbacks($query_args);
        }

        if (empty($feedbacks)) {
            $feedbacks = [];
        }

        foreach ($feedbacks as $feedback) {
            $export_data[] = [
                'id' => $feedback->getId(),
                'identifier' => $feedback->getIdentifier(),
                'form_id' => $feedback->getFormId(),
                'form_type' => $feedback->getFormType(),
                'status' => $feedback->getStatus(),
                'created' => $feedback->getCreated(),
                'feedback_data' => $feedback->getDecodedFeedbackData(),
                'tracking_data' => $feedback->getDecodedTrackingData(),
            ];
        }

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);

        echo json_encode($export_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Importiert Formulare aus einer Liste von Daten.
     *
     * @param array $forms_data Liste der zu importierenden Formulardaten.
     * @return array Statusbericht über den Import.
     */
    public function importForms(array $forms_data): array {
        if (!current_user_can('manage_options')) {
            return ['success' => false, 'message' => 'Permission denied'];
        }

        $form_db = new FormDB();
        $results = [
            'imported' => 0,
            'updated' => 0,
            'inserted' => 0,
            'errors' => 0
        ];

        foreach ($forms_data as $data) {
            // Grobe Datenvalidierung auf Hauptkeys
            if (!isset($data['name']) || (!isset($data['preview_data']) && !isset($data['live_data']))) {
                $results['errors']++;
                continue;
            }

            $id = isset($data['id']) ? (int) $data['id'] : 0;
            
            // Wenn eine ID gesetzt ist, prüfen ob das Formular in der DB existiert
            if ($id > 0) {
                $existing_form = $form_db->get_form($id);
                if (!$existing_form) {
                    $id = 0; // ID auf 0 setzen, damit ein neues Formular erstellt wird (Insert)
                }
            }

            $name = sanitize_text_field($data['name']);
            
            // Vorrangig live_data nutzen, falls vorhanden, sonst preview_data
            $form_content = $data['live_data'] ?? $data['preview_data'];
            
            // Falls es sich bereits um ein Array handelt (neues Format), wieder in JSON umwandeln für update_form_data
            if (is_array($form_content)) {
                $form_content = json_encode($form_content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            if (empty($form_content)) {
                $results['errors']++;
                continue;
            }

            // update_form_data(id, data, field, name)
            // Wir importieren standardmäßig in den 'live' slot, was auch preview befüllt
            $new_id = $form_db->update_form_data($id, $form_content, 'live', $name);

            if ($new_id !== false) {
                // Bei Import/Überschreibung pauschal auf Status 1 (paused) setzen zur Sicherheit
                $form_db->update_form_status($id ?: $new_id, 1);
                
                if ($id > 0) {
                    $results['updated']++;
                } else {
                    $results['inserted']++;
                }
                $results['imported']++;
            } else {
                $results['errors']++;
            }
        }

        $message = sprintf(
			esc_html__('admin.export.json.import_results', 'flwp'),
            $results['imported'],
            $results['inserted'],
            $results['updated'],
            $results['errors']
        );

        return [
            'success' => ($results['imported'] > 0 || $results['updated'] > 0),
            'message' => $message,
            'results' => $results
        ];
    }

    /**
     * Importiert Feedbacks aus einer Liste von Daten.
     *
     * @param array $feedback_data Liste der zu importierenden Feedbackdaten.
     * @return array Statusbericht über den Import.
     */
    public function importFeedbacks(array $feedback_data): array {
        if (!current_user_can('manage_options')) {
            return ['success' => false, 'message' => 'Permission denied'];
        }

        $form_db = new FormDB();
        $feedback_db = new FeedbackDB();
        $results = [
            'imported' => 0,
            'updated' => 0,
            'inserted' => 0,
            'ignored' => 0,
            'errors' => 0
        ];

        foreach ($feedback_data as $data) {
            // Validierung: Mindestens form_id und feedback_data sollten vorhanden sein
            if (empty($data['form_id']) || !isset($data['feedback_data'])) {
                $results['errors']++;
                continue;
            }

            $form_id = (int) $data['form_id'];
            
            // Prüfung, ob das zugehörige Formular existiert
            if (!$form_db->get_form($form_id)) {
                $results['ignored']++;
                continue;
            }

            $identifier = $data['identifier'] ?? ($data['flwp_ff_identifier'] ?? '');
            $existing_feedback = !empty($identifier) ? $feedback_db->get_feedback_by_identifier($identifier) : null;

            if ($existing_feedback) {
                // Update
                $success = $feedback_db->update_feedback_by_identifier($existing_feedback->getIdentifier(), $data);
                if ($success !== false) {
                    $results['updated']++;
                    $results['imported']++;
                } else {
                    $results['errors']++;
                }
            } else {
                // Insert
                $inserted_id = $feedback_db->add_feedback($data);
                if ($inserted_id) {
                    $results['inserted']++;
                    $results['imported']++;
                } else {
                    $results['errors']++;
                }
            }
        }

        $message = sprintf(
			esc_html__('admin.export.json.import_feedbacks_results', 'flwp'),
            $results['imported'],
            $results['inserted'],
            $results['updated'],
            $results['ignored'],
            $results['errors']
        );

        return [
            'success' => ($results['imported'] > 0),
            'message' => $message,
            'results' => $results
        ];
    }
}
