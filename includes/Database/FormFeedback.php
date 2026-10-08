<?php

namespace FLWP\Database;

class FormFeedback extends Database {
    public function __construct() {
        parent::__construct();
        $this->table_name = $this->wpdb->prefix . 'flwp_form_feedback';
    }

    public function create_table() {
        $charset_collate = $this->wpdb->get_charset_collate();

        $sql = "CREATE TABLE $this->table_name (
            flwp_ff_id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
            flwp_ff_fd_id INT(11) UNSIGNED NOT NULL,
            flwp_ff_form_type ENUM('shortcode','pre-content','post-content','feedback-button','overlay','slide-in','modal') NOT NULL,
            flwp_ff_feedback_data LONGTEXT NULL DEFAULT NULL,
            flwp_ff_tracking_data LONGTEXT NULL DEFAULT NULL,
            flwp_ff_tracking_page_url TEXT NULL DEFAULT NULL,
            flwp_ff_tracking_language VARCHAR(50) NOT NULL DEFAULT '',
            flwp_ff_tracking_screen_res_w SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
            flwp_ff_tracking_screen_res_h SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
            flwp_ff_tracking_viewport_w SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
            flwp_ff_tracking_viewport_h SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
            flwp_ff_tracking_timezone VARCHAR(255) NOT NULL DEFAULT '',
            flwp_ff_tracking_conn_type VARCHAR(50) NOT NULL DEFAULT '',
            flwp_ff_tracking_device_type VARCHAR(50) NOT NULL DEFAULT '',
            flwp_ff_tracking_session_id VARCHAR(255) NOT NULL DEFAULT '',
            flwp_ff_tracking_time_on_page INT(10) UNSIGNED NULL DEFAULT NULL,
            flwp_ff_tracking_color_scheme VARCHAR(50) NOT NULL DEFAULT '',
            flwp_ff_identifier VARCHAR(50) NOT NULL DEFAULT '',
            flwp_ff_status ENUM('unread','read','archived') NOT NULL DEFAULT 'unread',
            flwp_ff_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
            flwp_ff_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
            PRIMARY KEY  (flwp_ff_id),
            INDEX flwp_ff_status (flwp_ff_status),
            INDEX flwp_ff_form_type (flwp_ff_form_type),
            INDEX flwp_ff_created (flwp_ff_created),
            INDEX flwp_ff_identifier (flwp_ff_identifier),
            INDEX FK_ff_fd (flwp_ff_fd_id)
        ) $charset_collate ENGINE=InnoDB;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        // Add foreign key if it doesn't exist
        $this->add_foreign_key();
    }

    private function add_foreign_key() {
        $form_table = $this->wpdb->prefix . 'flwp_form_data';
        $check_fk = $this->wpdb->get_results("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '$this->table_name' AND CONSTRAINT_NAME = 'FK_ff_fd'");

        if (empty($check_fk)) {
            $this->wpdb->query("ALTER TABLE $this->table_name ADD CONSTRAINT FK_ff_fd FOREIGN KEY (flwp_ff_fd_id) REFERENCES $form_table (flwp_fd_id) ON DELETE CASCADE ON UPDATE NO ACTION");
        }
    }

    private function apply_filters($args) {
        $where = "WHERE 1=1";

        if (!empty($args['form_id'])) {
            if (is_array($args['form_id'])) {
                $ids = array_map('intval', $args['form_id']);
                $placeholders = implode(',', array_fill(0, count($ids), '%d'));
                $where .= $this->wpdb->prepare(" AND flwp_ff_fd_id IN ($placeholders)", $ids);
            } else {
                $where .= $this->wpdb->prepare(" AND flwp_ff_fd_id = %d", $args['form_id']);
            }
        }

        if (!empty($args['status'])) {
            $where .= $this->wpdb->prepare(" AND flwp_ff_status = %s", $args['status']);
        }

        if (!empty($args['identifier'])) {
            $where .= $this->wpdb->prepare(" AND flwp_ff_identifier = %s", $args['identifier']);
        }

        if (!empty($args['form_type'])) {
            $where .= $this->wpdb->prepare(" AND flwp_ff_form_type = %s", $args['form_type']);
        }

        $start_date = !empty($args['start_date']) ? $args['start_date'] : null;
        $end_date = !empty($args['end_date']) ? $args['end_date'] : null;

        if (!empty($args['range']) && empty($start_date) && empty($end_date)) {
            switch ($args['range']) {
                case 'today':
                    $start_date = gmdate('Y-m-d');
					$end_date = gmdate('Y-m-d');
                    break;
                case 'yesterday':
                    $start_date = gmdate('Y-m-d', strtotime('-1 day'));
					$end_date = gmdate('Y-m-d', strtotime('-1 day'));
                    break;
                case 'last_7_days':
                    $start_date = gmdate('Y-m-d', strtotime('-6 days'));
                    break;
                case 'last_30_days':
                    $start_date = gmdate('Y-m-d', strtotime('-29 days'));
                    break;
                case 'this_month':
                    $start_date = gmdate('Y-m-01');
                    break;
                case 'last_month':
                    $start_date = gmdate('Y-m-01', strtotime('first day of last month'));
                    $end_date = gmdate('Y-m-t', strtotime('last day of last month'));
                    break;
                case 'this_year':
                    $start_date = gmdate('Y-01-01');
                    break;
                case 'last_year':
                    $start_date = gmdate('Y-01-01', strtotime('last year'));
                    $end_date = gmdate('Y-12-31', strtotime('last year'));
                    break;
            }
        }

        if (!empty($start_date)) {
            $where .= $this->wpdb->prepare(" AND flwp_ff_created >= %s", $start_date . ' 00:00:00');
        }
        if (!empty($end_date)) {
            $where .= $this->wpdb->prepare(" AND flwp_ff_created <= %s", $end_date . ' 23:59:59');
        }

        return $where;
    }

    public function get_feedbacks($args = []) {
        $orderby = !empty($args['orderby']) ? sanitize_sql_orderby($args['orderby']) : 'flwp_ff_created';
        $order = !empty($args['order']) ? sanitize_text_field($args['order']) : 'DESC';
        $limit = isset($args['limit']) ? (int) $args['limit'] : 50;
        $offset = isset($args['offset']) ? (int) $args['offset'] : 0;

        $where = $this->apply_filters($args);

        $allowed_orderby = ['flwp_ff_id', 'flwp_ff_created', 'flwp_ff_fd_id', 'flwp_ff_status', 'flwp_ff_identifier'];
        if (!in_array($orderby, $allowed_orderby)) {
            $orderby = 'flwp_ff_created';
        }

        $order = (strtoupper($order) === 'ASC') ? 'ASC' : 'DESC';

        $query = "SELECT * FROM $this->table_name 
            $where
            ORDER BY $orderby $order 
            LIMIT %d OFFSET %d";

        $results = $this->wpdb->get_results($this->wpdb->prepare($query, [$limit, $offset]), ARRAY_A);

        $feedbacks = [];
        if ($results) {
            foreach ($results as $row) {
                $feedbacks[] = new \FLWP\Database\Entity\FormFeedback($row);
            }
        }
        
        return $feedbacks;
    }

    public function get_feedback_count($args = []) {
        $where = $this->apply_filters($args);
        return (int) $this->wpdb->get_var("SELECT COUNT(*) FROM $this->table_name $where");
    }

    private function getPreparedTrackingData($tracking_data) {
        // Tracking-Daten aufbereiten
        $screen_res_w = null;
        $screen_res_h = null;
        if (!empty($tracking_data['screenResolution']) && strpos($tracking_data['screenResolution'], 'x') !== false) {
            $parts = explode('x', $tracking_data['screenResolution']);
            $screen_res_w = (int) $parts[0];
            $screen_res_h = (int) $parts[1];
        }

        $viewport_w = null;
        $viewport_h = null;
        if (!empty($tracking_data['viewportSize']) && strpos($tracking_data['viewportSize'], 'x') !== false) {
            $parts = explode('x', $tracking_data['viewportSize']);
            $viewport_w = (int) $parts[0];
            $viewport_h = (int) $parts[1];
        }

        return [
            'tracking_page_url'     => $tracking_data['url'] ?? '',
            'tracking_language'     => $tracking_data['language'] ?? '',
            'tracking_screen_res_w' => $screen_res_w,
            'tracking_screen_res_h' => $screen_res_h,
            'tracking_viewport_w'   => $viewport_w,
            'tracking_viewport_h'   => $viewport_h,
            'tracking_timezone'     => $tracking_data['timezone'] ?? '',
            'tracking_conn_type'    => $tracking_data['connectionType'] ?? ($tracking_data['conn_type'] ?? ''),
            'tracking_device_type'  => $tracking_data['deviceType'] ?? ($tracking_data['device_type'] ?? ''),
            'tracking_session_id'   => $tracking_data['anonymizedSessionId'] ?? ($tracking_data['session_id'] ?? ''),
            'tracking_time_on_page' => isset($tracking_data['timeOnPageSeconds']) ? (int) $tracking_data['timeOnPageSeconds'] : (isset($tracking_data['time_on_page']) ? (int) $tracking_data['time_on_page'] : null),
            'tracking_color_scheme' => $tracking_data['colorScheme'] ?? ($tracking_data['color_scheme'] ?? ''),
        ];
    }

    public function add_feedback($data) {
        $feedback_data = $data['feedback_data'] ?? [];
        if (is_array($feedback_data)) {
            $feedback_data = json_encode($feedback_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        $tracking_data = $data['tracking_data'] ?? [];
        $tracking_data_encoded = $tracking_data;
        if (is_array($tracking_data)) {
            $tracking_data_encoded = json_encode($tracking_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        $prepared_tracking = $this->getPreparedTrackingData($tracking_data);

        $insert_data = [
            'flwp_ff_fd_id'                 => (int) $data['form_id'],
            'flwp_ff_form_type'             => $data['form_type'] ?? 'shortcode',
            'flwp_ff_feedback_data'         => $feedback_data,
            'flwp_ff_tracking_data'         => $tracking_data_encoded,
            'flwp_ff_tracking_page_url'     => $prepared_tracking['tracking_page_url'],
            'flwp_ff_tracking_language'     => $prepared_tracking['tracking_language'],
            'flwp_ff_tracking_screen_res_w' => $prepared_tracking['tracking_screen_res_w'],
            'flwp_ff_tracking_screen_res_h' => $prepared_tracking['tracking_screen_res_h'],
            'flwp_ff_tracking_viewport_w'   => $prepared_tracking['tracking_viewport_w'],
            'flwp_ff_tracking_viewport_h'   => $prepared_tracking['tracking_viewport_h'],
            'flwp_ff_tracking_timezone'     => $prepared_tracking['tracking_timezone'],
            'flwp_ff_tracking_conn_type'    => $prepared_tracking['tracking_conn_type'],
            'flwp_ff_tracking_device_type'  => $prepared_tracking['tracking_device_type'],
            'flwp_ff_tracking_session_id'   => $prepared_tracking['tracking_session_id'],
            'flwp_ff_tracking_time_on_page' => $prepared_tracking['tracking_time_on_page'],
            'flwp_ff_tracking_color_scheme' => $prepared_tracking['tracking_color_scheme'],
            'flwp_ff_identifier'            => !empty($data['identifier']) ? $data['identifier'] : (!empty($data['flwp_ff_identifier']) ? $data['flwp_ff_identifier'] : uniqid('', true)),
            'flwp_ff_status'                => $data['status'] ?? 'unread'
        ];

        $formats = ['%d', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s'];

        if (!empty($data['created'])) {
            $insert_data['flwp_ff_created'] = $data['created'];
            $formats[] = '%s';
        }

        return $this->wpdb->insert($this->table_name, $insert_data, $formats);
    }

    public function update_feedback_by_identifier($identifier, $data) {
        $feedback_data = $data['feedback_data'] ?? [];
        if (is_array($feedback_data)) {
            $feedback_data = json_encode($feedback_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        $tracking_data = $data['tracking_data'] ?? [];
        $tracking_data_encoded = $tracking_data;
        if (is_array($tracking_data)) {
            $tracking_data_encoded = json_encode($tracking_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        $prepared_tracking = $this->getPreparedTrackingData($tracking_data);

        $update_data = [
            'flwp_ff_fd_id'                 => (int) $data['form_id'],
            'flwp_ff_form_type'             => $data['form_type'] ?? 'shortcode',
            'flwp_ff_feedback_data'         => $feedback_data,
            'flwp_ff_tracking_data'         => $tracking_data_encoded,
            'flwp_ff_tracking_page_url'     => $prepared_tracking['tracking_page_url'],
            'flwp_ff_tracking_language'     => $prepared_tracking['tracking_language'],
            'flwp_ff_tracking_screen_res_w' => $prepared_tracking['tracking_screen_res_w'],
            'flwp_ff_tracking_screen_res_h' => $prepared_tracking['tracking_screen_res_h'],
            'flwp_ff_tracking_viewport_w'   => $prepared_tracking['tracking_viewport_w'],
            'flwp_ff_tracking_viewport_h'   => $prepared_tracking['tracking_viewport_h'],
            'flwp_ff_tracking_timezone'     => $prepared_tracking['tracking_timezone'],
            'flwp_ff_tracking_conn_type'    => $prepared_tracking['tracking_conn_type'],
            'flwp_ff_tracking_device_type'  => $prepared_tracking['tracking_device_type'],
            'flwp_ff_tracking_session_id'   => $prepared_tracking['tracking_session_id'],
            'flwp_ff_tracking_time_on_page' => $prepared_tracking['tracking_time_on_page'],
            'flwp_ff_tracking_color_scheme' => $prepared_tracking['tracking_color_scheme'],
            'flwp_ff_status'                => $data['status'] ?? 'unread'
        ];

        $formats = ['%d', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s'];

        if (!empty($data['created'])) {
            $update_data['flwp_ff_created'] = $data['created'];
            $formats[] = '%s';
        }

		$preparedIdentifier = wp_strip_tags($identifier);

        return $this->wpdb->update($this->table_name, $update_data, ['flwp_ff_identifier' => $preparedIdentifier], $formats, ['%s']);
    }

    public function update_status($id, $status) {
        $allowed_status = ['unread', 'read', 'archived'];
        if (!in_array($status, $allowed_status)) {
            return false;
        }

        return $this->wpdb->update(
            $this->table_name,
            ['flwp_ff_status' => $status],
            ['flwp_ff_id' => $id],
            ['%s'],
            ['%d']
        );
    }

    public function delete_feedback($id) {
        return $this->wpdb->delete($this->table_name, ['flwp_ff_id' => $id], ['%d']);
    }

    public function get_feedback_by_id($id) {
        $row = $this->wpdb->get_row($this->wpdb->prepare(
            "SELECT * FROM $this->table_name WHERE flwp_ff_id = %d",
            $id
        ), ARRAY_A);

        return $row ? new \FLWP\Database\Entity\FormFeedback($row) : null;
    }

    public function get_feedback_by_identifier($identifier) {
        $row = $this->wpdb->get_row($this->wpdb->prepare(
            "SELECT * FROM $this->table_name WHERE flwp_ff_identifier = %s",
            $identifier
        ), ARRAY_A);

        return $row ? new \FLWP\Database\Entity\FormFeedback($row) : null;
    }

    public function get_stats($form_id = null) {
        $where = !empty($form_id) ? $this->wpdb->prepare("WHERE flwp_ff_fd_id = %d", $form_id) : '';
        
        $total = $this->wpdb->get_var("SELECT COUNT(*) FROM $this->table_name $where");
        
        $today_where = !empty($form_id) ? $this->wpdb->prepare("AND flwp_ff_fd_id = %d", $form_id) : '';
        $today = $this->wpdb->get_var("SELECT COUNT(*) FROM $this->table_name WHERE DATE(flwp_ff_created) = CURDATE() $today_where");

        $status_results = $this->wpdb->get_results("SELECT flwp_ff_status as status, COUNT(*) as count FROM $this->table_name $where GROUP BY flwp_ff_status", ARRAY_A);
        $statuses = [];
        foreach ($status_results as $row) {
            $statuses[$row['status']] = (int) $row['count'];
        }

        $type_results = $this->wpdb->get_results("SELECT flwp_ff_form_type as type, COUNT(*) as count FROM $this->table_name $where GROUP BY flwp_ff_form_type", ARRAY_A);
        $types = [];
        foreach ($type_results as $row) {
            $types[$row['type']] = [
                'total' => (int) $row['count']
            ];
        }

        return [
            'total' => (int) $total,
            'today' => (int) $today,
            'statuses' => $statuses,
            'types' => $types
        ];
    }
}
