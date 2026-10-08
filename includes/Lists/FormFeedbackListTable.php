<?php

namespace FLWP\Lists;

use FLWP\Database\FormFeedback;
use FLWP\Helper\FormHelper;
use WP_List_Table;

if (!defined('ABSPATH')) {
	exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class FormFeedbackListTable extends WP_List_Table {

	protected $formHelper;

    public function __construct() {
		$this->formHelper = new FormHelper();

        parent::__construct( [
            'singular' => 'form_feedback',
            'plural'   => 'form_feedbacks',
            'ajax'     => false
        ] );
    }

    public function get_columns() {
        return [
            'id'            => esc_html__( 'admin.form_list.id', 'flwp' ),
            'form_id'       => esc_html__( 'admin.form_list.form_id', 'flwp' ),
            'form_type'     => esc_html__( 'admin.form_list.display_type', 'flwp' ),
            'form_name'     => esc_html__( 'admin.form_list.form_name', 'flwp' ),
            'page_url'      => esc_html__( 'admin.form_list.page_url', 'flwp' ),
            'status'        => esc_html__( 'admin.form_list.status', 'flwp' ),
            'created'       => esc_html__( 'admin.form_list.created', 'flwp' ),
            'updated'       => esc_html__( 'admin.form_list.updated', 'flwp' ),
        ];
    }

    protected function get_sortable_columns() {
        return [
            'id'      => [ 'id', false ],
            'form_id' => [ 'form_id', false ],
            'created' => [ 'created', false ],
            'updated' => [ 'updated', true ],
        ];
    }

    public function column_default( $item, $column_name ) {
        $feedback = $item['feedback_entity'];
        
        switch ( $column_name ) {
            case 'id':
                return '#' . $feedback->getId();
            case 'form_id':
                return $feedback->getFormId();
            case 'form_type':
				$formType = $this->formHelper->get_form_type_name($feedback->getFormType());
                return sprintf( '<code style="font-size: 10px;">%s</code>', esc_html($formType));
            case 'form_name':
                $data = $feedback->getDecodedFeedbackData();
                return esc_html( $data['title'] ?? '-' );
            case 'page_url':
                $url = $feedback->getTrackingPageUrl();
                $path = wp_parse_url( $url, PHP_URL_PATH ) ?: $url;
                return sprintf( 
                    '<div class="flwp-text-muted" style="font-size: 11px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><a href="%1$s" target="_blank">%2$s</a></div>', 
                    esc_url( $url ),
                    esc_html( $path )
                );
            case 'status':
                $status = $feedback->getStatus();
                switch ( $status ) {
                    case 'read':
                        $status_label = esc_html__( 'admin.form_list.filter.status.read', 'flwp' );
                        break;
                    case 'archived':
                        $status_label = esc_html__( 'admin.form_list.filter.status.archived', 'flwp' );
                        break;
                    case 'unread':
                    default:
                        $status_label = esc_html__( 'admin.form_list.filter.status.unread', 'flwp' );
                        break;
                }
                return sprintf( '<span class="flwp-status-badge %s">%s</span>', esc_attr( $status ), esc_html( $status_label ) );
            case 'created':
                return date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $feedback->getCreated() ) );
            case 'updated':
                return date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $feedback->getUpdated() ) );
            default:
                return '-';
        }
    }

    public function column_id( $item ) {
        $feedback = $item['feedback_entity'];
        $actions = [
            'view'   => sprintf( 
                '<a href="#" class="flwp-view-feedback" data-id="%d">%s</a>', 
                $feedback->getId(), 
                esc_html__( 'admin.form_list.action.view', 'flwp' )
            ),
            'delete' => sprintf( 
                '<a href="#" class="flwp-delete-form-feedback" data-id="%d">%s</a>', 
                $feedback->getId(), 
                esc_html__( 'admin.form_list.action.delete', 'flwp' )
            ),
        ];

        return sprintf( '<strong><a href="#" class="flwp-view-feedback" data-id="%d">#%d</a></strong> %s', 
            $feedback->getId(),
            $feedback->getId(), 
            $this->row_actions( $actions ) 
        );
    }

    public function no_items() {
        esc_html_e( 'admin.form_list.no_items', 'flwp' );
    }

    public function extra_tablenav( $which ) {
        if ( $which === 'top' ) {
			$range = !empty($_GET['filter_range']) ? sanitize_text_field(wp_unslash($_GET['filter_range'])) : '';
			$start_date = !empty($_GET['filter_start_date']) ? sanitize_text_field(wp_unslash($_GET['filter_start_date'])) : '';
			$end_date = !empty($_GET['filter_end_date']) ? sanitize_text_field(wp_unslash($_GET['filter_end_date'])) : '';
			$date_style = ($range === 'custom') ? '' : 'display:none;';
            ?>
            <div class="alignleft actions">
                <?php $form_id_filter = !empty( $_GET['filter_form_id'] ) ? (int) $_GET['filter_form_id'] : ''; ?>
                <select name="filter_form_id" id="filter-form-id-select">
                    <option value=""><?php esc_html_e( 'admin.form_list.filter.form', 'flwp' ); ?></option>
                    <?php
                    $form_db = new \FLWP\Database\Form();
                    $forms = $form_db->get_forms(['limit' => 999, 'orderby' => 'flwp_fd_name', 'order' => 'ASC']);
                    foreach ($forms as $form) {
                        printf(
                                '<option value="%d" %s>%d %s</option>',
                                $form->getId(),
                                selected($form_id_filter, $form->getId(), false),
                                $form->getId(),
                                esc_html($form->getName())
                        );
                    }
                    ?>
                </select>

                <?php $form_type_filter = ! empty( $_GET['filter_form_type'] ) ? sanitize_text_field(wp_unslash($_GET['filter_form_type'] )) : ''; ?>
                <select name="filter_form_type" id="filter-form-type-select">
                    <option value=""><?php esc_html_e( 'admin.form_list.display_type', 'flwp' ); ?></option>
                    <?php foreach ($this->formHelper->get_form_type_name_mapping() as $type => $name) : ?>
                        <option value="<?php echo esc_attr($type); ?>" <?php selected($form_type_filter, $type); ?>><?php echo esc_html($name); ?></option>
                    <?php endforeach; ?>
                </select>

                <?php $status_filter = ! empty( $_GET['filter_status'] ) ? sanitize_text_field(wp_unslash($_GET['filter_status'] )) : ''; ?>
                <select name="filter_status" id="filter-status-select">
                    <option value=""><?php esc_html_e( 'admin.form_list.filter.status.placeholder', 'flwp' ); ?></option>
                    <option value="unread" <?php selected( $status_filter, 'unread' ); ?>><?php esc_html_e( 'admin.form_list.filter.status.unread', 'flwp' ); ?></option>
                    <option value="read" <?php selected( $status_filter, 'read' ); ?>><?php esc_html_e( 'admin.form_list.filter.status.read', 'flwp' ); ?></option>
                    <option value="archived" <?php selected( $status_filter, 'archived' ); ?>><?php esc_html_e( 'admin.form_list.filter.status.archived', 'flwp' ); ?></option>
                </select>

                <select name="filter_range" id="filter-range-select">
                    <option value=""><?php esc_html_e( 'admin.form_list.filter.range.placeholder', 'flwp' ); ?></option>
                    <option value="today" <?php selected( $range, 'today' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.today', 'flwp' ); ?></option>
                    <option value="yesterday" <?php selected( $range, 'yesterday' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.yesterday', 'flwp' ); ?></option>
                    <option value="last_7_days" <?php selected( $range, 'last_7_days' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.last_7_days', 'flwp' ); ?></option>
                    <option value="last_30_days" <?php selected( $range, 'last_30_days' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.last_30_days', 'flwp' ); ?></option>
                    <option value="this_month" <?php selected( $range, 'this_month' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.this_month', 'flwp' ); ?></option>
                    <option value="last_month" <?php selected( $range, 'last_month' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.last_month', 'flwp' ); ?></option>
                    <option value="this_year" <?php selected( $range, 'this_year' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.this_year', 'flwp' ); ?></option>
                    <option value="last_year" <?php selected( $range, 'last_year' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.last_year', 'flwp' ); ?></option>
                    <option value="custom" <?php selected( $range, 'custom' ); ?>><?php esc_html_e( 'admin.form_list.filter.range.custom', 'flwp' ); ?></option>
                </select>

            	<span class="custom-date-fields" style="<?php echo esc_html($date_style); ?>">
					<input type="date" name="filter_start_date" value="<?php echo esc_attr( $start_date ); ?>" placeholder="<?php esc_html_e( 'admin.form_list.filter.date.start', 'flwp' ); ?>" />
					<input type="date" name="filter_end_date" value="<?php echo esc_attr( $end_date ); ?>" placeholder="<?php esc_html_e( 'admin.form_list.filter.date.end', 'flwp' ); ?>" />
				</span>

                <?php submit_button( esc_html__( 'admin.form_list.filter.button', 'flwp' ), '', 'filter_action', false ); ?>
            </div>
            <?php
        }
    }

    public function prepare_items() {
        $columns  = $this->get_columns();
        $hidden   = [];
        $sortable = $this->get_sortable_columns();

        $this->_column_headers = [ $columns, $hidden, $sortable ];

        $per_page     = 20;
        $current_page = $this->get_pagenum();

		$orderby = (!empty($_GET['orderby'])) ? sanitize_text_field(wp_unslash($_GET['orderby'])) : 'created';
		$order = (!empty($_GET['order'])) ? sanitize_text_field(wp_unslash($_GET['order'])) : 'desc';

		$filter_range = !empty($_GET['filter_range']) ? sanitize_text_field(wp_unslash($_GET['filter_range'])) : '';
		$filter_status = !empty($_GET['filter_status']) ? sanitize_text_field(wp_unslash($_GET['filter_status'])) : '';
		$filter_form_type = !empty($_GET['filter_form_type']) ? sanitize_text_field(wp_unslash($_GET['filter_form_type'])) : '';
		$filter_form_id = !empty($_GET['filter_form_id']) ? (int) wp_unslash($_GET['filter_form_id']) : '';
		$filter_start_date = !empty($_GET['filter_start_date']) ? sanitize_text_field(wp_unslash($_GET['filter_start_date'])) : '';
		$filter_end_date = !empty($_GET['filter_end_date']) ? sanitize_text_field(wp_unslash($_GET['filter_end_date'])) : '';

        // Map orderby to DB columns
        $mapping = [
            'id'      => 'flwp_ff_id',
            'form_id' => 'flwp_ff_fd_id',
            'created' => 'flwp_ff_created',
            'updated' => 'flwp_ff_updated',
        ];

        if ( isset( $mapping[ $orderby ] ) ) {
            $orderby = $mapping[ $orderby ];
        }

        $args = [
            'limit'      => $per_page,
            'offset'     => ( $current_page - 1 ) * $per_page,
            'orderby'    => $orderby,
            'order'      => $order,
            'range'      => $filter_range,
            'status'     => $filter_status,
            'form_type'  => $filter_form_type,
            'form_id'    => $filter_form_id,
            'start_date' => $filter_start_date,
            'end_date'   => $filter_end_date,
        ];

        $form_feedback_db = new FormFeedback();
        $total_items      = $form_feedback_db->get_feedback_count( $args );
        $feedbacks        = $form_feedback_db->get_feedbacks( $args );

        $this->items = [];
        foreach ( $feedbacks as $feedback ) {
            $this->items[] = [
                'id'              => $feedback->getId(),
                'feedback_entity' => $feedback
            ];
        }

		$requestUri = sanitize_url(wp_unslash($_SERVER['REQUEST_URI'] ?? ''));
		// Preserve parameters in pagination and sorting links
		if (!empty($filter_range)) {
			$requestUri = add_query_arg('filter_range', $filter_range, $requestUri);
		}
		if (!empty($filter_status)) {
			$requestUri = add_query_arg('filter_status', $filter_status, $requestUri);
		}
		if (!empty($filter_form_type)) {
			$requestUri = add_query_arg('filter_form_type', $filter_form_type, $requestUri);
		}
		if (!empty($filter_form_id)) {
			$requestUri = add_query_arg('filter_form_id', $filter_form_id, $requestUri);
		}
		if (!empty($filter_start_date)) {
			$requestUri = add_query_arg('filter_start_date', $filter_start_date, $requestUri);
		}
		if (!empty($filter_end_date)) {
			$requestUri = add_query_arg('filter_end_date', $filter_end_date, $requestUri);
		}

		if (!empty($requestUri)) {
			$_SERVER['REQUEST_URI'] = $requestUri;
		}

        $this->set_pagination_args( [
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil( $total_items / $per_page )
        ] );
    }
}
