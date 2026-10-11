<?php
/**
 * Template for Form Shortcode
 */
if (!defined('ABSPATH')) exit;

$flwpStyleAttribute = '';
if (!empty($inlineStyles)) {
	$flwpStyleAttribute = "style='" . esc_attr(implode('; ', $inlineStyles)) . "'";
}

$flwpWrapperClasses = ['flwp-feedback-plugin', 'flwp-feedback-type-placeholder', 'flwp-in-content-feedback-container', esc_attr('flwp-form-id-' . $formData['id'])];
if (!empty($customClasses)) :
	$flwpWrapperClasses[] = esc_attr($customClasses);
endif;
?>
<div class="<?php echo esc_html(implode(' ', $flwpWrapperClasses)) ?>" <?php echo esc_html($flwpStyleAttribute) ?> data-type="<?php echo esc_attr($formType) ?>" data-form-id="<?php echo esc_attr($formData['id']) ?>" data-form-updated="<?php echo esc_attr($formUpdated) ?>"></div>