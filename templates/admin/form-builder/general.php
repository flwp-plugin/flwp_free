<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-general" aria-label="<?php esc_attr_e('admin.builder.general.title', 'flwp'); ?>">

	<div class="flwp-builder-section-col">
		<!-- Header -->
		<div class="flwp-builder-section-header">
			<h3 class="flwp-builder-section-title"><i class="fas fa-sliders-h"></i> <?php esc_html_e('admin.builder.general.title', 'flwp'); ?></h3>
		</div>

		<div class="flwp-builder-section">
			<div class="flwp-form-group">
				<label for="flwp-setting-form-id"><?php esc_html_e('admin.builder.general.form_id.label', 'flwp'); ?> <span style="color: var(--flwp-text-secondary);">(<?php esc_html_e('admin.builder.general.form_id.hint', 'flwp'); ?>)</span></label>
				<input type="text" id="flwp-setting-form-id" class="flwp-form-input" value="<?php echo (int) $formId ?>" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
				<p class="flwp-settings-text"><?php echo sprintf(esc_html__('admin.builder.general.form_id.description', 'flwp'), '<code>[flwp_form id="' . (int) $formId . '"]</code>'); ?></p>
			</div>

			<div class="flwp-form-group">
				<label for="flwp-setting-form-name"><?php esc_html_e('admin.builder.general.form_name.label', 'flwp'); ?></label>
				<input type="text" id="flwp-setting-form-name" class="flwp-form-input" value="<?php esc_html_e('admin.builder.general.form_name.default', 'flwp'); ?>" />
				<p class="flwp-settings-text"><?php esc_html_e('admin.builder.general.form_name.description', 'flwp'); ?></p>
			</div>

			<div class="flwp-form-group">
				<label for="flwp-setting-custom-classes"><?php esc_html_e('admin.builder.general.custom_classes.label', 'flwp'); ?></label>
				<input type="text" id="flwp-setting-custom-classes" class="flwp-form-input" value="<?php esc_html_e('admin.builder.general.custom_classes.default', 'flwp'); ?>" placeholder="<?php esc_html_e('admin.builder.general.custom_classes.placeholder', 'flwp'); ?>" />
				<p class="flwp-settings-text"><?php esc_html_e('admin.builder.general.custom_classes.description', 'flwp'); ?></p>
			</div>

			<div class="flwp-switch-group">
	      <span class="flwp-switch-label">
	        <i class="fas fa-shield-alt"></i> <?php esc_html_e('admin.builder.general.honeypot.label', 'flwp'); ?>
	      </span>
				<label class="flwp-switch-wrapper" for="flwp-setting-honeypot">
					<input type="checkbox" id="flwp-setting-honeypot" checked />
					<span class="flwp-switch-slider"></span>
				</label>
			</div>
		</div>

	</div>

</section>
