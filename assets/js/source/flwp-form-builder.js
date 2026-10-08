import { utils } from '../components/flwp-form-utils.js';
import { __ } from '../components/flwp-i18n.js';
import { config as globalConfig } from '../components/flwp-form-config.js';
import { fields } from '../components/flwp-form-fields.js';
import { FormBuilderTemplates } from '../components/flwp-form-builder-template.js';
import { FLWPConditionBuilder } from '../components/flwp-form-builder-condition-builder.js';
import { FormValidator } from '../components/flwp-form-builder-form-validator.js';
import { initFormBuilderTemplateDisplay } from '../components/flwp-form-builder-template-display.js';
import { PreviewEngine } from '../components/flwp-form-builder-preview-engine.js';

if (typeof window.flwpFormBuilder === 'undefined') {
    window.flwpFormBuilder = {
        nonce: 'mock-nonce',
        ajaxurl: '/api/mock-ajax'
    };
}

const flwpFormBuilder = window.flwpFormBuilder;

const FLWPFormBuilder = (function() {

    // 1. DOM REFERENCES
    let elSplitPreviewColumn,
        elBtnToggleSplitPreview,
        elFormTitle,
        elActiveFormIdDisplay,
        elLastUpdatedDisplay,
        elLastPublishedDisplay,
        elFormStatusBadge,
        elFormStatusText,
        elCanvasStep1,
        elCanvasStep2,
        elStep1Card,
        elStep2Card,
        elStep1Header,
        elStep1NavToggle,
        elStep2NavToggle,
        elStep1Count,
        elStep2Count,
        elEmptyNotifierStep1,
        elStep2DisabledNotifier,
        elStep2EnabledEmptyNotifier,
        elOptionsEmptyNotice,
        elOptionsFormContainer,
        elOptElementId,
        elOptElementTypeBadge,
        elOptElementIdBadge,
        elOptLabel,
        elOptDescText,
        elOptPlaceholder,
        elOptIcon,
        elOptIconPosition,
        elOptButtonType,
        elOptRatingStars,
        elOptAlignment,
        elOptHType,
        elOptBold,
        elOptItalic,
        elOptUnderline,
        elOptFontSize,
        elOptTextColorColor,
        elOptTextColorHex,
        elOptLineHeight,
        elOptBorderRadius,
        elOptRequired,
        elOptSmileyLegend,
        elOptHideLabel,
        elOptFullWidth,
        elOptWidth,
        elOptClearBefore,
        elOptStep2Enabled,
        elOptBtnCustomColorsEnabled,
        elOptBtnColorsSubpanel,
        elOptBtnBgColor,
        elOptBtnBgHex,
        elOptBtnTextColor,
        elOptBtnTextHex,
        elOptBtnBorderColor,
        elOptBtnBorderHex,
        elOptBtnHoverBgColor,
        elOptBtnHoverBgHex,
        elOptBtnHoverTextColor,
        elOptBtnHoverTextHex,
        elOptBtnHoverBorderColor,
        elOptBtnHoverBorderHex,
        elOptBtnColorsReset,
        elDraggableStoreGrid,
        elSearchFieldsInput,
        elSearchNoResults,
        elPreviewModal,
        elPreviewWidget,
        elPreviewInnerForm,
        elWidgetStepIndicator;

    function refreshDomReferences() {
        elSplitPreviewColumn = document.getElementById("flwp-split-preview-column");
        elBtnToggleSplitPreview = document.getElementById("flwp-btn-toggle-split-preview");
        elFormTitle = document.getElementById("flwp-form-title");
        elActiveFormIdDisplay = document.getElementById("flwp-active-form-id-display");
        elLastUpdatedDisplay = document.getElementById("flwp-last-updated-display");
        elLastPublishedDisplay = document.getElementById("flwp-last-published-display");
        elFormStatusBadge = document.getElementById("flwp-form-status-badge");
        elFormStatusText = document.getElementById("flwp-form-status-text");
        elCanvasStep1 = document.getElementById("flwp-canvas-step-1");
        elCanvasStep2 = document.getElementById("flwp-canvas-step-2");
        elStep1Card = document.getElementById("flwp-step-1-card");
        elStep2Card = document.getElementById("flwp-step-2-card");
        elStep1Header = document.getElementById("flwp-step-1-header");
        elStep1NavToggle = document.getElementById("flwp-step-1-nav-toggle");
        elStep2NavToggle = document.getElementById("flwp-step-2-nav-toggle");
        elStep1Count = document.getElementById("flwp-step-1-count");
        elStep2Count = document.getElementById("flwp-step-2-count");
        elEmptyNotifierStep1 = elCanvasStep1 ? elCanvasStep1.querySelector(".flwp-canvas-empty-notifier") : null;
        elStep2DisabledNotifier = document.getElementById("flwp-step-2-disabled-notifier");
        elStep2EnabledEmptyNotifier = document.getElementById("flwp-step-2-enabled-empty-notifier");
        elOptionsEmptyNotice = document.getElementById("flwp-options-empty-notice");
        elOptionsFormContainer = document.getElementById("flwp-options-form-container");
        elOptElementId = document.getElementById("flwp-opt-element-id");
        elOptElementTypeBadge = document.getElementById("flwp-opt-element-type-badge");
        elOptElementIdBadge = document.getElementById("flwp-opt-element-id-badge");
        elOptLabel = document.getElementById("flwp-opt-label");
        elOptDescText = document.getElementById("flwp-opt-desc-text");
        elOptPlaceholder = document.getElementById("flwp-opt-placeholder");
        elOptIcon = document.getElementById("flwp-opt-icon");
        elOptIconPosition = document.getElementById("flwp-opt-icon-position");
        elOptButtonType = document.getElementById("flwp-opt-button-type");
        elOptRatingStars = document.getElementById("flwp-opt-rating-stars");
        elOptAlignment = document.getElementById("flwp-opt-alignment");
        elOptHType = document.getElementById("flwp-opt-h-type");
        elOptBold = document.getElementById("flwp-opt-bold");
        elOptItalic = document.getElementById("flwp-opt-italic");
        elOptUnderline = document.getElementById("flwp-opt-underline");
        elOptFontSize = document.getElementById("flwp-opt-font-size");
        elOptTextColorColor = document.getElementById("flwp-opt-text-color");
        elOptTextColorHex = document.getElementById("flwp-opt-text-color-hex");
        elOptLineHeight = document.getElementById("flwp-opt-line-height");
        elOptBorderRadius = document.getElementById("flwp-opt-border-radius");
        elOptRequired = document.getElementById("flwp-opt-required");
        elOptSmileyLegend = document.getElementById("flwp-opt-smiley-legend");
        elOptHideLabel = document.getElementById("flwp-opt-hide-label");
        elOptFullWidth = document.getElementById("flwp-opt-full-width");
        elOptWidth = document.getElementById("flwp-opt-width");
        elOptClearBefore = document.getElementById("flwp-opt-clear-before");
        elOptStep2Enabled = document.getElementById("flwp-opt-step2-enabled");
        elOptBtnCustomColorsEnabled = document.getElementById("flwp-opt-btn-custom-colors-enabled");
        elOptBtnColorsSubpanel = document.getElementById("flwp-opt-btn-colors-subpanel");
        elOptBtnBgColor = document.getElementById("flwp-opt-btn-bg-color");
        elOptBtnBgHex = document.getElementById("flwp-opt-btn-bg-hex");
        elOptBtnTextColor = document.getElementById("flwp-opt-btn-text-color");
        elOptBtnTextHex = document.getElementById("flwp-opt-btn-text-hex");
        elOptBtnBorderColor = document.getElementById("flwp-opt-btn-border-color");
        elOptBtnBorderHex = document.getElementById("flwp-opt-btn-border-hex");
        elOptBtnHoverBgColor = document.getElementById("flwp-opt-btn-hover-bg-color");
        elOptBtnHoverBgHex = document.getElementById("flwp-opt-btn-hover-bg-hex");
        elOptBtnHoverTextColor = document.getElementById("flwp-opt-btn-hover-text-color");
        elOptBtnHoverTextHex = document.getElementById("flwp-opt-btn-hover-text-hex");
        elOptBtnHoverBorderColor = document.getElementById("flwp-opt-btn-hover-border-color");
        elOptBtnHoverBorderHex = document.getElementById("flwp-opt-btn-hover-border-hex");
        elOptBtnColorsReset = document.getElementById("flwp-opt-btn-colors-reset");
        elDraggableStoreGrid = document.getElementById("flwp-draggable-store-grid");
        elSearchFieldsInput = document.getElementById("flwp-search-fields-input");
        elSearchNoResults = document.getElementById("flwp-search-no-results");
        elPreviewModal = document.getElementById("flwp-modal-preview");
        elPreviewWidget = document.getElementById("flwp-preview-floating-widget");
        elPreviewInnerForm = document.getElementById("flwp-widget-live-inner-form");
        elWidgetStepIndicator = document.getElementById("flwp-widget-step-indicator");
    }

    refreshDomReferences();

    // 2. CONFIGURATION
    const config = {
        ...globalConfig,
        DECLARATIVE_OPTION_BINDINGS: [
            { element: elOptLabel, key: "label", type: "text", event: "input", condition: (el) => el.type !== "description", defaultValue: "" },
            { element: elOptDescText, key: "label", type: "text", event: "input", condition: (el) => el.type === "description", defaultValue: "" },
            { element: elOptPlaceholder, key: "settings.placeholder", type: "text", event: "input", defaultValue: "" },
            {
                element: elOptButtonType, key: "settings.buttonType", type: "text", event: "change", defaultValue: "submit",
                onAfterChange: (el, val) => {
                    if (val === 'submit') {
                        el.label = __('fields.button.submit.default_text');
                        el.settings.icon = 'fa-paper-plane';
                        el.settings.iconPosition = 'right';
                    } else if (val === 'back') {
                        el.label = __('fields.button.back.default_text');
                        el.settings.icon = 'fa-arrow-left';
                        el.settings.iconPosition = 'left';
                    } else if (val === 'next') {
                        el.label = __('fields.button.next.default_text');
                        el.settings.icon = 'fa-arrow-right';
                        el.settings.iconPosition = 'right';
                    }
                    setTimeout(() => engine.updateOptionsPanel(), 0);
                }
            },
            { element: elOptIcon, key: "settings.icon", type: "text", event: "change", defaultValue: "fa-arrow-right" },
            { element: elOptIconPosition, key: "settings.iconPosition", type: "text", event: "change", defaultValue: "right" },
            { element: elOptRatingStars, key: "settings.stars", type: "int", event: "change", defaultValue: 5 },
            { element: elOptAlignment, key: "settings.alignment", type: "text", event: "change", defaultValue: "left" },
            { element: elOptHType, key: "settings.hType", type: "text", event: "change", defaultValue: "h3" },
            {
                element: elOptBold, key: "settings.bold", type: "bool", event: "change", defaultValue: false,
                onAfterChange: (el, checked) => { elOptBold.closest(".flwp-formatting-btn").classList.toggle("active", checked); }
            },
            {
                element: elOptItalic, key: "settings.italic", type: "bool", event: "change", defaultValue: false,
                onAfterChange: (el, checked) => { elOptItalic.closest(".flwp-formatting-btn").classList.toggle("active", checked); }
            },
            {
                element: elOptUnderline, key: "settings.underline", type: "bool", event: "change", defaultValue: false,
                onAfterChange: (el, checked) => { elOptUnderline.closest(".flwp-formatting-btn").classList.toggle("active", checked); }
            },
            { element: elOptFontSize, key: "settings.fontSize", type: "text", event: "change", defaultValue: "inherit" },
            { element: elOptLineHeight, key: "settings.lineHeight", type: "text", event: "change", defaultValue: "inherit" },
            { element: elOptBorderRadius, key: "settings.borderRadius", type: "text", event: "change", defaultValue: "inherit" },
            { element: elOptRequired, key: "settings.required", type: "bool", event: "change", defaultValue: false },
            { element: elOptHideLabel, key: "settings.hideLabel", type: "bool", event: "change", defaultValue: false },
            { element: elOptFullWidth, key: "settings.fullWidth", type: "bool", event: "change", defaultValue: true },
            { element: elOptWidth, key: "settings.width", type: "text", event: "change", defaultValue: "100%" },
            { element: elOptClearBefore, key: "settings.clearBefore", type: "bool", event: "change", defaultValue: false },
            { element: elOptSmileyLegend, key: "settings.smileyLegend", type: "bool", event: "change", defaultValue: false },
            {
                element: elOptStep2Enabled, key: "settings.step2Enabled", type: "bool", event: "change", defaultValue: false,
                onAfterChange: (el, checked) => {
                    if (checked) {
                        state.activeStep2TriggerId = el.id;
                        engine.getStep2List(el.id);
                        if (uiState.activeStepView === 1) {
                            utils.showToast(__("admin.toast.step2_unlocked"), "success");
                            controller.setStepFocus(2);
                        }
                    }
                }
            },
            {
                element: elOptBtnCustomColorsEnabled, key: "settings.customColorsEnabled", type: "bool", event: "change", defaultValue: false,
                onAfterChange: (el, checked) => { elOptBtnColorsSubpanel.style.display = checked ? "flex" : "none"; }
            }
        ],
        COLOR_PICKER_BINDINGS: [
            { picker: elOptBtnBgColor, hexInput: elOptBtnBgHex, key: "bgColor" },
            { picker: elOptBtnTextColor, hexInput: elOptBtnTextHex, key: "textColor" },
            { picker: elOptBtnBorderColor, hexInput: elOptBtnBorderHex, key: "borderColor" },
            { picker: elOptBtnHoverBgColor, hexInput: elOptBtnHoverBgHex, key: "hoverBgColor" },
            { picker: elOptBtnHoverTextColor, hexInput: elOptBtnHoverTextHex, key: "hoverTextColor" },
            { picker: elOptBtnHoverBorderColor, hexInput: elOptBtnHoverBorderHex, key: "hoverBorderColor" }
        ],
        currentView: 'fields'
    };

    // 3. RUNTIME APP STATE & UI STATE
    const state = JSON.parse(flwpFormBuilder.formData);

    const uiState = {
        selectedElementId: null,
        activeStepView: 1,
        localDragSourceStep: null,
        isSplitPreviewVisible: localStorage.getItem("flwp_split_preview_visible") !== "false",
        splitPreviewCurrentStep: 1,
        splitPreviewStep2TriggerId: null,
        activeTargetingType: "in-content",
        activeDisplayTab: "in-content",
        previewCurrentStep: 1,
        previewStep2TriggerId: null
    };

    // 5. HISTORY ENGINE (UNDO/REDO)
    let undoStack = [];
    let redoStack = [];
    let isApplyingHistory = false;
    let lastKnownStateStr = "";

    const history = {
        isApplyingHistory: () => isApplyingHistory,
        getLastKnownStateStr: () => lastKnownStateStr,
        setLastKnownStateStr: (val) => { lastKnownStateStr = val; },
        pushUndo: (item) => {
            undoStack.push(item);
            if (undoStack.length > 50) undoStack.shift();
        },
        clearRedo: () => { redoStack = []; },
        updateUndoRedoButtons: () => {
            const btnUndo = document.getElementById("flwp-btn-undo");
            const btnRedo = document.getElementById("flwp-btn-redo");
            if (btnUndo) btnUndo.disabled = undoStack.length === 0;
            if (btnRedo) btnRedo.disabled = redoStack.length === 0;
        },
        handleUndo: function() {
            if (undoStack.length === 0) return;
            redoStack.push({
                steps: JSON.parse(JSON.stringify(state.steps)),
                activeStep2TriggerId: state.activeStep2TriggerId,
                selectedElementId: uiState.selectedElementId,
                activeStepView: uiState.activeStepView
            });

            const previous = undoStack.pop();
            isApplyingHistory = true;

            state.steps = previous.steps;
            state.activeStep2TriggerId = previous.activeStep2TriggerId;
            uiState.selectedElementId = previous.selectedElementId;

            if (previous.activeStepView !== undefined && previous.activeStepView !== uiState.activeStepView) {
                controller.setStepFocus(previous.activeStepView);
            }

            engine.renderStepCanvas(1);
            engine.renderStepCanvas(2);
            engine.updateOptionsPanel();

            if (uiState.selectedElementId) {
                const activeList = uiState.activeStepView === 1 ? state.steps.step1 : engine.getStep2List();
                const stillExists = activeList.some(it => it.id === uiState.selectedElementId);
                if (stillExists) {
                    engine.selectElementForEditing(uiState.selectedElementId, uiState.activeStepView);
                } else {
                    uiState.selectedElementId = null;
                    engine.updateOptionsPanel();
                }
            }

            api.saveStateToLocalStorage();
            lastKnownStateStr = JSON.stringify(state.steps);
            isApplyingHistory = false;
            history.updateUndoRedoButtons();
            utils.showToast(__("admin.toast.undo"), "info");
        },
        handleRedo: function() {
            if (redoStack.length === 0) return;
            undoStack.push({
                steps: JSON.parse(JSON.stringify(state.steps)),
                activeStep2TriggerId: state.activeStep2TriggerId,
                selectedElementId: uiState.selectedElementId,
                activeStepView: uiState.activeStepView
            });

            const nextState = redoStack.pop();
            isApplyingHistory = true;

            state.steps = nextState.steps;
            state.activeStep2TriggerId = nextState.activeStep2TriggerId;
            uiState.selectedElementId = nextState.selectedElementId;

            if (nextState.activeStepView !== undefined && nextState.activeStepView !== uiState.activeStepView) {
                controller.setStepFocus(nextState.activeStepView);
            }

            engine.renderStepCanvas(1);
            engine.renderStepCanvas(2);
            engine.updateOptionsPanel();

            if (uiState.selectedElementId) {
                const activeList = uiState.activeStepView === 1 ? state.steps.step1 : engine.getStep2List();
                const stillExists = activeList.some(it => it.id === uiState.selectedElementId);
                if (stillExists) {
                    engine.selectElementForEditing(uiState.selectedElementId, uiState.activeStepView);
                } else {
                    uiState.selectedElementId = null;
                    engine.updateOptionsPanel();
                }
            }

            api.saveStateToLocalStorage();
            lastKnownStateStr = JSON.stringify(state.steps);
            isApplyingHistory = false;
            history.updateUndoRedoButtons();
            utils.showToast(__("admin.toast.redo"), "info");
        },
        initHistoryKeyboardShortcuts: function() {
            document.addEventListener("keydown", (e) => {
                const active = document.activeElement;
                if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT")) {
                    return;
                }
                const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                const modifier = isMac ? e.metaKey : e.ctrlKey;

                if (modifier && e.key.toLowerCase() === 'z') {
                    if (e.shiftKey) {
                        e.preventDefault();
                        history.handleRedo();
                    } else {
                        e.preventDefault();
                        history.handleUndo();
                    }
                } else if (modifier && e.key.toLowerCase() === 'y') {
                    e.preventDefault();
                    history.handleRedo();
                }
            });
        }
    };

    // 6. DB & LOCAL STORAGE API
    const api = {
        recalculateMinHeight: function() {
            if (!state.settings) {
                state.settings = {};
            }
            if (!state.settings.display) {
                state.settings.display = {};
            }
            if (!state.settings.display.subTypeData.shortcode.globalData) {
                state.settings.display.subTypeData.shortcode.globalData = {};
            }
            if (!state.settings.display.subTypeData.shortcode.globalData.spacing) {
                state.settings.display.subTypeData.shortcode.globalData.spacing = {};
            }

            // If user entered a custom min height, use that instead of recalculating
            const customMinHeight = state.settings.display.subTypeData.shortcode.globalData.spacing.customMinHeight;
            if (typeof customMinHeight === "number" && customMinHeight >= 0) {
                state.settings.display.subTypeData.shortcode.globalData.spacing.minHeight = customMinHeight;
                return customMinHeight;
            }

            let totalHeight = 0;
            let step1List = [];
            if (state.steps && Array.isArray(state.steps.step1)) {
                step1List = state.steps.step1;
            }
            const numFields = step1List.length;

            step1List.forEach(field => {
                let fieldType = field.type;

                const fieldConfig = config.FIELD_TYPES_CONFIG[fieldType];
                if (fieldConfig) {
                    const settings = field.settings || {};
                    let elementHeight = fieldConfig.baseHeight || 0;
                    if (fieldConfig.labelHeight && settings.hideLabel !== true) {
                        elementHeight += fieldConfig.labelHeight;
                    }
                    if (fieldConfig.legendHeight && settings.smileyLegend !== false) {
                        elementHeight += fieldConfig.legendHeight;
                    }

                    totalHeight += elementHeight;
                } else {
                    totalHeight += 40; // Default fallback
                }
            });

            if (numFields > 1) {
                totalHeight += (numFields - 1) * 7;
            }

            state.settings.display.subTypeData.shortcode.globalData.spacing.minHeight = totalHeight;
            return totalHeight;
        },
        isFormValid: function() {
            return FormValidator.isFormValid(state);
        },
        checkSubmitButtonLogic: function() {
            FormValidator.updateWarningBanners(state);
        },
        saveStateToLocalStorage: function() {
            try {
                api.recalculateMinHeight();
                if (!history.isApplyingHistory()) {
                    const currentStepsStr = JSON.stringify(state.steps);
                    const lastStr = history.getLastKnownStateStr();
                    if (lastStr && currentStepsStr !== lastStr) {
                        const previousSteps = JSON.parse(lastStr);
                        history.pushUndo({
                            steps: previousSteps,
                            activeStep2TriggerId: state.activeStep2TriggerId,
                            selectedElementId: uiState.selectedElementId,
                            activeStepView: uiState.activeStepView
                        });
                        history.clearRedo();
                        history.updateUndoRedoButtons();
                    }
                    history.setLastKnownStateStr(currentStepsStr);
                }
                const rawKey = flwpFormBuilder.formId !== 0 ? `${flwpFormBuilder.formId}_${flwpFormBuilder.formUpdated}_${flwpFormBuilder.pluginVersion}` : `0_${flwpFormBuilder.pluginVersion}`;
                const storageKey = `flwp_builder_state_${utils.base64(rawKey)}`;

                const ttl = 24 * 60 * 60 * 1000; // 1 Tag in Millisekunden
                const item = {
                    value: state,
                    expiry: Date.now() + ttl
                };
                localStorage.setItem(storageKey, JSON.stringify(item));
                window.dispatchEvent(new CustomEvent("flwp-form-updated", { detail: { formId: state.id } }));

                // Check submit button logic to update warning banner and status
                api.checkSubmitButtonLogic();

                if (uiState.isSplitPreviewVisible) {
                    engine.renderSplitPreview();
                }
            } catch(e) {
                console.warn("Storage write failed:", e);
            }
        },
        saveStateToDatabase: async function(type = 'preview') {
            if (!FormValidator.checkAndShowToasts(state)) {
                return false;
            }

            api.recalculateMinHeight();
            const formData = new FormData();
            formData.append('action', 'flwp_save_form_data');
            formData.append('nonce', flwpFormBuilder.nonce);
            formData.append('form_id', flwpFormBuilder.formId);
            formData.append('form_data', JSON.stringify(state));
            formData.append('type', type);

            try {
                const response = await fetch(flwpFormBuilder.ajaxurl, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    if (result.data && result.data.new_id) {
                        state.id = result.data.new_id;
                        flwpFormBuilder.formId = result.data.new_id;
                        if (elActiveFormIdDisplay) elActiveFormIdDisplay.textContent = flwpFormBuilder.formId;

                        const url = new URL(window.location.href);
                        url.searchParams.set('id', result.data.new_id);
                        window.history.replaceState({}, '', url);
                    }

                    // Update timestamps on successful save
                    const now = new Date();
                    flwpFormBuilder.formSavedTimestamp = now;
                    if (elLastUpdatedDisplay) elLastUpdatedDisplay.textContent = utils.formatDate(now, config.locale);

                    if (type === 'live') {
                        flwpFormBuilder.formPublishedTimestamp = now;
                        if (elLastPublishedDisplay) elLastPublishedDisplay.textContent = utils.formatDate(now, config.locale);
                    }

                    utils.showToast(type === 'live' ? __("admin.toast.form_published") : __("admin.toast.draft_saved"), "success");
                    return true;
                } else {
                    utils.showToast(__("admin.toast.save_error", { error: result.data || __("admin.toast.unknown_error") }), "error");
                    return false;
                }
            } catch (error) {
                console.error("AJAX Error:", error);
                utils.showToast(__("admin.toast.network_error"), "error");
                return false;
            }
        },
        saveStatusToDatabase: async function(statusInt) {
            if (!flwpFormBuilder.formId) return;
            const formData = new FormData();
            formData.append('action', 'flwp_update_form_status');
            formData.append('nonce', flwpFormBuilder.nonce);
            formData.append('form_id', flwpFormBuilder.formId);
            formData.append('status', statusInt);

            try {
                const response = await fetch(flwpFormBuilder.ajaxurl, { method: 'POST', body: formData });
                const result = await response.json();
                if (!result.success) console.error("Status update failed:", result.data);
            } catch (error) {
                console.error("AJAX Status Error:", error);
            }
        },
        validateFormState: function(data) {
            if (!data || typeof data !== 'object') throw new Error("Data must be a valid object.");
            if (!data.steps || typeof data.steps !== 'object') throw new Error("Invalid data structure: The 'steps' object is missing.");
            if (!Array.isArray(data.steps.step1)) throw new Error("Invalid structure: 'step1' must be an array.");

            const knownTypes = Object.keys(config.FIELD_TYPES_CONFIG);

            const validateItem = (item) => {
                if (!item || typeof item !== 'object') throw new Error("Element is not a valid object.");
                if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') throw new Error("Element has no valid ID.");
                if (!item.type || !knownTypes.includes(item.type)) throw new Error(`Known type is missing: '${item.type}'`);
                if (!item.settings || typeof item.settings !== 'object') item.settings = {};
                if (item.settings.fontSize === undefined) item.settings.fontSize = "inherit";
                if (item.settings.hideLabel === undefined) item.settings.hideLabel = false;
                if (item.label === undefined) item.label = __("fields.unnamed");
            };

            data.steps.step1.forEach(validateItem);

            if (data.steps.step2) {
                if (typeof data.steps.step2 !== 'object') {
                    throw new Error("Invalid structure 'step2'");
                }
                for (const key in data.steps.step2) {
                    if (Object.prototype.hasOwnProperty.call(data.steps.step2, key)) {
                        const list = data.steps.step2[key];
                        if (!Array.isArray(list)) throw new Error("step2 sub-path must be an array");
                        list.forEach(validateItem);
                    }
                }
            } else {
                data.steps.step2 = {};
            }

            if (!data.settings) data.settings = {};
            if (!data.settings.main) {
                data.settings.main = {
                    customClasses: '',
                    honeypot: true
                };
            }
            if (!data.settings.styles) {
                data.settings.styles = {
                    accentColor: '#104689'
                };
            }
            if (!data.settings.display) data.settings.display = {};
            if (!data.settings.display.subTypeData) data.settings.display.subTypeData = {};
            if (data.settings.display.displayType === undefined) {
                data.settings.display.displayType = "in-content";
            }
            ['shortcode', 'modal', 'slide-in', 'feedback-button'].forEach(type => {
                if (!data.settings.display.subTypeData[type]) data.settings.display.subTypeData[type] = {};
            });

            const std = data.settings.display.subTypeData;

            // Shortcode
            const sc = std.shortcode;
            if (sc.autoEnabled === undefined) sc.autoEnabled = false;
            if (sc.autoPosition === undefined) sc.autoPosition = "bottom";
            if (!sc.globalData) sc.globalData = {};
            if (!sc.globalData.main) sc.globalData.main = { cookieSubmitDays: 30, cookieScope: "domain" };
            if (!sc.globalData.spacing) sc.globalData.spacing = {
                padding: { top: "16", right: "16", bottom: "16", left: "16", unit: "px" },
                margin: { top: "0", right: "auto", bottom: "0", left: "auto", unit: "px" },
                position: "center"
            };
            if (!sc.globalData.design) sc.globalData.design = { customStylesEnabled: false, bgColor: "#ffffff", borderColor: "#ffffff" };

            // Modal & Slide-in
            ['modal', 'slide-in'].forEach(type => {
                const st = std[type];
                if (st.trigger === undefined) st.trigger = "click";
                if (!st.triggerData) st.triggerData = {};
                if (!st.triggerData.exitIntent) st.triggerData.exitIntent = { delay: "immediate" };
                if (!st.triggerData.scroll) st.triggerData.scroll = { type: "end", percent: 50 };
                if (!st.triggerData.click) st.triggerData.click = { selector: "" };

                if (!st.globalData) st.globalData = {};
                if (!st.globalData.main) st.globalData.main = { cookieCloseDays: 1, cookieSubmitDays: 30, cookieScope: "domain", showBackdrop: false, closeOnBackdrop: true, closeOnEsc: true };
                if (!st.globalData.spacing) st.globalData.spacing = { position: "center" };
                if (!st.globalData.design) st.globalData.design = { headerIndicator: "progress", showFooterText: true, customFooterText: __('admin.frontend.default_footer_text') };
            });

            // Feedback Button
            const fb = std['feedback-button'];
            if (fb.text === undefined) fb.text = "Feedback";
            if (fb.position === undefined) fb.position = "right-middle";
            if (fb.customStylesEnabled === undefined) fb.customStylesEnabled = true;
            if (fb.hideOptionEnabled === undefined) fb.hideOptionEnabled = true;
            if (fb.bgColor === undefined) fb.bgColor = "#ffffff";
            if (fb.textColor === undefined) fb.textColor = "#104689";
            if (fb.borderColor === undefined) fb.borderColor = "#104689";
            if (fb.hoverBgColor === undefined) fb.hoverBgColor = "#104689";
            if (fb.hoverTextColor === undefined) fb.hoverTextColor = "#ffffff";
            if (fb.hoverBorderColor === undefined) fb.hoverBorderColor = "#104689";
            if (fb.fontSize === undefined) fb.fontSize = 16;
            if (!fb.globalData) fb.globalData = {};
            if (!fb.globalData.main) fb.globalData.main = { cookieCloseDays: 1, cookieSubmitDays: 30, cookieScope: "domain", showBackdrop: false, closeOnBackdrop: true, closeOnEsc: true };
            if (!fb.globalData.spacing) fb.globalData.spacing = { position: "center" };
            if (!fb.globalData.design) fb.globalData.design = { headerIndicator: "progress", showFooterText: true, customFooterText: __('admin.frontend.default_footer_text') };

            if (!data.settings.tracking) data.settings.tracking = {};
            const tr = data.settings.tracking;
            if (tr.enabled === undefined) tr.enabled = true;
            if (tr.url === undefined) tr.url = true;
            if (tr.pageTitle === undefined) tr.pageTitle = true;
            if (tr.referrer === undefined) tr.referrer = true;
            if (tr.userAgent === undefined) tr.userAgent = true;
            if (tr.language === undefined) tr.language = false;
            if (tr.screenResolution === undefined) tr.screenResolution = false;
            if (tr.viewportSize === undefined) tr.viewportSize = false;
            if (tr.timezone === undefined) tr.timezone = false;
            if (tr.connectionType === undefined) tr.connectionType = false;
            if (tr.deviceType === undefined) tr.deviceType = false;
            if (tr.anonymizedSessionId === undefined) tr.anonymizedSessionId = false;
            if (tr.timeOnPageSeconds === undefined) tr.timeOnPageSeconds = false;
            if (tr.colorScheme === undefined) tr.colorScheme = false;

            if (!data.targeting) data.targeting = {};
            if (!data.targeting["in-content"]) {
                data.targeting["in-content"] = { andRules: [], orRules: [] };
            }
            if (!data.targeting.shortcode) {
                data.targeting.shortcode = { andRules: [], orRules: [] };
            }
            if (!data.targeting.overlay) {
                data.targeting.overlay = { andRules: [], orRules: [] };
            }

            return data;
        },
        cleanupExpiredLocalStorage: function() {
            try {
                const now = Date.now();
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith("flwp_builder_")) {
                        const val = localStorage.getItem(key);
                        if (val) {
                            try {
                                const parsed = JSON.parse(val);
                                if (parsed && parsed.expiry !== undefined && now > parsed.expiry) {
                                    keysToRemove.push(key);
                                }
                            } catch (err) {
                                // Ignore JSON parse errors for non-builder objects
                            }
                        }
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
                if (keysToRemove.length > 0) {
                    console.log("Expired localStorage entries cleaned up:", keysToRemove);
                }
            } catch(e) {
                console.warn("LocalStorage cleanup error:", e);
            }
        },
        loadStateFromLocalStorage: function() {
            try {
                const rawKey = flwpFormBuilder.formId !== 0 ? `${flwpFormBuilder.formId}_${flwpFormBuilder.formUpdated}_${flwpFormBuilder.pluginVersion}` : `0_${flwpFormBuilder.pluginVersion}`;
                const storageKey = `flwp_builder_state_${utils.base64(rawKey)}`;

                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed) {
                        let dataToUse = parsed;
                        if (parsed.value !== undefined && parsed.expiry !== undefined) {
                            if (Date.now() > parsed.expiry) {
                                localStorage.removeItem(storageKey);
                                return;
                            }
                            dataToUse = parsed.value;
                        }

                        if (dataToUse && dataToUse.steps && parseInt(dataToUse.id) === parseInt(state.id)) {
                            const validated = api.validateFormState(dataToUse);
                            Object.assign(state, validated);
                        }
                    }
                }
            } catch(e) {
                console.warn("Storage load failed, reverting to defaults:", e);
            } finally {
                history.setLastKnownStateStr(JSON.stringify(state.steps));
            }
        }
    };

    // 7. RENDERING & CANVAS ENGINE
    const engine = {
        openProUpgradeModal: function() {
            const modal = document.getElementById("flwp-modal-pro-upgrade");
            if (modal) {
                modal.classList.add("flwp-modal-overlay-active");
            }
        },
        initProUpgradeModal: function() {
            const modal = document.getElementById("flwp-modal-pro-upgrade");
            if (!modal) return;

            const closeBtn = document.getElementById("flwp-btn-close-pro-modal");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => modal.classList.remove("flwp-modal-overlay-active"));
            }
            const cancelBtn = document.getElementById("flwp-btn-close-pro-cancel");
            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => modal.classList.remove("flwp-modal-overlay-active"));
            }

            // Set upgrade link from config
            const upgradeCtaBtn = document.getElementById("flwp-btn-pro-upgrade-cta");
            if (upgradeCtaBtn && config.upgradeUrl) {
                upgradeCtaBtn.setAttribute("href", config.upgradeUrl);
            }

            if (config.isPro) {
                // If PRO version is active, remove all badges and blockers
                document.querySelectorAll(".flwp-draggable-pro-item").forEach(el => {
                    el.classList.remove("flwp-draggable-pro-item");
                });
                document.querySelectorAll(".flwp-pro-inline-badge").forEach(el => {
                    el.style.display = "none";
                });
                document.querySelectorAll(".flwp-pro-feature-locked").forEach(el => {
                    el.classList.remove("flwp-pro-feature-locked");
                });
            } else {
                // If Free version is active, block click actions and show modal
                const lockedFeatures = document.querySelectorAll(".flwp-pro-feature-locked");
                lockedFeatures.forEach(feat => {
                    feat.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        engine.openProUpgradeModal();
                    }, true);
                });

                const addUrlFilterBtn = document.getElementById("flwp-btn-add-url-filter");
                if (addUrlFilterBtn) {
                    addUrlFilterBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        engine.openProUpgradeModal();
                    }, true);
                }
            }
        },
        getActiveStep2TriggerId: function() {
            if (state.activeStep2TriggerId) {
                const triggerExists = state.steps.step1.find(
                    (it) => it.id === state.activeStep2TriggerId && (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(it.type)) && it.settings.step2Enabled
                );
                if (triggerExists) return state.activeStep2TriggerId;
            }
            const firstTrigger = state.steps.step1.find(
                (it) => (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(it.type)) && it.settings.step2Enabled
            );
            if (firstTrigger) {
                state.activeStep2TriggerId = firstTrigger.id;
                return firstTrigger.id;
            }
            return null;
        },
        getStep2List: function(triggerId) {
            if (!triggerId) triggerId = engine.getActiveStep2TriggerId();
            if (!triggerId) return [];
            return utils.getStep2List(state, triggerId);
        },
        isOptionStep2ActiveOnStep1: function() {
            return utils.isOptionStep2ActiveOnStep1(state);
        },
        renderStepCanvas: function(stepNum) {
            if (this._isRendering) return;
            this._isRendering = true;
            try {
                const list = stepNum === 1 ? state.steps.step1 : engine.getStep2List();
                const canvas = stepNum === 1 ? elCanvasStep1 : elCanvasStep2;

                canvas.innerHTML = '';
                const isStep2Enabled = engine.isOptionStep2ActiveOnStep1();

                if (stepNum === 2) {
                    if (!isStep2Enabled) {
                        if (elStep2DisabledNotifier) {
                            elStep2DisabledNotifier.style.display = "flex";
                            canvas.appendChild(elStep2DisabledNotifier);
                        }
                        if (elStep2EnabledEmptyNotifier) elStep2EnabledEmptyNotifier.style.display = "none";
                        elStep2Card.style.opacity = "0.55";
                        if (elStep2Count) {
                            elStep2Count.innerHTML = __("admin.builder.element_count_plural", { count: 0 });
                        }
                        return;
                    } else {
                        elStep2Card.style.opacity = "1";
                        if (elStep2DisabledNotifier) elStep2DisabledNotifier.style.display = "none";
                        if (elStep2EnabledEmptyNotifier) {
                            elStep2EnabledEmptyNotifier.style.display = "flex";
                            if (list.length === 0) canvas.appendChild(elStep2EnabledEmptyNotifier);
                        }
                    }
                } else if (list.length === 0 && elEmptyNotifierStep1) {
                    canvas.appendChild(elEmptyNotifierStep1);
                }

                if (stepNum === 1) {
                    elStep1Count.textContent = list.length === 1
                        ? __("admin.builder.element_count_singular", { count: 1 })
                        : __("admin.builder.element_count_plural", { count: list.length });
                } else {
                    const activeTriggerId = engine.getActiveStep2TriggerId();
                    const activeTrigger = state.steps.step1.find(it => it.id === activeTriggerId);
                    const step2Triggers = state.steps.step1.filter(it => (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(it.type)) && it.settings.step2Enabled);

                    let html = list.length === 1
                        ? __("admin.builder.element_count_singular", { count: 1 })
                        : __("admin.builder.element_count_plural", { count: list.length });
                    if (activeTrigger) html += ` - ${__("admin.builder.active_for", { label: `<strong>${utils.escapeHtml(activeTrigger.label)}</strong>` })}`;
                    if (step2Triggers.length > 1) {
                        html += ` <span style="margin: 0 6px; color: var(--flwp-border);">|</span> <button type="button" class="flwp-btn" style="font-size:10px; padding: 2px 8px; height:20px;" id="flwp-step2-trigger-switcher-btn"><i class="fas fa-exchange-alt"></i> ${__("admin.builder.switch_recipient")}</button>`;
                    }
                    elStep2Count.innerHTML = html;

                    const switcherBtn = document.getElementById("flwp-step2-trigger-switcher-btn");
                    if (switcherBtn) {
                        switcherBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            let selectHtml = `<select id="flwp-step2-trigger-dropdown" class="flwp-form-select" style="font-size:11px; padding:2px; width:auto; display:inline-block; height:24px;">`;
                            step2Triggers.forEach(tr => {
                                selectHtml += `<option value="${tr.id}" ${tr.id === activeTriggerId ? 'selected' : ''}>${utils.escapeHtml(tr.label)}</option>`;
                            });
                            selectHtml += `</select>`;
                            switcherBtn.outerHTML = selectHtml;

                            const dropdown = document.getElementById("flwp-step2-trigger-dropdown");
                            dropdown.addEventListener("change", (ev) => {
                                state.activeStep2TriggerId = ev.target.value;
                                engine.renderStepCanvas(2);
                                api.saveStateToLocalStorage();
                            });
                            dropdown.addEventListener("blur", () => engine.renderStepCanvas(2));
                            dropdown.focus();
                        });
                    }
                }

                list.forEach((item) => {
                    const el = document.createElement("div");
                    el.className = "flwp-rendered-form-element";
                    const w = (item.settings && item.settings.width) || "100%";
                    el.classList.add(`flwp-rendered-width-${w.replace("%", "")}`);
                    el.setAttribute("draggable", "true");
                    el.id = `canvas-item-${item.id}`;
                    el.dataset.id = item.id;
                    el.dataset.step = stepNum;

                    if (uiState.selectedElementId === item.id) el.className += " flwp-rendered-form-element-selected";

                    const handle = document.createElement("div");
                    handle.className = "flwp-element-drag-handle";
                    handle.innerHTML = `<i class="fas fa-grip-vertical"></i>`;
                    el.appendChild(handle);

                    const contentWrap = document.createElement("div");
                    contentWrap.className = "flwp-rendered-field-details-wrap";

                    const htmlMarkup = fields.render(item, 'builder', state);
                    contentWrap.innerHTML = htmlMarkup;
                    el.appendChild(contentWrap);

                    el.querySelectorAll(".flwp-step2-connection-badge").forEach(badge => {
                        badge.addEventListener("click", (e) => {
                            e.stopPropagation();
                            state.activeStep2TriggerId = item.id;
                            controller.setStepFocus(2);
                            engine.renderStepCanvas(2);
                        });
                    });

                    el.addEventListener("contextmenu", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        controller.showContextMenu(e, item, stepNum);
                    });

                    const controls = document.createElement("div");
                    controls.className = "flwp-element-controls";

                    const btnMove = document.createElement("button");
                    btnMove.className = "flwp-el-control-btn flwp-btn-el-move";
                    btnMove.title = stepNum === 1 ? __("admin.builder.move_to_step2") : __("admin.builder.move_to_step1");
                    btnMove.innerHTML = stepNum === 1 ? `<i class="fas fa-arrow-right"></i>` : `<i class="fas fa-arrow-left"></i>`;
                    btnMove.addEventListener("click", (e) => {
                        e.stopPropagation();
                        controller.moveElementBetweenSteps(item.id, stepNum);
                    });

                    const btnDuplicate = document.createElement("button");
                    btnDuplicate.className = "flwp-el-control-btn flwp-btn-el-duplicate";
                    btnDuplicate.title = __("admin.builder.duplicate_element");
                    btnDuplicate.innerHTML = `<i class="fas fa-copy"></i>`;
                    btnDuplicate.addEventListener("click", (e) => {
                        e.stopPropagation();
                        controller.duplicateElementInState(item.id, stepNum);
                    });

                    const btnDelete = document.createElement("button");
                    btnDelete.className = "flwp-el-control-btn flwp-btn-el-delete";
                    btnDelete.title = __("admin.builder.delete_element");
                    btnDelete.innerHTML = `<i class="fas fa-trash-alt"></i>`;
                    btnDelete.addEventListener("click", (e) => {
                        e.stopPropagation();
                        controller.deleteElementFromState(item.id, stepNum);
                    });

                    controls.appendChild(btnMove);
                    controls.appendChild(btnDuplicate);
                    controls.appendChild(btnDelete);
                    el.appendChild(controls);

                    el.addEventListener("click", (e) => {
                        e.stopPropagation();
                        engine.selectElementForEditing(item.id, stepNum);
                    });

                    el.addEventListener("dragstart", (e) => {
                        e.dataTransfer.setData("text/plain", item.id);
                        e.dataTransfer.setData("source-step", stepNum);
                        uiState.localDragSourceStep = stepNum;
                        el.style.opacity = "0.4";
                    });

                    el.addEventListener("dragend", () => {
                        el.style.opacity = "1";
                        uiState.localDragSourceStep = null;
                        controller.removeDragPlaceholders();
                        document.querySelectorAll(".flwp-step-canvas-droppable").forEach(dk => dk.classList.remove("flwp-step-canvas-dragover"));
                    });

                    if (item.settings && item.settings.clearBefore) {
                        const breakEl = document.createElement("div");
                        breakEl.className = "flwp-rendered-break";
                        canvas.appendChild(breakEl);
                    }

                    canvas.appendChild(el);
                });

                if (uiState.isSplitPreviewVisible) {
                    engine.renderSplitPreview();
                }
                api.checkSubmitButtonLogic();
            } finally {
                this._isRendering = false;
            }
        },
        selectElementForEditing: function(id, stepNum) {
            uiState.selectedElementId = id;
            controller.switchSidebarTab("field-options");
            document.querySelectorAll(".flwp-rendered-form-element").forEach(el => el.classList.remove("flwp-rendered-form-element-selected"));
            const targetEl = document.getElementById(`canvas-item-${id}`);
            if (targetEl) targetEl.classList.add("flwp-rendered-form-element-selected");

            if (stepNum === 1) {
                const item = state.steps.step1.find(it => it.id === id);
                if (item && ['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(item.type) && item.settings.step2Enabled) {
                    if (state.activeStep2TriggerId !== id) {
                        state.activeStep2TriggerId = id;
                        engine.renderStepCanvas(2);
                    }
                }
            }

            engine.updateOptionsPanel();
        },
        updateOptionsPanel: function() {
            if (!uiState.selectedElementId) {
                elOptionsEmptyNotice.style.display = "block";
                elOptionsFormContainer.style.display = "none";
                return;
            }

            let element = state.steps.step1.find(it => it.id === uiState.selectedElementId);
            let stepNum = 1;
            if (!element) {
                if (state.steps.step2 && !Array.isArray(state.steps.step2)) {
                    for (const triggerId in state.steps.step2) {
                        const found = state.steps.step2[triggerId].find(it => it.id === uiState.selectedElementId);
                        if (found) {
                            element = found;
                            stepNum = 2;
                            state.activeStep2TriggerId = triggerId;
                            break;
                        }
                    }
                } else {
                    element = engine.getStep2List().find(it => it.id === uiState.selectedElementId);
                    stepNum = 2;
                }
            }

            if (!element) {
                uiState.selectedElementId = null;
                elOptionsEmptyNotice.style.display = "block";
                elOptionsFormContainer.style.display = "none";
                return;
            }

            elOptionsEmptyNotice.style.display = "none";
            elOptionsFormContainer.style.display = "flex";

            elOptElementId.value = element.id;
            elOptElementIdBadge.textContent = `ID: #${element.id}`;

            const fieldConfig = config.FIELD_TYPES_CONFIG[element.type];
            elOptElementTypeBadge.textContent = fieldConfig ? fieldConfig.name.toUpperCase() : "ELEMENT";

            const supported = fieldConfig ? fieldConfig.supportedSettings : [];
            const toggleFieldGroup = (groupEl, fieldName) => {
                if (groupEl) groupEl.style.display = supported.includes(fieldName) ? "flex" : "none";
            };

            toggleFieldGroup(document.getElementById("flwp-opt-group-label"), "label");
            toggleFieldGroup(document.getElementById("flwp-opt-group-desc-text"), "label");
            toggleFieldGroup(document.getElementById("flwp-opt-group-placeholder"), "placeholder");
            toggleFieldGroup(document.getElementById("flwp-opt-group-button-type"), "buttonType");
            toggleFieldGroup(document.getElementById("flwp-opt-group-icon"), "icon");
            toggleFieldGroup(document.getElementById("flwp-opt-group-icon-position"), "iconPosition");
            toggleFieldGroup(document.getElementById("flwp-opt-group-rating-stars"), "stars");
            toggleFieldGroup(document.getElementById("flwp-opt-group-font-size"), "fontSize");
            toggleFieldGroup(document.getElementById("flwp-opt-group-alignment"), "alignment");
            toggleFieldGroup(document.getElementById("flwp-opt-group-h-type"), "hType");
            toggleFieldGroup(document.getElementById("flwp-opt-group-textFormatting"), "textFormatting");
            toggleFieldGroup(document.getElementById("flwp-opt-group-required"), "required");
            toggleFieldGroup(document.getElementById("flwp-opt-group-hide-label"), "hideLabel");
            toggleFieldGroup(document.getElementById("flwp-opt-group-full-width"), "fullWidth");
            toggleFieldGroup(document.getElementById("flwp-opt-group-width"), "width");
            toggleFieldGroup(document.getElementById("flwp-opt-group-clear-before"), "clearBefore");
            toggleFieldGroup(document.getElementById("flwp-opt-group-smiley-legend"), "smileyLegend");
            toggleFieldGroup(document.getElementById("flwp-opt-group-textColor"), "textColor");
            toggleFieldGroup(document.getElementById("flwp-opt-group-button-colors"), "buttonColors");
            toggleFieldGroup(document.getElementById("flwp-opt-group-border-radius"), "borderRadius");

            const elGroupStep2 = document.getElementById("flwp-opt-group-step2");
            if (elGroupStep2) {
                elGroupStep2.style.display = (stepNum === 1 && supported.includes("step2Enabled")) ? "flex" : "none";
            }

            config.DECLARATIVE_OPTION_BINDINGS.forEach(binding => {
                if (!binding.element) return;
                if (binding.condition && !binding.condition(element)) return;

                let value = utils.getDeepState(element, binding.key);
                if (value === undefined) value = binding.defaultValue;

                if (binding.type === "bool") {
                    binding.element.checked = value || false;
                    const formattingLabel = binding.element.closest(".flwp-formatting-btn");
                    if (formattingLabel) {
                        formattingLabel.classList.toggle("active", value || false);
                    }
                } else {
                    binding.element.value = value !== undefined ? value : "";
                }
            });

            const syncSliderNode = (value, slider, input, reset, min, max, step, defVal) => {
                if (!slider || !input || !reset) return;
                if (value === "inherit" || value === undefined || value === "") {
                    slider.value = defVal;
                    input.value = "";
                    input.placeholder = defVal;
                    reset.style.opacity = "0.5";
                    reset.style.pointerEvents = "none";
                } else {
                    const num = parseFloat(value) || defVal;
                    const clamped = Math.max(min, Math.min(max, num));
                    slider.value = clamped;
                    input.value = step >= 1 ? Math.round(clamped) : parseFloat(clamped.toFixed(1));
                    input.placeholder = "";
                    reset.style.opacity = "1";
                    reset.style.pointerEvents = "auto";
                }
            };

            // Sync custom font-size slider & input
            if (supported.includes("fontSize")) {
                let fsValue = element.settings.fontSize;
                if (fsValue === undefined || fsValue === "") fsValue = "inherit";

                let defSize = 14;
                if (element.type === 'headline') defSize = 20;
                else if (element.type === 'description') defSize = 13;

                syncSliderNode(
                    fsValue,
                    document.getElementById("flwp-opt-font-size-slider"),
                    document.getElementById("flwp-opt-font-size-input"),
                    document.getElementById("flwp-opt-font-size-reset"),
                    6, 48, 1, defSize
                );
            }

            // Sync custom line-height slider & input
            if (supported.includes("lineHeight")) {
                let lhValue = element.settings.lineHeight;
                if (lhValue === undefined || lhValue === "") lhValue = "inherit";

                let defLH = 1.4;
                if (element.type === 'headline') defLH = 1.2;
                else if (element.type === 'description') defLH = 1.5;

                syncSliderNode(
                    lhValue,
                    document.getElementById("flwp-opt-line-height-slider"),
                    document.getElementById("flwp-opt-line-height-input"),
                    document.getElementById("flwp-opt-line-height-reset"),
                    0.8, 3.0, 0.1, defLH
                );
            }

            // Sync custom border-radius slider & input
            if (supported.includes("borderRadius")) {
                let brValue = element.settings.borderRadius;
                if (brValue === undefined || brValue === "") brValue = "inherit";

                let defBR = 6;

                syncSliderNode(
                    brValue,
                    document.getElementById("flwp-opt-border-radius-slider"),
                    document.getElementById("flwp-opt-border-radius-input"),
                    document.getElementById("flwp-opt-border-radius-reset"),
                    0, 100, 1, defBR
                );
            }

            if (element.type === 'description') {
                document.getElementById("flwp-opt-group-label").style.display = "none";
            } else {
                document.getElementById("flwp-opt-group-desc-text").style.display = "none";
            }

            // Sync customColors settings
            const hasCustomColors = supported.includes("customColors");
            const elColorsGroup = document.getElementById("flwp-opt-group-button-colors");
            if (elColorsGroup) {
                elColorsGroup.style.display = hasCustomColors ? "flex" : "none";
            }

            if (hasCustomColors) {
                const customColorsTitleEl = document.getElementById("flwp-opt-custom-colors-title");
                if (customColorsTitleEl && fieldConfig) {
                    customColorsTitleEl.innerHTML = `<i class="fas fa-palette" style="color: var(--flwp-primary);"></i> ${__("admin.builder.customize_colors", { name: fieldConfig.name })}`;
                }

                const colorsEnabled = element.settings.customColorsEnabled || false;
                elOptBtnColorsSubpanel.style.display = colorsEnabled ? "flex" : "none";

                // Sync the active flag checkbox
                elOptBtnCustomColorsEnabled.checked = colorsEnabled;

                // Hide/show specific color rows based on config.FIELD_TYPES_CONFIG[element.type].customColorTypes
                const supportedTypes = fieldConfig.customColorTypes || [];

                const rowBg = document.getElementById("flwp-opt-colors-group-bg");
                const rowText = document.getElementById("flwp-opt-colors-group-text");
                const rowBorder = document.getElementById("flwp-opt-colors-group-border");
                const rowHoverBg = document.getElementById("flwp-opt-colors-group-hover-bg");
                const rowHoverText = document.getElementById("flwp-opt-colors-group-hover-text");
                const rowHoverBorder = document.getElementById("flwp-opt-colors-group-hover-border");

                const headerStandard = document.getElementById("flwp-opt-colors-standard-header");
                const headerHover = document.getElementById("flwp-opt-colors-hover-header");

                if (rowBg) rowBg.style.display = supportedTypes.includes("bgColor") ? "block" : "none";
                if (rowText) rowText.style.display = supportedTypes.includes("textColor") ? "block" : "none";
                if (rowBorder) rowBorder.style.display = supportedTypes.includes("borderColor") ? "block" : "none";
                if (rowHoverBg) rowHoverBg.style.display = supportedTypes.includes("hoverBgColor") ? "block" : "none";
                if (rowHoverText) rowHoverText.style.display = supportedTypes.includes("hoverTextColor") ? "block" : "none";
                if (rowHoverBorder) rowHoverBorder.style.display = supportedTypes.includes("hoverBorderColor") ? "block" : "none";

                const hasStandard = supportedTypes.includes("bgColor") || supportedTypes.includes("textColor") || supportedTypes.includes("borderColor");
                const hasHover = supportedTypes.includes("hoverBgColor") || supportedTypes.includes("hoverTextColor") || supportedTypes.includes("hoverBorderColor");

                if (headerStandard) headerStandard.style.display = hasStandard ? "block" : "none";
                if (headerHover) headerHover.style.display = hasHover ? "block" : "none";

                // Determine default values based on element type
                let defaultBg = "#104689";
                let defaultText = "#222222";
                let defaultBorder = "#104689";
                let defaultHoverBg = "#0b3363";
                let defaultHoverText = "#222222";
                let defaultHoverBorder = "#0b3363";

                if (element.type === 'button') {
                    defaultBg = (element.settings.buttonType === 'back' ? '#e2e8f0' : (state.settings.styles.accentColor || '#104689'));
                    defaultText = element.settings.buttonType === 'back' ? '#334155' : '#ffffff';
                    defaultBorder = element.settings.buttonType === 'back' ? '#cbd5e1' : (state.settings.styles.accentColor || '#104689');
                    
                    defaultHoverBg = (element.settings.buttonType === 'back' ? '#cbd5e1' : (state.settings.styles.secondaryColor || '#0b3363'));
                    defaultHoverText = element.settings.buttonType === 'back' ? '#334155' : '#ffffff';
                    defaultHoverBorder = (element.settings.buttonType === 'back' ? '#94a3b8' : (state.settings.styles.secondaryColor || '#0b3363'));
                } else if (element.type === 'rating' || element.type === 'smileys') {
                    defaultBg = "#ffffff";
                    defaultText = '#cbd5e1';
                    defaultBorder = "#e2e8f0";
                    
                    defaultHoverBg = "#f8fafc";
                    defaultHoverText = state.settings.styles.secondaryColor || '#0b3363';
                    defaultHoverBorder = "#cbd5e1";
                } else if (element.type === 'thumbs') {
                    defaultBg = '#ffffff';
                    defaultText = "#000000";
                    defaultBorder = '#000000';
                    
                    defaultHoverBg = state.settings.styles.secondaryColor || '#0b3363';
                    defaultHoverText = "#ffffff";
                    defaultHoverBorder = state.settings.styles.secondaryColor || '#0b3363';
                } else if (element.type === 'nps') {
                    defaultBg = '#ffffff';
                    defaultText = "#475569";
                    defaultBorder = '#cbd5e1';

                    defaultHoverBg = state.settings.styles.secondaryColor || '#0b3363';
                    defaultHoverText = "#ffffff";
                    defaultHoverBorder = state.settings.styles.secondaryColor || '#0b3363';
                } else {
                    // For headline or description, standard defaults
                    defaultBg = "#ffffff";
                    defaultText = element.type === 'headline' ? '#222222' : '#6c757d';
                    defaultBorder = "#e2e8f0";
                    
                    defaultHoverBg = "#ffffff";
                    defaultHoverText = element.type === 'headline' ? '#222222' : '#6c757d';
                    defaultHoverBorder = "#e2e8f0";
                }

                config.COLOR_PICKER_BINDINGS.forEach(binding => {
                    const isHover = binding.key.toLowerCase().includes("hover");
                    let defVal = isHover ? defaultHoverBg : defaultBg;
                    if (binding.key.toLowerCase().includes("textcolor")) defVal = isHover ? defaultHoverText : defaultText;
                    if (binding.key.toLowerCase().includes("bordercolor")) defVal = isHover ? defaultHoverBorder : defaultBorder;

                    const val = element.settings[binding.key] || defVal;
                    utils.syncColorValue(binding.picker, binding.hexInput, val);
                });
            }
        },
        openWidgetPreview: function() {
            const modalContainer = document.getElementById("flwp-preview-simulator-container-modal-box");
            if (!modalContainer) return;

            const modalOverlay = document.getElementById("flwp-modal-preview");

            utils.renderFormSimulator(modalContainer, state, PreviewEngine, {
                id: 'modal-preview',
                header: {
                    left: ['title'],
                    right: ['viewports', 'refresh', 'close'],
                    title: __('admin.preview.widget_title')
                },
                onClose: () => {
                    if (modalOverlay) modalOverlay.classList.remove("flwp-modal-overlay-active");
                }
            });

            if (modalOverlay) modalOverlay.classList.add("flwp-modal-overlay-active");
        },
        updateDisplayTypeUI: function() {
            if (window.flwpTemplateDisplayController && typeof window.flwpTemplateDisplayController.syncUI === "function") {
                window.flwpTemplateDisplayController.syncUI();
            }
        },
        renderSplitPreview: function(force = false) {
            const containerEl = document.getElementById("flwp-preview-simulator-container-fields");
            if (!containerEl) return;

            // Verhindere mehrfaches Rendern, außer force ist true
            if (!force && containerEl.dataset.isRendering === "true") {
                return;
            }

            containerEl.dataset.isRendering = "true";
            containerEl.innerHTML = ""; // Container leeren vor dem Rendern

            utils.renderFormSimulator(containerEl, state, PreviewEngine, {
                mode: 'in-content',
                subType: 'form-only',
                showMockArticle: false,
                header: {
                    left: ['title'],
                    right: ['refresh', 'close'],
                    title: __('admin.preview.form_preview_title')
                },
                onClose: () => {
                    engine.toggleSplitPreview(false);
                }
            }).finally(() => {
                delete containerEl.dataset.isRendering;
            });
        },
        toggleSplitPreview: function(forceState) {
            if (typeof forceState === 'boolean') {
                uiState.isSplitPreviewVisible = forceState;
            } else {
                uiState.isSplitPreviewVisible = !uiState.isSplitPreviewVisible;
            }

            localStorage.setItem("flwp_split_preview_visible", uiState.isSplitPreviewVisible ? "true" : "false");

            if (uiState.isSplitPreviewVisible) {
                if (elSplitPreviewColumn) elSplitPreviewColumn.style.display = "flex";
                if (elBtnToggleSplitPreview) elBtnToggleSplitPreview.classList.add("flwp-btn-primary");
                engine.renderSplitPreview();
            } else {
                if (elSplitPreviewColumn) elSplitPreviewColumn.style.display = "none";
                if (elBtnToggleSplitPreview) elBtnToggleSplitPreview.classList.remove("flwp-btn-primary");
            }
        }
    };

    // 8. CONTROLLER & INTERRUPT LOGIC
    let activeContextMenu = null;

    const controller = {
        closeContextMenu: function() {
            if (activeContextMenu) {
                activeContextMenu.remove();
                activeContextMenu = null;
            }
        },
        showContextMenu: function(e, item, stepNum) {
            controller.closeContextMenu();

            const menu = document.createElement("div");
            menu.className = "flwp-custom-context-menu";
            menu.style.position = "fixed";
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            menu.style.zIndex = "999999";

            const editOption = document.createElement("div");
            editOption.className = "flwp-context-menu-item";
            editOption.innerHTML = `<i class="fas fa-edit"></i> <span>${__("admin.builder.edit_element")}</span>`;
            editOption.addEventListener("click", () => {
                controller.closeContextMenu();
                engine.selectElementForEditing(item.id, stepNum);
            });
            menu.appendChild(editOption);

            const duplicateOption = document.createElement("div");
            duplicateOption.className = "flwp-context-menu-item";
            duplicateOption.innerHTML = `<i class="fas fa-copy"></i> <span>${__("admin.builder.duplicate_element")}</span>`;
            duplicateOption.addEventListener("click", () => {
                controller.closeContextMenu();
                controller.duplicateElementInState(item.id, stepNum);
            });
            menu.appendChild(duplicateOption);

            const moveOption = document.createElement("div");
            moveOption.className = "flwp-context-menu-item";
            moveOption.innerHTML = stepNum === 1 ? `<i class="fas fa-arrow-right"></i> <span>${__("admin.builder.move_to_step2")}</span>` : `<i class="fas fa-arrow-left"></i> <span>${__("admin.builder.move_to_step1")}</span>`;
            moveOption.addEventListener("click", () => {
                controller.closeContextMenu();
                controller.moveElementBetweenSteps(item.id, stepNum);
            });
            menu.appendChild(moveOption);

            const divider = document.createElement("div");
            divider.className = "flwp-context-menu-divider";
            menu.appendChild(divider);

            const deleteOption = document.createElement("div");
            deleteOption.className = "flwp-context-menu-item flwp-context-menu-item-danger";
            deleteOption.innerHTML = `<i class="fas fa-trash-alt"></i> <span>${__("admin.builder.delete_element")}</span>`;
            deleteOption.addEventListener("click", () => {
                controller.closeContextMenu();
                controller.deleteElementFromState(item.id, stepNum);
            });
            menu.appendChild(deleteOption);

            document.body.appendChild(menu);
            activeContextMenu = menu;

            menu.addEventListener("click", (evt) => evt.stopPropagation());

            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) menu.style.left = `${e.clientX - rect.width}px`;
            if (rect.bottom > window.innerHeight) menu.style.top = `${e.clientY - rect.height}px`;
        },
        moveElementBetweenSteps: function(id, sourceStepNum) {
            controller.closeContextMenu();

            if (sourceStepNum === 1) {
                const index = state.steps.step1.findIndex(it => it.id === id);
                if (index === -1) return;

                const elToMove = state.steps.step1[index];
                let targetTriggerId = engine.getActiveStep2TriggerId();

                if (!targetTriggerId) {
                    const candidate = state.steps.step1.find(it => (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(it.type)));
                    if (candidate) {
                        candidate.settings.step2Enabled = true;
                        state.activeStep2TriggerId = candidate.id;
                        targetTriggerId = candidate.id;
                        utils.showToast(__("admin.toast.step2_auto_activated", { label: candidate.label }), "info");
                    }
                }

                if (!targetTriggerId) {
                    utils.showToast(__("admin.toast.step2_requirement_error"), "error");
                    return;
                }

                state.steps.step1.splice(index, 1);
                const list2 = engine.getStep2List(targetTriggerId);
                list2.push(elToMove);

                controller.setStepFocus(2);
                if (uiState.selectedElementId === id) {
                    engine.selectElementForEditing(id, 2);
                } else {
                    engine.updateOptionsPanel();
                }

                engine.renderStepCanvas(1);
                engine.renderStepCanvas(2);
                api.saveStateToLocalStorage();
                utils.showToast(__("admin.toast.moved_to_step2", { label: elToMove.label }), "success");

            } else {
                let elToMove = null;
                let foundTriggerId = null;
                let foundIndex = -1;

                if (state.steps.step2 && !Array.isArray(state.steps.step2)) {
                    for (const triggerId in state.steps.step2) {
                        const idx = state.steps.step2[triggerId].findIndex(it => it.id === id);
                        if (idx !== -1) {
                            elToMove = state.steps.step2[triggerId][idx];
                            foundTriggerId = triggerId;
                            foundIndex = idx;
                            break;
                        }
                    }
                } else {
                    const list2 = engine.getStep2List();
                    const idx = list2.findIndex(it => it.id === id);
                    if (idx !== -1) {
                        elToMove = list2[idx];
                        foundIndex = idx;
                    }
                }

                if (!elToMove) return;

                if (foundTriggerId) {
                    state.steps.step2[foundTriggerId].splice(foundIndex, 1);
                } else {
                    engine.getStep2List().splice(foundIndex, 1);
                }

                state.steps.step1.push(elToMove);

                controller.setStepFocus(1);
                if (uiState.selectedElementId === id) {
                    engine.selectElementForEditing(id, 1);
                } else {
                    engine.updateOptionsPanel();
                }

                engine.renderStepCanvas(1);
                engine.renderStepCanvas(2);
                api.saveStateToLocalStorage();
                utils.showToast(__("admin.toast.moved_to_step1", { label: elToMove.label }), "success");
            }
        },
        setStepFocus: function(focusedStepNum) {
            uiState.activeStepView = focusedStepNum;

            if (focusedStepNum === 1) {
                elStep1Card.classList.remove("flwp-step-card-shrunken");
                elStep2Card.classList.add("flwp-step-card-shrunken");
                elStep1NavToggle.style.display = "none";
                elStep2NavToggle.style.display = "flex";
            } else {
                elStep1Card.classList.add("flwp-step-card-shrunken");
                elStep2Card.classList.remove("flwp-step-card-shrunken");
                elStep1NavToggle.style.display = "flex";
                elStep2NavToggle.innerHTML = `<i class="fas fa-compress-alt"></i> ${__("admin.builder.back_to_overview")}`;
            }
        },
        deleteElementFromState: function(id, stepNum) {
            const list = stepNum === 1 ? state.steps.step1 : engine.getStep2List();
            const index = list.findIndex(item => item.id === id);
            if (index !== -1) {
                list.splice(index, 1);
                if (uiState.selectedElementId === id) {
                    uiState.selectedElementId = null;
                    engine.updateOptionsPanel();
                }
                if (stepNum === 1) {
                    if (state.steps.step2 && typeof state.steps.step2 === "object" && !Array.isArray(state.steps.step2)) {
                        if (state.steps.step2[id]) {
                            delete state.steps.step2[id];
                        }
                    }
                    if (state.activeStep2TriggerId === id) {
                        state.activeStep2TriggerId = null;
                        engine.getActiveStep2TriggerId();
                    }
                }
                engine.renderStepCanvas(stepNum);
                if (stepNum === 1) engine.renderStepCanvas(2);
                utils.showToast(__("admin.toast.deleted"), "info");
                api.saveStateToLocalStorage();
            }
        },
        duplicateElementInState: function(id, stepNum) {
            const list = stepNum === 1 ? state.steps.step1 : engine.getStep2List();
            const index = list.findIndex(item => item.id === id);
            if (index !== -1) {
                const original = list[index];
                const copy = JSON.parse(JSON.stringify(original));
                copy.id = `flwp-el-${Date.now()}`;

                list.splice(index + 1, 0, copy);
                engine.renderStepCanvas(stepNum);
                if (stepNum === 1) engine.renderStepCanvas(2);
                engine.selectElementForEditing(copy.id, stepNum);
                utils.showToast(__("admin.toast.duplicated"), "success");
                api.saveStateToLocalStorage();
            }
        },
        handleSidebarFieldClick: function(type) {
            const fieldConfig = config.FIELD_TYPES_CONFIG[type];
            if (!fieldConfig) return;

            if (fieldConfig.isPro && !config.isPro) {
                engine.openProUpgradeModal();
                return;
            }

            const newField = fields.createDefaultElement(type, fieldConfig.defaultLabel);
            const newId = newField.id;

            if (uiState.activeStepView === 2 && engine.isOptionStep2ActiveOnStep1()) {
                engine.getStep2List().push(newField);
                engine.renderStepCanvas(2);
                engine.selectElementForEditing(newId, 2);
            } else {
                state.steps.step1.push(newField);
                engine.renderStepCanvas(1);
                engine.selectElementForEditing(newId, 1);
            }

            utils.showToast(__("admin.toast.added", { name: fieldConfig.name }), "success");
            api.saveStateToLocalStorage();
        },
        getOrCreatePlaceholder: function() {
            let existing = document.querySelector(".flwp-drag-placeholder");
            if (!existing) {
                existing = document.createElement("div");
                existing.className = "flwp-drag-placeholder flwp-rendered-form-element";
            }
            return existing;
        },
        getDragAfterElement: function(container, y) {
            const draggableElements = [...container.querySelectorAll('.flwp-rendered-form-element:not(.flwp-drag-placeholder)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        },
        removeDragPlaceholders: function() {
            document.querySelectorAll(".flwp-drag-placeholder").forEach(item => item.remove());
        },
        initDragAndDropEngine: function() {
            const draggableItems = elDraggableStoreGrid.querySelectorAll(".flwp-draggable-field-item");
            draggableItems.forEach(item => {
                item.addEventListener("dragstart", (e) => {
                    const type = item.dataset.type;
                    const fieldConfig = config.FIELD_TYPES_CONFIG[type];
                    if (fieldConfig && fieldConfig.isPro && !config.isPro) {
                        e.preventDefault();
                        engine.openProUpgradeModal();
                        return;
                    }

                    e.dataTransfer.setData("new-field-type", item.dataset.type);
                    e.dataTransfer.effectAllowed = "copy";
                });
            });

            const droppables = [elCanvasStep1, elCanvasStep2];

            droppables.forEach(droppable => {
                const stepNum = parseInt(droppable.dataset.step);

                droppable.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    if (stepNum === 2 && !engine.isOptionStep2ActiveOnStep1()) return;

                    droppable.classList.add("flwp-step-canvas-dragover");

                    const placeholder = controller.getOrCreatePlaceholder();
                    const afterElement = controller.getDragAfterElement(droppable, e.clientY);

                    if (afterElement === null) {
                        if (placeholder.parentNode !== droppable) droppable.appendChild(placeholder);
                    } else {
                        if (placeholder.nextSibling !== afterElement) droppable.insertBefore(placeholder, afterElement);
                    }
                });

                droppable.addEventListener("dragleave", (e) => {
                    if (e.relatedTarget && droppable.contains(e.relatedTarget)) return;
                    droppable.classList.remove("flwp-step-canvas-dragover");
                    controller.removeDragPlaceholders();
                });

                droppable.addEventListener("drop", (e) => {
                    e.preventDefault();
                    droppable.classList.remove("flwp-step-canvas-dragover");

                    const newFieldType = e.dataTransfer.getData("new-field-type");
                    const existingFieldId = e.dataTransfer.getData("text/plain");
                    const sourceStep = e.dataTransfer.getData("source-step");

                    const targetList = stepNum === 1 ? state.steps.step1 : engine.getStep2List();
                    const placeholders = Array.from(droppable.querySelectorAll(".flwp-drag-placeholder"));
                    let insertIndex = targetList.length;

                    if (placeholders.length > 0) {
                        const children = Array.from(droppable.children);
                        const pIndex = children.indexOf(placeholders[0]);
                        let count = 0;
                        for (let i = 0; i < pIndex; i++) {
                            if (children[i].classList.contains("flwp-rendered-form-element")) count++;
                        }
                        insertIndex = count;
                    }

                    controller.removeDragPlaceholders();

                    if (newFieldType) {
                        const fieldConfig = config.FIELD_TYPES_CONFIG[newFieldType];
                        if (fieldConfig) {
                            const newField = fields.createDefaultElement(newFieldType, fieldConfig.defaultLabel);
                            const newId = newField.id;

                            targetList.splice(insertIndex, 0, newField);
                            engine.renderStepCanvas(stepNum);
                            engine.selectElementForEditing(newId, stepNum);
                            utils.showToast(__("admin.toast.dropped", { name: fieldConfig.name }), "success");
                            api.saveStateToLocalStorage();
                        }
                    } else if (existingFieldId) {
                        const srcStepNum = parseInt(sourceStep);
                        const sourceList = srcStepNum === 1 ? state.steps.step1 : engine.getStep2List();
                        const index = sourceList.findIndex(it => it.id === existingFieldId);
                        if (index !== -1) {
                            const elementToMove = sourceList[index];
                            if (srcStepNum !== stepNum) {
                                utils.showToast(__("admin.toast.move_step_not_allowed"), "error");
                                return;
                            }
                            sourceList.splice(index, 1);
                            let adjustedIndex = insertIndex;
                            if (index < insertIndex) adjustedIndex = Math.max(0, insertIndex - 1);

                            targetList.splice(adjustedIndex, 0, elementToMove);
                            engine.renderStepCanvas(stepNum);
                            engine.selectElementForEditing(existingFieldId, stepNum);
                            api.saveStateToLocalStorage();
                        }
                    }
                });
            });

            draggableItems.forEach(item => {
                item.addEventListener("click", () => {
                    const type = item.dataset.type;
                    controller.handleSidebarFieldClick(type);
                });
            });
        },
        switchSidebarTab: function(panelName) {
            const triggers = document.querySelectorAll(".flwp-sidebar-tab-trigger");
            const panels = document.querySelectorAll(".flwp-sidebar-tab-panel");

            triggers.forEach(trigger => {
                if (trigger.dataset.panel === panelName) {
                    trigger.classList.add("flwp-sidebar-tab-active");
                } else {
                    trigger.classList.remove("flwp-sidebar-tab-active");
                }
            });

            panels.forEach(panel => {
                if (panel.id === `flwp-panel-${panelName}`) {
                    panel.classList.add("flwp-sidebar-tab-panel-active");
                } else {
                    panel.classList.remove("flwp-sidebar-tab-panel-active");
                }
            });
        },
        handleMainViewSwitch: function(viewName, showToastFlag = false) {
            const tabs = document.querySelectorAll(".flwp-nav-tab");
            const views = document.querySelectorAll(".flwp-builder-view");

            tabs.forEach(tab => {
                if (tab.dataset.view === viewName) {
                    tab.classList.add("flwp-nav-tab-active");
                } else {
                    tab.classList.remove("flwp-nav-tab-active");
                }
            });

            views.forEach(view => {
                if (view.id === `flwp-view-${viewName}`) {
                    view.classList.add("flwp-builder-view-active");
                } else {
                    view.classList.remove("flwp-builder-view-active");
                }
            });

            if (viewName === "general") {
                const formNameInp = document.getElementById("flwp-setting-form-name");
                if (formNameInp) formNameInp.value = state.settings.main.title;
            } else if (viewName === "display") {
                if (window.flwpTemplateDisplayController && typeof window.flwpTemplateDisplayController.syncUI === 'function') {
                    window.flwpTemplateDisplayController.syncUI();
                }
            }

            // Update URL parameter
            try {
                const url = new URL(window.location.href);
                if (url.searchParams.get('view') !== viewName) {
                    url.searchParams.set('view', viewName);
                    window.history.pushState({}, '', url.toString());
                }
            } catch (e) {
                console.error("Failed to update URL parameters", e);
            }

            if (showToastFlag) {
                utils.showToast(__("admin.toast.view_loaded", { view: viewName.toUpperCase() }), "info");
            }

            config.currentView = viewName;
        },
        initFieldsSearch: function() {
            if (!elSearchFieldsInput) return;
            elSearchFieldsInput.addEventListener("input", (e) => {
                const q = e.target.value.toLowerCase().trim();
                const items = elDraggableStoreGrid.querySelectorAll(".flwp-draggable-field-item");
                let matches = 0;

                items.forEach(item => {
                    const text = item.querySelector("span").textContent.toLowerCase();
                    if (text.includes(q)) {
                        item.style.display = "flex";
                        matches++;
                    } else {
                        item.style.display = "none";
                    }
                });

                const standardGroup = elDraggableStoreGrid.querySelector(".flwp-fields-grid:first-of-type");
                const reviewsGroup = elDraggableStoreGrid.querySelector(".flwp-fields-grid:last-of-type");
                const titleStandard = document.getElementById("flwp-sec-title-standard");
                const titleReviews = document.getElementById("flwp-sec-title-reviews");

                if (titleStandard && standardGroup) {
                    titleStandard.style.display = Array.from(standardGroup.children).some(child => child.style.display !== "none") ? "flex" : "none";
                }
                if (titleReviews && reviewsGroup) {
                    titleReviews.style.display = Array.from(reviewsGroup.children).some(child => child.style.display !== "none") ? "flex" : "none";
                }

                if (elSearchNoResults) elSearchNoResults.style.display = matches === 0 ? "block" : "none";
            });
        },
        bindConfigurationInputs: function() {
            if (elFormTitle) {
                elFormTitle.addEventListener("input", (e) => {
                    state.settings.main.title = e.target.value;
                    api.saveStateToLocalStorage();
                });
            }

            document.getElementById("flwp-setting-form-name").addEventListener("input", (e) => {
                state.settings.main.title = e.target.value;
                if (elFormTitle) elFormTitle.value = e.target.value;
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-setting-custom-classes").addEventListener("input", (e) => {
                state.settings.main.customClasses = e.target.value;
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-setting-honeypot").addEventListener("change", (e) => {
                state.settings.main.honeypot = e.target.checked;
                api.saveStateToLocalStorage();
            });

            utils.registerColorPickerPair("flwp-style-accent-color", "flwp-style-accent-hex", (val) => {
                state.settings.styles.accentColor = val;
                api.saveStateToLocalStorage();
            });

            utils.registerColorPickerPair("flwp-style-secondary-color", "flwp-style-secondary-hex", (val) => {
                state.settings.styles.secondaryColor = val;
                api.saveStateToLocalStorage();
            });

            const valMinHeight = document.getElementById("flwp-style-min-height");
            if (valMinHeight) {
                valMinHeight.addEventListener("input", (e) => {
                    const parsedVal = parseInt(e.target.value);
                    state.settings.display.subTypeData.shortcode.globalData.spacing.customMinHeight = !isNaN(parsedVal) && parsedVal >= 0 ? parsedVal : null;
                    api.saveStateToLocalStorage();
                    engine.renderSplitPreview();
                });
            }

            utils.registerColorPickerPair("flwp-style-confirm-color", "flwp-style-confirm-hex", (val) => {
                state.confirmation.textColor = val;
                api.saveStateToLocalStorage();
                engine.renderSplitPreview();
            });

            const confirmType = document.getElementById("flwp-style-confirm-type");
            confirmType.addEventListener("change", (e) => {
                const val = e.target.value;
                state.confirmation.type = val;
                document.getElementById("flwp-config-group-confirm-msg").style.display = "flex";
                document.getElementById("flwp-config-group-confirm-ext-url").style.display = val === 'url' ? "flex" : "none";
                api.saveStateToLocalStorage();
            });

            const msgTextarea = document.getElementById("flwp_confirm_message_text");

            msgTextarea.addEventListener("input", (e) => {
                state.confirmation.message = e.target.value;
                api.saveStateToLocalStorage();
            });

            // Support für WordPress wp_editor / TinyMCE
            utils.setupTinyMCEListener("flwp_confirm_message_text", (val) => state.confirmation.message = val, api.saveStateToLocalStorage);

            document.getElementById("flwp-config-confirm-url").addEventListener("input", (e) => {
                state.confirmation.extUrl = e.target.value;
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-notification-enabled").addEventListener("change", (e) => {
                state.notification.enabled = e.target.checked;
                document.getElementById("flwp-notification-settings-fields-group").style.opacity = e.target.checked ? "1" : "0.5";
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-notify-recipient").addEventListener("input", (e) => {
                state.notification.recipient = e.target.value;
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-notify-subject").addEventListener("input", (e) => {
                state.notification.subject = e.target.value;
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-notify-sender-name").addEventListener("input", (e) => {
                state.notification.senderName = e.target.value;
                api.saveStateToLocalStorage();
            });

            document.getElementById("flwp-notify-sender-email").addEventListener("input", (e) => {
                state.notification.senderEmail = e.target.value;
                api.saveStateToLocalStorage();
            });

            // Bind tracking configuration changes
            const trEnableEl = document.getElementById("flwp-setting-tracking-enabled");
            if (trEnableEl) {
                trEnableEl.addEventListener("change", (e) => {
                    if (!state.settings.tracking) state.settings.tracking = {};
                    state.settings.tracking.enabled = e.target.checked;

                    const groupEl = document.getElementById("flwp-tracking-settings-fields-group");
                    if (groupEl) groupEl.style.opacity = e.target.checked ? "1" : "0.5";

                    const trackingFields = [
                        "url", "pageTitle", "referrer", "userAgent", "language",
                        "screenResolution", "viewportSize", "timezone", "connectionType",
                        "deviceType", "anonymizedSessionId", "timeOnPageSeconds", "colorScheme"
                    ];
                    trackingFields.forEach(field => {
                        const el = document.getElementById(`flwp-setting-tracking-${field}`);
                        if (el) el.disabled = !e.target.checked;
                    });

                    api.saveStateToLocalStorage();
                    engine.renderSplitPreview();
                });
            }

            const trackingFieldsElementsList = [
                "url", "pageTitle", "referrer", "userAgent", "language",
                "screenResolution", "viewportSize", "timezone", "connectionType",
                "deviceType", "anonymizedSessionId", "timeOnPageSeconds", "colorScheme"
            ];
            trackingFieldsElementsList.forEach(field => {
                const el = document.getElementById(`flwp-setting-tracking-${field}`);
                if (el) {
                    el.addEventListener("change", (e) => {
                        if (!state.settings.tracking) state.settings.tracking = {};
                        state.settings.tracking[field] = e.target.checked;
                        api.saveStateToLocalStorage();
                        engine.renderSplitPreview();
                    });
                }
            });
        },
        bindOptionsLiveEditing: function() {
            const applyChange = (callback) => {
                if (!uiState.selectedElementId) return;

                let element = state.steps.step1.find(it => it.id === uiState.selectedElementId);
                let stepNum = 1;
                if (!element) {
                    if (state.steps.step2 && !Array.isArray(state.steps.step2)) {
                        for (const triggerId in state.steps.step2) {
                            const found = state.steps.step2[triggerId].find(it => it.id === uiState.selectedElementId);
                            if (found) {
                                element = found;
                                stepNum = 2;
                                break;
                            }
                        }
                    } else {
                        element = engine.getStep2List().find(it => it.id === uiState.selectedElementId);
                        stepNum = 2;
                    }
                }

                if (element) {
                    callback(element);
                    engine.renderStepCanvas(stepNum);
                    if (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(element.type)) {
                        engine.renderStepCanvas(2);
                    }
                    api.saveStateToLocalStorage();
                    engine.renderSplitPreview();
                }
            };

            config.DECLARATIVE_OPTION_BINDINGS.forEach(binding => {
                if (!binding.element) return;
                binding.element.addEventListener(binding.event, (e) => {
                    applyChange(el => {
                        if (binding.condition && !binding.condition(el)) return;
                        let val;
                        if (binding.type === "bool") {
                            val = e.target.checked;
                        } else if (binding.type === "int") {
                            val = parseInt(e.target.value) || 0;
                        } else {
                            val = e.target.value;
                        }
                        utils.setDeepState(el, binding.key, val);
                        if (binding.onAfterChange) binding.onAfterChange(el, val);
                    });
                });
            });

            config.COLOR_PICKER_BINDINGS.forEach(binding => {
                utils.registerColorPickerPair(binding.picker, binding.hexInput, (val) => {
                    applyChange(el => { el.settings[binding.key] = val; });
                });
            });

            if (elOptBtnColorsReset) {
                elOptBtnColorsReset.addEventListener("click", () => {
                    applyChange(el => {
                        delete el.settings.bgColor;
                        delete el.settings.textColor;
                        delete el.settings.borderColor;
                        delete el.settings.hoverBgColor;
                        delete el.settings.hoverTextColor;
                        delete el.settings.hoverBorderColor;
                    });
                    engine.updateOptionsPanel();
                });
            }

            // Custom Sliders & Numeric Input Syncing Helper
            const setupCustomSlider = (configObj) => {
                if (!configObj.hiddenInput || !configObj.sliderInput || !configObj.numericInput || !configObj.resetBtn) return;

                configObj.sliderInput.addEventListener("input", (e) => {
                    const val = parseFloat(e.target.value);
                    const clamped = Math.max(configObj.min, Math.min(configObj.max, val));

                    const displayVal = configObj.step >= 1 ? Math.round(clamped) : parseFloat(clamped.toFixed(1));
                    configObj.numericInput.value = displayVal;
                    configObj.numericInput.placeholder = "";

                    configObj.hiddenInput.value = displayVal + configObj.unit;
                    configObj.resetBtn.style.opacity = "1";
                    configObj.resetBtn.style.pointerEvents = "auto";

                    configObj.hiddenInput.dispatchEvent(new Event("change"));
                });

                configObj.numericInput.addEventListener("input", (e) => {
                    let val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    const clamped = Math.max(configObj.min, Math.min(configObj.max, val));
                    configObj.sliderInput.value = clamped;

                    const displayVal = configObj.step >= 1 ? Math.round(clamped) : parseFloat(clamped.toFixed(1));
                    configObj.hiddenInput.value = displayVal + configObj.unit;
                    configObj.resetBtn.style.opacity = "1";
                    configObj.resetBtn.style.pointerEvents = "auto";

                    configObj.hiddenInput.dispatchEvent(new Event("change"));
                });

                configObj.numericInput.addEventListener("blur", (e) => {
                    let val = parseFloat(e.target.value);
                    if (isNaN(val)) {
                        val = parseFloat(configObj.sliderInput.value);
                    }
                    const clamped = Math.max(configObj.min, Math.min(configObj.max, val));
                    configObj.sliderInput.value = clamped;

                    const displayVal = configObj.step >= 1 ? Math.round(clamped) : parseFloat(clamped.toFixed(1));
                    configObj.numericInput.value = displayVal;

                    configObj.hiddenInput.value = displayVal + configObj.unit;
                    configObj.resetBtn.style.opacity = "1";
                    configObj.resetBtn.style.pointerEvents = "auto";

                    configObj.hiddenInput.dispatchEvent(new Event("change"));
                });

                configObj.resetBtn.addEventListener("click", () => {
                    configObj.hiddenInput.value = "inherit";

                    let element = null;
                    if (uiState.selectedElementId) {
                        element = state.steps.step1.find(it => it.id === uiState.selectedElementId);
                        if (!element && state.steps.step2 && !Array.isArray(state.steps.step2)) {
                            for (const tId in state.steps.step2) {
                                const f = state.steps.step2[tId].find(it => it.id === uiState.selectedElementId);
                                if (f) { element = f; break; }
                            }
                        }
                    }
                    const defVal = configObj.getDefaultValue(element);
                    configObj.sliderInput.value = defVal;
                    configObj.numericInput.value = "";
                    configObj.numericInput.placeholder = defVal;
                    configObj.resetBtn.style.opacity = "0.5";
                    configObj.resetBtn.style.pointerEvents = "none";

                    configObj.hiddenInput.dispatchEvent(new Event("change"));
                });
            };

            // Initialize Font Size Slider
            setupCustomSlider({
                hiddenInput: elOptFontSize,
                sliderInput: document.getElementById("flwp-opt-font-size-slider"),
                numericInput: document.getElementById("flwp-opt-font-size-input"),
                resetBtn: document.getElementById("flwp-opt-font-size-reset"),
                min: 6,
                max: 48,
                step: 1,
                unit: "px",
                getDefaultValue: (el) => {
                    if (!el) return 14;
                    if (el.type === 'headline') return 20;
                    if (el.type === 'description') return 13;
                    return 14;
                }
            });

            // Initialize Line Height Slider (Zeilenhöhe)
            setupCustomSlider({
                hiddenInput: elOptLineHeight,
                sliderInput: document.getElementById("flwp-opt-line-height-slider"),
                numericInput: document.getElementById("flwp-opt-line-height-input"),
                resetBtn: document.getElementById("flwp-opt-line-height-reset"),
                min: 0.8,
                max: 3.0,
                step: 0.1,
                unit: "",
                getDefaultValue: (el) => {
                    if (!el) return 1.4;
                    if (el.type === 'headline') return 1.2;
                    if (el.type === 'description') return 1.5;
                    return 1.4;
                }
            });

            // Initialize Border Radius Slider
            setupCustomSlider({
                hiddenInput: elOptBorderRadius,
                sliderInput: document.getElementById("flwp-opt-border-radius-slider"),
                numericInput: document.getElementById("flwp-opt-border-radius-input"),
                resetBtn: document.getElementById("flwp-opt-border-radius-reset"),
                min: 0,
                max: 100,
                step: 1,
                unit: "px",
                getDefaultValue: (el) => {
                    return 6;
                }
            });
        },
        initExportImportSystem: function() {
            const modal = document.getElementById("flwp-modal-export");
            const trigger = document.getElementById("flwp-btn-export-json");
            const selectArea = document.getElementById("flwp-json-textarea");

            if (trigger) {
                trigger.addEventListener("click", () => {
                    selectArea.value = JSON.stringify(state, null, 2);
                    modal.classList.add("flwp-modal-overlay-active");
                });
            }

            const closeBtn = document.getElementById("flwp-btn-close-export-modal");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => modal.classList.remove("flwp-modal-overlay-active"));
            }
            const cancelBtn = document.getElementById("flwp-btn-close-export-cancel");
            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => modal.classList.remove("flwp-modal-overlay-active"));
            }

            const copyBtn = document.getElementById("flwp-btn-copy-json");
            if (copyBtn) {
                copyBtn.addEventListener("click", () => {
                    selectArea.select();
                    document.execCommand("copy");
                    utils.showToast(__("admin.toast.config_copied"), "success");
                });
            }

            const importActionBtn = document.getElementById("flwp-btn-modal-import-action");
            if (importActionBtn) {
                importActionBtn.addEventListener("click", () => {
                    const raw = selectArea.value.trim();
                    if (!raw) {
                        utils.showToast(__("admin.toast.invalid_json"), "error");
                        return;
                    }
                    try {
                        const parsed = JSON.parse(raw);
                        const validated = api.validateFormState(parsed);
                        if (validated) {
                            Object.assign(state, validated);
                            controller.loadFormStateToInputs();
                            engine.renderStepCanvas(1);
                            engine.renderStepCanvas(2);
                            controller.setStepFocus(1);
                            modal.classList.remove("flwp-modal-overlay-active");
                            utils.showToast(__("admin.toast.config_loaded"), "success");
                            api.saveStateToLocalStorage();
                        }
                    } catch (e) {
                        utils.showToast(__("admin.toast.import_error", { error: e.message }), "error");
                    }
                });
            }
        },
        initTemplatesModal: function() {
            const modal = document.getElementById("flwp-modal-templates");
            const trigger = document.getElementById("flwp-btn-load-templates");

            if (trigger) {
                trigger.addEventListener("click", () => {
                    modal.classList.add("flwp-modal-overlay-active");
                    FormBuilderTemplates.init();
                });
            }

            const closeTmplBtn = document.getElementById("flwp-btn-close-tmpl-modal");
            if (closeTmplBtn) {
                closeTmplBtn.addEventListener("click", () => modal.classList.remove("flwp-modal-overlay-active"));
            }
            const cancelTmplBtn = document.getElementById("flwp-btn-close-tmpl-cancel");
            if (cancelTmplBtn) {
                cancelTmplBtn.addEventListener("click", () => modal.classList.remove("flwp-modal-overlay-active"));
            }
        },
        syncTargetingStateToUI: function() {
            const sectionTitle = document.getElementById("flwp-targeting-section-title");
            if (sectionTitle) {
                const label = state.settings.display.displayType === "in-content" ? "In-Content" : "Overlay";
                sectionTitle.innerHTML = `<i class="fas fa-bullseye"></i> ${__('admin.builder.display_type_label', { label: label })}`;
            }

            // Sicherstellen, dass der aktive Targeting-Typ zum aktuellen Hauptanzeigetyp passt
            if (state.settings.display.displayType === "in-content") {
                if (uiState.activeTargetingType !== "in-content" && uiState.activeTargetingType !== "shortcode") {
                    uiState.activeTargetingType = "in-content";
                }
            } else if (state.settings.display.displayType === "overlay") {
                if (uiState.activeTargetingType !== "overlay") {
                    uiState.activeTargetingType = "overlay";
                }
            }

            // Sub-Tabs dynamisch rendern
            const tabsContainer = document.getElementById("flwp-targeting-tabs-container");
            if (tabsContainer) {
                tabsContainer.innerHTML = "";
                let tabsToRender = [];
                if (state.settings.display.displayType === "in-content") {
                    tabsToRender = [
                        { type: "in-content", label: __('admin.builder.targeting_tabs.in_content'), icon: "fa-file-invoice" },
                        { type: "shortcode", label: __('admin.builder.targeting_tabs.shortcode'), icon: "fa-code" }
                    ];
                } else {
                    tabsToRender = [
                        { type: "overlay", label: __('admin.builder.targeting_tabs.overlay'), icon: "fa-window-restore" }
                    ];
                }

                tabsToRender.forEach(tab => {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "flwp-targeting-tab-btn";
                    if (tab.type === uiState.activeTargetingType) {
                        btn.classList.add("flwp-targeting-tab-btn-active");
                    }
                    btn.dataset.targetingType = tab.type;

                    const icon = document.createElement("i");
                    icon.className = `fas ${tab.icon}`;
                    btn.appendChild(icon);
                    btn.appendChild(document.createTextNode(" " + tab.label));

                    btn.addEventListener("click", () => {
                        uiState.activeTargetingType = tab.type;
                        controller.syncTargetingStateToUI();

                        try {
                            const url = new URL(window.location.href);
                            if (url.searchParams.get('targeting_tab') !== tab.type) {
                                url.searchParams.set('targeting_tab', tab.type);
                                window.history.pushState({}, '', url.toString());
                            }
                        } catch (e) {
                            console.error("Failed to update URL parameters", e);
                        }
                    });

                    tabsContainer.appendChild(btn);
                });
            }

            // Interactive Condition Builder instantiieren
            const conditionContainer = document.getElementById("flwp-targeting-condition-builder-container");
            if (conditionContainer) {
                const typeCfg = state.targeting[uiState.activeTargetingType];
                if (typeCfg) {
                    new FLWPConditionBuilder(
                        conditionContainer,
                        typeCfg,
                        (updatedConfig) => {
                            state.targeting[uiState.activeTargetingType] = updatedConfig;
                            api.saveStateToLocalStorage();
                        },
                        {
                            isPro: globalConfig.isPro,
                            openProUpgradeModal: () => engine.openProUpgradeModal()
                        }
                    );
                }
            }
        },
        loadFormStateToInputs: function() {
            if (elFormTitle) elFormTitle.value = state.settings.main.title;
            if (elActiveFormIdDisplay) elActiveFormIdDisplay.textContent = flwpFormBuilder.formId;
            if (elLastUpdatedDisplay) elLastUpdatedDisplay.textContent = utils.formatDate(flwpFormBuilder.formSavedTimestamp, config.locale);
            if (elLastPublishedDisplay) {
                elLastPublishedDisplay.textContent = flwpFormBuilder.formPublishedTimestamp ? utils.formatDate(flwpFormBuilder.formPublishedTimestamp, config.locale) : '-';
            }
            const setIDEl = document.getElementById("flwp-setting-form-id");
            if (setIDEl) setIDEl.value = flwpFormBuilder.formId;

            controller.updateStatusBadge(state.status);

            const accentColorEl = document.getElementById("flwp-style-accent-color");
            if (accentColorEl) accentColorEl.value = state.settings.styles.accentColor || "#000000";
            const accentHexEl = document.getElementById("flwp-style-accent-hex");
            if (accentHexEl) accentHexEl.value = (state.settings.styles.accentColor || "#000000").toUpperCase();

            const secondaryColorEl = document.getElementById("flwp-style-secondary-color");
            if (secondaryColorEl) secondaryColorEl.value = state.settings.styles.secondaryColor || "#555555";
            const secondaryHexEl = document.getElementById("flwp-style-secondary-hex");
            if (secondaryHexEl) secondaryHexEl.value = (state.settings.styles.secondaryColor || "#555555").toUpperCase();

            // const customMinHeightVal = state.settings.display.globalData.spacing.customMinHeight;
            // const minHeightEl = document.getElementById("flwp-style-min-height");
            // if (minHeightEl) minHeightEl.value = (customMinHeightVal !== undefined && customMinHeightVal !== null) ? customMinHeightVal : '';

            engine.updateDisplayTypeUI();

            let confType = state.confirmation.type || 'message';
            document.getElementById("flwp-style-confirm-type").value = confType;
            document.getElementById("flwp-config-group-confirm-msg").style.display = "flex";
            document.getElementById("flwp-config-group-confirm-ext-url").style.display = confType === 'url' ? "flex" : "none";

            document.getElementById("flwp-style-confirm-color").value = (state.confirmation.textColor || state?.settings?.style?.accentColor || "#000000").toUpperCase();
            document.getElementById("flwp-style-confirm-hex").value = (state.confirmation.textColor || state?.settings?.style?.accentColor || "#000000").toUpperCase();

            const loadedMsg = state.confirmation.message || '';
            document.getElementById("flwp_confirm_message_text").value = loadedMsg;
            if (window.tinymce) {
                const editor = window.tinymce.get("flwp_confirm_message_text");
                if (editor) {
                    editor.setContent(loadedMsg);
                }
            }

            document.getElementById("flwp-config-confirm-url").value = state.confirmation.extUrl || '';

            const notifyEnabled = state.notification.enabled ?? true;
            document.getElementById("flwp-notification-enabled").checked = notifyEnabled;
            document.getElementById("flwp-notification-settings-fields-group").style.opacity = notifyEnabled ? "1" : "0.5";

            document.getElementById("flwp-notify-recipient").value = state.notification.recipient || '';
            document.getElementById("flwp-notify-subject").value = state.notification.subject || '';
            document.getElementById("flwp-notify-sender-name").value = state.notification.senderName || '';
            document.getElementById("flwp-notify-sender-email").value = state.notification.senderEmail || '';

            document.getElementById("flwp-setting-custom-classes").value = state.settings.main.customClasses || '';
            document.getElementById("flwp-setting-honeypot").checked = state.settings.main.honeypot ?? true;

            // Ensure tracking settings exist on load
            if (!state.settings.tracking) {
                state.settings.tracking = {
                    enabled: true,
                    url: true,
                    pageTitle: true,
                    referrer: true,
                    userAgent: true,
                    language: true,
                    screenResolution: true,
                    viewportSize: true,
                    timezone: true,
                    connectionType: true,
                    deviceType: true,
                    anonymizedSessionId: true,
                    timeOnPageSeconds: true,
                    colorScheme: true
                };
            }

            const tracking = state.settings.tracking;
            const trackingEnabled = tracking.enabled ?? true;

            const trackingMainToggle = document.getElementById("flwp-setting-tracking-enabled");
            if (trackingMainToggle) {
                trackingMainToggle.checked = trackingEnabled;
            }
            const trackingGroup = document.getElementById("flwp-tracking-settings-fields-group");
            if (trackingGroup) {
                trackingGroup.style.opacity = trackingEnabled ? "1" : "0.5";
            }

            const trackingFields = [
                "url", "pageTitle", "referrer", "userAgent", "language",
                "screenResolution", "viewportSize", "timezone", "connectionType",
                "deviceType", "anonymizedSessionId", "timeOnPageSeconds", "colorScheme"
            ];

            trackingFields.forEach(field => {
                const el = document.getElementById(`flwp-setting-tracking-${field}`);
                if (el) {
                    el.checked = tracking[field] ?? true;
                    el.disabled = !trackingEnabled;
                }
            });

            controller.syncTargetingStateToUI();
        },
        updateStatusBadge: function(newStatus) {
            newStatus = parseInt(newStatus) || 1;
            state.status = newStatus;

            let statusText = __("admin.toast.status_paused");
            let badgeClass = "flwp-status-paused";
            if (newStatus === 2) {
                statusText = __("admin.toast.status_live");
                badgeClass = "flwp-status-live";
            } else if (newStatus === 3) {
                statusText = __("admin.toast.status_admin_only");
                badgeClass = "flwp-status-admin-only";
            }

            if (elFormStatusText) elFormStatusText.textContent = statusText;
            if (elFormStatusBadge) {
                elFormStatusBadge.className = "flwp-status-indicator " + badgeClass;
            }

            const dropdownItems = document.querySelectorAll("#flwp-status-dropdown-menu .flwp-status-dropdown-item");
            dropdownItems.forEach(item => {
                const itemStatus = parseInt(item.getAttribute("data-status"));
                if (itemStatus === newStatus) {
                    item.classList.add("is-active");
                } else {
                    item.classList.remove("is-active");
                }
            });
        }
    };

    const init = async function() {
        api.cleanupExpiredLocalStorage();
        api.loadStateFromLocalStorage();

        controller.loadFormStateToInputs();

        engine.renderStepCanvas(1);
        engine.renderStepCanvas(2);
        controller.setStepFocus(1);

        // Initial check for submit button logic to show/hide warning banner and auto-pause if live
        api.checkSubmitButtonLogic();

        const viewsTriggers = document.querySelectorAll(".flwp-nav-tab");
        viewsTriggers.forEach(tab => {
            tab.addEventListener("click", () => controller.handleMainViewSwitch(tab.dataset.view));
        });

        const sidebarTriggers = document.querySelectorAll(".flwp-sidebar-tab-trigger");
        sidebarTriggers.forEach(trigger => {
            trigger.addEventListener("click", () => controller.switchSidebarTab(trigger.dataset.panel));
        });

        controller.bindOptionsLiveEditing();
        controller.initDragAndDropEngine();
        controller.initFieldsSearch();
        controller.bindConfigurationInputs();
        controller.initExportImportSystem();
        controller.initTemplatesModal();
        engine.initProUpgradeModal();
        window.flwpTemplateDisplayController = initFormBuilderTemplateDisplay({ state, engine, utils, api, controller });

        const undoBtn = document.getElementById("flwp-btn-undo");
        if (undoBtn) undoBtn.addEventListener("click", history.handleUndo);

        const redoBtn = document.getElementById("flwp-btn-redo");
        if (redoBtn) redoBtn.addEventListener("click", history.handleRedo);
        history.initHistoryKeyboardShortcuts();
        history.updateUndoRedoButtons();

        // Support closing context menu and status dropdown on external events
        document.addEventListener("click", (e) => {
            controller.closeContextMenu();
            const dropdown = document.getElementById("flwp-status-dropdown-menu");
            const trigger = document.getElementById("flwp-btn-change-status");
            if (dropdown && !dropdown.contains(e.target) && trigger && !trigger.contains(e.target)) {
                dropdown.classList.remove("flwp-status-dropdown-active");
            }
        });
        document.addEventListener("scroll", () => {
            controller.closeContextMenu();
            const dropdown = document.getElementById("flwp-status-dropdown-menu");
            if (dropdown) dropdown.classList.remove("flwp-status-dropdown-active");
        }, true);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                controller.closeContextMenu();
                const dropdown = document.getElementById("flwp-status-dropdown-menu");
                if (dropdown) dropdown.classList.remove("flwp-status-dropdown-active");
            }
        });

        const btnChangeStatus = document.getElementById("flwp-btn-change-status");
        const dropdownStatusMenu = document.getElementById("flwp-status-dropdown-menu");

        if (btnChangeStatus && dropdownStatusMenu) {
            btnChangeStatus.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownStatusMenu.classList.toggle("flwp-status-dropdown-active");
            });

            const dropdownItems = dropdownStatusMenu.querySelectorAll(".flwp-status-dropdown-item");
            dropdownItems.forEach(item => {
                item.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const next = parseInt(item.getAttribute("data-status"));
                    dropdownStatusMenu.classList.remove("flwp-status-dropdown-active");

                    if (next === state.status) return;

                    if (next !== 1) {
                        if (!FormValidator.checkAndShowToasts(state)) {
                            return;
                        }
                    }
                    controller.updateStatusBadge(next);
                    api.saveStateToLocalStorage();
                    api.saveStatusToDatabase(next);

                    let statusName = __("admin.toast.status_paused");
                    if (next === 2) statusName = __("admin.toast.status_live");
                    else if (next === 3) statusName = __("admin.toast.status_admin_only");

                    utils.showToast(__("admin.toast.status_changed", { status: statusName }), "success");
                });
            });
        }

        const saveDraftBtn = document.getElementById("flwp-btn-save-draft");
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener("click", () => {
                if (!FormValidator.checkAndShowToasts(state)) {
                    return;
                }

                api.saveStateToLocalStorage();
                api.saveStateToDatabase('preview');
            });
        }

        const publishBtn = document.getElementById("flwp-btn-publish");
        if (publishBtn) {
            publishBtn.addEventListener("click", () => {
                if (!FormValidator.checkAndShowToasts(state)) {
                    return;
                }

                api.saveStateToLocalStorage();
                api.saveStateToDatabase('live');
            });
        }

        const closeAppBtn = document.getElementById("flwp-btn-close-app");
        if (closeAppBtn) {
            closeAppBtn.addEventListener("click", () => {
                if (confirm(__('admin.builder.leave_editor_confirm'))) {
                    window.location.href = "/wp-admin/admin.php?page=flwp-forms";
                }
            });
        }

        const openModalBtn = document.getElementById("flwp-btn-preview-modal");
        if (openModalBtn) openModalBtn.addEventListener("click", engine.openWidgetPreview);

        if (elBtnToggleSplitPreview) elBtnToggleSplitPreview.addEventListener("click", () => engine.toggleSplitPreview());

        const splitCloseBtn = document.getElementById("flwp-btn-split-preview-close");
        if (splitCloseBtn) splitCloseBtn.addEventListener("click", () => engine.toggleSplitPreview(false));

        const splitRestartBtn = document.getElementById("flwp-btn-split-preview-restart");
        if (splitRestartBtn) {
            splitRestartBtn.addEventListener("click", () => {
                engine.renderSplitPreview(true);
                utils.showToast(__("admin.toast.split_preview_reset"), "info");
            });
        }

        engine.toggleSplitPreview(uiState.isSplitPreviewVisible);

        if (elStep1Header) {
            elStep1Header.addEventListener("click", () => {
                if (uiState.activeStepView === 2) controller.setStepFocus(1);
            });
        }

        if (elStep2Card) {
            elStep2Card.addEventListener("click", () => {
                if (elStep2Card.classList.contains("flwp-step-card-shrunken")) {
                    if (engine.isOptionStep2ActiveOnStep1()) controller.setStepFocus(2);
                    else utils.showToast(__("admin.toast.activate_step2_first"), "error");
                }
            });
        }

        if (elStep2NavToggle) {
            elStep2NavToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                if (uiState.activeStepView === 1) {
                    if (engine.isOptionStep2ActiveOnStep1()) controller.setStepFocus(2);
                    else utils.showToast(__("admin.toast.activate_step2_first"), "error");
                } else {
                    controller.setStepFocus(1);
                }
            });
        }

        // Restore active tabs and views from URL parameters if present
        const restoreTabsFromUrl = function(showToastFlag) {
            try {
                const urlParams = new URLSearchParams(window.location.search);

                // 1. Restore Main View (fields, general, styles, etc.)
                const savedView = urlParams.get('view');
                if (savedView && ["fields", "general", "styles", "display", "targeting", "confirmation", "notification", "tracking"].includes(savedView)) {
                    controller.handleMainViewSwitch(savedView, showToastFlag);
                } else if (!savedView) {
                    // Default view if none specified in URL (e.g. initial view)
                    controller.handleMainViewSwitch("fields", false);
                }

                // 2. Restore Display Sub-Tab (in-content, overlay)
                const savedDisplayTab = urlParams.get('display_tab');
                if (savedDisplayTab && ["in-content", "overlay"].includes(savedDisplayTab)) {
                    state.settings.display.displayType = savedDisplayTab;
                    uiState.activeDisplayTab = savedDisplayTab;
                    engine.updateDisplayTypeUI();
                }

                // 3. Restore Targeting Sub-Tab (in-content, overlay, shortcode)
                const savedTargetingTab = urlParams.get('targeting_tab');
                if (savedTargetingTab && ["in-content", "shortcode", "overlay"].includes(savedTargetingTab)) {
                    uiState.activeTargetingType = savedTargetingTab;
                    controller.syncTargetingStateToUI();
                }
            } catch (e) {
                console.error("Failed to restore tabs from URL parameters", e);
            }
        };

        // Call immediately on page initialization
        restoreTabsFromUrl(false);

        // Listen to browser back/forward buttons to automatically switch views/tabs accordingly
        window.addEventListener("popstate", () => {
            restoreTabsFromUrl(false);
        });

        // utils.showToast(__("admin.toast.initialized"), "success");
    };

    return {
        config,
        state,
        uiState,
        utils,
        history,
        api,
        engine,
        controller,
        init
    };
})();

window.FLWPFormBuilder = FLWPFormBuilder;

if (document.readyState === 'complete') {
    FLWPFormBuilder.init();
} else {
    window.addEventListener('load', FLWPFormBuilder.init);
}
