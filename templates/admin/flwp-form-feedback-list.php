<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section id="flwp-view-start" class="flwp-view-section flwp-form-feedback-list">
	<header class="flwp-view-header flex-row">
		<h2 style="font-size: 24px; font-weight: 600; margin: 0 0 25px 0; color: var(--flwp-primary-color);"><?php esc_html_e('admin.page.feedback_list.title', 'flwp'); ?></h2>
	</header>

	<form method="get">
		<input type="hidden" name="page" value="flwp-form-feedbacks" />
		<?php wp_nonce_field('flwp_admin_nonce', 'nonce'); ?>
		<?php $feedback_table->display(); ?>
	</form>

	<div id="flwp-modal-backdrop" class="flwp-modal-backdrop hidden"></div>
	<div id="flwp-modal-container" class="flwp-modal-container hidden"></div>

	<template id="flwp-feedback-details-modal">
		<div class="flwp-modal flwp-feedback-dialog-container">
			<header class="flwp-modal-header flwp-feedback-dialog-header">
				<div style="display: flex; align-items: center; gap: 12px;">
					<div class="flwp-feedback-avatar" id="flwp-modal-avatar-wrapper">
						<i class="fas fa-comment-dots"></i>
					</div>
					<div>
						<h2 id="flwp-modal-feedback-id-title" style="margin: 0; font-size: 1.15rem; font-weight: 600;"><?php esc_html_e('admin.page.feedback_list.modal.id_title', 'flwp'); ?></h2>
						<p style="margin: 2px 0 0 0; font-size: 0.75rem; color: var(--flwp-text-secondary);"><?php esc_html_e('admin.page.feedback_list.modal.created_at', 'flwp'); ?> <span id="flwp-modal-date-text" style="font-weight: 500;">{{date}}</span></p>
					</div>
				</div>
				<button class="flwp-modal-modal-close" id="flwp-modal-btn-close-modal" aria-label="<?php echo esc_attr__('admin.page.feedback_list.modal.close', 'flwp') ?>"><i class="fas fa-times"></i></button>
			</header>

			<div class="flwp-modal-scrollable-body" style="background-color: #f6f8fb;">
				<div class="flwp-details-grid-layout">

					<!-- LINKER BEREICH: FORMULAR (USERWERTE) -->
					<div style="display: flex; flex-direction: column; gap: 20px;">
						<!-- BEARBEITUNGS-STATUS -->
						<div class="flwp-details-card">
							<div class="flwp-card-title-bar">
								<i class="fas fa-tasks" style="color: var(--app-primary-color);"></i>
								<h3><?php esc_html_e('admin.page.feedback_list.modal.status.title', 'flwp'); ?></h3>
							</div>
							<div class="flwp-status-segmented-control" id="flwp-modal-status-control">
								<button type="button" class="flwp-status-btn" data-status="unread">
									<i class="far fa-envelope"></i> <?php esc_html_e('admin.page.feedback_list.modal.status.unread', 'flwp'); ?>
								</button>
								<button type="button" class="flwp-status-btn" data-status="read">
									<i class="far fa-envelope-open"></i> <?php esc_html_e('admin.page.feedback_list.modal.status.read', 'flwp'); ?>
								</button>
								<button type="button" class="flwp-status-btn" data-status="archived">
									<i class="fas fa-archive"></i> <?php esc_html_e('admin.page.feedback_list.modal.status.archived', 'flwp'); ?>
								</button>
							</div>
						</div>

						<!-- KUNDEN-FORMULARWERTE -->
						<div class="flwp-details-card flwp-details-form-card">
							<div class="flwp-card-title-bar">
								<i class="fas fa-file-invoice" style="color: var(--app-primary-color);"></i>
								<h3><?php esc_html_e('admin.page.feedback_list.modal.customer_form_values', 'flwp'); ?></h3>
							</div>

							<div class="flwp-form-body">
								<div id="flwp-admin-feedback-form-render" class="flwp-feedback-plugin flwp-form-frontend-wrapper" data-is-admin="1"></div>

								<!-- URL der Einsendung -->
								<div class="flwp-form-group-item">
									<label class="flwp-form-field-label"><?php esc_html_e('admin.page.feedback_list.modal.source_url', 'flwp'); ?></label>
									<div style="margin-bottom: 8px; font-size: 0.85rem; color: var(--flwp-primary-color); font-weight: 600;" id="flwp-modal-page-path"></div>
									<div class="flwp-copyable-input-group">
										<input type="text" id="flwp-input-source-url" class="flwp-form-text-control" readonly style="font-family: monospace; font-size: 0.8rem;">
										<button id="flwp-btn-copy-url" class="flwp-form-copy-btn" type="button" title="<?php echo esc_attr__('admin.page.feedback_list.modal.copy_to_clipboard', 'flwp') ?>">
											<i class="far fa-copy"></i>
										</button>
										<button id="flwp-btn-open-url" class="flwp-form-open-btn" type="button" title="<?php echo esc_attr__('admin.page.feedback_list.modal.open_in_new_window', 'flwp') ?>">
											<i class="fas fa-external-link-alt"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- RECHTER BEREICH: TRACKING INFORMATIONEN -->
					<div class="flwp-details-card flwp-details-tracking-card">
						<div class="flwp-card-title-bar">
							<i class="fas fa-satellite-dish" style="color: var(--flwp-primary-color); animation: pulse 2s infinite;"></i>
							<h3><?php esc_html_e('admin.page.feedback_list.modal.tracking.title', 'flwp'); ?></h3>
						</div>

						<div class="flwp-tracking-grid">

							<!-- UserAgent -->
							<div class="flwp-tracking-metric-box full-width">
								<div class="flwp-metric-icon-sphere"><i class="fas fa-info-circle"></i></div>
								<div class="flwp-metric-info-block">
									<span class="flwp-metric-label" title="<?php echo esc_attr__('admin.page.feedback_list.modal.tracking.user_agent', 'flwp') ?>"><?php esc_html_e('admin.page.feedback_list.modal.tracking.user_agent', 'flwp') ?></span>
									<div class="flwp-track-ua-text" id="flwp-track-useragent" style="font-size: 0.75rem; color: var(--flwp-text-secondary); word-break: break-all; line-height: 1.3;">-</div>
								</div>
							</div>
						</div>

						<!-- Collapse Section JSON -->
						<div class="flwp-raw-data-section" style="margin-top: 20px; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
							<button class="flwp-raw-toggle-btn" id="flwp-btn-raw-toggle" type="button" style="background: none; border: none; font-size: 0.8rem; color: var(--flwp-primary-color); cursor: pointer; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 4px 6px; border-radius: 4px; transition: background 0.2s;">
								<span style="font-weight: 600;" title="<?php echo esc_attr__('admin.page.feedback_list.modal.json_data', 'flwp') ?>"><i class="fas fa-code" style="margin-right: 6px;"></i> <?php esc_html_e('admin.page.feedback_list.modal.json_data', 'flwp') ?></span>
								<i class="fas fa-chevron-down" id="flwp-raw-chevron"></i>
							</button>
							<pre class="flwp-raw-json-pre hidden" id="flwp-raw-json-block" style="background: #1e293b; color: #38bdf8; font-family: monospace; font-size: 0.75rem; padding: 12px; border-radius: 6px; margin-top: 10px; max-height: 150px; overflow-y: auto; text-align: left;"></pre>
						</div>
					</div>

				</div>
			</div>

			<footer class="flwp-modal-modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; background-color: #f8f9fa; border-top: 1px solid var(--flwp-border-color);">
				<button class="flwp-modal-btn-secondary" id="flwp-modal-btn-modal-done" style="font-weight: 500; font-size: 0.85rem; padding: 8px 16px; border-radius: var(--flwp-radius);"><?php esc_html_e('admin.page.feedback_list.modal.close_button', 'flwp'); ?></button>
			</footer>
		</div>
	</template>

</section>