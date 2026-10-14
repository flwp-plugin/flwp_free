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
		$wpdb = $this->wpdb;

        $form_table = $wpdb->prefix . 'flwp_form_data';

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- Checking a foreign key constraint for a custom plugin table.
		$check_fk = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT CONSTRAINT_NAME
				 FROM information_schema.KEY_COLUMN_USAGE
				 WHERE TABLE_SCHEMA = DATABASE()
				   AND TABLE_NAME = %s
				   AND CONSTRAINT_NAME = %s
				   AND REFERENCED_TABLE_NAME IS NOT NULL",
				$this->table_name,
				'FK_ff_fd'
			)
		);

		if (null !== $check_fk) {
			return;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery -- Custom plugin table.
		$wpdb->query(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery.SchemaChange -- Foreign key creation for custom plugin table.
				'ALTER TABLE %i
					 ADD CONSTRAINT FK_ff_fd
					 FOREIGN KEY (flwp_ff_fd_id)
					 REFERENCES %i (flwp_fd_id)
					 ON DELETE CASCADE
					 ON UPDATE NO ACTION',
			    $this->table_name,
			    $form_table
			)
		);
	}

    private function apply_filters($args) {
        $where = "WHERE 1=1";

        if (!empty($args['form_id'])) {
            if (is_array($args['form_id'])) {
                $ids = array_map('intval', $args['form_id']);
                $placeholders = implode(',', array_fill(0, count($ids), '%d'));
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare -- Placeholders are generated exclusively from %d; values are bound via prepare().
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
		$wpdb = $this->wpdb;

        $orderby = !empty($args['orderby']) ? sanitize_sql_orderby(wp_unslash($args['orderby'])) : 'flwp_ff_created';
        $order = !empty($args['order']) ? sanitize_text_field(wp_unslash($args['order'])) : 'DESC';
        $limit = isset($args['limit']) ? (int) $args['limit'] : 50;
        $offset = isset($args['offset']) ? (int) $args['offset'] : 0;

        $where = $this->apply_filters($args);

        $allowed_orderby = ['flwp_ff_id', 'flwp_ff_created', 'flwp_ff_fd_id', 'flwp_ff_status', 'flwp_ff_identifier'];
        if (!in_array($orderby, $allowed_orderby)) {
            $orderby = 'flwp_ff_created';
        }

        $order = (strtoupper($order) === 'ASC') ? 'ASC' : 'DESC';

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, PluginCheck.Security.DirectDB.UnescapedDBParameter, WordPress.DB.DirectDatabaseQuery.DirectQuery
		$results = $wpdb->get_results(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT * FROM %i {$where} ORDER BY {$orderby} {$order} LIMIT %d OFFSET %d", [
					$this->table_name, $limit, $offset
				]
			),
			ARRAY_A
		);

        $feedbacks = [];
        if ($results) {
            foreach ($results as $row) {
                $feedbacks[] = new \FLWP\Database\Entity\FormFeedback($row);
            }
        }
        
        return $feedbacks;
    }

    public function get_feedback_count($args = []) {
		$wpdb = $this->wpdb;

        $where = $this->apply_filters($args);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
        return (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM %i {$where}", $this->table_name));
    }

    private function getPreparedTrackingData($tracking_data) {
		return [
			'tracking_page_url' => $tracking_data['url'] ?? '',
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
		$wpdb = $this->wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $row = $wpdb->get_row(
			$wpdb->prepare("SELECT * FROM %i WHERE flwp_ff_id = %d", [
				$this->table_name,
				$id
			]),
			ARRAY_A
		);

        return $row ? new \FLWP\Database\Entity\FormFeedback($row) : null;
    }

    public function get_stats($form_id = null) {
		$wpdb = $this->wpdb;

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
		if (null !== $form_id && absint($form_id) > 0) {
			$total = $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM %i WHERE flwp_ff_fd_id = %d',
				    $this->table_name,
				    absint($form_id)
				)
			);

			$today = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM %i WHERE DATE(flwp_ff_created) = CURDATE() AND flwp_ff_fd_id = %d",
				   $this->table_name,
				   absint($form_id)
				)
			);

			$status_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT flwp_ff_status as status, COUNT(*) as count FROM %i AND flwp_ff_fd_id = %d GROUP BY flwp_ff_status",
					$this->table_name,
					absint($form_id)
				),
				ARRAY_A
			);

			$type_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT flwp_ff_form_type as type, COUNT(*) as count FROM %i AND flwp_ff_fd_id = %d GROUP BY flwp_ff_form_type",
					$this->table_name,
					absint($form_id)
				),
				ARRAY_A
			);
		} else {
			$total = $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM %i',
				    $this->table_name
				)
			);

			$today = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM %i WHERE DATE(flwp_ff_created) = CURDATE()",
					$this->table_name
				)
			);

			$status_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT flwp_ff_status as status, COUNT(*) as count FROM %i GROUP BY flwp_ff_status",
					$this->table_name
				),
				ARRAY_A
			);

			$type_results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT flwp_ff_form_type as type, COUNT(*) as count FROM %i GROUP BY flwp_ff_form_type",
					$this->table_name
				),
				ARRAY_A
			);
		}
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery

        $statuses = [];
        foreach ($status_results as $row) {
            $statuses[$row['status']] = (int) $row['count'];
        }

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
