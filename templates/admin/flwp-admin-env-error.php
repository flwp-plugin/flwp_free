<?php
if (!defined('ABSPATH')) {
	exit;
}

$current_page = sanitize_text_field(wp_unslash($_GET['page'] ?? ''));
?>

<div class="wrap">
    <div id="flwp-feedback-admin" class="flwp-admin-container <?php echo esc_html($current_page)?>">
        <h1 class="wp-heading-inline" style="display:none;"></h1>
        <hr class="wp-header-end" style="display:none;">
    </div>
</div>