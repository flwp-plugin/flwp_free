<?php

namespace FLWP\Database\Entity;

class Form {
    private $id;
    private $name;
    private $preview_data;
    private $live_data;
    private $status;
    private $last_saved;
    private $last_published;
    private $created;
    private $updated;

    public function __construct($data = []) {
        if (!empty($data)) {
            $this->id           = isset($data['flwp_fd_id']) ? (int) $data['flwp_fd_id'] : (isset($data['id']) ? (int) $data['id'] : null);
            $this->name         = $data['flwp_fd_name'] ?? ($data['name'] ?? '');
            $this->preview_data = $data['flwp_fd_preview_data'] ?? ($data['preview_data'] ?? null);
            $this->live_data    = $data['flwp_fd_live_data'] ?? ($data['live_data'] ?? null);
            $this->status       = isset($data['flwp_fd_status']) ? (int) $data['flwp_fd_status'] : (isset($data['status']) ? (int) $data['status'] : 1);
            $this->last_saved   = $data['flwp_fd_last_saved'] ?? ($data['last_saved'] ?? null);
            $this->last_published = $data['flwp_fd_last_published'] ?? ($data['last_published'] ?? null);
            $this->created      = $data['flwp_fd_created'] ?? ($data['created'] ?? '');
            $this->updated      = $data['flwp_fd_updated'] ?? ($data['updated'] ?? '');
        }
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getPreviewData(): ?string {
        return $this->preview_data;
    }

    public function getDecodedPreviewData(): array {
        return json_decode($this->preview_data, true) ?: [];
    }

    public function getLiveData(): ?string {
        return $this->live_data;
    }

    public function getDecodedLiveData(): array {
        return json_decode($this->live_data, true) ?: [];
    }

    public function getStatus(): int {
        return $this->status;
    }

    public function getLastSaved(): ?string {
        return $this->last_saved;
    }

    public function getLastPublished(): ?string {
        return $this->last_published;
    }

    public function getCreated(): string {
        return $this->created;
    }

    public function getUpdated(): string {
        return $this->updated;
    }

    public function toArray(): array {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'preview_data' => $this->getDecodedPreviewData(),
            'live_data'    => $this->getDecodedLiveData(),
            'status'           => $this->status,
            'last_saved'     => $this->last_saved,
            'last_published' => $this->last_published,
            'created'        => $this->created,
            'updated'      => $this->updated,
        ];
    }
}
