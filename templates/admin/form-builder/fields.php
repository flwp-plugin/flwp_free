<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section class="flwp-builder-view flwp-felder-editor-layout" id="flwp-view-fields" aria-label="<?php esc_attr_e('admin.builder.fields.title', 'flwp'); ?>">

    <!-- Sidebar selection & specifics -->
    <aside class="flwp-builder-sidebar">

        <!-- Tab Header in Sidebar -->
        <div class="flwp-sidebar-tabs-header">
            <div class="flwp-sidebar-tab-trigger flwp-sidebar-tab-active" data-panel="add-fields" id="flwp-tab-trigger-add">
                <i class="fas fa-plus-circle"></i> <?php esc_html_e('admin.builder.fields.add_fields', 'flwp'); ?>
            </div>
            <div class="flwp-sidebar-tab-trigger" data-panel="field-options" id="flwp-tab-trigger-options">
                <i class="fas fa-sliders-h"></i> <?php esc_html_e('admin.builder.fields.field_options', 'flwp'); ?>
            </div>
        </div>

        <!-- Container für dynamische Warnmeldungen -->
        <div id="flwp-warning-banners-container"></div>

        <!-- Sidebar Tab Panel Content -->
        <div class="flwp-sidebar-tab-content-wrapper">

            <!-- PANEL A: Felder hinzufügen -->
            <div class="flwp-sidebar-tab-panel flwp-sidebar-tab-panel-active" id="flwp-panel-add-fields">

                <!-- Search boxes for standard fields -->
                <div class="flwp-search-box-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" id="flwp-search-fields-input" class="flwp-search-input" placeholder="<?php esc_attr_e('admin.builder.fields.search_placeholder', 'flwp'); ?>" title="<?php esc_html_e('admin.builder.fields.search_title', 'flwp'); ?>" autocomplete="off" />
                </div>

                <div class="flwp-sidebar-section-title" id="flwp-sec-title-standard">
                    <span><?php esc_html_e('admin.builder.fields.standard_fields', 'flwp'); ?></span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>

                <!-- Draggable elements container -->
                <div id="flwp-draggable-store-grid" style="display: flex; flex-direction: column; gap: 16px;">

                    <!-- Grid 1: Standard elements -->
                    <div class="flwp-fields-grid">
                        <div class="flwp-draggable-field-item" draggable="true" data-type="headline" id="flwp-field-drag-headline">
                            <i class="fas fa-heading"></i>
                            <span><?php esc_html_e('admin.builder.fields.headline', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-draggable-field-item" draggable="true" data-type="description" id="flwp-field-drag-desc">
                            <i class="fas fa-align-left"></i>
                            <span><?php esc_html_e('admin.builder.fields.description', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-draggable-field-item" draggable="true" data-type="button" id="flwp-field-drag-button">
                            <i class="fas fa-square-minus" style="transform: scaleY(0.75);"></i>
                            <span><?php esc_html_e('admin.builder.fields.button', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-draggable-field-item" draggable="true" data-type="textarea" id="flwp-field-drag-textarea">
                            <i class="fas fa-keyboard"></i>
                            <span><?php esc_html_e('admin.builder.fields.textarea', 'flwp'); ?></span>
                        </div>
                    </div>

                    <div class="flwp-sidebar-section-title" id="flwp-sec-title-reviews" style="margin-top: 8px; margin-bottom: 0;">
                        <span><?php esc_html_e('admin.builder.fields.reviews', 'flwp'); ?></span>
                        <i class="fas fa-chevron-down text-xs"></i>
                    </div>

                    <!-- Grid 2: Reviews elements -->
                    <div class="flwp-fields-grid">
                        <div class="flwp-draggable-field-item" draggable="true" data-type="rating" id="flwp-field-drag-rating">
                            <i class="fas fa-star"></i>
                            <span><?php esc_html_e('admin.builder.fields.rating', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-draggable-field-item flwp-draggable-pro-item" draggable="true" data-type="thumbs" id="flwp-field-drag-thumbs">
                            <i class="fas fa-thumbs-up"></i>
                            <span><?php esc_html_e('admin.builder.fields.thumbs', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-draggable-field-item flwp-draggable-pro-item" draggable="true" data-type="smileys" id="flwp-field-drag-smileys">
                            <i class="fas fa-smile"></i>
                            <span><?php esc_html_e('admin.builder.fields.smileys', 'flwp'); ?></span>
                        </div>

                        <div class="flwp-draggable-field-item flwp-draggable-pro-item" draggable="true" data-type="nps" id="flwp-field-drag-nps">
                            <i class="fas fa-chart-bar"></i>
                            <span><?php esc_html_e('admin.builder.fields.nps', 'flwp'); ?></span>
                        </div>
                    </div>

                </div>

                <div class="flwp-empty-search-msg" id="flwp-search-no-results">
                    <?php esc_html_e('admin.builder.fields.search_no_results', 'flwp'); ?>
                </div>

                <div style="margin-top: auto; padding-top: 24px; font-size: 11px; color: var(--flwp-text-secondary); line-height: 1.4; border-top: 1px dashed var(--flwp-border);">
                    <i class="fas fa-mouse-pointer" style="margin-right: 4px;"></i>
                    <strong><?php esc_html_e('admin.builder.fields.tip', 'flwp'); ?>:</strong> <?php esc_html_e('admin.builder.fields.tip_text', 'flwp'); ?>
                </div>

            </div>

            <!-- PANEL B: Feldoptionen -->
            <div class="flwp-sidebar-tab-panel" id="flwp-panel-field-options">

                <!-- Default notice if no element selected -->
                <div class="flwp-no-field-selected" id="flwp-options-empty-notice">
                    <i class="fas fa-mouse-pointer"></i>
                    <p><?php esc_html_e('admin.builder.fields.no_field_selected', 'flwp'); ?></p>
                </div>

                <!-- Active options form -->
                <div class="flwp-field-options-form" id="flwp-options-form-container" style="display: none;">
                    <input type="hidden" id="flwp-opt-element-id" />

                    <div style="display: flex; flex-direction: column; margin-bottom: 12px;">
                        <span id="flwp-opt-element-type-badge" style="font-size: 12px; font-weight: 650; color: var(--flwp-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;"><?php esc_html_e('admin.builder.fields.options.field_type', 'flwp'); ?></span>
                        <span class="flwp-badge-id" id="flwp-opt-element-id-badge" style="align-self: flex-start; font-size: 10px; color: #64748b; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: var(--flwp-font-mono);"><?php esc_html_e('admin.builder.fields.options.id', 'flwp'); ?>: #</span>
                    </div>

                    <!-- Basic Label Option -->
                    <div class="flwp-form-group" id="flwp-opt-group-label">
                        <label for="flwp-opt-label"><?php esc_html_e('admin.builder.fields.options.label.title', 'flwp'); ?> <i class="fas fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.fields.options.label.hint', 'flwp'); ?>"></i></label>
                        <input type="text" id="flwp-opt-label" class="flwp-form-input" />
                    </div>

                    <!-- Dynamic settings dependent on Field Type -->

                    <!-- Description setting -->
                    <div class="flwp-form-group" id="flwp-opt-group-desc-text">
                        <label for="flwp-opt-desc-text"><?php esc_html_e('admin.builder.fields.options.description.title', 'flwp'); ?></label>
                        <textarea id="flwp-opt-desc-text" class="flwp-form-textarea" placeholder="<?php esc_html_e('admin.builder.fields.options.description.placeholder', 'flwp'); ?>"></textarea>
                    </div>

                    <!-- Placeholder parameter -->
                    <div class="flwp-form-group" id="flwp-opt-group-placeholder">
                        <label for="flwp-opt-placeholder"><?php esc_html_e('admin.builder.fields.options.placeholder.title', 'flwp'); ?></label>
                        <input type="text" id="flwp-opt-placeholder" class="flwp-form-input" placeholder="<?php esc_html_e('admin.builder.fields.options.placeholder.placeholder', 'flwp'); ?>" />
                    </div>

                    <!-- Button Type Picker -->
                    <div class="flwp-form-group" id="flwp-opt-group-button-type">
                        <label for="flwp-opt-button-type"><?php esc_html_e('admin.builder.fields.options.button_type.title', 'flwp'); ?></label>
                        <select id="flwp-opt-button-type" class="flwp-form-select">
                            <option value="next"><?php esc_html_e('admin.builder.fields.options.button_type.next', 'flwp'); ?></option>
                            <option value="submit"><?php esc_html_e('admin.builder.fields.options.button_type.submit', 'flwp'); ?></option>
                            <option value="back"><?php esc_html_e('admin.builder.fields.options.button_type.back', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Button Icon Picker -->
                    <div class="flwp-form-group" id="flwp-opt-group-icon">
                        <label for="flwp-opt-icon"><?php esc_html_e('admin.builder.fields.options.icon.title', 'flwp'); ?> <i class="far fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.fields.options.icon.hint', 'flwp'); ?>"></i></label>
                        <select id="flwp-opt-icon" class="flwp-form-select">
                            <option value="fa-arrow-right"><?php esc_html_e('admin.builder.fields.options.icon.option.arrow_right', 'flwp'); ?></option>
                            <option value="fa-arrow-circle-right"><?php esc_html_e('admin.builder.fields.options.icon.option.arrow_circle_right', 'flwp'); ?></option>
                            <option value="fa-arrow-left"><?php esc_html_e('admin.builder.fields.options.icon.option.arrow_left', 'flwp'); ?></option>
                            <option value="fa-arrow-circle-left"><?php esc_html_e('admin.builder.fields.options.icon.option.arrow_circle_left', 'flwp'); ?></option>
                            <option value="fa-paper-plane"><?php esc_html_e('admin.builder.fields.options.icon.option.paper_plane', 'flwp'); ?></option>
                            <option value="fa-check"><?php esc_html_e('admin.builder.fields.options.icon.option.check', 'flwp'); ?></option>
                            <option value="fa-heart"><?php esc_html_e('admin.builder.fields.options.icon.option.heart', 'flwp'); ?></option>
                            <option value="fa-comment"><?php esc_html_e('admin.builder.fields.options.icon.option.comment', 'flwp'); ?></option>
                            <option value="fa-laugh-beam"><?php esc_html_e('admin.builder.fields.options.icon.option.laugh_beam', 'flwp'); ?></option>
                            <option value="fa-futbol"><?php esc_html_e('admin.builder.fields.options.icon.option.futbol', 'flwp'); ?></option>
                            <option value="fa-lightbulb"><?php esc_html_e('admin.builder.fields.options.icon.option.lightbulb', 'flwp'); ?></option>
                            <option value="fa-bug"><?php esc_html_e('admin.builder.fields.options.icon.option.bug', 'flwp'); ?></option>
                            <option value="fa-comment-dots"><?php esc_html_e('admin.builder.fields.options.icon.option.comment_dots', 'flwp'); ?></option>
                            <option value="fa-times"><?php esc_html_e('admin.builder.fields.options.icon.option.none', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Button Icon Position -->
                    <div class="flwp-form-group" id="flwp-opt-group-icon-position">
                        <label for="flwp-opt-icon-position"><?php esc_html_e('admin.builder.fields.options.icon_position.title', 'flwp'); ?></label>
                        <select id="flwp-opt-icon-position" class="flwp-form-select">
                            <option value="right"><?php esc_html_e('admin.builder.fields.options.icon_position.right', 'flwp'); ?></option>
                            <option value="left"><?php esc_html_e('admin.builder.fields.options.icon_position.left', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Rating Stars Amount -->
                    <div class="flwp-form-group" id="flwp-opt-group-rating-stars">
                        <label for="flwp-opt-rating-stars"><?php esc_html_e('admin.builder.fields.options.rating_stars.title', 'flwp'); ?> <i class="fas fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.fields.options.rating_stars.hint', 'flwp'); ?>"></i></label>
                        <select id="flwp-opt-rating-stars" class="flwp-form-select">
                            <option value="3"><?php esc_html_e('admin.builder.fields.options.rating_stars.3', 'flwp'); ?></option>
                            <option value="5"><?php esc_html_e('admin.builder.fields.options.rating_stars.5', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Alignment Selection (Ausrichtung) -->
                    <div class="flwp-form-group" id="flwp-opt-group-alignment">
                        <label for="flwp-opt-alignment"><?php esc_html_e('admin.builder.fields.options.alignment.title', 'flwp'); ?> <i class="fas fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.fields.options.alignment.hint', 'flwp'); ?>"></i></label>
                        <select id="flwp-opt-alignment" class="flwp-form-select">
                            <option value="left"><?php esc_html_e('admin.builder.fields.options.alignment.left', 'flwp'); ?></option>
                            <option value="center"><?php esc_html_e('admin.builder.fields.options.alignment.center', 'flwp'); ?></option>
                            <option value="right"><?php esc_html_e('admin.builder.fields.options.alignment.right', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Heading Tag Type Selection -->
                    <div class="flwp-form-group" id="flwp-opt-group-h-type" style="display: none;">
                        <label for="flwp-opt-h-type"><?php esc_html_e('admin.builder.fields.h_type.title', 'flwp'); ?> <i class="fas fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.fields.h_type.hint', 'flwp'); ?>"></i></label>
                        <select id="flwp-opt-h-type" class="flwp-form-select">
                            <option value="h1"><?php esc_html_e('admin.builder.fields.h_type.h1', 'flwp'); ?></option>
                            <option value="h2"><?php esc_html_e('admin.builder.fields.h_type.h2', 'flwp'); ?></option>
                            <option value="h3"><?php esc_html_e('admin.builder.fields.h_type.h3', 'flwp'); ?></option>
                            <option value="h4"><?php esc_html_e('admin.builder.fields.h_type.h4', 'flwp'); ?></option>
                            <option value="h5"><?php esc_html_e('admin.builder.fields.h_type.h5', 'flwp'); ?></option>
                            <option value="h6"><?php esc_html_e('admin.builder.fields.h_type.h6', 'flwp'); ?></option>
                            <option value="div"><?php esc_html_e('admin.builder.fields.h_type.div', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Text formatting settings -->
                    <div class="flwp-form-group" id="flwp-opt-group-textFormatting" style="display: none;">
                        <label><?php esc_html_e('admin.builder.fields.text_formatting.title', 'flwp'); ?> <i class="fas fa-question-circle flwp-help-tip" title="<?php esc_html_e('admin.builder.fields.text_formatting.hint', 'flwp'); ?>"></i></label>
                        <div style="display: flex; gap: 8px; width: 100%;">
                            <!-- Bold -->
                            <label class="flwp-formatting-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; height: 32px;">
                                <input type="checkbox" id="flwp-opt-bold" style="display: none;" />
                                <i class="fas fa-bold"></i>
                            </label>
                            <!-- Italic -->
                            <label class="flwp-formatting-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; height: 32px;">
                                <input type="checkbox" id="flwp-opt-italic" style="display: none;" />
                                <i class="fas fa-italic"></i>
                            </label>
                            <!-- Underline -->
                            <label class="flwp-formatting-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; height: 32px;">
                                <input type="checkbox" id="flwp-opt-underline" style="display: none;" />
                                <i class="fas fa-underline"></i>
                            </label>
                        </div>
                    </div>

                    <!-- Inline styles (Font size) -->
                    <div class="flwp-form-group" id="flwp-opt-group-font-size">
                        <div>
                            <input type="hidden" id="flwp-opt-font-size" value="inherit" />
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
                                <span style="font-size: 13px; font-weight: 550; color: var(--flwp-text-main); white-space: nowrap;"><?php esc_html_e('admin.builder.fields.font_size.title', 'flwp'); ?></span>
                                <button type="button" id="flwp-opt-font-size-reset" class="flwp-btn" style="font-size: 10px; padding: 2px 4px; height: auto; background: none; border: none; color: var(--flwp-primary); cursor: pointer; text-decoration: underline; box-shadow: none;"><?php esc_html_e('admin.builder.fields.font_size.reset', 'flwp'); ?></button>
                            </div>

                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%;">
                                <input type="range" id="flwp-opt-font-size-slider" min="6" max="48" step="1" value="14" class="flwp-range-input" style="flex-grow: 1; margin: 0; min-width: 0;" />
                                <div style="display: inline-flex; align-items: center; border: 1px solid var(--flwp-border); border-radius: 6px; padding: 4px 8px; background: #ffffff; width: 68px; min-width: 68px; justify-content: space-between; height: 28px; box-sizing: border-box;">
                                    <input type="number" id="flwp-opt-font-size-input" min="6" max="48" value="14" style="width: 32px; border: none; font-size: 13px; text-align: right; padding: 0; outline: none; background: transparent; -webkit-appearance: none; -moz-appearance: textfield; margin: 0; font-family: inherit; font-weight: 600; color: var(--flwp-text-main);" />
                                    <span style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-left: 2px; pointer-events: none; user-select: none;">px</span>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 14px;">
                            <input type="hidden" id="flwp-opt-line-height" value="inherit" />
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
                                <span style="font-size: 13px; font-weight: 550; color: var(--flwp-text-main); white-space: nowrap;"><?php esc_html_e('admin.builder.fields.line_height.title', 'flwp'); ?></span>
                                <button type="button" id="flwp-opt-line-height-reset" class="flwp-btn" style="font-size: 10px; padding: 2px 4px; height: auto; background: none; border: none; color: var(--flwp-primary); cursor: pointer; text-decoration: underline; box-shadow: none;"><?php esc_html_e('admin.builder.fields.line_height.reset', 'flwp'); ?></button>
                            </div>

                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%;">
                                <input type="range" id="flwp-opt-line-height-slider" min="0.8" max="3.0" step="0.1" value="1.4" class="flwp-range-input" style="flex-grow: 1; margin: 0; min-width: 0;" />
                                <div style="display: inline-flex; align-items: center; border: 1px solid var(--flwp-border); border-radius: 6px; padding: 4px 8px; background: #ffffff; width: 68px; min-width: 68px; justify-content: space-between; height: 28px; box-sizing: border-box;">
                                    <input type="number" id="flwp-opt-line-height-input" min="0.8" max="3.0" step="0.1" value="1.4" style="width: 32px; border: none; font-size: 13px; text-align: right; padding: 0; outline: none; background: transparent; -webkit-appearance: none; -moz-appearance: textfield; margin: 0; font-family: inherit; font-weight: 600; color: var(--flwp-text-main);" />
                                    <span style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-left: 2px; pointer-events: none; user-select: none;"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Option: BorderRadius (Eckenradius) -->
                    <div class="flwp-form-group" id="flwp-opt-group-border-radius" style="display: none;">
                        <div>
                            <input type="hidden" id="flwp-opt-border-radius" value="inherit" />
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
                                <span style="font-size: 13px; font-weight: 550; color: var(--flwp-text-main); white-space: nowrap;"><?php esc_html_e('admin.builder.fields.border_radius.title', 'flwp'); ?></span>
                                <button type="button" id="flwp-opt-border-radius-reset" class="flwp-btn" style="font-size: 10px; padding: 2px 4px; height: auto; background: none; border: none; color: var(--flwp-primary); cursor: pointer; text-decoration: underline; box-shadow: none;"><?php esc_html_e('admin.builder.fields.border_radius.reset', 'flwp'); ?></button>
                            </div>

                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%;">
                                <input type="range" id="flwp-opt-border-radius-slider" min="0" max="100" step="1" value="6" class="flwp-range-input" style="flex-grow: 1; margin: 0; min-width: 0;" />
                                <div style="display: inline-flex; align-items: center; border: 1px solid var(--flwp-border); border-radius: 6px; padding: 4px 8px; background: #ffffff; width: 68px; min-width: 68px; justify-content: space-between; height: 28px; box-sizing: border-box;">
                                    <input type="number" id="flwp-opt-border-radius-input" min="0" max="100" value="6" style="width: 32px; border: none; font-size: 13px; text-align: right; padding: 0; outline: none; background: transparent; -webkit-appearance: none; -moz-appearance: textfield; margin: 0; font-family: inherit; font-weight: 600; color: var(--flwp-text-main);" />
                                    <span style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-left: 2px; pointer-events: none; user-select: none;">px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Option: Textfarbe -->
                    <div class="flwp-form-group" id="flwp-opt-group-textColor" style="display: none; margin-bottom: 14px;">
                        <label for="flwp-opt-text-color" style="display: flex; align-items: center; gap: 6px; font-weight: 550; font-size: 11.5px; color: var(--flwp-text-main); margin-bottom: 4px;">
                            <i class="fas fa-paint-brush" style="color: var(--flwp-text-secondary); font-size: 11px;"></i> <?php esc_html_e('admin.builder.fields.text_color.title', 'flwp'); ?>
                        </label>
                        <div style="display: flex; gap: 6px; align-items: center;">
                            <input type="color" id="flwp-opt-text-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                            <input type="text" id="flwp-opt-text-color-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" placeholder="#222222" />
                        </div>
                    </div>

                    <!-- Validation: Required status -->
                    <div class="flwp-switch-group" id="flwp-opt-group-required">
                        <span class="flwp-switch-label"><i class="fas fa-exclamation-triangle" style="color: var(--flwp-warning); font-size: 11px;"></i> <?php esc_html_e('admin.builder.fields.required.title', 'flwp'); ?></span>
                        <label class="flwp-switch-wrapper" for="flwp-opt-required">
                            <input type="checkbox" id="flwp-opt-required" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <!-- Option: Hide Label -->
                    <div class="flwp-switch-group" id="flwp-opt-group-hide-label" style="display: none;">
                        <span class="flwp-switch-label"><i class="fas fa-eye-slash" style="color: var(--flwp-text-secondary); font-size: 11px;"></i> <?php esc_html_e('admin.builder.fields.hide_label.title', 'flwp'); ?></span>
                        <label class="flwp-switch-wrapper" for="flwp-opt-hide-label">
                            <input type="checkbox" id="flwp-opt-hide-label" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <!-- Option: Full Width -->
                    <div class="flwp-switch-group" id="flwp-opt-group-full-width">
                        <span class="flwp-switch-label"><i class="fas fa-arrows-alt-h" style="color: var(--flwp-text-secondary); font-size: 11px;"></i> <?php esc_html_e('admin.builder.fields.full_width.title', 'flwp'); ?></span>
                        <label class="flwp-switch-wrapper" for="flwp-opt-full-width">
                            <input type="checkbox" id="flwp-opt-full-width" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <!-- Option: Element-Breite -->
                    <div class="flwp-form-group" id="flwp-opt-group-width" style="display: none;">
                        <label for="flwp-opt-width" style="display: flex; align-items: center; gap: 6px; font-weight: 550; font-size: 11.5px; color: var(--flwp-text-main); margin-bottom: 4px;">
                            <i class="fas fa-arrows-alt-h" style="color: var(--flwp-text-secondary); font-size: 11px;"></i> <?php esc_html_e('admin.builder.fields.width.title', 'flwp'); ?>
                        </label>
                        <select id="flwp-opt-width" class="flwp-form-select">
                            <option value="100%"><?php esc_html_e('admin.builder.fields.width.100', 'flwp'); ?></option>
                            <option value="50%"><?php esc_html_e('admin.builder.fields.width.50', 'flwp'); ?></option>
                            <option value="33%"><?php esc_html_e('admin.builder.fields.width.33', 'flwp'); ?></option>
                            <option value="25%"><?php esc_html_e('admin.builder.fields.width.25', 'flwp'); ?></option>
                        </select>
                    </div>

                    <!-- Option: In neuer Zeile starten -->
                    <div class="flwp-switch-group" id="flwp-opt-group-clear-before" style="display: none;">
                        <span class="flwp-switch-label"><i class="fas fa-level-down-alt" style="color: var(--flwp-text-secondary); font-size: 11px; transform: rotate(90deg);"></i> <?php esc_html_e('admin.builder.fields.clear_before.title', 'flwp'); ?></span>
                        <label class="flwp-switch-wrapper" for="flwp-opt-clear-before">
                            <input type="checkbox" id="flwp-opt-clear-before" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <!-- Smiley Legend Switch -->
                    <div class="flwp-switch-group" id="flwp-opt-group-smiley-legend">
                        <span class="flwp-switch-label"><i class="fas fa-comment-dots" style="color: var(--flwp-primary); font-size: 11px;"></i> <?php esc_html_e('admin.builder.fields.smiley_legend.title', 'flwp'); ?></span>
                        <label class="flwp-switch-wrapper" for="flwp-opt-smiley-legend">
                            <input type="checkbox" id="flwp-opt-smiley-legend" />
                            <span class="flwp-switch-slider"></span>
                        </label>
                    </div>

                    <!-- Button Custom Color Settings -->
                    <div id="flwp-opt-group-button-colors" style="border-top: 1px dashed var(--flwp-border); padding-top: 14px; margin-top: 14px; display: none; flex-direction: column; gap: 12px;">
                        <div id="flwp-opt-custom-colors-title" style="font-weight: 650; font-size: 11.5px; color: var(--flwp-text-primary); margin-bottom: 2px;">
                            <i class="fas fa-palette" style="color: var(--flwp-primary);"></i> <?php esc_html_e('admin.builder.fields.custom_colors.title', 'flwp'); ?>
                        </div>

                        <!-- Toggle to override colors -->
                        <div class="flwp-switch-group" style="margin-bottom: 6px;">
                            <span class="flwp-switch-label" style="font-size: 11px;"><?php esc_html_e('admin.builder.fields.custom_colors.enabled_label', 'flwp'); ?></span>
                            <label class="flwp-switch-wrapper" for="flwp-opt-btn-custom-colors-enabled">
                                <input type="checkbox" id="flwp-opt-btn-custom-colors-enabled" />
                                <span class="flwp-switch-slider"></span>
                            </label>
                        </div>

                        <div id="flwp-opt-btn-colors-subpanel" style="display: none; flex-direction: column; gap: 10px; padding-left: 6px; border-left: 2px solid var(--flwp-border);">
                            <!-- Standard state colors -->
                            <div id="flwp-opt-colors-standard-header" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--flwp-text-secondary);"><?php esc_html_e('admin.builder.fields.custom_colors.standard_state', 'flwp'); ?></div>

                            <div class="flwp-form-group" id="flwp-opt-colors-group-bg" style="margin-bottom: 4px;">
                                <label style="font-size: 10.5px;"><?php esc_html_e('admin.builder.fields.custom_colors.bg_color', 'flwp'); ?></label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <input type="color" id="flwp-opt-btn-bg-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                                    <input type="text" id="flwp-opt-btn-bg-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" />
                                </div>
                            </div>

                            <div class="flwp-form-group" id="flwp-opt-colors-group-text" style="margin-bottom: 4px;">
                                <label style="font-size: 10.5px;"><?php esc_html_e('admin.builder.fields.custom_colors.text_color', 'flwp'); ?></label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <input type="color" id="flwp-opt-btn-text-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                                    <input type="text" id="flwp-opt-btn-text-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" />
                                </div>
                            </div>

                            <div class="flwp-form-group" id="flwp-opt-colors-group-border" style="margin-bottom: 8px;">
                                <label style="font-size: 10.5px;"><?php esc_html_e('admin.builder.fields.custom_colors.border_color', 'flwp'); ?></label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <input type="color" id="flwp-opt-btn-border-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                                    <input type="text" id="flwp-opt-btn-border-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" />
                                </div>
                            </div>

                            <!-- Hover state colors -->
                            <div id="flwp-opt-colors-hover-header" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--flwp-text-secondary); margin-top: 4px; border-top: 1px dashed var(--flwp-border); padding-top: 8px;"><?php esc_html_e('admin.builder.fields.custom_colors.hover_state', 'flwp'); ?></div>

                            <div class="flwp-form-group" id="flwp-opt-colors-group-hover-bg" style="margin-bottom: 4px;">
                                <label style="font-size: 10.5px;"><?php esc_html_e('admin.builder.fields.custom_colors.bg_color_hover', 'flwp'); ?></label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <input type="color" id="flwp-opt-btn-hover-bg-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                                    <input type="text" id="flwp-opt-btn-hover-bg-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" />
                                </div>
                            </div>

                            <div class="flwp-form-group" id="flwp-opt-colors-group-hover-text" style="margin-bottom: 4px;">
                                <label style="font-size: 10.5px;"><?php esc_html_e('admin.builder.fields.custom_colors.text_color_hover', 'flwp'); ?></label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <input type="color" id="flwp-opt-btn-hover-text-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                                    <input type="text" id="flwp-opt-btn-hover-text-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" />
                                </div>
                            </div>

                            <div class="flwp-form-group" id="flwp-opt-colors-group-hover-border" style="margin-bottom: 4px;">
                                <label style="font-size: 10.5px;"><?php esc_html_e('admin.builder.fields.custom_colors.border_color_hover', 'flwp'); ?></label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <input type="color" id="flwp-opt-btn-hover-border-color" style="width: 44px; height: 32px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid var(--flwp-border);" />
                                    <input type="text" id="flwp-opt-btn-hover-border-hex" class="flwp-form-input" style="font-family: var(--flwp-font-mono); font-size: 11px; height: 32px; padding: 4px 8px;" />
                                </div>
                            </div>

                            <button type="button" id="flwp-opt-btn-colors-reset" class="flwp-btn" style="margin-top: 10px; width: 100%; font-size: 11px; padding: 6px 12px; height: auto; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid var(--flwp-border); background: #ffffff; color: var(--flwp-text-primary); border-radius: 4px; cursor: pointer; transition: all 0.2s; box-shadow: none;">
                                <i class="fas fa-undo"></i> <?php esc_html_e('admin.builder.fields.custom_colors.reset', 'flwp'); ?>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2 Trigger Toggle for Buttons & Ratings -->
                    <div id="flwp-opt-group-step2" style="border-top: 1px dashed var(--flwp-border); padding-top: 14px; margin-top: 4px; flex-direction: column;">
                        <div class="flwp-switch-group">
              <span class="flwp-switch-label" style="color: var(--flwp-step2-accent); font-weight: 650;">
                <i class="fas fa-project-diagram"></i> <?php esc_html_e('admin.builder.fields.step2.title_activate', 'flwp'); ?>
              </span>
                            <label class="flwp-switch-wrapper" for="flwp-opt-step2-enabled">
                                <input type="checkbox" id="flwp-opt-step2-enabled" />
                                <span class="flwp-switch-slider"></span>
                            </label>
                        </div>
                        <p style="font-size: 10.5px; color: var(--flwp-text-secondary); line-height: 1.35; margin-top: 6px;">
                            <?php esc_html_e('admin.builder.fields.step2.description', 'flwp'); ?>
                        </p>
                    </div>

                </div>

            </div>

        </div>

    </aside>

    <!-- Visual Editor Canvas Area -->
    <article class="flwp-editor-canvas-column" id="flwp-canvas-column">

        <div class="flwp-editor-steps-container">

            <!-- SCHRITT 1 CONTAINER CARD -->
            <div class="flwp-step-card flwp-step-card-step1" id="flwp-step-1-card">

                <div class="flwp-step-header" id="flwp-step-1-header">
                    <div class="flwp-step-meta-left">
                        <span class="flwp-step-index-badge flwp-step-badge-1">1</span>
                        <div>
                            <h3 class="flwp-step-title"><?php esc_html_e('admin.builder.fields.step1.title', 'flwp'); ?></h3>
                            <span class="flwp-step-subtitle" id="flwp-step-1-count"><?php esc_html_e('admin.builder.fields.step1.subtitle', 'flwp'); ?></span>
                        </div>
                    </div>
                    <div class="flwp-step-nav-action" id="flwp-step-1-nav-toggle" style="display: none;">
                        <i class="fas fa-compress-alt"></i> <?php esc_html_e('admin.builder.fields.nav.back', 'flwp'); ?>
                    </div>
                </div>

                <!-- Droppable Area -->
                <div class="flwp-step-canvas-droppable" id="flwp-canvas-step-1" data-step="1">

                    <div class="flwp-canvas-empty-notifier">
                        <i class="fas fa-hand-holding-hand drag-icon"></i>
                        <span><?php esc_html_e('admin.builder.fields.step1.empty_notifier', 'flwp'); ?></span>
                    </div>

                </div>

            </div>


            <!-- CONNECTOR CONNECTOR LINE (VISUAL ONLY) -->
            <div id="flwp-steps-visual-connector" style="display: flex; justify-content: center; align-items: center; margin: -10px 0;">
                <div style="width: 2px; height: 24px; background: repeating-linear-gradient(to bottom, #cbd5e1, #cbd5e1 4px, transparent 4px, transparent 8px); z-index: 1;"></div>
            </div>


            <!-- SCHRITT 2 CONTAINER CARD (Tied dynamically) -->
            <div class="flwp-step-card flwp-step-card-step2" id="flwp-step-2-card">

                <div class="flwp-step-header" id="flwp-step-2-header" style="cursor: pointer;">
                    <div class="flwp-step-meta-left">
                        <span class="flwp-step-index-badge flwp-step-badge-2">2</span>
                        <div>
                            <h3 class="flwp-step-title"><?php esc_html_e('admin.builder.fields.step2.title', 'flwp'); ?></h3>
                            <span class="flwp-step-subtitle" id="flwp-step-2-count"><?php esc_html_e('admin.builder.fields.step2.subtitle', 'flwp'); ?></span>
                        </div>
                    </div>
                    <div class="flwp-step-nav-action" id="flwp-step-2-nav-toggle">
                        <i class="fas fa-expand-alt"></i> <?php esc_html_e('admin.builder.fields.nav.maximize', 'flwp'); ?>
                    </div>
                </div>

                <!-- Droppable Area Step 2 -->
                <div class="flwp-step-canvas-droppable" id="flwp-canvas-step-2" data-step="2">

                    <div class="flwp-canvas-empty-notifier" id="flwp-step-2-disabled-notifier">
                        <i class="fas fa-lock"></i>
                        <span><?php esc_html_e('admin.builder.fields.step2.disabled_notifier', 'flwp'); ?></span>
                    </div>

                    <div class="flwp-canvas-empty-notifier" id="flwp-step-2-enabled-empty-notifier" style="display: none;">
                        <i class="fas fa-plus"></i>
                        <span><?php esc_html_e('admin.builder.fields.step2.enabled_notifier', 'flwp'); ?></span>
                    </div>

                </div>

            </div>

        </div>

    </article>

    <!-- Split-View Live-Vorschau Column (Initially collapsed or shown per click) -->
    <aside class="flwp-split-preview-column flwp-feedback-plugin" id="flwp-split-preview-column" style="display: none;">
	    <!-- RIGHT COLUMN: LIVE INTERACTIVE SIMULATOR -->
	    <div id="flwp-preview-simulator-container-fields" class="flwp-preview-simulator-container"></div>
    </aside>

</section>
