<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-tracking"
         aria-label="<?php esc_attr_e('admin.builder.tracking.title', 'flwp'); ?>">

	<div class="flwp-builder-section-col">
		<!-- Header -->
		<div class="flwp-builder-section-header">
			<h3 class="flwp-builder-section-title"><i class="fas fa-chart-line"></i> <?php esc_html_e('admin.builder.tracking.title', 'flwp'); ?>
			</h3>
		</div>

		<div class="flwp-builder-section">
			<div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 11.5px; color: var(--flwp-text-secondary); line-height: 1.45; margin-bottom: 20px;">
				<?php esc_html_e('admin.builder.tracking.description', 'flwp'); ?>
			</div>

			<!-- Main toggler activation -->
			<div class="flwp-switch-group">
				<span class="flwp-switch-label" style="font-size: 14px; font-weight: 650; color: var(--flwp-text);">
				<i class="fas fa-toggle-on" style="color: var(--flwp-success);"></i> <?php esc_html_e('admin.builder.tracking.enabled.label', 'flwp'); ?>
				</span>
				<label class="flwp-switch-wrapper" for="flwp-setting-tracking-enabled">
					<input type="checkbox" id="flwp-setting-tracking-enabled" checked/>
					<span class="flwp-switch-slider"></span>
				</label>
			</div>

			<div id="flwp-tracking-settings-fields-group" style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">

				<span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;"><?php esc_html_e('admin.builder.tracking.data_points.title', 'flwp'); ?></span>

				<!-- URL -->
				<div class="flwp-switch-group" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-link" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.url.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-url">
						<input type="checkbox" id="flwp-setting-tracking-url" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Page Title -->
				<div class="flwp-switch-group" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-heading" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.page_title.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-pageTitle">
						<input type="checkbox" id="flwp-setting-tracking-pageTitle" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Referrer -->
				<div class="flwp-switch-group" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-sign-in-alt" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.referrer.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-referrer">
						<input type="checkbox" id="flwp-setting-tracking-referrer" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- User Agent -->
				<div class="flwp-switch-group" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-laptop" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.user_agent.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-userAgent">
						<input type="checkbox" id="flwp-setting-tracking-userAgent" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Language -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-language" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.language.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-language">
						<input type="checkbox" id="flwp-setting-tracking-language" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Screen Resolution -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-desktop" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.screen_resolution.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-screenResolution">
						<input type="checkbox" id="flwp-setting-tracking-screenResolution" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Viewport Size -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-window-maximize" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.viewport_size.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-viewportSize">
						<input type="checkbox" id="flwp-setting-tracking-viewportSize" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Timezone -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
					<span class="flwp-switch-label">
					<i class="fas fa-globe" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.timezone.label', 'flwp'); ?>
					</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-timezone">
						<input type="checkbox" id="flwp-setting-tracking-timezone" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Connection Type -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
				<span class="flwp-switch-label">
				<i class="fas fa-wifi" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.connection_type.label', 'flwp'); ?>
				</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-connectionType">
						<input type="checkbox" id="flwp-setting-tracking-connectionType" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Device Type -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
				<span class="flwp-switch-label">
				<i class="fas fa-mobile-alt" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.device_type.label', 'flwp'); ?>
				</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-deviceType">
						<input type="checkbox" id="flwp-setting-tracking-deviceType" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Session ID -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
				<span class="flwp-switch-label">
				<i class="fas fa-id-badge" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.session_id.label', 'flwp'); ?>
				</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-anonymizedSessionId">
						<input type="checkbox" id="flwp-setting-tracking-anonymizedSessionId" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Time on Page -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
				<span class="flwp-switch-label">
				<i class="fas fa-hourglass-half" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.time_on_page.label', 'flwp'); ?>
				</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-timeOnPageSeconds">
						<input type="checkbox" id="flwp-setting-tracking-timeOnPageSeconds" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

				<!-- Color Scheme -->
				<div class="flwp-switch-group flwp-pro-feature-locked" style="margin-bottom: 0;">
				<span class="flwp-switch-label">
				<i class="fas fa-adjust" style="width: 16px; color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.tracking.color_scheme.label', 'flwp'); ?>
				</span>
					<label class="flwp-switch-wrapper" for="flwp-setting-tracking-colorScheme">
						<input type="checkbox" id="flwp-setting-tracking-colorScheme" checked/>
						<span class="flwp-switch-slider"></span>
					</label>
				</div>

			</div>
		</div>
	</div>
</section>