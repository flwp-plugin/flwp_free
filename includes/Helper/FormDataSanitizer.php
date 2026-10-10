<?php
/** FLWP form configuration sanitizer. PHP 7.4+. */

namespace FLWP\Helper;

use WP_Error;

if (!defined('ABSPATH')) {
	exit;
}

class FormDataSanitizer
{
	private $allowed_fields;
	private $errors = [];
	private $removed = [];

	public function __construct(array $allowed_fields)
	{
		$this->allowed_fields = array_values(array_unique(array_map('strval', $allowed_fields)));
	}

	public function get_removed_keys(): array
	{
		return $this->removed;
	}

	private function report(string $path, string $reason, bool $fatal = false): void
	{
		if ($fatal) {
			$this->errors[] = $path . ': ' . $reason;
		} else {
			$this->removed[] = $path . ': ' . $reason;
		}
		if (
			defined('WP_DEBUG') && WP_DEBUG &&
			defined('WP_DEBUG_LOG') && WP_DEBUG_LOG
		) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- Debug logging only when WP_DEBUG and WP_DEBUG_LOG are enabled.
			error_log(
				'[FLWP FormDataSanitizer] ' .
				( $fatal ? 'Invalid: ' : 'Removed/adjusted: ' ) .
				$path . ' (' . $reason . ')'
			);
		}
	}

	private function object($value, string $path): array
	{
		if (!is_array($value)) {
			$this->report($path, 'Expected object', true);

			return [];
		}

		return $value;
	}

	private function apply($value, array $schema, string $path)
	{
		if (!is_array($value)) {
			$this->report($path, 'Expected object', true);

			return [];
		}
		$out = [];
		foreach ($value as $key => $item) {
			$p = $path . '.' . $key;
			if (!array_key_exists($key, $schema)) {
				$this->report($p, 'Unknown key');
				continue;
			}
			$rule = $schema[$key];
			if (is_array($rule)) {
				$out[$key] = $this->apply($item, $rule, $p);
			} else {
				$out[$key] = $this->scalar($item, $rule, $p);
			}
		}

		return $out;
	}

	private function scalar($value, string $rule, string $path)
	{
		if ('bool' === $rule) {
			if (!is_bool($value)) {
				$this->report($path, 'Expected boolean', true);

				return false;
			}

			return $value;
		}
		if ('int' === $rule || 'positive' === $rule || 'percent' === $rule) {
			if (!is_int($value) && !(is_string($value) && preg_match('/^\d+$/D', $value))) {
				$this->report($path, 'Expected nonnegative integer', true);

				return 0;
			}
			$number = (int)$value;
			if ('positive' === $rule) {
				$number = max(1, min(10000, $number));
			} elseif ('percent' === $rule) {
				$number = max(0, min(100, $number));
			} else {
				$number = max(0, min(36500, $number));
			}

			return $number;
		}
		if (!is_string($value) && !is_numeric($value)) {
			$this->report($path, 'Expected string', true);

			return '';
		}
		$value = (string)$value;
		if ('rich' === $rule) {
			return wp_kses_post($value);
		}
		if ('text' === $rule) {
			$clean = sanitize_text_field( $value );

			if ($clean !== $value) {
				$this->report($path, 'Text sanitized');
			}

			return $clean;
		}
		if ('email' === $rule) {
			return sanitize_email($value);
		}
		if ('url' === $rule) {
			return esc_url_raw($value);
		}
		if ('color' === $rule) {
			$color = sanitize_hex_color($value);
			if (!$color) {
				$this->report($path, 'Invalid color; defaulted');

				return '#000000';
			}

			return $color;
		}
		if ('classes' === $rule) {
			return implode(' ', array_filter(array_map('sanitize_html_class', preg_split('/\s+/', trim($value)))));
		}
		if ('selector' === $rule) {
			// CSS selector syntax is broad; never concatenate into CSS/HTML without context-specific escaping.
			$value = sanitize_text_field($value);
			if (strlen($value) > 500 || preg_match('/[<>\\x00-\\x1f{};]/', $value)) {
				$this->report($path, 'Invalid selector', true);

				return '';
			}

			return $value;
		}
		if ('icon' === $rule) {
			if (!preg_match('/^fa-[a-z0-9-]{1,80}$/D', $value)) {
				$this->report($path, 'Invalid icon', true);

				return '';
			}

			return $value;
		}
		if ('id' === $rule) {
			if (!preg_match('/^flwp-el-[a-zA-Z0-9_-]+$/D', $value)) {
				$this->report($path, 'Invalid field ID', true);

				return '';
			}

			return $value;
		}
		if ('ruleid' === $rule) {
			if (!preg_match('/^rule-[a-zA-Z0-9_-]+$/D', $value)) {
				$this->report($path, 'Invalid rule ID', true);

				return '';
			}

			return $value;
		}
		if ('csslength' === $rule) {
			if (!preg_match('/^(?:inherit|auto|\d+(?:\.\d+)?(?:px|%|em|rem|vh|vw)?)$/D', $value)) {
				$this->report($path, 'Invalid CSS length', true);

				return '';
			}

			return $value;
		}
		if ('delay' === $rule) {
			if (!preg_match('/^(?:immediate|\d+(?:\.\d+)?(?:ms|s))$/D', $value)) {
				$this->report($path, 'Invalid delay', true);

				return '';
			}

			return $value;
		}
		if (0 === strpos($rule, 'enum:')) {
			$options = explode('|', substr($rule, 5));
			if (!in_array($value, $options, true)) {
				$this->report($path, 'Invalid option', true);

				return '';
			}

			return $value;
		}

		if ('lineheight' === $rule) {
			if (!preg_match('/^(?:normal|(?:\d+(?:\.\d+)?)(?:px|%|em|rem)?)$/D', $value)) {
				$this->report($path, 'Invalid line height', true);
				return '';
			}

			return $value;
		}

		return sanitize_text_field($value);
	}

	private function spacing_box_schema(): array
	{
		return [
			'top'    => 'csslength',
			'right'  => 'csslength',
			'bottom' => 'csslength',
			'left'   => 'csslength',
			'unit'   => 'enum:px|%|em|rem',
			'linked' => 'bool',
		];
	}

	private function global_schema(bool $shortcode): array
	{
		if ($shortcode) {
			return [
				'main'    => ['cookieSubmitDays' => 'int', 'cookieScope' => 'enum:domain|page'],
				'spacing' => [
					'padding'         => $this->spacing_box_schema(),
					'margin'          => $this->spacing_box_schema(),
					'position'        => 'enum:left|center|right',
					'minHeight'       => 'int',
					'customMinHeight' => 'int',
					'maxWidth'        => 'int',
				],
				'design' => [
					'customStylesEnabled' => 'bool',
					'bgColor'             => 'color',
					'borderColor'         => 'color',
					'borderStyle'         => 'enum:none|solid|dashed|dotted|double',
					'borderWidth'         => 'int',
					'borderRadius'        => 'int',
				],
			];
		}

		return [
			'main'    => [
				'cookieCloseDays'  => 'int',
				'cookieSubmitDays' => 'int',
				'cookieScope'      => 'enum:domain|page',
				'showBackdrop'     => 'bool',
				'allowBodyScroll'  => 'bool',
				'closeOnBackdrop'  => 'bool',
				'closeOnEsc'       => 'bool',
				'hideHeader'       => 'bool',
				'hideFooter'       => 'bool'
			],
			'spacing' => [
				'position'     => 'enum:center|bottom-right|bottom-left|bottom-middle|right-middle|left-middle|top-right|top-middle|top-left',
				'overlayWidth' => 'int'
			],
			'design'  => [
				'headerIndicator'  => 'enum:progress|title|step|none',
				'showFooterText'   => 'bool',
				'customFooterText' => 'text',
				'headerTitle' => 'text',
			],
		];
	}

	private function trigger_schema(): array
	{
		return [
			'exitIntent' => ['delay' => 'delay'],
			'scroll'     => ['type' => 'enum:end|percent', 'percent' => 'percent'],
			'click'      => ['selector' => 'selector', 'hideOnClose' => 'bool',	'hideOnSubmit' => 'bool'],
			'delay'      => ['seconds' => 'int'],
		];
	}

	private function sanitize_display($value, string $path): array
	{
		$value = $this->object($value, $path);
		$schema = [
			'displayType'    => 'enum:in-content|overlay',
			'displaySubType' => 'enum:shortcode|modal|slide-in|feedback-button'
		];
		$out = $this->apply(array_diff_key($value, ['subTypeData' => true]), $schema, $path);
		$out['subTypeData'] = [];
		$subtypes = $this->object($value['subTypeData'] ?? [], $path . '.subTypeData');
		foreach ($subtypes as $key => $config) {
			$p = $path . '.subTypeData.' . $key;
			if (!in_array($key, ['shortcode', 'modal', 'slide-in', 'feedback-button'], true)) {
				$this->report($p, 'Unknown subtype');
				continue;
			}
			$schema = ['globalData' => $this->global_schema('shortcode' === $key)];
			if ('shortcode' === $key) {
				$schema += ['autoEnabled' => 'bool', 'autoPosition' => 'enum:top|bottom'];
			} else {
				if ('feedback-button' !== $key) {
					$schema += [
						'trigger'     => 'enum:click|exit-intent|scroll|delay',
						'triggerData' => $this->trigger_schema()
					];
				} else {
					$schema += [
						'text'                => 'text',
						'position'            => 'enum:right-middle|left-middle|bottom-right|bottom-middle|bottom-left',
						'customStylesEnabled' => 'bool',
						'hideOptionEnabled'   => 'bool',
						'fontSize'            => 'positive',
						'bgColor'             => 'color',
						'textColor'           => 'color',
						'borderColor'         => 'color',
						'hoverBgColor'        => 'color',
						'hoverTextColor'      => 'color',
						'hoverBorderColor'    => 'color',
					];
				}
			}
			$out['subTypeData'][$key] = $this->apply($config, $schema, $p);
		}
		if (!isset($out['displayType'], $out['displaySubType']) ||
			('in-content' === $out['displayType'] && 'shortcode' !== $out['displaySubType']) ||
			('overlay' === $out['displayType'] && 'shortcode' === $out['displaySubType']) ||
			!isset($out['subTypeData'][$out['displaySubType']])) {
			$this->report($path, 'Inconsistent display configuration', true);
		}

		return $out;
	}

	private function sanitize_rule($value, string $path): array
	{
		$value = $this->object($value, $path);
		$type = $value['type'] ?? null;
		$operators = [
			'page_type' => ['in', 'not_in'],
			'device'    => ['in', 'not_in'],
			'url'       => ['contains', 'not_contains', 'exact', 'not_exact', 'starts_with', 'ends_with'],
			'cookie'    => ['contains', 'not_contains', 'exact', 'not_exact', 'exists', 'not_exists'],
		];
		if (!is_string($type) || !isset($operators[$type])) {
			$this->report($path . '.type', 'Invalid rule type', true);

			return [];
		}
		$operator = $value['operator'] ?? null;
		if (!is_string($operator) || !in_array($operator, $operators[$type], true)) {
			$this->report($path . '.operator', 'Invalid rule operator', true);

			return [];
		}
		$out = $this->apply(array_intersect_key($value, ['id' => true, 'type' => true, 'operator' => true]),
		                    ['id' => 'ruleid', 'type' => 'text', 'operator' => 'text'],
		                    $path);
		foreach ($value as $key => $_) {
			if (!in_array($key, ['id', 'type', 'operator', 'value', 'cookieName'], true)) {
				$this->report($path . '.' . $key, 'Unknown rule key');
			}
		}
		if (!isset($out['id'])) {
			$this->report($path . '.id', 'Missing rule ID', true);
		}
		if (in_array($type, ['page_type', 'device'], true)) {
			if (!isset($value['value']) || !is_array($value['value'])) {
				$this->report($path . '.value', 'Expected list', true);
				$out['value'] = [];
			} else {
				$allowed = 'device' === $type ? ['desktop', 'tablet', 'mobile'] : [
					'page',
					'post',
					'frontpage',
					'home',
					'archive',
					'search',
					'404'
				];
				$out['value'] = [];
				foreach ($value['value'] as $i => $item) {
					if (is_string($item) && in_array($item, $allowed, true)) {
						$out['value'][] = $item;
					} else {
						$this->report($path . '.value[' . $i . ']', 'Unknown list value');
					}
				}
			}
		} else {
			$out['value'] = $this->scalar($value['value'] ?? '', 'text', $path . '.value');
		}
		if ('cookie' === $type) {
			$out['cookieName'] = $this->scalar($value['cookieName'] ?? '', 'text', $path . '.cookieName');
		} elseif (isset($value['cookieName'])) {
			$this->report($path . '.cookieName', 'Not applicable');
		}

		return $out;
	}

	private function sanitize_targeting($value, string $path): array
	{
		$value = $this->object($value, $path);
		$out = [];
		foreach ($value as $key => $config) {
			$p = $path . '.' . $key;
			if (!in_array($key, ['in-content', 'shortcode', 'overlay'], true)) {
				$this->report($p, 'Unknown targeting mode');
				continue;
			}
			$config = $this->object($config, $p);
			foreach ($config as $k => $_) {
				if (!in_array($k, ['singleRules', 'andRules', 'orRules'], true)) {
					$this->report($p . '.' . $k, 'Unknown key');
				}
			}
			$out[$key] = [
				'singleRules' => $this->apply(
					$config['singleRules'] ?? [],
					['show_on_frontpage' => 'bool'],
					$p . '.singleRules'
				)
			];
			foreach (['andRules', 'orRules'] as $group) {
				$rules = $config[$group] ?? [];
				if (!is_array($rules) || !array_is_list_compat($rules)) {
					$this->report($p . '.' . $group, 'Expected list', true);
					$rules = [];
				}
				$out[$key][$group] = [];
				foreach ($rules as $i => $rule) {
					$out[$key][$group][] = $this->sanitize_rule($rule, $p . '.' . $group . '[' . $i . ']');
				}
			}
		}

		return $out;
	}

	private function field_schema(string $type): array
	{
		$common = [
			'alignment'           => 'enum:left|center|right',
			'fontSize'            => 'csslength',
			'hideLabel'           => 'bool',
			'bold'                => 'bool',
			'italic'              => 'bool',
			'underline'           => 'bool',
			'lineHeight'          => 'lineheight',
			'customColorsEnabled' => 'bool',
			'bgColor'             => 'color',
			'textColor'           => 'color',
			'borderColor'         => 'color',
			'hoverBgColor'        => 'color',
			'hoverTextColor'      => 'color',
			'hoverBorderColor'    => 'color',
			'icon'                => 'icon',
			'iconPosition' => 'enum:left|right',
			'width'               => 'enum:100%|50%|33%|25%',
			'clearBefore'         => 'bool',
		];
		if ('button' === $type) {
			return $common + [
					'buttonType'   => 'enum:next|back|submit',
					'width'        => 'csslength',
					'fullWidth'    => 'bool',
					'step2Enabled' => 'bool',
					'borderRadius' => 'csslength',
				];
		}
		if ('textarea' === $type) {
			return $common + ['placeholder' => 'text', 'required' => 'bool'];
		}
		if ('headline' === $type) {
			return $common + [
					'hType' => 'enum:h1|h2|h3|h4|h5|h6|div',
				];
		}
		if (in_array($type, ['rating', 'thumbs', 'smileys', 'nps'], true)) {
			return $common + [
					'required'     => 'bool',
					'step2Enabled' => 'bool',
					'stars'        => 'positive',
					'smileyLegend' => 'bool'
				];
		}

		return $common;
	}

	private function sanitize_fields($value, string $path, array &$ids): array
	{
		if (!is_array($value) || !array_is_list_compat($value)) {
			$this->report($path, 'Expected field list', true);

			return [];
		}
		$out = [];
		foreach ($value as $i => $field) {
			$p = $path . '[' . $i . ']';
			if (!is_array($field)) {
				$this->report($p, 'Invalid field', true);
				continue;
			}
			$type = $field['type'] ?? null;
			if (!is_string($type) || !in_array($type, $this->allowed_fields, true)) {
				$this->report($p . '.type', 'Disallowed field type', true);
				continue;
			}
			$clean = $this->apply(array_diff_key($field, ['settings' => true]),
			                      ['id' => 'id', 'type' => 'text', 'label' => 'text'],
			                      $p);
			if (empty($clean['id']) || isset($ids[$clean['id']])) {
				$this->report($p . '.id', 'Missing or duplicate field ID', true);
				continue;
			}
			$ids[$clean['id']] = true;
			$clean['settings'] = $this->apply($field['settings'] ?? [], $this->field_schema($type), $p . '.settings');
			$out[] = $clean;
		}

		return $out;
	}

	private function sanitize_steps($value, string $path): array
	{
		$value = $this->object($value, $path);
		foreach ($value as $key => $_) {
			if (!in_array($key, ['step1', 'step2'], true)) {
				$this->report($path . '.' . $key, 'Unknown key');
			}
		}

		$ids = [];
		$out = ['step1' => $this->sanitize_fields($value['step1'] ?? null, $path . '.step1', $ids), 'step2' => []];
		$triggers = [];
		foreach ($out['step1'] as $field) {
			if (!empty($field['settings']['step2Enabled'])) {
				$triggers[$field['id']] = true;
			}
		}
		$step2 = $this->object($value['step2'] ?? [], $path . '.step2');
		foreach ($step2 as $trigger_id => $fields) {
			if (!isset($triggers[$trigger_id])) {
				unset($out['step2'][$trigger_id]);

				$this->report($path . '.step2.' . $trigger_id, 'Orphaned step2 reference');
				continue;
			}
			$out['step2'][$trigger_id] = $this->sanitize_fields($fields, $path . '.step2.' . $trigger_id, $ids);
		}
		foreach ($triggers as $trigger_id => $_) {
			if (!isset($out['step2'][$trigger_id])) {
				$this->report($path . '.step2.' . $trigger_id, 'Missing step2 branch', true);
			}
		}

		return $out;
	}

	/** @return array|WP_Error */
	public function sanitize(array $data)
	{
		$this->errors = [];
		$this->removed = [];
		$out = [];
		$schemas = [
			'settings'     => [
				'main'     => ['title' => 'text', 'customClasses' => 'classes', 'honeypot' => 'bool'],
				'styles'   => ['accentColor' => 'color', 'secondaryColor' => 'color'],
				'tracking' => array_fill_keys(
					[
						'enabled',
						'url',
						'pageTitle',
						'referrer',
						'userAgent',
						'language',
						'screenResolution',
						'viewportSize',
						'timezone',
						'connectionType',
						'deviceType',
						'anonymizedSessionId',
						'timeOnPageSeconds',
						'colorScheme'
					],
					'bool'
				),
			],
			'confirmation' => ['type' => 'enum:message|url', 'message' => 'rich', 'extUrl' => 'url'],
			'notification' => [
				'enabled'     => 'bool',
				'recipient'   => 'email',
				'subject'     => 'text',
				'senderName'  => 'text',
				'senderEmail' => 'email'
			],
		];
		foreach ($data as $key => $value) {
			if (isset($schemas[$key])) {
				if ('settings' === $key) {
					$settings = $this->object($value, 'settings');
					$out['settings'] = $this->apply(array_diff_key($settings, ['display' => true]),
					                                $schemas['settings'],
					                                'settings');
					$out['settings']['display'] = $this->sanitize_display(
						$settings['display'] ?? null,
						'settings.display'
					);
				} else {
					$out[$key] = $this->apply($value, $schemas[$key], $key);
				}
			} elseif ('targeting' === $key) {
				$out['targeting'] = $this->sanitize_targeting($value, 'targeting');
			} elseif ('steps' === $key) {
				$out['steps'] = $this->sanitize_steps($value, 'steps');
			} elseif ('activeStep2TriggerId' === $key) {
				$out[$key] = '' === $value ? '' : $this->scalar($value, 'id', $key);

				if (!empty($out[$key])) {
					foreach ($out['steps']['step1'] as $stepField) {
						if ($stepField['id'] === $out[$key] && empty($stepField['settings']['step2Enabled'])) {
							$out[$key] = '';
						}
					}
				}
			} elseif ('status' === $key) {
				$out['status'] = $this->scalar($value, 'int', 'status');
			} elseif ('id' === $key) {
				$out['id'] = $this->scalar($value, 'int', 'id');
			} else {
				$this->report($key, 'Unknown top-level key');
			}
		}
		foreach (['settings', 'steps', 'confirmation', 'notification', 'targeting'] as $required) {
			if (!isset($out[$required])) {
				$this->report($required, 'Missing required section', true);
			}
		}
		if (isset($out['activeStep2TriggerId']) && '' !== $out['activeStep2TriggerId']) {
			$trigger_id = $out['activeStep2TriggerId'];
			if (!isset($out['steps']['step2'][$trigger_id])) {
				$this->report('activeStep2TriggerId', 'Unknown step2 reference', false);
			}
		}
		if ($this->errors) {
			return new WP_Error(
				'flwp_invalid_form_data',
				__('Invalid form configuration.', 'flwp'),
				['paths' => $this->errors]
			);
		}

		return $out;
	}
}

/** PHP 7.4 compatible array_is_list(). */
function array_is_list_compat(array $value): bool
{
	return array_keys($value) === range(0, count($value) - 1) || [] === $value;
}
