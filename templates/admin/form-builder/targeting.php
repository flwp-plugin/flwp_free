<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-targeting" aria-label="<?php esc_attr_e('admin.builder.targeting.title', 'flwp'); ?>">

	<div class="flwp-builder-section-col">
		<!-- Header -->
		<div class="flwp-builder-section-header">
			<h3 class="flwp-builder-section-title"><i class="fas fa-bullseye"></i> <?php esc_html_e('admin.builder.targeting.header', 'flwp'); ?></h3>
		</div>

		<div class="flwp-builder-section">
			<div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 11.5px; color: var(--flwp-text-secondary); line-height: 1.45; margin-bottom: 20px;">
				<?php esc_html_e('admin.builder.targeting.description', 'flwp'); ?>
			</div>

			<!-- Segmented Display Type Sub-Tabs inside Targeting -->
			<div id="flwp-targeting-tabs-container" class="flwp-targeting-tabs" style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid var(--flwp-border); padding-bottom: 12px; overflow-x: auto;">
				<!-- Dynamisch erzeugt basierend auf Hauptanzeigetyp -->
			</div>

			<!-- Targeting Inputs Form Container acting on current sub-tab -->
			<div id="flwp-targeting-condition-builder-container"></div>
		</div>
	</div>
</section>
