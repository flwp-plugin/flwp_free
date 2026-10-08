/**
 * Component: FormBuilder Template Display Settings Redesign
 * Handles card selection, trigger segmented control, global settings tabs,
 * box model linkage, color controls, live interactive simulator, and state synchronization.
 */

import {PreviewEngine} from './flwp-form-builder-preview-engine.js';

import { __ } from './flwp-i18n.js';

// Display Type & Subtype visibility configuration
const DISPLAY_TYPE_CONFIG = {
    "in-content": {
        showIncontentSubOptions: true,
        showTriggersSection: false,
        showTriggerSegmentedControl: false,
        showClickSelector: false,
        showClickUseStandardToggle: false,
        showStandardFeedbackBtnOptions: false,
        showRowCloseDays: false,
        showRowSubmitDays: true,
        showRowCookieScope: true,
        showGroupClosingOptions: false,
        showGroupPadding: true,
        showGroupMargin: true,
        showGroupDimensions: true,
        showRowOverlayPosition: false,
        showRowMinHeight: true,
        showGroupCustomColors: true,
        showGroupHeaderFooter: false,
    },
    "overlay:modal": {
        showIncontentSubOptions: false,
        showTriggersSection: true,
        showTriggerSegmentedControl: true,
        showClickSelector: true,
        showClickUseStandardToggle: false,
        showStandardFeedbackBtnOptions: false,
        showRowCloseDays: true,
        showRowSubmitDays: true,
        showRowCookieScope: true,
        showGroupClosingOptions: true,
        showGroupPadding: false,
        showGroupMargin: false,
        showGroupDimensions: true,
        showRowOverlayPosition: true,
        showRowMinHeight: false,
        showGroupCustomColors: false,
        showGroupHeaderFooter: true,
    },
    "overlay:slide-in": {
        showIncontentSubOptions: false,
        showTriggersSection: true,
        showTriggerSegmentedControl: true,
        showClickSelector: true,
        showClickUseStandardToggle: false,
        showStandardFeedbackBtnOptions: false,
        showRowCloseDays: true,
        showRowSubmitDays: true,
        showRowCookieScope: true,
        showGroupClosingOptions: true,
        showGroupPadding: false,
        showGroupMargin: false,
        showGroupDimensions: true,
        showRowOverlayPosition: true,
        showRowMinHeight: false,
        showGroupCustomColors: false,
        showGroupHeaderFooter: true,
    },
    "overlay:feedback-button": {
        showIncontentSubOptions: false,
        showTriggersSection: false,
        showFeedbackButtonSection: true,
        showTriggerSegmentedControl: false,
        showClickSelector: false,
        showClickUseStandardToggle: false,
        showStandardFeedbackBtnOptions: true,
        showRowCloseDays: true,
        showRowSubmitDays: true,
        showRowCookieScope: true,
        showGroupClosingOptions: true,
        showGroupPadding: false,
        showGroupMargin: false,
        showGroupDimensions: true,
        showRowOverlayPosition: true,
        showRowMinHeight: false,
        showGroupCustomColors: false,
        showGroupHeaderFooter: true,
    }
};

export function initFormBuilderTemplateDisplay(ctx = {}) {
    const { state, engine, utils, api, controller } = ctx;

    if (!state) {
        console.warn("initFormBuilderTemplateDisplay: missing state context");
        return;
    }

    // --- DOM Elements - Left Settings Column ---

    const typeCards = document.querySelectorAll(".flwp-form-builder-template-display-type-card");
    const triggerSection = document.getElementById("flwp-display-section-triggers");
    const feedbackButtonSection = document.getElementById("flwp-display-section-feedback-button");
    const incontentSubOptions = document.getElementById("flwp-incontent-sub-options");
    const legacyDisplayTypeSelect = document.getElementById("flwp-style-display-type");
    const triggerSegmentBtns = document.querySelectorAll(".flwp-form-builder-template-display-segment-btn");
    const legacyTriggerSelect = document.getElementById("flwp-style-overlay-trigger");
    const globalTabBtns = document.querySelectorAll(".flwp-form-builder-template-display-tab-btn");

    // Options & Inputs
    const headerIndicatorSelect = document.getElementById("flwp-style-overlay-header-indicator");
    const customColorsToggle = document.getElementById("flwp-opt-globaldata-custom-enabled");
    const colorsSubpanel = document.getElementById("flwp-opt-globaldata-colors-subpanel");
    const bgColorInput = document.getElementById("flwp-opt-globaldata-bg");
    const bgHexInput = document.getElementById("flwp-opt-globaldata-bg-hex");
    const borderColorInput = document.getElementById("flwp-opt-globaldata-border");
    const borderHexInput = document.getElementById("flwp-opt-globaldata-border-hex");
    const borderStyleInput = document.getElementById("flwp-opt-globaldata-border-style");
    const borderWidthInput = document.getElementById("flwp-opt-globaldata-border-width");
    const borderRadiusInput = document.getElementById("flwp-opt-globaldata-border-radius");
    const showBackdropToggle = document.getElementById("flwp-style-overlay-rule-show-backdrop");
    const allowScrollToggle = document.getElementById("flwp-style-overlay-rule-allow-scroll");
    const hideHeaderToggle = document.getElementById("flwp-style-overlay-rule-hide-header");
    const hideFooterToggle = document.getElementById("flwp-style-overlay-rule-hide-footer");
    const closeOnBackdropToggle = document.getElementById("flwp-style-overlay-rule-backdrop");
    const closeOnEscToggle = document.getElementById("flwp-style-overlay-rule-esc");
    const maxWidthInput = document.getElementById("flwp-style-overlay-rule-width");
    const minHeightInput = document.getElementById("flwp-style-min-height");
    const overlayPositionSelect = document.getElementById("flwp-style-overlay-position");
    const headerTitleInput = document.getElementById("flwp-style-overlay-header-title");
    const headerTitleContainer = document.getElementById("flwp-style-overlay-header-title-container");
    const footerTextInput = document.getElementById("flwp-style-overlay-footer-text");
    const ruleCloseDaysInput = document.getElementById("flwp-style-overlay-rule-close-days");
    const ruleSubmitDaysInput = document.getElementById("flwp-style-overlay-rule-submit-days");
    const ruleCookieScopeSelect = document.getElementById("flwp-style-overlay-rule-cookie-scope");
    const clickSelectorInput = document.getElementById("flwp-style-overlay-click-selector");
    const exitIntentDelaySelect = document.getElementById("flwp-style-exit-intent-delay");
    const delaySecondsInput = document.getElementById("flwp-style-overlay-delay-seconds");
    const scrollTypeSelect = document.getElementById("flwp-style-overlay-scroll-type");
    const scrollPercentInput = document.getElementById("flwp-style-overlay-scroll-percent");
    const scrollPercentContainer = document.getElementById("flwp-overlay-scroll-percent-container");
    const inContentAutoEnabledToggle = document.getElementById("flwp-style-display-in-content");
    const inContentAutoPositionSelect = document.getElementById("flwp-style-in-content-position");
    const inContentAutoPositionGroup = document.getElementById("flwp-in-content-auto-position-group");

    // --- DOM Elements - Right Simulator Panel ---
    const stageWrapper = document.getElementById("flwp-preview-simulator-container");
    const incontentSlot = document.getElementById("flwp-display-incontent-slot");

    // Helper to safely trigger preview update
    const requestUpdate = () => {
        if (api && typeof api.saveStateToLocalStorage === 'function') {
            api.saveStateToLocalStorage();
        }
        if (engine && typeof engine.updateDisplayTypeUI === 'function') {
            engine.updateDisplayTypeUI();
        }
    };

    // --- 1. Type Card Selection ---
    typeCards.forEach(card => {
        card.addEventListener("click", () => {
            const type = card.getAttribute("data-type");
            const subtype = card.getAttribute("data-subtype");

            // Update state
            state.settings.display.displayType = type;
            state.settings.display.displaySubType = subtype;

            // Sync legacy input if present
            if (legacyDisplayTypeSelect) {
                legacyDisplayTypeSelect.value = type;
            }

            syncTypeCardsUI();
            requestUpdate();
            controller.syncTargetingStateToUI();
        });
    });

    function syncTypeCardsUI() {
        const currentType = state.settings.display.displayType || "in-content";
        const currentSubtype = state.settings.display.displaySubType || (currentType === "in-content" ? "shortcode" : "modal");

        typeCards.forEach(card => {
            const cardType = card.getAttribute("data-type");
            const cardSubtype = card.getAttribute("data-subtype");

            const isActive = cardType === currentType && cardSubtype === currentSubtype;
            card.classList.toggle("active", isActive);
        });

        applyDisplayTypeConfigUI();
    }

    function applyDisplayTypeConfigUI() {
        const currentType = state.settings.display.displayType || "in-content";
        const currentSubtype = (state.settings && state.settings.display && state.settings.display.displaySubType) || (currentType === "in-content" ? "shortcode" : "modal");
        const configKey = currentType === "in-content" ? "in-content" : `${currentType}:${currentSubtype}`;

        const cfg = DISPLAY_TYPE_CONFIG[configKey] || DISPLAY_TYPE_CONFIG["in-content"];

        // Section 1: In-Content Sub Options
        if (incontentSubOptions) {
            incontentSubOptions.style.display = cfg.showIncontentSubOptions ? "block" : "none";
        }

        // Section 2: Triggers Section
        if (triggerSection) {
            triggerSection.style.display = cfg.showTriggersSection ? "block" : "none";
        }

        if (feedbackButtonSection) {
            feedbackButtonSection.style.display = cfg.showFeedbackButtonSection ? "block" : "none";
        }

        const triggerSegmented = document.getElementById("flwp-display-trigger-segmented-control");
        if (triggerSegmented) {
            triggerSegmented.style.display = cfg.showTriggerSegmentedControl ? "flex" : "none";
        }

        const clickSelectorGroup = document.getElementById("flwp-overlay-click-selector-group");
        if (clickSelectorGroup) {
            clickSelectorGroup.style.display = cfg.showClickSelector ? "flex" : "none";
        }

        const clickUseStandardToggleGroup = document.getElementById("flwp-overlay-click-use-standard-toggle-group");
        if (clickUseStandardToggleGroup) {
            clickUseStandardToggleGroup.style.display = cfg.showClickUseStandardToggle ? "flex" : "none";
        }

        const standardFeedbackBtnGroup = document.getElementById("flwp-overlay-click-standard-btn-group");
        if (standardFeedbackBtnGroup) {
            standardFeedbackBtnGroup.style.display = cfg.showStandardFeedbackBtnOptions ? "flex" : "none";
        }

        // Ensure click panel is shown for feedback-button
        if (currentSubtype === "feedback-button") {
            const clickPanel = document.getElementById("flwp-overlay-trigger-panel-click");
            if (clickPanel) clickPanel.style.display = "flex";
        }

        // Section 3: Verhalten & Frequenz
        const rowCloseDays = document.getElementById("flwp-display-row-close-days");
        if (rowCloseDays) {
            rowCloseDays.style.display = cfg.showRowCloseDays ? "flex" : "none";
        }

        const rowSubmitDays = document.getElementById("flwp-display-row-submit-days");
        if (rowSubmitDays) {
            rowSubmitDays.style.display = cfg.showRowSubmitDays ? "flex" : "none";
        }

        const rowCookieScope = document.getElementById("flwp-display-row-cookie-scope");
        if (rowCookieScope) {
            rowCookieScope.style.display = cfg.showRowCookieScope ? "block" : "none";
        }

        const groupClosingOptions = document.getElementById("flwp-display-group-closing-options");
        if (groupClosingOptions) {
            groupClosingOptions.style.display = cfg.showGroupClosingOptions ? "block" : "none";
        }

        // Section 3: Abstände & Maße (Box Model)
        const groupPadding = document.getElementById("flwp-display-group-padding");
        if (groupPadding) {
            groupPadding.style.display = cfg.showGroupPadding ? "block" : "none";
        }

        const groupMargin = document.getElementById("flwp-display-group-margin");
        if (groupMargin) {
            groupMargin.style.display = cfg.showGroupMargin ? "block" : "none";
        }

        const groupDimensions = document.getElementById("flwp-display-group-dimensions");
        if (groupDimensions) {
            groupDimensions.style.display = cfg.showGroupDimensions ? "block" : "none";
            const titleEl = groupDimensions.querySelector(".flwp-form-builder-template-display-group-title");
            if (titleEl) {
                if (currentType === "in-content") {
                    titleEl.innerHTML = '<i class="fas fa-ruler-combined"></i> ' + __('admin.display.group_title_in_content');
                } else {
                    titleEl.innerHTML = '<i class="fas fa-arrows-alt"></i> ' + __('admin.display.group_title_default');
                }
            }
        }

        const rowOverlayPosition = document.getElementById("flwp-display-row-overlay-position");
        if (rowOverlayPosition) {
            rowOverlayPosition.style.display = cfg.showRowOverlayPosition ? "block" : "none";
        }

        const rowMinHeight = document.getElementById("flwp-display-row-min-height");
        if (rowMinHeight) {
            rowMinHeight.style.display = cfg.showRowMinHeight ? "flex" : "none";
        }

        const boxModelTabBtn = document.querySelector('.flwp-form-builder-template-display-tab-btn[data-global-tab="box-model"]');
        if (boxModelTabBtn) {
            if (currentType === "in-content") {
                boxModelTabBtn.innerHTML = '<i class="fas fa-expand"></i> ' + __('admin.display.tab_btn_in_content');
            } else {
                boxModelTabBtn.innerHTML = '<i class="fas fa-arrows-alt"></i> ' + __('admin.display.tab_btn_default');
            }
        }

        // Section 3: Design & Farben
        const groupCustomColors = document.getElementById("flwp-display-group-custom-colors");
        if (groupCustomColors) {
            groupCustomColors.style.display = cfg.showGroupCustomColors ? "block" : "none";
        }

        const groupHeaderFooter = document.getElementById("flwp-display-group-header-footer");
        if (groupHeaderFooter) {
            groupHeaderFooter.style.display = cfg.showGroupHeaderFooter ? "block" : "none";
        }

        updateStepNumbering();
    }

    function updateStepNumbering() {
        const sections = document.querySelectorAll(".flwp-form-builder-template-display-section");
        let visibleStepCount = 0;

        sections.forEach(section => {
            if (window.getComputedStyle(section).display !== "none") {
                visibleStepCount++;

                // Update Badge text
                const badge = section.querySelector(".flwp-form-builder-template-display-badge");
                if (badge) {
                    badge.textContent = __('admin.display.step_label', { step: visibleStepCount });
                }

                // Update Title prefix (e.g. "1. Hauptanzeigetyp wählen")
                const title = section.querySelector(".flwp-form-builder-template-display-section-title");
                if (title) {
                    const icon = title.querySelector("i");
                    const iconHTML = icon ? icon.outerHTML : "";

                    // Get text content without the number prefix
                    let textContent = title.textContent.trim();
                    const pureText = textContent.replace(/^\d+\.\s*/, "");

                    title.innerHTML = `${iconHTML} ${visibleStepCount}. ${pureText}`;
                }
            }
        });
    }

    // --- 2. Trigger Segmented Control ---
    triggerSegmentBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const trigger = btn.getAttribute("data-trigger");
            const currentSubType = state.settings.display.displaySubType || "shortcode";
            if (state.settings?.display?.subTypeData?.[currentSubType]) {
                state.settings.display.subTypeData[currentSubType].trigger = trigger;
            }

            if (legacyTriggerSelect) {
                legacyTriggerSelect.value = trigger;
                legacyTriggerSelect.dispatchEvent(new Event("change"));
            }

            syncTriggerSegmentUI();
            requestUpdate();
        });
    });

    function syncTriggerSegmentUI() {
        const currentType = state.settings.display.displayType || "in-content";
        const currentSubType = state.settings.display.displaySubType || "shortcode";
        const currentTrigger = (state.settings?.display?.subTypeData?.[currentSubType]?.trigger) || "click";

        triggerSegmentBtns.forEach(btn => {
            const btnTrigger = btn.getAttribute("data-trigger");
            btn.classList.toggle("active", btnTrigger === currentTrigger);
        });

        const triggerPanels = {
            click: document.getElementById("flwp-overlay-trigger-panel-click"),
            "exit-intent": document.getElementById("flwp-overlay-trigger-panel-exit-intent"),
            delay: document.getElementById("flwp-overlay-trigger-panel-delay"),
            scroll: document.getElementById("flwp-overlay-trigger-panel-scroll")
        };

        Object.entries(triggerPanels).forEach(([key, panel]) => {
            if (panel) {
                panel.style.display = key === currentTrigger ? "flex" : "none";
            }
        });

        // Toggle visibility of hide-click options in Global settings (only relevant for click trigger)
        const hideClickRowClose = document.getElementById("flwp-display-row-hide-click-on-close");
        const hideClickRowSubmit = document.getElementById("flwp-display-row-hide-click-on-submit");
        const showHideOptions = currentType === "overlay" && currentSubType !== 'feedback-button' && currentTrigger === "click";

        if (hideClickRowClose) hideClickRowClose.style.display = showHideOptions ? "block" : "none";
        if (hideClickRowSubmit) hideClickRowSubmit.style.display = showHideOptions ? "block" : "none";

        applyDisplayTypeConfigUI();
    }

    // --- 3. Global Settings Tabs ---
    globalTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-global-tab");

            globalTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".flwp-form-builder-template-display-tab-panel").forEach(panel => {
                panel.classList.remove("active");
            });

            const activePanel = document.getElementById(`flwp-display-global-tab-${targetTab}`);
            if (activePanel) {
                activePanel.classList.add("active");
            }
        });
    });

    // --- Helper to safely get feedbackButton state ---
    function getFeedbackButtonState() {
        if (!state.settings) state.settings = {};
        if (!state.settings.display) state.settings.display = {};
        if (!state.settings.display.subTypeData) state.settings.display.subTypeData = {};
        if (!state.settings.display.subTypeData['feedback-button']) {
            state.settings.display.subTypeData['feedback-button'] = {};
        }
        return state.settings.display.subTypeData['feedback-button'];
    }

    // --- Overlay Position Setup & Sync ---
    function setupOverlayPositionControl() {
        if (overlayPositionSelect) {
            overlayPositionSelect.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.spacing.position`, e.target.value);
                requestUpdate();
            });
        }
    }

    function syncOverlayPositionUI() {
        if (!overlayPositionSelect) return;
        const currentType = state.settings.display.displayType || "in-content";
        const currentSubtype = state.settings.display.displaySubType || (currentType === "in-content" ? "shortcode" : "modal");

        let defaultPos = "center";
        if (currentSubtype === "slide-in") defaultPos = "bottom-right";
        if (currentSubtype === "feedback-button") defaultPos = "right-middle";

        overlayPositionSelect.value = (() => {
            const subTypeData = state.settings?.display?.subTypeData?.[currentSubtype];
            if (!subTypeData) return defaultPos;

            return subTypeData.globalData?.spacing?.position || defaultPos;
        })();
    }

    // --- Feedback Button Controls Setup & Sync ---
    function setupFeedbackButtonControls() {
        const inputBtnText = document.getElementById("flwp-style-feedback-btn-text");
        const selectBtnPos = document.getElementById("flwp-style-feedback-btn-position");
        const checkHideOption = document.getElementById("flwp-style-feedback-hide-option-enabled");
        const checkCustomEnabled = document.getElementById("flwp-opt-feedback-btn-custom-enabled");
        const colorsSubpanel = document.getElementById("flwp-opt-feedback-btn-colors-subpanel");
        const inputFontSize = document.getElementById("flwp-opt-feedback-btn-font-size");
        const valFontSize = document.getElementById("flwp-opt-feedback-btn-font-size-val");

        if (inputBtnText) {
            inputBtnText.addEventListener("input", (e) => {
                getFeedbackButtonState().text = e.target.value;
                requestUpdate();
            });
        }

        if (selectBtnPos) {
            selectBtnPos.addEventListener("change", (e) => {
                getFeedbackButtonState().position = e.target.value;
                requestUpdate();
            });
        }

        if (checkHideOption) {
            checkHideOption.addEventListener("change", (e) => {
                getFeedbackButtonState().hideOptionEnabled = e.target.checked;
                requestUpdate();
            });
        }

        if (checkCustomEnabled) {
            checkCustomEnabled.addEventListener("change", (e) => {
                const isChecked = e.target.checked;
                getFeedbackButtonState().customStylesEnabled = isChecked;
                if (colorsSubpanel) colorsSubpanel.style.display = isChecked ? "flex" : "none";
                requestUpdate();
            });
        }

        if (inputFontSize) {
            inputFontSize.addEventListener("input", (e) => {
                const val = parseInt(e.target.value, 10) || 16;
                if (valFontSize) valFontSize.textContent = `${val}px`;
                getFeedbackButtonState().fontSize = val;
                requestUpdate();
            });
        }

        utils.registerColorPickerPair("flwp-opt-feedback-btn-bg", "flwp-opt-feedback-btn-bg-hex", (val) => {
            getFeedbackButtonState().bgColor = val;
            requestUpdate();
        });
        utils.registerColorPickerPair("flwp-opt-feedback-btn-text", "flwp-opt-feedback-btn-text-hex", (val) => {
            getFeedbackButtonState().textColor = val;
            requestUpdate();
        });
        utils.registerColorPickerPair("flwp-opt-feedback-btn-border", "flwp-opt-feedback-btn-border-hex", (val) => {
            getFeedbackButtonState().borderColor = val;
            requestUpdate();
        });
        utils.registerColorPickerPair("flwp-opt-feedback-btn-hover-bg", "flwp-opt-feedback-btn-hover-bg-hex", (val) => {
            getFeedbackButtonState().hoverBgColor = val;
            requestUpdate();
        });
        utils.registerColorPickerPair("flwp-opt-feedback-btn-hover-text", "flwp-opt-feedback-btn-hover-text-hex", (val) => {
            getFeedbackButtonState().hoverTextColor = val;
            requestUpdate();
        });
        utils.registerColorPickerPair("flwp-opt-feedback-btn-hover-border", "flwp-opt-feedback-btn-hover-border-hex", (val) => {
            getFeedbackButtonState().hoverBorderColor = val;
            requestUpdate();
        });
    }

    function syncFeedbackButtonUI() {
        const fb = getFeedbackButtonState();

        const inputBtnText = document.getElementById("flwp-style-feedback-btn-text");
        const selectBtnPos = document.getElementById("flwp-style-feedback-btn-position");
        const checkHideOption = document.getElementById("flwp-style-feedback-hide-option-enabled");
        const checkCustomEnabled = document.getElementById("flwp-opt-feedback-btn-custom-enabled");
        const colorsSubpanel = document.getElementById("flwp-opt-feedback-btn-colors-subpanel");
        const inputFontSize = document.getElementById("flwp-opt-feedback-btn-font-size");
        const valFontSize = document.getElementById("flwp-opt-feedback-btn-font-size-val");

        if (inputBtnText) inputBtnText.value = fb.text || "Feedback";
        if (selectBtnPos) selectBtnPos.value = fb.position || "right-middle";
        if (checkHideOption) checkHideOption.checked = !!fb.hideOptionEnabled;
        if (checkCustomEnabled) checkCustomEnabled.checked = !!fb.customStylesEnabled;
        if (colorsSubpanel) colorsSubpanel.style.display = fb.customStylesEnabled ? "flex" : "none";

        if (inputFontSize) inputFontSize.value = fb.fontSize || 16;
        if (valFontSize) valFontSize.textContent = `${fb.fontSize || 16}px`;

        utils.syncColorValue("flwp-opt-feedback-btn-bg", "flwp-opt-feedback-btn-bg-hex", fb.bgColor || "#104689");
        utils.syncColorValue("flwp-opt-feedback-btn-text", "flwp-opt-feedback-btn-text-hex", fb.textColor || "#ffffff");
        utils.syncColorValue("flwp-opt-feedback-btn-border", "flwp-opt-feedback-btn-border-hex", fb.borderColor || "#104689");
        utils.syncColorValue("flwp-opt-feedback-btn-hover-bg", "flwp-opt-feedback-btn-hover-bg-hex", fb.hoverBgColor || "#0a2e5c");
        utils.syncColorValue("flwp-opt-feedback-btn-hover-text", "flwp-opt-feedback-btn-hover-text-hex", fb.hoverTextColor || "#ffffff");
        utils.syncColorValue("flwp-opt-feedback-btn-hover-border", "flwp-opt-feedback-btn-hover-border-hex", fb.hoverBorderColor || "#0a2e5c");
    }

    // --- 5. Simulator Setup & Controls ---
    setupColorPickers();
    setupSimulatorControls();
    setupOverlayPositionControl();
    setupFeedbackButtonControls();
    setupOverlayBehaviorControls();

    // --- Overlay Behavior Rules Setup & Sync ---
    function setupOverlayBehaviorControls() {

        const showFooterToggle = document.getElementById("flwp-style-overlay-show-footer");
        if (showFooterToggle) {
            showFooterToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.showFooterText`, e.target.checked);
                requestUpdate();
            });
        }

        if (ruleCloseDaysInput) {
            ruleCloseDaysInput.addEventListener("input", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.cookieCloseDays`, parseInt(e.target.value) || 0);
                requestUpdate();
            });
        }

        if (ruleSubmitDaysInput) {
            ruleSubmitDaysInput.addEventListener("input", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.cookieSubmitDays`, parseInt(e.target.value) || 0);
                requestUpdate();
            });
        }

        if (ruleCookieScopeSelect) {
            ruleCookieScopeSelect.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.cookieScope`, e.target.value);
                requestUpdate();
            });
        }

        if (clickSelectorInput) {
            clickSelectorInput.addEventListener("input", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.click.selector`, e.target.value);
                requestUpdate();
            });
        }

        const hideClickOnCloseToggle = document.getElementById("flwp-style-overlay-rule-hide-click-on-close");
        if (hideClickOnCloseToggle) {
            hideClickOnCloseToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.click.hideOnClose`, e.target.checked);
                requestUpdate();
            });
        }

        const hideClickOnSubmitToggle = document.getElementById("flwp-style-overlay-rule-hide-click-on-submit");
        if (hideClickOnSubmitToggle) {
            hideClickOnSubmitToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.click.hideOnSubmit`, e.target.checked);
                requestUpdate();
            });
        }

        if (exitIntentDelaySelect) {
            exitIntentDelaySelect.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.exitIntent.delay`, e.target.value);
                requestUpdate();
            });
        }

        if (delaySecondsInput) {
            delaySecondsInput.addEventListener("input", (e) => {
                const val = parseInt(e.target.value, 10);
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.delay.seconds`, !isNaN(val) ? val : 5);
                requestUpdate();
            });
        }

        if (scrollTypeSelect) {
            scrollTypeSelect.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.scroll.type`, e.target.value);
                if (scrollPercentContainer) {
                    scrollPercentContainer.style.display = e.target.value === "percent" ? "flex" : "none";
                }
                requestUpdate();
            });
        }

        if (scrollPercentInput) {
            scrollPercentInput.addEventListener("input", (e) => {
                const val = parseInt(e.target.value, 10);
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.triggerData.scroll.percent`, !isNaN(val) ? val : 50);
                requestUpdate();
            });
        }
        if (showBackdropToggle) {
            showBackdropToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.showBackdrop`, e.target.checked);
                requestUpdate();
            });
        }
        if (allowScrollToggle) {
            allowScrollToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.allowBodyScroll`, e.target.checked);
                requestUpdate();
            });
        }
        if (hideHeaderToggle) {
            hideHeaderToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.hideHeader`, e.target.checked);
                requestUpdate();
            });
        }
        if (hideFooterToggle) {
            hideFooterToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.hideFooter`, e.target.checked);
                requestUpdate();
            });
        }
        if (closeOnBackdropToggle) {
            closeOnBackdropToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.closeOnBackdrop`, e.target.checked);
                requestUpdate();
            });
        }
        if (closeOnEscToggle) {
            closeOnEscToggle.addEventListener("change", (e) => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.main.closeOnEsc`, e.target.checked);
                requestUpdate();
            });
        }
    }

    function syncOverlayBehaviorUI() {
        const currentSubType = state.settings.display.displaySubType || "modal";
        const subTypeData = state.settings.display.subTypeData?.[currentSubType] || {};
        
        const grM = subTypeData.globalData?.main || {};
        const grD = subTypeData.globalData?.design || {};
        const triggerData = subTypeData.triggerData || {};

        if (showBackdropToggle) {
            showBackdropToggle.checked = grM.showBackdrop !== false;
        }
        if (closeOnBackdropToggle) {
            closeOnBackdropToggle.checked = grM.closeOnBackdrop !== false;
        }
        if (allowScrollToggle) {
            allowScrollToggle.checked = grM.allowBodyScroll !== false;
        }
        if (hideHeaderToggle) {
            hideHeaderToggle.checked = grM.hideHeader !== false;
        }
        if (hideFooterToggle) {
            hideFooterToggle.checked = grM.hideFooter !== false;
        }
        if (closeOnEscToggle) {
            closeOnEscToggle.checked = grM.closeOnEsc !== false;
        }

        const showFooterToggle = document.getElementById("flwp-style-overlay-show-footer");
        if (showFooterToggle) {
            showFooterToggle.checked = grD.showFooterText !== false;
        }
        if (footerTextInput) {
            footerTextInput.value = grD.customFooterText || "";
        }
        if (ruleCloseDaysInput) {
            ruleCloseDaysInput.value = grM.cookieCloseDays !== undefined ? grM.cookieCloseDays : 1;
        }
        if (ruleSubmitDaysInput) {
            ruleSubmitDaysInput.value = grM.cookieSubmitDays !== undefined ? grM.cookieSubmitDays : 30;
        }
        if (ruleCookieScopeSelect) {
            ruleCookieScopeSelect.value = grM.cookieScope || "domain";
        }
        if (clickSelectorInput) {
            const clk = triggerData.click || {};
            clickSelectorInput.value = clk.selector || "";

            const hideClose = document.getElementById("flwp-style-overlay-rule-hide-click-on-close");
            if (hideClose) hideClose.checked = !!clk.hideOnClose;

            const hideSubmit = document.getElementById("flwp-style-overlay-rule-hide-click-on-submit");
            if (hideSubmit) hideSubmit.checked = !!clk.hideOnSubmit;
        }
        if (exitIntentDelaySelect) {
            const ei = triggerData.exitIntent || {};
            exitIntentDelaySelect.value = ei.delay || "immediate";
        }
        if (delaySecondsInput) {
            const del = triggerData.delay || {};
            delaySecondsInput.value = del.seconds !== undefined ? del.seconds : 5;
        }
        if (scrollTypeSelect) {
            const sc = triggerData.scroll || {};
            scrollTypeSelect.value = sc.type || "end";
            if (scrollPercentContainer) {
                scrollPercentContainer.style.display = scrollTypeSelect.value === "percent" ? "flex" : "none";
            }
        }
        if (scrollPercentInput) {
            const sc = triggerData.scroll || {};
            scrollPercentInput.value = sc.percent !== undefined ? sc.percent : 50;
        }
        if (headerIndicatorSelect) {
            headerIndicatorSelect.value = grD.headerIndicator || "progress";
        }
        if (headerTitleInput) {
            headerTitleInput.value = grD.headerTitle || "";
        }
        if (headerTitleContainer) {
            const isTitle = (headerIndicatorSelect ? headerIndicatorSelect.value : grD.headerIndicator) === "title";
            headerTitleContainer.style.display = isTitle ? "flex" : "none";
        }
    }

    function setupColorPickers() {
        if (customColorsToggle && colorsSubpanel) {
            customColorsToggle.addEventListener("change", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.customStylesEnabled`, customColorsToggle.checked);
                colorsSubpanel.style.display = customColorsToggle.checked ? "flex" : "none";
                requestUpdate();
            });
        }

        if (bgColorInput) {
            bgColorInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.bgColor`, bgColorInput.value);
                if (bgHexInput) bgHexInput.value = bgColorInput.value.toUpperCase();
                requestUpdate();
            });
        }

        if (borderColorInput) {
            borderColorInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.borderColor`, borderColorInput.value);
                if (borderHexInput) borderHexInput.value = borderColorInput.value.toUpperCase();
                requestUpdate();
            });
        }
        if (borderStyleInput) {
            borderStyleInput.addEventListener("change", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.borderStyle`, borderStyleInput.value);
                requestUpdate();
            });
        }
        if (borderWidthInput) {
            borderWidthInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.borderWidth`, borderWidthInput.value);
                requestUpdate();
            });
        }
        if (borderRadiusInput) {
            borderRadiusInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.borderRadius`, borderRadiusInput.value);
                requestUpdate();
            });
        }
    }

    let activePreviewController = null;

    function setupSimulatorControls() {
        if (headerIndicatorSelect) {
            headerIndicatorSelect.addEventListener("change", () => {
                const isTitle = headerIndicatorSelect.value === "title";
                if (headerTitleContainer) {
                    headerTitleContainer.style.display = isTitle ? "flex" : "none";
                }
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.headerIndicator`, headerIndicatorSelect.value);
                requestUpdate();
                renderDisplaySimulator();
            });
        }

        if (headerTitleInput) {
            headerTitleInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.headerTitle`, headerTitleInput.value);
                requestUpdate();
                renderDisplaySimulator();
            });
        }

        if (footerTextInput) {
            footerTextInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.design.customFooterText`, footerTextInput.value);
                requestUpdate();
                renderDisplaySimulator();
            });
        }

        if (maxWidthInput) {
            maxWidthInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                const currentType = state.settings.display.displayType || "in-content";
                if (currentType === "in-content") {
                    utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.spacing.maxWidth`, maxWidthInput.value);
                } else {
                    utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.spacing.overlayWidth`, maxWidthInput.value);
                }
                requestUpdate();
                renderDisplaySimulator();
            });
        }

        if (minHeightInput) {
            minHeightInput.addEventListener("input", () => {
                const activeSubtype = state.settings.display.displaySubType || "modal";
                const currentType = state.settings.display.displayType || "in-content";
                if (currentType === "in-content") {
                    const val = parseInt(minHeightInput.value, 10);
                    utils.setDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData.spacing.customMinHeight`, !isNaN(val) && val >= 0 ? val : null);
                }
                requestUpdate();
                renderDisplaySimulator();
            });
        }

        if (showBackdropToggle) {
            showBackdropToggle.addEventListener("change", () => {
                renderDisplaySimulator();
            });
        }

        if (hideHeaderToggle) {
            hideHeaderToggle.addEventListener("change", () => {
                renderDisplaySimulator();
            });
        }

        if (hideFooterToggle) {
            hideFooterToggle.addEventListener("change", () => {
                renderDisplaySimulator();
            });
        }
    }

    // --- 6. Render Live Stage Simulator ---
    function renderDisplaySimulator() {
        if (!stageWrapper) return;

        // Prevent multiple simultaneous renders
        if (stageWrapper.dataset.isRendering === "true") return;
        stageWrapper.dataset.isRendering = "true";

        // Destroy previous overlay controller instance if active
        if (activePreviewController) {
            if (typeof activePreviewController.destroy === 'function') activePreviewController.destroy();
            activePreviewController = null;
        }

        const activeType = state.settings.display.displayType || "in-content";
        const activeSubtype = state.settings.display.displaySubType || (activeType === "in-content" ? "shortcode" : "modal");
        
        const gr = utils.getDeepState(state, `settings.display.subTypeData.${activeSubtype}.globalData`, {});
        const showBackdrop = showBackdropToggle ? showBackdropToggle.checked : (gr.showBackdrop !== false);
        const closeOnBackdrop = closeOnBackdropToggle ? closeOnBackdropToggle.checked : (gr.closeOnBackdrop !== false);
        const closeOnEsc = closeOnEscToggle ? closeOnEscToggle.checked : (gr.closeOnEsc !== false);
        const hideHeader = hideHeaderToggle ? hideHeaderToggle.checked : (gr.hideHeader !== false);
        const hideFooter = hideFooterToggle ? hideFooterToggle.checked : (gr.hideFooter !== false);
        const maxWidth = maxWidthInput ? maxWidthInput.value : "";

        const promise = utils.renderFormSimulator(stageWrapper, state, PreviewEngine, {
            mode: activeType,
            activeSubtype: activeSubtype,
            showBackdrop,
            closeOnBackdrop,
            closeOnEsc,
            hideHeader,
            hideFooter,
            maxWidth,
            feedbackButton: typeof getFeedbackButtonState === 'function' ? getFeedbackButtonState() : {}
        });

        // Ensure we handle the promise if it's returned (utils.renderFormSimulator returns the result of PreviewEngine.render)
        if (promise && typeof promise.then === 'function') {
            promise.then((controller) => {
                activePreviewController = controller;
            }).finally(() => {
                delete stageWrapper.dataset.isRendering;
            });
        } else {
            // Fallback for immediate return (though PreviewEngine.render returns a promise)
            activePreviewController = promise;
            delete stageWrapper.dataset.isRendering;
        }
    }

    function setupInContentControls() {
        if (inContentAutoEnabledToggle) {
            inContentAutoEnabledToggle.addEventListener("change", (e) => {
                utils.setDeepState(state, "settings.display.subTypeData.shortcode.autoEnabled", e.target.checked);
                if (inContentAutoPositionGroup) {
                    inContentAutoPositionGroup.style.display = e.target.checked ? "flex" : "none";
                }
                requestUpdate();
            });
        }

        if (inContentAutoPositionSelect) {
            inContentAutoPositionSelect.addEventListener("change", (e) => {
                utils.setDeepState(state, "settings.display.subTypeData.shortcode.autoPosition", e.target.value);
                requestUpdate();
            });
        }
    }

    function syncInContentControlsUI() {
        const currentType = state.settings.display.displayType || "in-content";
        const currentSubType = state.settings.display.displaySubType || (currentType === "in-content" ? "shortcode" : "modal");
        const subTypeData = state.settings.display.subTypeData?.[currentSubType] || {};
        const ovGrS = subTypeData.globalData?.spacing || {};
        const ovGrD = subTypeData.globalData?.design || {};

        if (maxWidthInput) {
            if (currentType === "in-content") {
                maxWidthInput.value = ovGrS.maxWidth !== undefined && ovGrS.maxWidth !== null ? ovGrS.maxWidth : "";
            } else {
                maxWidthInput.value = ovGrS.overlayWidth !== undefined && ovGrS.overlayWidth !== null ? ovGrS.overlayWidth : "";
            }
        }
        if (minHeightInput) {
            if (currentType === "in-content") {
                minHeightInput.value = ovGrS.customMinHeight !== undefined && ovGrS.customMinHeight !== null ? ovGrS.customMinHeight : "";
            } else {
                minHeightInput.value = "";
            }
        }

        if (customColorsToggle) {
            customColorsToggle.checked = !!ovGrD.customStylesEnabled;
        }
        if (colorsSubpanel) {
            colorsSubpanel.style.display = ovGrD.customStylesEnabled ? "flex" : "none";
        }
        if (bgColorInput) {
            bgColorInput.value = ovGrD.bgColor || "#ffffff";
            if (bgHexInput) bgHexInput.value = (ovGrD.bgColor || "#ffffff").toUpperCase();
        }
        if (borderColorInput) {
            borderColorInput.value = ovGrD.borderColor || "#e2e8f0";
            if (borderHexInput) borderHexInput.value = (ovGrD.borderColor || "#e2e8f0").toUpperCase();
        }
        if (borderStyleInput) {
            borderStyleInput.value = ovGrD.borderStyle || "solid";
        }
        if (borderWidthInput) {
            borderWidthInput.value = ovGrD.borderWidth || "1";
        }
        if (borderRadiusInput) {
            borderRadiusInput.value = ovGrD.borderRadius || "0";
        }

        if (inContentAutoEnabledToggle) {
            inContentAutoEnabledToggle.checked = !!subTypeData.autoEnabled;
        }
        if (inContentAutoPositionSelect) {
            inContentAutoPositionSelect.value = subTypeData.autoPosition || "bottom";
        }
        if (inContentAutoPositionGroup) {
            inContentAutoPositionGroup.style.display = subTypeData.autoEnabled ? "flex" : "none";
        }
    }

    setupInContentControls();

    function syncInContentBoxModelUI() {
        const gbS = state.settings?.display?.subTypeData?.shortcode?.globalData?.spacing || {};

        if (!window.flwpGlobalDataPaddingControl) {
            window.flwpGlobalDataPaddingControl = utils.setupBoxModelControl(
                "flwp-globaldata-padding",
                () => state.settings.display.subTypeData.shortcode.globalData.spacing.padding,
                () => {
                    requestUpdate();
                }
            );
        }
        utils.syncControl(window.flwpGlobalDataPaddingControl, gbS.padding);

        if (!window.flwpGlobalDataMarginControl) {
            window.flwpGlobalDataMarginControl = utils.setupBoxModelControl(
                "flwp-globaldata-margin",
                () => state.settings.display.subTypeData.shortcode.globalData.spacing.margin,
                () => {
                    requestUpdate();
                }
            );
        }
        utils.syncControl(window.flwpGlobalDataMarginControl, gbS.margin);
    }

    return {
        syncUI() {
            syncTypeCardsUI();
            syncTriggerSegmentUI();
            syncOverlayPositionUI();
            syncFeedbackButtonUI();
            syncOverlayBehaviorUI();
            syncInContentBoxModelUI();
            syncInContentControlsUI();
            renderDisplaySimulator();
        }
    };
}
