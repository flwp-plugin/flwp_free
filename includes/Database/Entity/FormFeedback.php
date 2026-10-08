<?php

namespace FLWP\Database\Entity;

class FormFeedback {
    private $id;
    private $form_id;
    private $form_type;
    private $feedback_data;
    private $tracking_data;
    private $tracking_page_url;
    private $tracking_language;
    private $tracking_screen_res_w;
    private $tracking_screen_res_h;
    private $tracking_viewport_w;
    private $tracking_viewport_h;
    private $tracking_timezone;
    private $tracking_conn_type;
    private $tracking_device_type;
    private $tracking_session_id;
    private $tracking_time_on_page;
    private $tracking_color_scheme;
    private $identifier;
    private $status;
    private $created;
    private $updated;

    public function __construct($data = []) {
        if (!empty($data)) {
            $this->id                    = isset($data['flwp_ff_id']) ? (int) $data['flwp_ff_id'] : (isset($data['id']) ? (int) $data['id'] : null);
            $this->form_id               = isset($data['flwp_ff_fd_id']) ? (int) $data['flwp_ff_fd_id'] : (isset($data['form_id']) ? (int) $data['form_id'] : null);
            $this->form_type             = $data['flwp_ff_form_type'] ?? ($data['form_type'] ?? 'shortcode');
            $this->feedback_data         = $data['flwp_ff_feedback_data'] ?? ($data['feedback_data'] ?? null);
            $this->tracking_data         = $data['flwp_ff_tracking_data'] ?? ($data['tracking_data'] ?? null);
            $this->tracking_page_url     = $data['flwp_ff_tracking_page_url'] ?? ($data['tracking_page_url'] ?? ($data['page_url'] ?? null));
            $this->tracking_language     = $data['flwp_ff_tracking_language'] ?? ($data['tracking_language'] ?? '');
            $this->tracking_screen_res_w = isset($data['flwp_ff_tracking_screen_res_w']) ? (int) $data['flwp_ff_tracking_screen_res_w'] : (isset($data['tracking_screen_res_w']) ? (int) $data['tracking_screen_res_w'] : null);
            $this->tracking_screen_res_h = isset($data['flwp_ff_tracking_screen_res_h']) ? (int) $data['flwp_ff_tracking_screen_res_h'] : (isset($data['tracking_screen_res_h']) ? (int) $data['tracking_screen_res_h'] : null);
            $this->tracking_viewport_w   = isset($data['flwp_ff_tracking_viewport_w']) ? (int) $data['flwp_ff_tracking_viewport_w'] : (isset($data['tracking_viewport_w']) ? (int) $data['tracking_viewport_w'] : null);
            $this->tracking_viewport_h   = isset($data['flwp_ff_tracking_viewport_h']) ? (int) $data['flwp_ff_tracking_viewport_h'] : (isset($data['tracking_viewport_h']) ? (int) $data['tracking_viewport_h'] : null);
            $this->tracking_timezone     = $data['flwp_ff_tracking_timezone'] ?? ($data['tracking_timezone'] ?? '');
            $this->tracking_conn_type     = $data['flwp_ff_tracking_conn_type'] ?? ($data['tracking_conn_type'] ?? '');
            $this->tracking_device_type   = $data['flwp_ff_tracking_device_type'] ?? ($data['tracking_device_type'] ?? '');
            $this->tracking_session_id    = $data['flwp_ff_tracking_session_id'] ?? ($data['tracking_session_id'] ?? '');
            $this->tracking_time_on_page  = isset($data['flwp_ff_tracking_time_on_page']) ? (int) $data['flwp_ff_tracking_time_on_page'] : (isset($data['tracking_time_on_page']) ? (int) $data['tracking_time_on_page'] : null);
            $this->tracking_color_scheme  = $data['flwp_ff_tracking_color_scheme'] ?? ($data['tracking_color_scheme'] ?? '');
            $this->identifier            = $data['flwp_ff_identifier'] ?? ($data['identifier'] ?? '');
            $this->status                = $data['flwp_ff_status'] ?? ($data['status'] ?? 'unread');
            $this->created               = $data['flwp_ff_created'] ?? ($data['created'] ?? '');
            $this->updated               = $data['flwp_ff_updated'] ?? ($data['updated'] ?? '');
        }
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getFormId(): ?int {
        return $this->form_id;
    }
    
    public function getFormType(): string {
        return $this->form_type;
    }

    public function getFeedbackData(): ?string {
        return $this->feedback_data;
    }

    public function getDecodedFeedbackData(): array {
        return json_decode($this->feedback_data, true) ?: [];
    }

    public function getTrackingData(): ?string {
        return $this->tracking_data;
    }

    public function getDecodedTrackingData(): array {
        return json_decode($this->tracking_data, true) ?: [];
    }

    public function getTrackingPageUrl(): ?string {
        return $this->tracking_page_url;
    }

    public function getTrackingLanguage(): string {
        return $this->tracking_language;
    }

    public function getTrackingScreenResW(): ?int {
        return $this->tracking_screen_res_w;
    }

    public function getTrackingScreenResH(): ?int {
        return $this->tracking_screen_res_h;
    }

    public function getTrackingViewportW(): ?int {
        return $this->tracking_viewport_w;
    }

    public function getTrackingViewportH(): ?int {
        return $this->tracking_viewport_h;
    }

    public function getTrackingTimezone(): string {
        return $this->tracking_timezone;
    }

    public function getTrackingConnType(): string {
        return $this->tracking_conn_type;
    }

    public function getTrackingDeviceType(): string {
        return $this->tracking_device_type;
    }

    public function getTrackingSessionId(): string {
        return $this->tracking_session_id;
    }

    public function getTrackingTimeOnPage(): ?int {
        return $this->tracking_time_on_page;
    }

    public function getTrackingColorScheme(): string {
        return $this->tracking_color_scheme;
    }

    public function getIdentifier(): string {
        return $this->identifier;
    }

    public function getStatus(): string {
        return $this->status;
    }

    public function getCreated(): string {
        return $this->created;
    }

    public function getUpdated(): string {
        return $this->updated;
    }

    public function toArray(array $ignore = []): array {
        $fields = [
            'id'                    => $this->id,
            'form_id'               => $this->form_id,
            'form_type'             => $this->form_type,
            'feedback_data'         => $this->feedback_data,
            'tracking_data'         => $this->tracking_data,
            'tracking_page_url'     => $this->tracking_page_url,
            'tracking_language'     => $this->tracking_language,
            'tracking_screen_res_w' => $this->tracking_screen_res_w,
            'tracking_screen_res_h' => $this->tracking_screen_res_h,
            'tracking_viewport_w'   => $this->tracking_viewport_w,
            'tracking_viewport_h'   => $this->tracking_viewport_h,
            'tracking_timezone'     => $this->tracking_timezone,
            'tracking_conn_type'    => $this->tracking_conn_type,
            'tracking_device_type'  => $this->tracking_device_type,
            'tracking_session_id'   => $this->tracking_session_id,
            'tracking_time_on_page' => $this->tracking_time_on_page,
            'tracking_color_scheme' => $this->tracking_color_scheme,
            'identifier'            => $this->identifier,
            'status'                => $this->status,
            'created'               => $this->created,
            'updated'               => $this->updated,
        ];

        if (!empty($ignore)) {
            foreach ($ignore as $field_name) {
                if (array_key_exists($field_name, $fields)) {
                    unset($fields[$field_name]);
                }
            }
        }

        return $fields;
    }
}
