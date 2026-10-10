<?php
namespace FLWP\Helper;

class FormFeedbackHelper {

    /**
     * Bereitet die User-Daten für die Detailansicht auf.
     * Konsolidiert alle Steps in Step 1 und filtert nicht relevante Felder.
     */
    public function prepare_steps_for_detail_view(array $user_data) {
        if (!isset($user_data['steps'])) {
            return [];
        }

        $preparedUserValues = [];
        $active_step2_trigger_id = $user_data['active_step2_trigger_id'] ?? '';

        $steps = $user_data['steps'];
        $final_step1 = [];

        // 1. Step 1 Felder übernehmen
        if (isset($steps['step1']) && is_array($steps['step1'])) {
            $final_step1 = $this->filter_fields_for_detail_view($steps['step1'], $active_step2_trigger_id);
        }

        // 2. Alle Step 2 Felder ans Ende von Step 1 hängen
        if (isset($steps['step2']) && is_array($steps['step2'])) {
            foreach ($steps['step2'] as $trigger_id => $fields) {
                // Nur Felder anzeigen, die für active_step2_trigger_id definiert sind (falls gesetzt)
                if (!empty($active_step2_trigger_id) && $trigger_id !== $active_step2_trigger_id) {
                    continue;
                }

                if (is_array($fields)) {
                    $filtered_fields = $this->filter_fields_for_detail_view($fields, $active_step2_trigger_id);
                    foreach ($filtered_fields as $field) {
                        $final_step1[] = $field;
                    }
                }
            }
        }

        foreach ($final_step1 as $step) {
            if (!isset($step['value'])) {
                continue;
            }

            $preparedUserValues[$step['id']] = $step['value'];
        }

        // Resultat zusammenbauen
        $user_data = [
            'steps' => [
                'step1' => $final_step1
            ],
            'userValues' => $preparedUserValues
        ];

        return $user_data;
    }

    /**
     * Filtert eine Liste von Feldern für die Detailansicht.
     * Felder mit userinput=true werden entfernt, wenn kein "value" gesetzt ist.
     * Ausnahme: Das Feld mit der ID $active_step2_trigger_id wird immer angezeigt.
     */
    protected function filter_fields_for_detail_view(array $fields, string $active_step2_trigger_id = ''): array {
        $configHelper = new ConfigHelper();
        $field_configs = $configHelper->get_field_types_config();
        
        return array_values(array_filter($fields, function($field) use ($field_configs, $active_step2_trigger_id) {
            $type = $field['type'] ?? '';
            $config = $field_configs[$type] ?? null;

            if (!$config) {
                return false;
            }

            // Wenn es sich um den active_step2_trigger_id handelt, immer anzeigen (wenn config vorhanden)
            if (!empty($active_step2_trigger_id) && isset($field['id']) && $field['id'] === $active_step2_trigger_id) {
                return true;
            }

            // Wenn userinput benötigt wird, muss ein value vorhanden sein
            if (isset($config['userinput']) && $config['userinput'] === true) {
                return array_key_exists('value', $field);
            }

            return true;
        }));
    }
}
