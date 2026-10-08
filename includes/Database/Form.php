<?php

namespace FLWP\Database;

use FLWP\Helper\FormHelper;

class Form extends Database {
    private static $cache = [];

    public function __construct() {
        parent::__construct();
        $this->table_name = $this->wpdb->prefix . 'flwp_form_data';
    }

    public function create_table() {
        $charset_collate = $this->wpdb->get_charset_collate();
		
		$defaultFormName = esc_html__('admin.db.default_form_name', 'flwp');

        $sql = "CREATE TABLE $this->table_name (
            flwp_fd_id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
            flwp_fd_name VARCHAR(255) NOT NULL DEFAULT '$defaultFormName',
            flwp_fd_preview_data LONGTEXT NULL DEFAULT NULL,
            flwp_fd_live_data LONGTEXT NULL DEFAULT NULL,
            flwp_fd_status TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
            flwp_fd_last_saved TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
            flwp_fd_last_published TIMESTAMP NULL DEFAULT NULL,
            flwp_fd_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
            flwp_fd_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
            PRIMARY KEY  (flwp_fd_id),
            INDEX flwp_fd_status (flwp_fd_status),
            INDEX flwp_fd_updated (flwp_fd_updated)
        ) $charset_collate ENGINE=InnoDB;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public function get_forms($args = []) {
        $orderby = !empty($args['orderby']) ? sanitize_sql_orderby($args['orderby']) : 'flwp_fd_updated';
        $order = !empty($args['order']) ? sanitize_text_field($args['order']) : 'DESC';
        $limit = isset($args['limit']) ? (int) $args['limit'] : 20;
        $offset = isset($args['offset']) ? (int) $args['offset'] : 0;
        $status = isset($args['status']) ? (int) $args['status'] : null;

        $allowed_orderby = ['flwp_fd_id', 'flwp_fd_name', 'flwp_fd_status', 'flwp_fd_updated', 'flwp_fd_created'];
        if (!in_array($orderby, $allowed_orderby)) {
            $orderby = 'flwp_fd_updated';
        }

        $order = (strtoupper($order) === 'ASC') ? 'ASC' : 'DESC';

        $query = "SELECT * FROM $this->table_name";
        $prepared_args = [];

        if ($status !== null) {
            $query .= " WHERE flwp_fd_status = %d";
            $prepared_args[] = $status;
        }

        $query .= " ORDER BY $orderby $order 
            LIMIT %d OFFSET %d";
        $prepared_args[] = $limit;
        $prepared_args[] = $offset;

        $results = $this->wpdb->get_results($this->wpdb->prepare($query, ...$prepared_args), ARRAY_A);
        
        $forms = [];
        if ($results) {
            foreach ($results as $row) {
                $forms[] = new \FLWP\Database\Entity\Form($row);
            }
        }
        
        return $forms;
    }

    public function get_form_count() {
        return (int) $this->wpdb->get_var("SELECT COUNT(*) FROM $this->table_name");
    }

    public function get_form($id) {
        if (is_numeric($id) === false) {
            return null;
        }

        $id = (int) $id;

        if (isset(self::$cache[$id])) {
            return self::$cache[$id];
        }

        $row = $this->wpdb->get_row($this->wpdb->prepare(
            "SELECT * FROM $this->table_name WHERE flwp_fd_id = %d",
            $id
        ), ARRAY_A);

        $form = $row ? new \FLWP\Database\Entity\Form($row) : null;
        
        if ($form) {
            self::$cache[$id] = $form;
        }

        return $form;
    }

    public function update_form_data($id, $data, $field = 'preview', $name = '') {
        if (empty($name)) {
            $name = esc_html__('admin.db.default_new_form_name', 'flwp');
        }
        $update_data = [];
        $formats = [];

        // Extrahiere den Namen aus den JSON-Daten, falls vorhanden
        $decoded_data = json_decode($data, true);

        if (is_array($decoded_data)) {
            $form_helper = new FormHelper();
            $decoded_data = $form_helper->clean_form_data_for_storage($decoded_data);
        }

        if (is_array($decoded_data) && !empty($decoded_data['settings']['main']['title'])) {
            $name = sanitize_text_field($decoded_data['settings']['main']['title']);
        }

        if ($id !== 0 && is_array($decoded_data)) {
            $decoded_data['id'] = $id;
        }

        $encoded_data = json_encode($decoded_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($field === 'live') {
            $update_data['flwp_fd_live_data'] = $encoded_data;
            $update_data['flwp_fd_preview_data'] = $encoded_data;
            $update_data['flwp_fd_last_published'] = current_time('mysql');
            $formats[] = '%s';
            $formats[] = '%s';
            $formats[] = '%s';
        } else {
            $update_data['flwp_fd_preview_data'] = $encoded_data;
			$update_data['flwp_fd_status'] = $decoded_data['status'];
            $update_data['flwp_fd_last_saved'] = current_time('mysql');
            $formats[] = '%s';
            $formats[] = '%s';
        }
        
        // Name immer aktualisieren, um Synchronität mit JSON zu wahren
        $update_data['flwp_fd_name'] = $name;
        $formats[] = '%s';

        if ($id === 0) {
            $success = $this->wpdb->insert(
                $this->table_name,
                $update_data,
                $formats
            );

            if (!$success) {
                return false;
            }

            $new_id = $this->wpdb->insert_id;

            // ID auch im JSON speichern
            if (is_array($decoded_data)) {
                $decoded_data['id'] = $new_id;
                $updated_json = json_encode($decoded_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                
                $this->wpdb->update(
                    $this->table_name,
                    ['flwp_fd_preview_data' => $updated_json],
                    ['flwp_fd_id' => $new_id],
                    ['%s'],
                    ['%d']
                );
            }

            return $new_id;
        }

        $success = $this->wpdb->update(
            $this->table_name,
            $update_data,
            ['flwp_fd_id' => $id],
            $formats,
            ['%d']
        );

        if ($success !== false && isset(self::$cache[$id])) {
            unset(self::$cache[$id]);
        }

        return $success;
    }

    public function update_form_status($id, $status) {
        $status = (int) $status;
        $id = (int) $id;

        $success = $this->wpdb->update(
            $this->table_name,
            ['flwp_fd_status' => $status],
            ['flwp_fd_id' => $id],
            ['%d'],
            ['%d']
        );

        // update status also in json status
        if ($success !== false) {
            if (isset(self::$cache[$id])) {
                unset(self::$cache[$id]);
            }
            $this->update_form_json_status($id, $status);
        }

        return $success;
    }

    /**
     * Dupliziert ein Formular. Nur die Preview-Daten werden übernommen.
     * 
     * @param int $id Die ID des zu duplizierenden Formulars.
     * @return int|bool Die neue ID oder false bei Fehler.
     */
    public function duplicate_form($id) {
        if (is_numeric($id) === false) {
            return false;
        }

        $original = $this->get_form($id);
        if (!$original) {
            return false;
        }

        $preview_data = $original->getPreviewData();
        $name = $original->getName();

        // JSON dekodieren, um den Titel anzupassen
        $decoded_data = json_decode($preview_data, true);
        if (is_array($decoded_data)) {
            $name = ($decoded_data['settings']['main']['title'] ?? $name) . ' (' . esc_html__('admin.form.duplicate_suffix', 'flwp') . ')';
            $decoded_data['settings']['main']['title'] = $name;
            // Status im JSON auf 1 (Vorschau) setzen
            $decoded_data['status'] = 1;
            $preview_data = json_encode($decoded_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            $name .= ' (' . esc_html__('admin.form.duplicate_suffix', 'flwp') . ')';
        }

        // Neues Formular erstellen (ID 0 triggert Insert)
        return $this->update_form_data(0, $preview_data, 'preview', $name);
    }

    /**
     * Löscht ein Formular und alle zugehörigen Feedbacks.
     * 
     * @param int $id Die ID des zu löschenden Formulars.
     * @return bool True bei Erfolg, false bei Fehler.
     */
    public function delete_form($id) {
        if (is_numeric($id) === false) {
            return false;
        }

        $id = (int) $id;
        
        // Feedbacks löschen (falls ON DELETE CASCADE nicht greift oder zur Sicherheit)
        $this->wpdb->delete($this->wpdb->prefix . 'flwp_form_feedback', ['flwp_ff_fd_id' => $id], ['%d']);
        
        // Formular löschen
        $success = $this->wpdb->delete($this->table_name, ['flwp_fd_id' => $id], ['%d']);

        if ($success !== false && isset(self::$cache[$id])) {
            unset(self::$cache[$id]);
        }
        
        return $success !== false;
    }

    private function update_form_json_status($id, $status) {
        if (is_numeric($id) === false) {
            return false;
        }

        $row = $this->wpdb->get_row($this->wpdb->prepare(
            "SELECT flwp_fd_preview_data, flwp_fd_live_data FROM $this->table_name WHERE flwp_fd_id = %d",
            $id
        ), ARRAY_A);

        if (!$row) {
            return false;
        }

        $update_data = [];
        $formats = [];

        foreach (['flwp_fd_preview_data', 'flwp_fd_live_data'] as $field) {
            if (!empty($row[$field])) {
                $json = json_decode($row[$field], true);

                if (is_array($json)) {
                    $json['status'] = $status;
                    $update_data[$field] = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                    $formats[] = '%s';
                }
            }
        }

        if (!empty($update_data)) {
            $this->wpdb->update(
                $this->table_name,
                $update_data,
                ['flwp_fd_id' => $id],
                $formats,
                ['%d']
            );
        }

        return true;
    }

    /**
     * Erstellt die Initial-Formulare mit default settings aus der config.
     * 
     * @return void
     */
    public function create_initial_forms() {
        $formHelper = new FormHelper();

        $initialFormData = $formHelper->generate_initial_form_data();
        if (empty($initialFormData)) {
            return;
        }

        foreach ($initialFormData as $form_data) {
            // Wir nutzen update_form_data mit ID 0, um ein neues Formular anzulegen.
            // Der Name wird automatisch aus $form_data['title'] extrahiert.
            $this->update_form_data(0, json_encode($form_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 'preview');
        }
    }
}
