<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section class="flwp-builder-view flwp-config-screen-layout" id="flwp-view-display" aria-label="Widget Display">

    <div class="flwp-settings-wrapper flwp-form-builder-template-display-layout-grid">

        <!-- LEFT COLUMN: SETTINGS FORM -->
        <div class="flwp-form-builder-template-display-left-col">

            <!-- Top Header -->
            <div class="flwp-builder-section-header">
                <h3 class="flwp-builder-section-title" style="margin-bottom: 0;">
                    <i class="fas fa-eye" style="color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.display.header.title', 'flwp'); ?>
                </h3>
            </div>

            <!-- Hidden compatibility inputs for legacy bindings -->
            <input type="hidden" id="flwp-style-display-type" value="in-content" />

            <!-- SECTION 1: HAUPTANZEIGETYP WÄHLEN -->
            <div class="flwp-form-builder-template-display-section">
                <div class="flwp-form-builder-template-display-section-header">
                    <h4 class="flwp-form-builder-template-display-section-title">
                        <i class="fas fa-layer-group"></i> <?php esc_html_e('admin.builder.display.section1.title', 'flwp'); ?>
                    </h4>
                    <span class="flwp-form-builder-template-display-badge"><?php esc_html_e('admin.builder.display.step1', 'flwp'); ?></span>
                </div>
                <p class="flwp-form-builder-template-display-desc">
                    <?php esc_html_e('admin.builder.display.section1.description', 'flwp'); ?>
                </p>

                <div class="flwp-form-builder-template-display-grid-cards">
                    <!-- Card 1: In-Content -->
                    <div class="flwp-form-builder-template-display-type-card active" data-type="in-content" data-subtype="shortcode">
                        <div class="flwp-form-builder-template-display-type-card-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="flwp-form-builder-template-display-type-card-content">
                            <h4><?php esc_html_e('admin.builder.display.card1.title', 'flwp'); ?></h4>
                            <p><?php esc_html_e('admin.builder.display.card1.description', 'flwp'); ?></p>
                        </div>
                        <div class="flwp-form-builder-template-display-card-indicator">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>

                    <!-- Card 2: Overlay Pop-Up -->
                    <div class="flwp-form-builder-template-display-type-card" data-type="overlay" data-subtype="modal">
                        <div class="flwp-form-builder-template-display-type-card-icon">
                            <i class="fas fa-window-restore"></i>
                        </div>
                        <div class="flwp-form-builder-template-display-type-card-content">
                            <h4><?php esc_html_e('admin.builder.display.card2.title', 'flwp'); ?></h4>
                            <p><?php esc_html_e('admin.builder.display.card2.description', 'flwp'); ?></p>
                        </div>
                        <div class="flwp-form-builder-template-display-card-indicator">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>

                    <!-- Card 3: Slide-In Panel -->
                    <div class="flwp-form-builder-template-display-type-card" data-type="overlay" data-subtype="slide-in">
                        <div class="flwp-form-builder-template-display-type-card-icon">
                            <i class="fas fa-square-parking"></i>
                        </div>
                        <div class="flwp-form-builder-template-display-type-card-content">
                            <h4><?php esc_html_e('admin.builder.display.card3.title', 'flwp'); ?></h4>
                            <p><?php esc_html_e('admin.builder.display.card3.description', 'flwp'); ?></p>
                        </div>
                        <div class="flwp-form-builder-template-display-card-indicator">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>

                    <!-- Card 4: Floating Feedback Button -->
                    <div class="flwp-form-builder-template-display-type-card" data-type="overlay" data-subtype="feedback-button">
                        <div class="flwp-form-builder-template-display-type-card-icon">
                            <i class="fas fa-comment-dots"></i>
                        </div>
                        <div class="flwp-form-builder-template-display-type-card-content">
                            <h4><?php esc_html_e('admin.builder.display.card4.title', 'flwp'); ?></h4>
                            <p><?php esc_html_e('admin.builder.display.card4.description', 'flwp'); ?></p>
                        </div>
                        <div class="flwp-form-builder-template-display-card-indicator">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                </div>

                <!-- In-Content Specific Sub-Option: Automatic insertion -->
                <div id="flwp-incontent-sub-options" style="margin-top: 14px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--flwp-border);">
                    <div class="flwp-switch-group" style="margin-bottom: 0;">
            <span class="flwp-switch-label" style="font-weight: 600; font-size: 12px;">
              <i class="fas fa-magic" style="color: var(--flwp-primary); font-size: 12px;"></i> <?php esc_html_e('admin.builder.display.in_content.auto_insert', 'flwp'); ?>
            </span>
                        <label class="flwp-switch-wrapper" for="flwp-style-display-in-content">
                            <input type="checkbox" id="flwp-style-display-in-content" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>
                    <div id="flwp-in-content-auto-position-group" style="display: none; margin-top: 10px; flex-direction: column; gap: 6px;">
                        <label for="flwp-style-in-content-position" style="font-size: 11.5px; font-weight: 600;"><?php esc_html_e('admin.builder.display.in_content.position.label', 'flwp'); ?></label>
                        <select id="flwp-style-in-content-position" class="flwp-form-select" style="height: 34px;">
                            <option value="bottom" selected><?php esc_html_e('admin.builder.display.in_content.position.bottom', 'flwp'); ?></option>
                            <option value="top"><?php esc_html_e('admin.builder.display.in_content.position.top', 'flwp'); ?></option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: AUSLÖSER & TIMING (TRIGGERS) -->
            <div class="flwp-form-builder-template-display-section" id="flwp-display-section-triggers" style="display: none;">
                <div class="flwp-form-builder-template-display-section-header">
                    <h4 class="flwp-form-builder-template-display-section-title">
                        <i class="fas fa-bolt"></i> <?php esc_html_e('admin.builder.display.section2.title', 'flwp'); ?>
                    </h4>
                    <span class="flwp-form-builder-template-display-badge"><?php esc_html_e('admin.builder.display.step2', 'flwp'); ?></span>
                </div>
                <p class="flwp-form-builder-template-display-desc">
                    <?php esc_html_e('admin.builder.display.section2.description', 'flwp'); ?>
                </p>

                <!-- Hidden trigger select for compatibility -->
                <select id="flwp-style-overlay-trigger" style="display: none;">
                    <option value="click">click</option>
                    <option value="exit-intent">exit-intent</option>
                    <option value="delay">delay</option>
                    <option value="scroll">scroll</option>
                </select>

                <!-- Segmented Control for Triggers -->
                <div class="flwp-form-builder-template-display-segmented-control" id="flwp-display-trigger-segmented-control">
                    <button type="button" class="flwp-form-builder-template-display-segment-btn active" data-trigger="click">
                        <i class="fas fa-mouse-pointer"></i> <?php esc_html_e('admin.builder.display.trigger.click', 'flwp'); ?>
                    </button>
                    <button type="button" class="flwp-form-builder-template-display-segment-btn" data-trigger="exit-intent">
                        <i class="fas fa-door-open"></i> <?php esc_html_e('admin.builder.display.trigger.exit_intent', 'flwp'); ?>
                    </button>
                    <button type="button" class="flwp-form-builder-template-display-segment-btn" data-trigger="delay">
                        <i class="fas fa-clock"></i> <?php esc_html_e('admin.builder.display.trigger.delay', 'flwp'); ?>
                    </button>
                    <button type="button" class="flwp-form-builder-template-display-segment-btn" data-trigger="scroll">
                        <i class="fas fa-arrows-alt-v"></i> <?php esc_html_e('admin.builder.display.trigger.scroll', 'flwp'); ?>
                    </button>
                </div>

                <!-- Trigger Detail Card -->
                <div class="flwp-form-builder-template-display-trigger-detail-card" id="flwp-display-trigger-content">

                    <!-- Panel Click -->
                    <div id="flwp-overlay-trigger-panel-click" style="display: flex; flex-direction: column; gap: 10px;">
                        <div class="flwp-form-group" id="flwp-overlay-click-selector-group" style="margin-bottom: 0;">
                            <label for="flwp-style-overlay-click-selector" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.trigger.click.selector.label', 'flwp'); ?></label>
                            <input type="text" id="flwp-style-overlay-click-selector" class="flwp-form-input" placeholder="#my-feedback-btn, .open-feedback" style="height: 34px; font-size: 12.5px;" />
                            <span class="flwp-form-builder-template-display-hint"><?php esc_html_e('admin.builder.display.trigger.click.hint', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-switch-group" id="flwp-overlay-click-use-standard-toggle-group" style="margin-top: 6px; margin-bottom: 0; display: none;">
                            <span class="flwp-switch-label" style="font-size: 11.5px;"><?php esc_html_e('admin.builder.display.trigger.click.standard_button.label', 'flwp'); ?></span>
                            <label class="flwp-switch-wrapper" for="flwp-style-overlay-click-use-standard">
                                <input type="checkbox" id="flwp-style-overlay-click-use-standard" checked />
                                <span class="flwp-switch-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Panel Exit-Intent -->
                    <div id="flwp-overlay-trigger-panel-exit-intent" style="display: none; flex-direction: column; gap: 10px;">
                        <p class="flwp-form-builder-template-display-hint">
                            <i class="fas fa-info-circle" style="color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.display.trigger.exit_intent.hint', 'flwp'); ?>
                        </p>
                        <div class="flwp-form-group" style="margin-bottom: 0;">
                            <label for="flwp-style-exit-intent-delay" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.trigger.exit_intent.sensitivity.label', 'flwp'); ?></label>
                            <select id="flwp-style-exit-intent-delay" class="flwp-form-select" style="height: 34px;">
                                <option value="immediate" selected><?php esc_html_e('admin.builder.display.trigger.exit_intent.sensitivity.immediate', 'flwp'); ?></option>
                                <option value="5s"><?php esc_html_e('admin.builder.display.trigger.exit_intent.sensitivity.5s', 'flwp'); ?></option>
                                <option value="10s"><?php esc_html_e('admin.builder.display.trigger.exit_intent.sensitivity.10s', 'flwp'); ?></option>
                                <option value="60s"><?php esc_html_e('admin.builder.display.trigger.exit_intent.sensitivity.60s', 'flwp'); ?></option>
                            </select>
                        </div>
                    </div>

                    <!-- Panel Delay -->
                    <div id="flwp-overlay-trigger-panel-delay" style="display: none; flex-direction: column; gap: 10px;">
                        <p class="flwp-form-builder-template-display-hint">
                            <i class="fas fa-clock" style="color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.display.trigger.delay.hint', 'flwp'); ?>
                        </p>
                        <div class="flwp-form-group" style="margin-bottom: 0;">
                            <label for="flwp-style-overlay-delay-seconds" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.trigger.delay.label', 'flwp'); ?></label>
                            <input type="number" id="flwp-style-overlay-delay-seconds" class="flwp-form-input" min="1" max="3600" value="5" style="height: 34px;" />
                        </div>
                    </div>

                    <!-- Panel Scroll -->
                    <div id="flwp-overlay-trigger-panel-scroll" style="display: none; flex-direction: column; gap: 10px;">
                        <p class="flwp-form-builder-template-display-hint">
                            <i class="fas fa-arrows-alt-v" style="color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.display.trigger.scroll.hint', 'flwp'); ?>
                        </p>
                        <div class="flwp-form-group" style="margin-bottom: 0;">
                            <label for="flwp-style-overlay-scroll-type" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.trigger.scroll.condition.label', 'flwp'); ?></label>
                            <select id="flwp-style-overlay-scroll-type" class="flwp-form-select" style="height: 34px;">
                                <option value="end" selected><?php esc_html_e('admin.builder.display.trigger.scroll.condition.end', 'flwp'); ?></option>
                                <option value="percent"><?php esc_html_e('admin.builder.display.trigger.scroll.condition.percent', 'flwp'); ?></option>
                            </select>
                        </div>
                        <div id="flwp-overlay-scroll-percent-container" class="flwp-form-group" style="display: none; margin-bottom: 0;">
                            <label for="flwp-style-overlay-scroll-percent" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.trigger.scroll.percent.label', 'flwp'); ?></label>
                            <input type="number" id="flwp-style-overlay-scroll-percent" class="flwp-form-input" min="1" max="100" value="50" style="height: 34px;" />
                        </div>
                    </div>

                </div>
            </div>

            <!-- SECTION 2B: FEEDBACK-BUTTON EINSTELLUNGEN -->
            <div class="flwp-form-builder-template-display-section" id="flwp-display-section-feedback-button" style="display: none;">
                <div class="flwp-form-builder-template-display-section-header">
                    <h4 class="flwp-form-builder-template-display-section-title">
                        <i class="fas fa-comment-alt"></i> 2. <?php esc_html_e('admin.builder.display.feedback_button.title', 'flwp'); ?>
                    </h4>
                    <span class="flwp-form-builder-template-display-badge"><?php esc_html_e('admin.builder.display.step.2', 'flwp'); ?></span>
                </div>
                <p class="flwp-form-builder-template-display-desc">
                    <?php esc_html_e('admin.builder.display.feedback_button.description', 'flwp'); ?>
                </p>

                <div class="flwp-form-builder-template-display-trigger-detail-card" id="flwp-overlay-click-standard-btn-group" style="display: flex; flex-direction: column; gap: 10px;">
                    <div class="flwp-form-group" style="margin-bottom: 0;">
                        <label for="flwp-style-feedback-btn-text" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.label.text', 'flwp'); ?></label>
                        <input type="text" id="flwp-style-feedback-btn-text" class="flwp-form-input" style="height: 34px; font-size: 12.5px;" value="<?php esc_html_e('admin.builder.display.feedback_button.label.default', 'flwp'); ?>" />
                    </div>
                    <div class="flwp-form-group" style="margin-bottom: 0;">
                        <label for="flwp-style-feedback-btn-position" class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.position.label', 'flwp'); ?></label>
                        <select id="flwp-style-feedback-btn-position" class="flwp-form-select" style="height: 34px;">
                            <option value="right-middle" selected><?php esc_html_e('admin.builder.display.feedback_button.position.right_middle', 'flwp'); ?></option>
                            <option value="left-middle"><?php esc_html_e('admin.builder.display.feedback_button.position.left_middle', 'flwp'); ?></option>
                            <option value="bottom-right"><?php esc_html_e('admin.builder.display.feedback_button.position.bottom_right', 'flwp'); ?></option>
                            <option value="bottom-middle"><?php esc_html_e('admin.builder.display.feedback_button.position.bottom_middle', 'flwp'); ?></option>
                            <option value="bottom-left"><?php esc_html_e('admin.builder.display.feedback_button.position.bottom_left', 'flwp'); ?></option>
                        </select>
                    </div>
                    <div class="flwp-switch-group" style="margin-bottom: 0;">
                        <span class="flwp-switch-label" style="font-size: 11px;"><?php esc_html_e('admin.builder.display.feedback_button.hide_option.label', 'flwp'); ?></span>
                        <label class="flwp-switch-wrapper" for="flwp-style-feedback-hide-option-enabled">
                            <input type="checkbox" id="flwp-style-feedback-hide-option-enabled" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <!-- CUSTOM STYLES & FARBEN FÜR FEEDBACK-BUTTON -->
                    <div class="flwp-switch-group" style="margin-top: 6px; margin-bottom: 0; padding-top: 10px; border-top: 1px dashed var(--flwp-border, #e2e8f0);">
                        <div class="flwp-form-builder-template-display-toggle-info">
                            <span class="flwp-form-builder-template-display-toggle-title" style="font-size: 12px; font-weight: 600;"><?php esc_html_e('admin.builder.display.feedback_button.custom_design.title', 'flwp'); ?></span>
                            <span class="flwp-form-builder-template-display-toggle-desc" style="font-size: 11px; color: var(--flwp-text-muted, #6c757d);"><?php esc_html_e('admin.builder.display.feedback_button.custom_design.description', 'flwp'); ?></span>
                        </div>
                        <label class="flwp-switch-wrapper" for="flwp-opt-feedback-btn-custom-enabled">
                            <input type="checkbox" id="flwp-opt-feedback-btn-custom-enabled" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <div id="flwp-opt-feedback-btn-colors-subpanel" style="display: none; flex-direction: column; gap: 12px; margin-top: 4px; padding-top: 10px; border-top: 1px dashed var(--flwp-border, #e2e8f0);">

                        <!-- Schriftgröße -->
                        <div class="flwp-form-group" style="margin-bottom: 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <label for="flwp-opt-feedback-btn-font-size" class="flwp-form-builder-template-display-label" style="margin-bottom: 0;"><?php esc_html_e('admin.builder.display.feedback_button.font_size.label', 'flwp'); ?></label>
                                <span id="flwp-opt-feedback-btn-font-size-val" style="font-size: 12px; font-weight: 600; color: var(--flwp-primary, #104689);">16px</span>
                            </div>
                            <input type="range" id="flwp-opt-feedback-btn-font-size" min="10" max="24" value="16" style="width: 100%; accent-color: var(--flwp-primary, #104689);" />
                        </div>

                        <!-- Farb-Raster -->
                        <div class="flwp-form-builder-template-display-color-grid">

                            <div class="flwp-form-builder-template-display-color-field">
                                <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.background.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-color-wrapper">
                                    <input type="color" id="flwp-opt-feedback-btn-bg" value="#104689" />
                                    <input type="text" id="flwp-opt-feedback-btn-bg-hex" value="#104689" readonly />
                                </div>
                            </div>

                            <div class="flwp-form-builder-template-display-color-field">
                                <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.text_color.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-color-wrapper">
                                    <input type="color" id="flwp-opt-feedback-btn-text" value="#ffffff" />
                                    <input type="text" id="flwp-opt-feedback-btn-text-hex" value="#FFFFFF" readonly />
                                </div>
                            </div>

                            <div class="flwp-form-builder-template-display-color-field">
                                <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.border.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-color-wrapper">
                                    <input type="color" id="flwp-opt-feedback-btn-border" value="#104689" />
                                    <input type="text" id="flwp-opt-feedback-btn-border-hex" value="#104689" readonly />
                                </div>
                            </div>

                            <div class="flwp-form-builder-template-display-color-field">
                                <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.hover.background.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-color-wrapper">
                                    <input type="color" id="flwp-opt-feedback-btn-hover-bg" value="#0a2e5c" />
                                    <input type="text" id="flwp-opt-feedback-btn-hover-bg-hex" value="#0A2E5C" readonly />
                                </div>
                            </div>

                            <div class="flwp-form-builder-template-display-color-field">
                                <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.hover.text_color.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-color-wrapper">
                                    <input type="color" id="flwp-opt-feedback-btn-hover-text" value="#ffffff" />
                                    <input type="text" id="flwp-opt-feedback-btn-hover-text-hex" value="#FFFFFF" readonly />
                                </div>
                            </div>

                            <div class="flwp-form-builder-template-display-color-field">
                                <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.feedback_button.hover.border.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-color-wrapper">
                                    <input type="color" id="flwp-opt-feedback-btn-hover-border" value="#0a2e5c" />
                                    <input type="text" id="flwp-opt-feedback-btn-hover-border-hex" value="#0A2E5C" readonly />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION 3: GLOBALE EINSTELLUNGEN -->
            <div class="flwp-form-builder-template-display-section">
                <div class="flwp-form-builder-template-display-section-header">
                    <h4 class="flwp-form-builder-template-display-section-title">
                        <i class="fas fa-sliders"></i> <?php esc_html_e('admin.builder.display.global.title', 'flwp'); ?>
                    </h4>
                    <span class="flwp-form-builder-template-display-badge"><?php esc_html_e('admin.builder.display.step.3', 'flwp'); ?></span>
                </div>
                <p class="flwp-form-builder-template-display-desc">
                    <?php esc_html_e('admin.builder.display.global.description', 'flwp'); ?>
                </p>

                <!-- Global Settings Navigation Tabs -->
                <div class="flwp-form-builder-template-display-tabs-nav">
                    <button type="button" class="flwp-form-builder-template-display-tab-btn active" data-global-tab="behavior">
                        <i class="fas fa-hand"></i> <?php esc_html_e('admin.builder.display.tab.behavior', 'flwp'); ?>
                    </button>
                    <button type="button" class="flwp-form-builder-template-display-tab-btn" data-global-tab="box-model">
                        <i class="fas fa-expand"></i> <?php esc_html_e('admin.builder.display.tab.box_model', 'flwp'); ?>
                    </button>
                    <button type="button" class="flwp-form-builder-template-display-tab-btn" data-global-tab="styling">
                        <i class="fas fa-palette"></i> <?php esc_html_e('admin.builder.display.tab.styling', 'flwp'); ?>
                    </button>
                </div>

                <!-- TAB PANEL 1: VERHALTEN & FREQUENZ -->
                <div class="flwp-form-builder-template-display-tab-panel active" id="flwp-display-global-tab-behavior">

                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-frequency">
                        <h5 class="flwp-form-builder-template-display-group-title"><i class="fas fa-history"></i> <?php esc_html_e('admin.builder.display.group.frequency.title', 'flwp'); ?></h5>

                        <div class="flwp-form-builder-template-display-grid-2">
                            <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-close-days">
                                <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-rule-close-days">
                                    <?php esc_html_e('admin.builder.display.frequency.close_days.label', 'flwp'); ?>
                                </label>
                                <div class="flwp-form-builder-template-display-input-suffix">
                                    <input type="number" id="flwp-style-overlay-rule-close-days" value="1" min="0" />
                                    <span><?php esc_html_e('admin.builder.display.days', 'flwp'); ?></span>
                                </div>
                                <span class="flwp-form-builder-template-display-hint"><?php esc_html_e('admin.builder.display.frequency.close_days.hint', 'flwp'); ?></span>
                            </div>

                            <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-submit-days">
                                <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-rule-submit-days">
                                    <?php esc_html_e('admin.builder.display.frequency.submit_days.label', 'flwp'); ?>
                                </label>
                                <div class="flwp-form-builder-template-display-input-suffix">
                                    <input type="number" id="flwp-style-overlay-rule-submit-days" value="30" min="0" />
                                    <span><?php esc_html_e('admin.builder.display.days', 'flwp'); ?></span>
                                </div>
                                <span class="flwp-form-builder-template-display-hint"><?php esc_html_e('admin.builder.display.frequency.submit_days.hint', 'flwp'); ?></span>
                            </div>
                        </div>

                        <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-cookie-scope" style="margin-top: 10px;">
                            <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-rule-cookie-scope"><?php esc_html_e('admin.builder.display.cookie_scope.label', 'flwp'); ?></label>
                            <select id="flwp-style-overlay-rule-cookie-scope" class="flwp-form-select" style="height: 34px;">
                                <option value="domain" selected><?php esc_html_e('admin.builder.display.cookie_scope.domain', 'flwp'); ?></option>
                                <option value="page"><?php esc_html_e('admin.builder.display.cookie_scope.page', 'flwp'); ?></option>
                            </select>
                        </div>

                        <!-- Hide Click Trigger Options (Visible when trigger is click) -->
                        <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-hide-click-on-close" style="margin-top: 10px; display: none;">
                            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                <div style="flex: 1; padding-right: 15px;">
                                    <label class="flwp-form-builder-template-display-label" style="margin-bottom: 0;"><?php esc_html_e('admin.builder.display.trigger.hide_click_on_close.label', 'flwp'); ?></label>
                                    <div style="font-size: 11px; color: var(--flwp-text-secondary);"><?php esc_html_e('admin.builder.display.trigger.hide_click_on_close.desc', 'flwp'); ?></div>
                                </div>
                                <label class="flwp-switch-wrapper" for="flwp-style-overlay-rule-hide-click-on-close" style="cursor: pointer;">
                                    <input type="checkbox" id="flwp-style-overlay-rule-hide-click-on-close" />
                                    <span class="flwp-switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-hide-click-on-submit" style="margin-top: 10px; display: none;">
                            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                <div style="flex: 1; padding-right: 15px;">
                                    <label class="flwp-form-builder-template-display-label" style="margin-bottom: 0;"><?php esc_html_e('admin.builder.display.trigger.hide_click_on_submit.label', 'flwp'); ?></label>
                                    <div style="font-size: 11px; color: var(--flwp-text-secondary);"><?php esc_html_e('admin.builder.display.trigger.hide_click_on_submit.desc', 'flwp'); ?></div>
                                </div>
                                <label class="flwp-switch-wrapper" for="flwp-style-overlay-rule-hide-click-on-submit" style="cursor: pointer;">
                                    <input type="checkbox" id="flwp-style-overlay-rule-hide-click-on-submit" />
                                    <span class="flwp-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-closing-options" style="margin-top: 14px;">
                        <h5 class="flwp-form-builder-template-display-group-title"><i class="fas fa-times-circle"></i> <?php esc_html_e('admin.builder.display.group.closing_options.title', 'flwp'); ?></h5>

                        <div class="flwp-form-builder-template-display-toggle-list">
	                        <label class="flwp-form-builder-template-display-toggle-item">
		                        <div class="flwp-form-builder-template-display-toggle-info">
			                        <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.overlay.allow_scroll.title', 'flwp'); ?></span>
			                        <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.overlay.allow_scroll.desc', 'flwp'); ?></span>
		                        </div>
		                        <div class="flwp-switch-wrapper">
			                        <input type="checkbox" id="flwp-style-overlay-rule-allow-scroll" checked />
			                        <span class="flwp-switch-slider"></span>
		                        </div>
	                        </label>

	                        <label class="flwp-form-builder-template-display-toggle-item">
		                        <div class="flwp-form-builder-template-display-toggle-info">
			                        <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.overlay.hide_header.title', 'flwp'); ?></span>
			                        <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.overlay.hide_header.desc', 'flwp'); ?></span>
		                        </div>
		                        <div class="flwp-switch-wrapper">
			                        <input type="checkbox" id="flwp-style-overlay-rule-hide-header" />
			                        <span class="flwp-switch-slider"></span>
		                        </div>
	                        </label>

	                        <label class="flwp-form-builder-template-display-toggle-item">
		                        <div class="flwp-form-builder-template-display-toggle-info">
			                        <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.overlay.hide_footer.title', 'flwp'); ?></span>
			                        <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.overlay.hide_footer.desc', 'flwp'); ?></span>
		                        </div>
		                        <div class="flwp-switch-wrapper">
			                        <input type="checkbox" id="flwp-style-overlay-rule-hide-footer" />
			                        <span class="flwp-switch-slider"></span>
		                        </div>
	                        </label>

                            <label class="flwp-form-builder-template-display-toggle-item">
                                <div class="flwp-form-builder-template-display-toggle-info">
                                    <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.overlay.show_backdrop.title', 'flwp'); ?></span>
                                    <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.overlay.show_backdrop.desc', 'flwp'); ?></span>
                                </div>
                                <div class="flwp-switch-wrapper">
                                    <input type="checkbox" id="flwp-style-overlay-rule-show-backdrop" checked />
                                    <span class="flwp-switch-slider"></span>
                                </div>
                            </label>

                            <label class="flwp-form-builder-template-display-toggle-item">
                                <div class="flwp-form-builder-template-display-toggle-info">
                                    <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.overlay.close_on_backdrop.title', 'flwp'); ?></span>
                                    <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.overlay.close_on_backdrop.desc', 'flwp'); ?></span>
                                </div>
                                <div class="flwp-switch-wrapper">
                                    <input type="checkbox" id="flwp-style-overlay-rule-backdrop" checked />
                                    <span class="flwp-switch-slider"></span>
                                </div>
                            </label>

                            <label class="flwp-form-builder-template-display-toggle-item">
                                <div class="flwp-form-builder-template-display-toggle-info">
                                    <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.overlay.esc_close.title', 'flwp'); ?></span>
                                    <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.overlay.esc_close.desc', 'flwp'); ?></span>
                                </div>
                                <div class="flwp-switch-wrapper">
                                    <input type="checkbox" id="flwp-style-overlay-rule-esc" checked />
                                    <span class="flwp-switch-slider"></span>
                                </div>
                            </label>
                        </div>
                    </div>

                </div>

                <!-- TAB PANEL 2: ABSTÄNDE & MAßE -->
                <div class="flwp-form-builder-template-display-tab-panel" id="flwp-display-global-tab-box-model">

                    <!-- Padding Box Model -->
                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-padding">
                        <div class="flwp-form-builder-template-display-box-header">
                            <h5 class="flwp-form-builder-template-display-group-title" style="margin: 0;"><i class="fas fa-expand"></i> <?php esc_html_e('admin.builder.display.box_model.padding.title', 'flwp'); ?></h5>
                            <div class="flwp-form-builder-template-display-box-actions">
                                <select id="flwp-globaldata-padding-unit" class="flwp-box-model-unit-select">
                                    <option value="px" selected>px</option>
                                    <option value="rem">rem</option>
                                    <option value="em">em</option>
                                </select>
                                <button type="button" id="flwp-globaldata-padding-link" class="flwp-box-model-link-btn is-linked" title="<?php esc_html_e('admin.builder.display.box_model.link.title', 'flwp'); ?>">
                                    <i class="fas fa-link"></i>
                                </button>
	                            <button type="button" id="flwp-globaldata-padding-reset" class="flwp-box-model-reset-btn" title="<?php esc_html_e('admin.builder.display.box_model.reset.title', 'flwp'); ?>">
		                            <i class="fas fa-undo"></i>
	                            </button>
                            </div>
                        </div>

                        <div class="flwp-form-builder-template-display-box-inputs">
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.top', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-padding-top" placeholder="16" />
                            </div>
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.right', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-padding-right" placeholder="16" />
                            </div>
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.bottom', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-padding-bottom" placeholder="16" />
                            </div>
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.left', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-padding-left" placeholder="16" />
                            </div>
                        </div>
                    </div>

                    <!-- Margin Box Model -->
                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-margin" style="margin-top: 14px;">
                        <div class="flwp-form-builder-template-display-box-header">
                            <h5 class="flwp-form-builder-template-display-group-title" style="margin: 0;"><i class="fas fa-arrows-alt"></i> <?php esc_html_e('admin.builder.display.box_model.margin.title', 'flwp'); ?></h5>
                            <div class="flwp-form-builder-template-display-box-actions">
                                <select id="flwp-globaldata-margin-unit" class="flwp-box-model-unit-select">
                                    <option value="px" selected>px</option>
                                    <option value="rem">rem</option>
                                    <option value="em">em</option>
                                </select>
                                <button type="button" id="flwp-globaldata-margin-link" class="flwp-box-model-link-btn is-linked" title="<?php esc_html_e('admin.builder.display.box_model.link.title', 'flwp'); ?>">
                                    <i class="fas fa-link"></i>
                                </button>
	                            <button type="button" id="flwp-globaldata-margin-reset" class="flwp-box-model-reset-btn" title="<?php esc_html_e('admin.builder.display.box_model.reset.title', 'flwp'); ?>">
		                            <i class="fas fa-undo"></i>
	                            </button>
                            </div>
                        </div>

                        <div class="flwp-form-builder-template-display-box-inputs">
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.top', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-margin-top" placeholder="0" />
                            </div>
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.right', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-margin-right" placeholder="auto" />
                            </div>
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.bottom', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-margin-bottom" placeholder="0" />
                            </div>
                            <div class="flwp-form-builder-template-display-box-field">
                                <span><?php esc_html_e('admin.builder.display.box_model.label.left', 'flwp'); ?></span>
                                <input type="text" id="flwp-globaldata-margin-left" placeholder="auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Dimensions & Position -->
                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-dimensions" style="margin-top: 14px;">
                        <h5 class="flwp-form-builder-template-display-group-title"><i class="fas fa-arrows-alt"></i> <?php esc_html_e('admin.builder.display.dimensions.title', 'flwp'); ?></h5>
                        <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-overlay-position" style="margin-bottom: 12px;">
                            <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-position"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.label', 'flwp'); ?></label>
                            <select id="flwp-style-overlay-position" class="flwp-form-select" style="height: 34px;">
                                <option value="center" selected><?php esc_html_e('admin.builder.display.dimensions.overlay_position.center', 'flwp'); ?></option>
                                <option value="bottom-right"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.bottom_right', 'flwp'); ?></option>
                                <option value="bottom-left"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.bottom_left', 'flwp'); ?></option>
                                <option value="bottom-middle"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.bottom_middle', 'flwp'); ?></option>
                                <option value="right-middle"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.right_middle', 'flwp'); ?></option>
                                <option value="left-middle"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.left_middle', 'flwp'); ?></option>
                                <option value="top-right"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.top_right', 'flwp'); ?></option>
                                <option value="top-middle"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.top_middle', 'flwp'); ?></option>
                                <option value="top-left"><?php esc_html_e('admin.builder.display.dimensions.overlay_position.top_left', 'flwp'); ?></option>
                            </select>
                        </div>
                        <div class="flwp-form-builder-template-display-grid-2">
                            <div class="flwp-form-builder-template-display-form-row">
                                <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-rule-width"><?php esc_html_e('admin.builder.display.dimensions.max_width.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-input-suffix">
                                    <input type="number" id="flwp-style-overlay-rule-width" placeholder="480" min="280" max="1200" />
                                    <span>px</span>
                                </div>
                            </div>

                            <div class="flwp-form-builder-template-display-form-row" id="flwp-display-row-min-height">
                                <label class="flwp-form-builder-template-display-label" for="flwp-style-min-height"><?php esc_html_e('admin.builder.display.dimensions.min_height.label', 'flwp'); ?></label>
                                <div class="flwp-form-builder-template-display-input-suffix">
                                    <input type="number" id="flwp-style-min-height" placeholder="Auto" min="0" max="800" />
                                    <span>px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- TAB PANEL 3: DESIGN & FARBEN -->
                <div class="flwp-form-builder-template-display-tab-panel" id="flwp-display-global-tab-styling">

                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-custom-colors">
                        <div class="flwp-switch-group" style="margin-bottom: 0;">
                            <div class="flwp-form-builder-template-display-toggle-info">
                                <span class="flwp-form-builder-template-display-toggle-title"><?php esc_html_e('admin.builder.display.custom_colors.title', 'flwp'); ?></span>
                                <span class="flwp-form-builder-template-display-toggle-desc"><?php esc_html_e('admin.builder.display.custom_colors.desc', 'flwp'); ?></span>
                            </div>
                            <label class="flwp-switch-wrapper" for="flwp-opt-globaldata-custom-enabled">
                                <input type="checkbox" id="flwp-opt-globaldata-custom-enabled" />
                                <span class="flwp-switch-slider"></span>
                            </label>
                        </div>

                        <div id="flwp-opt-globaldata-colors-subpanel" style="display: none; margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--flwp-border);">
                            <div class="flwp-form-builder-template-display-color-grid">

                                <div class="flwp-form-builder-template-display-color-field">
                                    <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.custom_colors.label.background', 'flwp'); ?></label>
                                    <div class="flwp-form-builder-template-display-color-wrapper">
                                        <input type="color" id="flwp-opt-globaldata-bg" value="#ffffff" />
                                        <input type="text" id="flwp-opt-globaldata-bg-hex" value="#FFFFFF" readonly />
                                    </div>
                                </div>

                                <div class="flwp-form-builder-template-display-color-field">
                                    <label class="flwp-form-builder-template-display-label"><?php esc_html_e('admin.builder.display.custom_colors.label.border', 'flwp'); ?></label>
                                    <div class="flwp-form-builder-template-display-color-wrapper">
                                        <input type="color" id="flwp-opt-globaldata-border" value="#e2e8f0" />
                                        <input type="text" id="flwp-opt-globaldata-border-hex" value="#E2E8F0" readonly />
                                    </div>
                                </div>

                                <div class="flwp-form-builder-template-display-color-field" style="grid-column: span 2;">
                                    <label class="flwp-form-builder-template-display-label" for="flwp-opt-globaldata-border-style"><?php esc_html_e('admin.builder.display.custom_colors.label.border_style', 'flwp'); ?></label>
                                    <select id="flwp-opt-globaldata-border-style" class="flwp-form-select" style="height: 34px;">
                                        <option value="solid" selected><?php esc_html_e('admin.builder.display.custom_colors.option.solid', 'flwp'); ?></option>
                                        <option value="dashed"><?php esc_html_e('admin.builder.display.custom_colors.option.dashed', 'flwp'); ?></option>
                                        <option value="dotted"><?php esc_html_e('admin.builder.display.custom_colors.option.dotted', 'flwp'); ?></option>
                                    </select>
                                </div>

	                            <div class="flwp-form-builder-template-display-color-field" style="grid-column: span 2;">
		                            <label class="flwp-form-builder-template-display-label" for="flwp-opt-globaldata-border-width"><?php esc_html_e('admin.builder.display.custom_colors.label.border_width', 'flwp'); ?></label>
		                            <div class="flwp-form-builder-template-display-input-suffix">
			                            <input type="number" id="flwp-opt-globaldata-border-width" value="1" min="0" max="20" />
			                            <span>px</span>
		                            </div>
	                            </div>

                                <div class="flwp-form-builder-template-display-color-field" style="grid-column: span 2;">
                                    <label class="flwp-form-builder-template-display-label" for="flwp-opt-globaldata-border-radius"><?php esc_html_e('admin.builder.display.custom_colors.label.border_radius', 'flwp'); ?></label>
                                    <div class="flwp-form-builder-template-display-input-suffix">
                                        <input type="number" id="flwp-opt-globaldata-border-radius" value="0" min="0" max="50" />
                                        <span>px</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="flwp-form-builder-template-display-group-card" id="flwp-display-group-header-footer" style="margin-top: 14px;">
                        <h5 class="flwp-form-builder-template-display-group-title"><i class="fas fa-heading"></i> <?php esc_html_e('admin.builder.display.header_footer.title', 'flwp'); ?></h5>
                        <div class="flwp-form-builder-template-display-grid-2">
                            <div class="flwp-form-builder-template-display-form-row">
                                <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-header-indicator"><?php esc_html_e('admin.builder.display.header_footer.indicator_type.label', 'flwp'); ?></label>
                                <select id="flwp-style-overlay-header-indicator" class="flwp-form-select" style="height: 34px;">
                                    <option value="progress" selected><?php esc_html_e('admin.builder.display.header_footer.indicator_type.option.progress', 'flwp'); ?></option>
                                    <option value="title"><?php esc_html_e('admin.builder.display.header_footer.indicator_type.option.title', 'flwp'); ?></option>
                                    <option value="step"><?php esc_html_e('admin.builder.display.header_footer.indicator_type.option.step', 'flwp'); ?></option>
                                    <option value="none"><?php esc_html_e('admin.builder.display.header_footer.indicator_type.option.none', 'flwp'); ?></option>
                                </select>
                            </div>

                            <div class="flwp-form-builder-template-display-form-row" id="flwp-style-overlay-header-title-container" style="display: none;">
                                <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-header-title"><?php esc_html_e('admin.builder.display.header_footer.custom_title.label', 'flwp'); ?></label>
                                <input type="text" id="flwp-style-overlay-header-title" class="flwp-form-input" placeholder="<?php esc_html_e('admin.builder.display.header_footer.custom_title.placeholder', 'flwp'); ?>" style="height: 34px;" />
                            </div>
                        </div>

                        <div class="flwp-switch-group" style="margin-top: 12px; margin-bottom: 0;">
                            <span class="flwp-switch-label" style="font-size: 11.5px;"><?php esc_html_e('admin.builder.display.header_footer.show_footer.label', 'flwp'); ?></span>
                            <label class="flwp-switch-wrapper" for="flwp-style-overlay-show-footer">
                                <input type="checkbox" id="flwp-style-overlay-show-footer" checked />
                                <span class="flwp-switch-slider"></span>
                            </label>
                        </div>

                        <div class="flwp-form-group" id="flwp-style-overlay-footer-text-container" style="margin-top: 8px; margin-bottom: 0;">
                            <label class="flwp-form-builder-template-display-label" for="flwp-style-overlay-footer-text"><?php esc_html_e('admin.builder.display.header_footer.custom_footer_text.label', 'flwp'); ?></label>
                            <input type="text" id="flwp-style-overlay-footer-text" class="flwp-form-input" placeholder="<?php esc_html_e('admin.builder.display.header_footer.custom_footer_text.placeholder', 'flwp'); ?>" style="height: 34px;" />
                        </div>
                    </div>

                </div>

            </div>

        </div>

    <!-- RIGHT COLUMN: LIVE INTERACTIVE SIMULATOR -->
    <div id="flwp-preview-simulator-container" class="flwp-preview-simulator-container"></div>


    </div>

</section>
