<?php
if (!defined('ABSPATH')) {
	exit;
}

$configHelper = new \FLWP\Helper\ConfigHelper();
$formConfig = $configHelper->get_default_form_config();

$notificationData = $formConfig['notification'];
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-notification" aria-label="<?php esc_attr_e('admin.builder.notification.title', 'flwp'); ?>">

	<div class="flwp-builder-section-col">
		<!-- Header -->
		<div class="flwp-builder-section-header">
			<h3 class="flwp-builder-section-title"><i class="fas fa-envelope"></i> <?php esc_html_e('admin.builder.notification.title', 'flwp'); ?></h3>
		</div>

		<div class="flwp-builder-section">
			<div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 11.5px; color: var(--flwp-text-secondary); line-height: 1.45; margin-bottom: 20px;">
				<?php esc_html_e('admin.builder.notification.description', 'flwp'); ?>
			</div>

			<!-- Main toggler activation -->
			<div class="flwp-switch-group">
		      <span class="flwp-switch-label" style="font-size: 14px; font-weight: 650; color: var(--flwp-text);">
		        <i class="fas fa-toggle-on" style="color: var(--flwp-success);"></i> <?php esc_html_e('admin.builder.notification.enabled.label', 'flwp'); ?>
		      </span>
				<label class="flwp-switch-wrapper" for="flwp-notification-enabled">
					<input type="checkbox" id="flwp-notification-enabled" checked />
					<span class="flwp-switch-slider"></span>
				</label>
			</div>

			<div id="flwp-notification-settings-fields-group" style="display: flex; flex-direction: column; gap: 20px;">

				<div class="flwp-form-group">
					<label for="flwp-notify-recipient"><?php esc_html_e('admin.builder.notification.recipient.label', 'flwp'); ?> <i class="fas fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.notification.recipient.hint', 'flwp'); ?>"></i></label>
					<div class="flwp-color-picker-row">
						<input type="text" id="flwp-notify-recipient" class="flwp-form-input" value="<?php esc_html_e('admin.builder.notification.recipient.default', 'flwp'); ?>" />
					</div>
				</div>

				<div class="flwp-form-group">
					<label for="flwp-notify-subject"><?php esc_html_e('admin.builder.notification.subject.label', 'flwp'); ?></label>
					<div class="flwp-color-picker-row">
						<input type="text" id="flwp-notify-subject" class="flwp-form-input" value="<?php esc_html_e('admin.builder.notification.subject.default', 'flwp'); ?>" />
					</div>
				</div>

				<div class="flwp-form-group">
					<label for="flwp-notify-sender-name"><?php esc_html_e('admin.builder.notification.sender_name.label', 'flwp'); ?></label>
					<div class="flwp-color-picker-row">
						<input type="text" id="flwp-notify-sender-name" class="flwp-form-input" value="<?php esc_html_e('admin.builder.notification.sender_name.default', 'flwp'); ?>" />
					</div>
				</div>

				<div class="flwp-form-group">
					<label for="flwp-notify-sender-email"><?php esc_html_e('admin.builder.notification.sender_email.label', 'flwp'); ?></label>
					<div class="flwp-color-picker-row">
						<input type="email" id="flwp-notify-sender-email" class="flwp-form-input" value="info@my-website.com" />
					</div>
				</div>

			</div>
		</div>
	</div>
</section>