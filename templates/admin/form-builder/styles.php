<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-styles" aria-label="<?php esc_attr_e('admin.builder.styles.title', 'flwp'); ?>">

	<div class="flwp-builder-section-col">
		<!-- Header -->
		<div class="flwp-builder-section-header">
			<h3 class="flwp-builder-section-title"><i class="fas fa-palette"></i> <?php esc_html_e('admin.builder.styles.title', 'flwp'); ?></h3>
		</div>

		<div class="flwp-builder-section">
			<div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 11.5px; color: var(--flwp-text-secondary); line-height: 1.45; margin-bottom: 20px;">
				<?php esc_html_e('admin.builder.styles.description', 'flwp'); ?>
			</div>

			<div class="flwp-form-group">
				<label for="flwp-style-accent-color"><?php esc_html_e('admin.builder.styles.accent_color.label', 'flwp'); ?></label>
				<div class="flwp-color-picker-row">
					<input type="color" id="flwp-style-accent-color" class="flwp-form-input" style="width: 60px; height: 36px; padding: 2px; cursor: pointer;" value="#000000" />
					<input type="text" id="flwp-style-accent-hex" class="flwp-form-input" value="#000000" style="width: 120px;" />
					<span class="flwp-settings-text"><?php esc_html_e('admin.builder.styles.accent_color.description', 'flwp'); ?></span>
				</div>
			</div>
			<div class="flwp-form-group">
				<label for="flwp-style-secondary-color"><?php esc_html_e('admin.builder.styles.secondary_color.label', 'flwp'); ?></label>
				<div class="flwp-color-picker-row">
					<input type="color" id="flwp-style-secondary-color" class="flwp-form-input" style="width: 60px; height: 36px; padding: 2px; cursor: pointer;" value="#555555" />
					<input type="text" id="flwp-style-secondary-hex" class="flwp-form-input" value="#555555" style="width: 120px;" />
					<span class="flwp-settings-text"><?php esc_html_e('admin.builder.styles.secondary_color.description', 'flwp'); ?></span>
				</div>
			</div>
		</div>
	</div>
</section>
