<?php
/**
 * Template for Form Shortcode
 */
if (!defined('ABSPATH')) exit;

$styleAttribute = '';
if (!empty($inlineStyles)) {
    $styleAttribute = "style='" . esc_attr(implode('; ', $inlineStyles)) . "'";
}

$wrapperClasses = ['flwp-feedback-plugin', 'flwp-feedback-type-placeholder', 'flwp-in-content-feedback-container', esc_attr('flwp-form-id-' . $formData['id'])];
if (!empty($customClasses)) :
    $wrapperClasses[] = esc_attr($customClasses);
endif;
?>
<div class="<?php echo esc_html(implode(' ', $wrapperClasses)) ?>" <?php echo esc_html($styleAttribute) ?> data-type="<?php echo esc_attr($formType) ?>" data-form-id="<?php echo esc_attr($formData['id']) ?>" data-form-updated="<?php echo esc_attr($formUpdated) ?>"></div>