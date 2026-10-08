<?php

/**
 * FLWP Form Builder Template
 */
if (!defined('ABSPATH')) {
    exit;
}

$configHelper = new \FLWP\Helper\ConfigHelper();
$formConfig = $configHelper->get_default_form_config();

$statusText = esc_html__('admin.page.builder.status.paused', 'flwp');
$statusClass = 'flwp-status-paused';
$status = $formData['status'] ?? 1;
switch ($status) {
    case 2:
        $statusText = esc_html__('admin.page.builder.status.live', 'flwp');
        $statusClass = 'flwp-status-live';
        break;
    case 3:
        $statusText = esc_html__('admin.page.builder.status.admin_only', 'flwp');
        $statusClass = 'flwp-status-admin-only';
        break;
}
$notificationData = $formConfig['notification'];
$displayedFormId = '-';
if (!empty($formId) && is_numeric($formId)) {
	$displayedFormId = (int) $formId;
}
?>

<!-- FLWP FormBuilder Application Frame -->
<main id="flwp-formbuilder-app" role="main">

    <div class="flwp-formbuilder-frame">

        <!-- Builder Header Area -->
        <div class="flwp-builder-header">

            <!-- Header Top Row (Form Title, Status, Action Buttons) -->
            <div class="flwp-header-top-row">
                <div class="flwp-header-title-container">
                    <div class="flwp-title-input-group">
                        <div class="flwp-form-title-wrapper">
                            <input type="text" id="flwp-form-title" class="flwp-form-title-input" value="<?php echo (esc_html($formData['settings']['main']['title'] ?? '') ?? esc_html__('admin.page.builder.form_title.default', 'flwp'))?>" title="<?php echo esc_html__('admin.page.builder.form_title.edit_title', 'flwp') ?>" />
                            <i class="fas fa-pen text-xs" style="color: #94a3b8; cursor: pointer;"></i>
                        </div>
	                    <span style="font-size: 11px; color: var(--flwp-text-secondary);"><?php esc_html_e('admin.page.builder.form_id', 'flwp'); ?>: <span id="flwp-active-form-id-display"><?php echo esc_html($displayedFormId) ?></span>
	                        <span style="margin-left: 12px; border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: 12px;"><?php esc_html_e('admin.page.builder.last_saved', 'flwp'); ?>: <span id="flwp-last-updated-display"><?php echo '-' ?></span></span>
	                        <span style="margin-left: 12px; border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: 12px;"><?php esc_html_e('admin.page.builder.last_published', 'flwp'); ?>: <span id="flwp-last-published-display"><?php echo '-' ?></span></span>
	                    </span>
                    </div>
                </div>

                <!-- Action Button Group & Status -->
                <div class="flwp-action-button-group">
                    <!-- Undo and Redo Button Group -->
                    <div class="flwp-header-history-group">
                        <button class="flwp-btn" id="flwp-btn-undo" title="<?php echo esc_attr__('admin.page.builder.undo', 'flwp') ?>" disabled>
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="flwp-btn" id="flwp-btn-redo" title="<?php echo esc_attr__('admin.page.builder.redo', 'flwp') ?>" disabled>
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>

                    <!-- Combined Status Dropdown Indicator -->
                    <div class="flwp-status-dropdown-container">
                        <button class="flwp-status-wrapper-btn" id="flwp-btn-change-status" title="<?php echo esc_html__('admin.page.builder.change_status', 'flwp') ?>">
                            <div class="flwp-status-indicator <?php echo esc_html($statusClass) ?>" id="flwp-form-status-badge">
                                <span class="flwp-status-dot"></span>
                                <span id="flwp-form-status-text"><?php echo esc_html($statusText) ?></span>
                                <i class="fas fa-chevron-down" style="font-size: 8px; opacity: 0.7; margin-left: 2px;"></i>
                            </div>
                        </button>
                        <div class="flwp-status-dropdown-menu" id="flwp-status-dropdown-menu">
                            <div class="flwp-status-dropdown-item" data-status="1">
                                <span class="flwp-status-dot-paused" style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"></span>
                                <span><?php esc_html_e('admin.page.builder.status.paused', 'flwp'); ?></span>
                                <i class="fas fa-check flwp-status-check"></i>
                            </div>
                            <div class="flwp-status-dropdown-item" data-status="2">
                                <span class="flwp-status-dot-live" style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"></span>
                                <span><?php esc_html_e('admin.page.builder.status.live', 'flwp'); ?></span>
                                <i class="fas fa-check flwp-status-check"></i>
                            </div>
                            <div class="flwp-status-dropdown-item" data-status="3">
                                <span class="flwp-status-dot-admin" style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"></span>
                                <span><?php esc_html_e('admin.page.builder.status.admin_only', 'flwp'); ?></span>
                                <i class="fas fa-check flwp-status-check"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Templates & Import/Export as separate small grouped buttons -->
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <button class="flwp-btn" id="flwp-btn-load-templates" title="<?php echo esc_attr__('admin.page.builder.load_templates', 'flwp') ?>" style="padding: 8px 10px; font-size: 12px; height: 34px;">
                            <i class="fas fa-folder-open"></i> <?php esc_html_e('admin.page.builder.templates', 'flwp'); ?>
                        </button>
                        <button class="flwp-btn" id="flwp-btn-export-json" title="<?php echo esc_attr__('admin.page.builder.json_export_import', 'flwp') ?>" style="padding: 8px 10px; font-size: 12px; height: 34px;">
                            <i class="fas fa-code"></i> <?php esc_html_e('admin.page.builder.json_label', 'flwp'); ?>
                        </button>
                    </div>

                    <!-- Save / Publish buttons -->
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <button class="flwp-btn" id="flwp-btn-save-draft" title="<?php echo esc_attr__('admin.page.builder.save_draft', 'flwp') ?>" style="padding: 8px 10px; font-size: 12px; height: 34px;">
                            <i class="fas fa-save"></i> <?php esc_html_e('admin.page.builder.save', 'flwp'); ?>
                        </button>
                        <button class="flwp-btn flwp-btn-primary" id="flwp-btn-publish" title="<?php echo esc_attr__('admin.page.builder.publish', 'flwp') ?>" style="padding: 8px 12px; font-size: 12px; height: 34px;">
                            <i class="fas fa-paper-plane"></i> <?php esc_html_e('admin.page.builder.publish_btn', 'flwp'); ?>
                        </button>
                    </div>

                    <!-- Integrated Preview Segment (Split-View and Fullscreen) -->
                    <div class="flwp-header-preview-segment">
                        <button class="flwp-segment-btn" id="flwp-btn-toggle-split-preview" title="<?php echo esc_attr__('admin.page.builder.split_view_title', 'flwp') ?>">
                            <i class="fas fa-columns"></i> <?php esc_html_e('admin.page.builder.split_view', 'flwp'); ?>
                        </button>
                        <button class="flwp-segment-btn" id="flwp-btn-preview-modal" title="<?php echo esc_attr__('admin.page.builder.preview_modal_title', 'flwp') ?>">
                            <i class="fas fa-expand"></i> <?php esc_html_e('admin.page.builder.preview', 'flwp'); ?>
                        </button>
                    </div>
                </div>

                <button class="flwp-btn flwp-btn-close" id="flwp-btn-close-app" title="<?php echo esc_attr__('admin.page.builder.close_editor', 'flwp') ?>">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Header Bottom Row (Configuration Step Navigation) -->
            <nav class="flwp-header-nav-row" aria-label="<?php echo esc_attr__('admin.page.builder.nav_steps', 'flwp') ?>">
                <div class="flwp-nav-tab" data-view="fields" id="flwp-nav-fields">
                    <i class="fas fa-cubes"></i> <?php esc_html_e('admin.page.builder.nav.fields', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="general" id="flwp-nav-general">
                    <i class="fas fa-cog"></i> <?php esc_html_e('admin.page.builder.nav.general', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="styles" id="flwp-nav-styles">
                    <i class="fas fa-paint-brush"></i> <?php esc_html_e('admin.page.builder.nav.styles', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="display" id="flwp-nav-display">
                    <i class="fas fa-eye"></i> <?php esc_html_e('admin.page.builder.nav.display', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="targeting" id="flwp-nav-targeting">
                    <i class="fas fa-bullseye"></i> <?php esc_html_e('admin.page.builder.nav.targeting', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="confirmation" id="flwp-nav-confirmation">
                    <i class="fas fa-check-circle"></i> <?php esc_html_e('admin.page.builder.nav.confirmation', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="notification" id="flwp-nav-notification">
                    <i class="fas fa-envelope"></i> <?php esc_html_e('admin.page.builder.nav.notification', 'flwp'); ?>
                </div>
                <div class="flwp-nav-tab" data-view="tracking" id="flwp-nav-tracking">
                    <i class="fas fa-chart-line"></i> <?php esc_html_e('admin.page.builder.nav.tracking', 'flwp'); ?>
                </div>
            </nav>

        </div>

        <!-- Content Area split by Selected tab (Loaded dynamically from /src/templates/admin/form-builder/) -->
        <div class="flwp-builder-content-container">

	        <?php
			include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/default.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/fields.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/general.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/styles.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/display.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/targeting.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/confirmation.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/notification.php';
            include FLWP_PLUGIN_PATH . 'templates/admin/form-builder/tracking.php';
            ?>

        </div>

    </div>

</main>

<!-- MODAL 1: EXPORT / IMPORT MODAL -->
<div id="flwp-modal-export" class="flwp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="flwp-json-title">
    <div class="flwp-modal-box" style="max-width: 650px;">
        <div class="flwp-modal-header">
            <h3 class="flwp-modal-title" id="flwp-json-title"><i class="fas fa-code"></i> <?php esc_html_e('admin.page.builder.json_modal.title', 'flwp'); ?></h3>
            <button class="flwp-btn flwp-btn-close" id="flwp-btn-close-export-modal" title="<?php esc_attr_e('admin.page.builder.close', 'flwp'); ?>"><i class="fas fa-times"></i></button>
        </div>
        <div class="flwp-modal-body">
            <p style="margin-bottom: 12px; color: var(--flwp-text-secondary);">
                <?php esc_html_e('admin.page.builder.json_modal.description', 'flwp'); ?>
            </p>

            <div class="flwp-form-group">
                <label for="flwp-json-textarea"><?php esc_html_e('admin.page.builder.json_modal.label', 'flwp'); ?></label>
                <textarea id="flwp-json-textarea" class="flwp-form-textarea" style="min-height: 180px; font-size: 11.5px; background-color: #0f172a; color: #a5f3fc;" placeholder="<?php esc_attr_e('admin.page.builder.json_modal.placeholder', 'flwp'); ?>"></textarea>
            </div>
        </div>
        <div class="flwp-modal-footer">
            <button class="flwp-btn" id="flwp-btn-modal-import-action" style="background-color: var(--flwp-primary); color: white; border-color: var(--flwp-primary);">
                <i class="fas fa-download"></i> <?php esc_html_e('admin.page.builder.json_modal.import_btn', 'flwp'); ?>
            </button>
            <button class="flwp-btn" id="flwp-btn-copy-json" style="background-color: var(--flwp-success); color: white; border-color: var(--flwp-success);">
                <i class="fas fa-copy"></i> <?php esc_html_e('admin.page.builder.json_modal.copy_btn', 'flwp'); ?>
            </button>
            <button class="flwp-btn" id="flwp-btn-close-export-cancel"><?php esc_html_e('admin.page.builder.close', 'flwp'); ?></button>
        </div>
    </div>
</div>

<!-- MODAL 2: LIVE POPUP WIDGET PREVIEW -->
<div id="flwp-modal-preview" class="flwp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="flwp-preview-title">
    <div class="flwp-modal-box" style="max-width: 900px; width: 95%;">

	    <div id="flwp-preview-simulator-container-modal-box" class="flwp-preview-simulator-container"></div>

    </div>
</div>

<!-- MODAL 3: SELECT TEMPLATE -->
<div id="flwp-modal-templates" class="flwp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="flwp-tmpl-title">
    <div class="flwp-modal-box" style="max-width: 1200px; width: 95%; max-height: 90vh;">
        <div class="flwp-modal-header">
            <h3 class="flwp-modal-title" id="flwp-tmpl-title"><i class="fas fa-folder-open"></i> <?php esc_html_e('admin.page.builder.modal_tmpl_title', 'flwp'); ?></h3>
            <button class="flwp-btn flwp-btn-close" id="flwp-btn-close-tmpl-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="flwp-modal-body" style="overflow-y: auto; flex: 1; padding: 24px;">
            <p style="margin-bottom: 20px; color: var(--flwp-text-secondary); font-size: 13.5px;">
                <?php esc_html_e('admin.page.builder.modal_tmpl_desc', 'flwp'); ?>
            </p>

            <div class="flwp-template-grid-new" id="flwp-templates-container">
                <!-- Wird dynamisch befüllt -->
            </div>
        </div>
        <div class="flwp-modal-footer">
            <button class="flwp-btn" id="flwp-btn-close-tmpl-cancel"><?php esc_html_e('admin.page.builder.modal_tmpl_cancel', 'flwp'); ?></button>
        </div>
    </div>
</div>


<!-- PRO / Freemius Upgrade Modal -->
<div id="flwp-modal-pro-upgrade" class="flwp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="flwp-pro-title">
    <div class="flwp-modal-box" style="max-width: 500px;">
        <div class="flwp-modal-header" style="background-color: var(--flwp-primary-light); border-bottom: 1px solid var(--flwp-border); padding: 16px 24px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <h3 class="flwp-modal-title" id="flwp-pro-title" style="color: var(--flwp-primary); font-weight: 700;">
                <i class="fas fa-crown" style="color: var(--flwp-warning);"></i> <?php esc_html_e('admin.page.builder.pro.title', 'flwp'); ?>
            </h3>
            <button class="flwp-btn flwp-btn-close" id="flwp-btn-close-pro-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="flwp-modal-body" style="padding: 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px; color: var(--flwp-warning);">
                    <i class="fas fa-gem"></i>
                </div>
                <h4 style="font-size: 18px; font-weight: 700; color: var(--flwp-text); margin-bottom: 8px;"><?php esc_html_e('admin.page.builder.pro.subtitle', 'flwp'); ?></h4>
                <p style="color: var(--flwp-text-secondary); font-size: 13.5px; line-height: 1.5; margin: 0;">
                    <?php esc_html_e('admin.page.builder.pro.description', 'flwp'); ?>
                </p>
            </div>

            <div style="background-color: var(--flwp-bg); border: 1px solid var(--flwp-border); border-radius: 8px; padding: 16px; margin-bottom: 4px;">
                <h5 style="font-weight: 700; font-size: 13px; color: var(--flwp-text); margin-bottom: 12px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.05em;"><?php esc_html_e('admin.page.builder.pro.benefits_title', 'flwp'); ?></h5>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; padding-left: 0; margin: 0;">
                    <li style="display: flex; align-items: flex-start; gap: 8px; color: var(--flwp-text);">
                        <i class="fas fa-check-circle" style="color: var(--flwp-success); margin-top: 2px;"></i>
                        <span><?php esc_html_e('admin.page.builder.pro.benefit.1', 'flwp'); ?></span>
                    </li>
                    <li style="display: flex; align-items: flex-start; gap: 8px; color: var(--flwp-text);">
                        <i class="fas fa-check-circle" style="color: var(--flwp-success); margin-top: 2px;"></i>
                        <span><?php esc_html_e('admin.page.builder.pro.benefit.2', 'flwp'); ?></span>
                    </li>
                    <li style="display: flex; align-items: flex-start; gap: 8px; color: var(--flwp-text);">
                        <i class="fas fa-check-circle" style="color: var(--flwp-success); margin-top: 2px;"></i>
                        <span><?php esc_html_e('admin.page.builder.pro.benefit.3', 'flwp'); ?></span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flwp-modal-footer" style="padding: 16px 24px; border-top: 1px solid var(--flwp-border); display: flex; justify-content: flex-end; gap: 12px; background-color: var(--flwp-bg); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
            <button class="flwp-btn" id="flwp-btn-close-pro-cancel" style="border: 1px solid var(--flwp-border); background: white; color: var(--flwp-text-secondary); font-weight: 550; padding: 8px 16px; border-radius: 6px; cursor: pointer; height: auto;"><?php esc_html_e('admin.page.builder.pro.cancel_btn', 'flwp'); ?></button>
            <a href="https://flwp.de" target="_blank" class="flwp-btn" id="flwp-btn-pro-upgrade-cta" style="background-color: var(--flwp-primary); color: white; font-weight: 600; padding: 8px 20px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--flwp-primary); box-shadow: var(--flwp-shadow-md); transition: all 0.2s; height: auto;">
                <i class="fas fa-shopping-cart"></i> <?php esc_html_e('admin.page.builder.pro.upgrade_btn', 'flwp'); ?>
            </a>
        </div>
    </div>
</div>

<!-- Generic Preview Shell Template -->
<template id="flwp-preview-shell-template">
	<div class="flwp-form-builder-template-display-preview-panel">
		<div class="flwp-form-builder-template-display-preview-card">
			<!-- Preview Toolbar -->
			<div data-slot="header" class="flwp-form-builder-template-display-preview-toolbar"></div>

			<!-- Simulated Website Stage -->
			<div data-slot="body" class="flwp-form-builder-template-display-stage" id="flwp-display-stage-wrapper">
				<!-- The inner shell for the actual widget/overlay content -->
				<div class="flwp-preview-shell flwp-preview-shell--overlay">
					<div data-slot="inner-header"></div>
					<div data-slot="inner-body"></div>
					<div data-slot="inner-footer"></div>
				</div>
			</div>

			<!-- Status Bar -->
			<div data-slot="footer" class="flwp-form-builder-template-display-preview-footer"></div>
		</div>
	</div>
</template>

<!-- Neues allgemeines Overlay-Formular Template -->
<template id="flwp-general-overlay-template">
    <div class="flwp-feedback-plugin flwp-general-overlay-backdrop" role="dialog" aria-modal="true" aria-labelledby="flwp-general-overlay-title">
        <div class="flwp-general-overlay-modal flwp-overlay-card-pos-center">
            <!-- HEADER -->
            <div class="flwp-overlay-header">
                <!-- Zurück-Button (Sinnvoll bei mehrschrittigen Formularen) -->
                <button id="flwp-general-overlay-back-button" class="flwp-general-overlay-icon-btn" aria-label="<?php echo esc_attr__('admin.builder.overlay_template.back', 'flwp') ?>" style="display: none;">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>

                <!-- Flexibler Indikator-Container (wird dynamisch gesteuert: progress, title, step oder none) -->
                <div id="flwp-general-overlay-header-indicator-wrapper" class="flwp-overlay-header-indicator-wrapper">
                    <!-- Variante 1: Progressbar -->
                    <div id="flwp-general-overlay-progress-bar-container" class="flwp-general-overlay-progress-bar-container" style="display: none;">
                        <div id="flwp-general-overlay-progress-bar" class="flwp-general-overlay-progress-bar"></div>
                    </div>

                    <!-- Variante 2: Formulartitel -->
                    <div id="flwp-general-overlay-title" class="flwp-overlay-header-title" style="display: none;"><?php esc_html_e('admin.builder.overlay_template.feedback', 'flwp'); ?></div>

                    <!-- Variante 3: Schritt-Indikator -->
                    <div id="flwp-general-overlay-step-indicator" class="flwp-overlay-header-step-indicator" style="display: none;"></div>
                </div>

                <!-- Schließen-Button -->
                <button id="flwp-general-overlay-close-button" class="flwp-general-overlay-icon-btn" aria-label="<?php echo esc_attr__('admin.builder.overlay_template.close', 'flwp') ?>">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- BODY -->
            <div class="flwp-overlay-body">
                <div id="flwp-general-overlay-content" class="flwp-feedback-type-placeholder flwp-form-id-1" data-type="overlay" data-form-id="1" data-form-updated="20260717120405"></div>
            </div>

            <!-- FOOTER -->
            <div class="flwp-overlay-footer">
                <?php esc_html_e('admin.builder.overlay_template.footer_text', 'flwp'); ?>
            </div>
        </div>
    </div>
</template>

<!-- Template for dynamic warning banners -->
<template id="flwp-tmpl-warning-banner">
    <div class="flwp-submit-warning-banner">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="flwp-warning-text"></span>
        <span class="flwp-warning-count-badge" style="display: none;"></span>
    </div>
</template>

<!-- Toast Notifications Container -->
<div id="flwp-toast-container" aria-live="polite"></div>