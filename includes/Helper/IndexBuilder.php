<?php

namespace FLWP\Helper;

class IndexBuilder {
    private const OPTION_KEY_PREFIX = 'flwp_targeting_index_';
    private const STATUS_LIVE = 'live';
    private const STATUS_PREVIEW = 'preview';

    /**
     * Generiert den Targeting-Index neu und speichert ihn in den WordPress-Optionen.
     * Berücksichtigt werden nur Formulare mit flwp_fd_status = 2.
     *
     * @return void
     */
    public function rebuild(): void {
        $this->generate_index(self::STATUS_LIVE);
        $this->generate_index(self::STATUS_PREVIEW);
    }

    /**
     * Gibt eine Liste von Formular-IDs zurück, die für den aktuellen Kontext und Anzeigetyp passen.
     *
     * @param array $displayType Ein einzelner Typ oder ein Array von Typen ('shortcode', 'in-content', 'feedback-button', 'exit-intent')
     * @param string $status 'live' oder 'preview'
     * @return array Wenn $displayType ein String ist: Liste von IDs. Wenn Array: [typ => [ids]]
     */
    public function get_form_ids(array $displayType, string $status = self::STATUS_LIVE): array {
        $index = get_option(self::OPTION_KEY_PREFIX . $status, []);

        $results = [];
        foreach ($displayType as $type) {
            $results[$type] = $this->resolve_ids_for_type($index, $type);
        }

        return $results;
    }

    /**
     * Hilfsmethode zur Auflösung der IDs für einen spezifischen Typ aus dem Index.
     *
     * @param array $index
     * @param string $displayType
     * @return array
     */
    private function resolve_ids_for_type(array $index, string $displayType): array {
        if (empty($index) || !isset($index[$displayType])) {
            return [];
        }

        $displayIndex = $index[$displayType];
        $rulesByForm = $displayIndex['rules_by_form'] ?? [];
        if (empty($rulesByForm)) {
            return [];
        }

        $fastFilters = $displayIndex['fast_filters'] ?? [];
		$requestUri = sanitize_url(wp_unslash($_SERVER['REQUEST_URI'] ?? ''));
        $currentUrl = wp_parse_url($requestUri, PHP_URL_PATH);
        $isFrontpage = is_front_page();
        $currentPostType = get_post_type();
        $isMobile = wp_is_mobile();
        $currentDevice = $isMobile ? 'mobile' : 'desktop';

        // Starten mit allen aktiven Formularen für diesen Anzeigetyp
        $candidates = array_keys($rulesByForm);

        // 1. Startseiten-Filterung (Frontpage Fast-Filter)
        if ($isFrontpage) {
            // alle formulare, welche auf der startseite angezeigt werden dürfen
            $showOnFrontpage = $fastFilters['show_on_frontpage'] ?? [];
            if (!empty($showOnFrontpage)) {
                $candidates = array_intersect($candidates, $showOnFrontpage);
            }
        }

        // 2. Seitentyp-Filterung (Page Type Fast-Filter)
        $byPageType = $fastFilters['by_page_type'] ?? [];
        if (!empty($byPageType)) {
            // Sammle alle Formular-IDs, die IRGENDEINE Seitentyp-Einschränkung haben
            $allPageTypeRestricted = [];
            foreach ($byPageType as $ptype => $ids) {
                if (is_array($ids)) {
                    $allPageTypeRestricted = array_merge($allPageTypeRestricted, $ids);
                }
            }
            $allPageTypeRestricted = array_unique($allPageTypeRestricted);

            // Wenn ein Formular seitentyp-eingeschränkt ist, MUSS es für den aktuellen Seitentyp erlaubt sein
            $allowedForCurrentPageType = $byPageType[$currentPostType] ?? [];
            foreach ($candidates as $key => $formId) {
                if (in_array($formId, $allPageTypeRestricted, true) && !in_array($formId, $allowedForCurrentPageType, true)) {
                    unset($candidates[$key]);
                }
            }
        }

        $matchingIds = [];

        // Finale präzise Evaluierung der Regeln für die verbleibenden Kandidaten
        foreach ($candidates as $formId) {
            $rules = $rulesByForm[$formId] ?? [];
            $singleRules = $rules['single'] ?? [];
            $andRules = $rules['and'] ?? [];
            $orRules = $rules['or'] ?? [];

            // Alle singleRules müssen erfüllt sein
            $singleMatch = true;
            foreach ($singleRules as $ruleType => $ruleValue) {
                if ($ruleType === 'show_on_frontpage') {
					// sind auf der frontpage, form darf aber nicht auf frontpage angezeigt werden
                    if ($ruleValue === false && $isFrontpage) {
                        $singleMatch = false;
                        break;
                    }
                }
            }

            if (!$singleMatch) {
                continue;
            }

            // Alle andRules müssen erfüllt sein
            $andMatch = true;
            foreach ($andRules as $rule) {
                if (!$this->evaluate_rule($rule, $currentUrl, $currentPostType, $currentDevice, $isFrontpage)) {
                    $andMatch = false;
                    break;
                }
            }

            if (!$andMatch) {
                continue;
            }

            // Mindestens eine orRule muss erfüllt sein (falls vorhanden)
            $orMatch = empty($orRules);
            foreach ($orRules as $rule) {
                if ($this->evaluate_rule($rule, $currentUrl, $currentPostType, $currentDevice, $isFrontpage)) {
                    $orMatch = true;
                    break;
                }
            }

            if ($orMatch) {
                $matchingIds[] = $formId;
            }
        }

        return $matchingIds;
    }

    /**
     * Wertet eine einzelne Regel aus.
     *
     * @param array $rule
     * @param string $currentUrl
     * @param string $currentPostType
     * @param string $currentDevice
     * @param bool $isFrontpage
     * @return bool
     */
    private function evaluate_rule(array $rule, string $currentUrl, string $currentPostType, string $currentDevice, bool $isFrontpage): bool {
        $type = $rule['type'] ?? '';
        $operator = $rule['operator'] ?? 'exact';
        $value = $rule['value'] ?? null;

        switch ($type) {
            case 'page_type':
                if ($operator === 'in' && is_array($value)) {
                    return in_array($currentPostType, $value);
                }
                return $currentPostType === $value;

            case 'device': // eher frontendseitig prüfen
                return true;
//                if ($operator === 'in' && is_array($value)) {
//                    return in_array($currentDevice, $value);
//                }
//                return $currentDevice === $value;

            case 'url':
                switch ($operator) {
                    case 'contains':
                        return strpos($currentUrl, (string)$value) !== false;
                    case 'not_contains':
                        return strpos($currentUrl, (string)$value) === false;
                    case 'exact':
                        return $currentUrl === $value;
                    case 'not_exact':
                        return $currentUrl !== $value;
                }
                break;

            case 'cookie':
                $cookieName = $rule['cookieName'] ?? $rule['cookie_name'] ?? '';
                if (empty($cookieName)) {
                    return false;
                }
                $cookieValue = sanitize_text_field(wp_unslash($_COOKIE[$cookieName] ?? ''));
                switch ($operator) {
                    case 'exact':
                        return $cookieValue === (string)$value;
                    case 'not_exact':
                        return $cookieValue !== (string)$value;
                    case 'contains':
                        return strpos($cookieValue, (string)$value) !== false;
                    case 'not_contains':
                        return strpos($cookieValue, (string)$value) === false;
                    case 'exists':
                        return isset($_COOKIE[$cookieName]);
                    case 'not_exists':
                        return !isset($_COOKIE[$cookieName]);
                }
                break;
        }

        return false;
    }

    /**
     * Interne Methode zur Index-Generierung für einen bestimmten Status.
     *
     * @param string $status
     * @return void
     */
    private function generate_index(string $status): void {
        $forms = $this->get_relevant_forms();
        $index = [
            'shortcode'  => $this->get_empty_structure(),
            'in-content' => $this->get_empty_structure(),
            'overlay'    => $this->get_empty_structure(),
        ];

        foreach ($forms as $form) {
            $raw_data = ($status === self::STATUS_LIVE) ? $form->getLiveData() : $form->getPreviewData();
			if (empty($raw_data)) {
				continue;
			}

            $formData = json_decode($raw_data, true);
            
            if (!$formData || !isset($formData['targeting'])) {
                continue;
            }

            foreach ($index as $targetingType => $data) {
                if ($this->is_targeting_type_active($formData, $targetingType)) {
                    $index[$targetingType] = $this->add_form_to_index($data, (int)$form->getId(), $formData['targeting'][$targetingType] ?? []);
                }
            }
        }

        update_option(self::OPTION_KEY_PREFIX . $status, $index, false);
    }

    /**
     * Holt alle relevanten Formular-Posts.
     *
     * @return \FLWP\Database\Entity\Form[]
     */
    private function get_relevant_forms(): array {
        $form_db = new \FLWP\Database\Form();

        return $form_db->get_forms([
            'limit'  => 1000,
//            'status' => 2,
        ]);
    }

    /**
     * Prüft ob ein Ausspielungstyp für ein Formular aktiviert ist.
     *
     * @param array $formData
     * @param string $targetingType
     * @return bool
     */
    private function is_targeting_type_active(array $formData, string $targetingType): bool {
        $settings = $formData['settings'] ?? [];

        switch ($targetingType) {
            case 'shortcode':
                // Shortcode ist "immer" aktiv wenn definiert, oder wir prüfen das main displayType setting
                return ($settings['display']['displayType'] ?? '') === 'in-content';
            case 'in-content':
                return ($settings['display']['subTypeData']['shortcode']['autoEnabled'] ?? false) === true;
            case 'overlay':
                return ($settings['display']['displayType'] ?? '') === 'overlay';
        }

        return false;
    }

    /**
     * Fügt ein Formular basierend auf seinen Targeting-Regeln zum Index-Zweig hinzu.
     *
     * @param array $indexPart Der Teil des Index (z.B. $index['shortcode'])
     * @param int $formId
     * @param array $targeting
     * @return array Der aktualisierte Teil des Index
     */
    private function add_form_to_index(array $indexPart, int $formId, array $targeting): array {
        $andRules = $targeting['andRules'] ?? [];
        $orRules = $targeting['orRules'] ?? [];
        $singleRules = $targeting['singleRules'] ?? [];

        // Extract 'frontpage' from singleRules if it exists as a boolean
        $frontpage = $singleRules['show_on_frontpage'] ?? false;
        if ($frontpage === true) {
            if (!in_array($formId, $indexPart['fast_filters']['show_on_frontpage'], true)) {
                $indexPart['fast_filters']['show_on_frontpage'][] = $formId;
            }
        }

        // Kompiliertes Regelwerk für die finale Evaluierung speichern
        $indexPart['rules_by_form'][$formId] = [
            'single' => $singleRules,
            'and' => $andRules,
            'or'  => $orRules,
        ];

        // Schnell-Filter (fast_filters) befüllen anhand von andRules
        foreach ($andRules as $rule) {
            $type = $rule['type'] ?? '';
            $value = $rule['value'] ?? null;
            $operator = $rule['operator'] ?? 'exact';

            if ($type === 'page_type') {
                if ($operator === 'in' && is_array($value)) {
                    foreach ($value as $ptype) {
                        if (!isset($indexPart['fast_filters']['by_page_type'][$ptype])) {
                            $indexPart['fast_filters']['by_page_type'][$ptype] = [];
                        }
                        if (!in_array($formId, $indexPart['fast_filters']['by_page_type'][$ptype], true)) {
                            $indexPart['fast_filters']['by_page_type'][$ptype][] = $formId;
                        }
                    }
                } elseif ($operator === 'exact' && is_string($value)) {
                    if (!isset($indexPart['fast_filters']['by_page_type'][$value])) {
                        $indexPart['fast_filters']['by_page_type'][$value] = [];
                    }
                    if (!in_array($formId, $indexPart['fast_filters']['by_page_type'][$value], true)) {
                        $indexPart['fast_filters']['by_page_type'][$value][] = $formId;
                    }
                }
            }
        }

        return $indexPart;
    }

    /**
     * Gibt die Grundstruktur für einen Anzeigetyp-Index zurück.
     *
     * @return array
     */
    private function get_empty_structure(): array {
        return [
            'fast_filters' => [
                'show_on_frontpage' => [],
                'by_page_type'   => [
                    'post' => [],
                    'page' => [],
                ],
            ],
            'rules_by_form' => [],
        ];
    }
}
