<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-confirmation" aria-label="<?php esc_attr_e('admin.builder.confirmation.aria_label', 'flwp'); ?>">

	<div class="flwp-builder-section-col">
		<!-- Header -->
		<div class="flwp-builder-section-header">
			<h3 class="flwp-builder-section-title"><i class="fas fa-check-circle"></i> <?php esc_html_e('admin.builder.confirmation.title', 'flwp'); ?></h3>
		</div>

		<div class="flwp-builder-section">
			<div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 11.5px; color: var(--flwp-text-secondary); line-height: 1.45;">
				<?php esc_html_e('admin.builder.confirmation.description', 'flwp'); ?>
			</div>

			<div class="flwp-form-group">
				<label for="flwp-style-confirm-type"><?php esc_html_e('admin.builder.confirmation.confirm_type.label', 'flwp'); ?></label>
				<select id="flwp-style-confirm-type" class="flwp-form-select">
					<option value="message" selected><?php esc_html_e('admin.builder.confirmation.confirm_type.message', 'flwp'); ?></option>
					<option value="url"><?php esc_html_e('admin.builder.confirmation.confirm_type.url', 'flwp'); ?></option>
				</select>
			</div>

			<!-- WYSIWYG Message setting container (Matches reference image) -->
			<div class="flwp-form-group">
				<label for="flwp-style-confirm-color"><?php esc_html_e('admin.builder.confirmation.confirm_color.label', 'flwp'); ?></label>
				<div class="flwp-color-picker-row">
					<input type="color" id="flwp-style-confirm-color" class="flwp-form-input" style="width: 60px; height: 36px; padding: 2px; cursor: pointer;" value="#000000" />
					<input type="text" id="flwp-style-confirm-hex" class="flwp-form-input" value="#000000" style="width: 120px;" />
				</div>
			</div>

			<div class="flwp-form-group" id="flwp-config-group-confirm-msg">
				<label for="flwp_confirm_message_text"><?php esc_html_e('admin.builder.confirmation.confirm_message.label', 'flwp'); ?></label>

            <?php
            wp_editor(
                    esc_html__('admin.builder.confirmation.confirm_message.default', 'flwp'),
                    'flwp_confirm_message_text',
                    [
                            'media_buttons' => false,
                            'textarea_name' => 'flwp_form[confirm_message_text]',
                            'textarea_rows' => 1,
                            'tinymce'       => [
                                    'setup' => 'function(ed) { ed.on("init", function() { this.getDoc().body.style.fontSize = "13px"; }); }',
                            ]
                    ]
            );
            ?>

			</div>

			<!-- Custom redirect URL (Initially hidden) -->
			<div class="flwp-form-group" id="flwp-config-group-confirm-ext-url" style="display: none;">
				<label for="flwp-config-confirm-url"><?php esc_html_e('admin.builder.confirmation.redirect_url.label', 'flwp'); ?></label>
				<input type="url" id="flwp-config-confirm-url" class="flwp-form-input" value="<?php esc_attr_e('admin.builder.confirmation.redirect_url.default_value', 'flwp'); ?>" placeholder="<?php esc_attr_e('admin.builder.confirmation.redirect_url.placeholder', 'flwp'); ?>" />
			</div>
		</div>
	</div>
</section>
