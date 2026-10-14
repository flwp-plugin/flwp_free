<?php

namespace FLWP\Database\Entity;

class FormFeedback {
    private $id;
    private $form_id;
    private $form_type;
    private $feedback_data;
    private $tracking_data;
    private $tracking_page_url;
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
