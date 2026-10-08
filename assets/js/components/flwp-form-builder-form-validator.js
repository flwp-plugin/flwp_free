import { utils } from './flwp-form-utils.js';

/**
 * Configuration of form validation rules.
 * Easily expandable for future warnings and validations.
 */

import { __ } from './flwp-i18n.js';

export const VALIDATION_RULES = [
    {
        id: 'step1-missing-submit-button',
        elementId: 'flwp-step1-missing-submit-warning',
        showBanner: true,
        blockSave: true,
        getMessage: () => __('admin.warning.submit_button'),
        check: (state) => utils.hasSubmitProblem(state && state.steps && state.steps.step1)
    },
    {
        id: 'step2-empty',
        elementId: 'flwp-step2-empty-warning',
        showBanner: true,
        blockSave: true,
        getMessage: () => __('admin.warning.step2_empty'),
        check: (state) => utils.hasStep2Problem(state)
    },
    {
        id: 'step2-missing-submit-button',
        elementId: 'flwp-step2-missing-submit-warning',
        showBanner: true,
        blockSave: true,
        getMessage: () => __('admin.warning.step2_missing_submit'),
        check: (state) => utils.hasStep2SubmitProblem(state)
    },
    {
        id: 'form-completely-empty',
        showBanner: false,
        blockSave: true,
        getMessage: () => __('admin.warning.empty_form'),
        check: (state) => !state || !state.steps || !Array.isArray(state.steps.step1) || state.steps.step1.length === 0
    }
];

export const FormValidator = {
    /**
     * Active validation rules array.
     */
    rules: VALIDATION_RULES,

    /**
     * Validates the form state against all configured rules.
     * @param {Object} state Form state object
     * @returns {Object} { isValid: boolean, errors: Array<{ id: string, elementId?: string, showBanner: boolean, blockSave: boolean, message: string }> }
     */
    validate: function(state) {
        const errors = [];
        for (const rule of this.rules) {
            if (rule.check && rule.check(state)) {
                errors.push({
                    id: rule.id,
                    elementId: rule.elementId,
                    showBanner: rule.showBanner !== false,
                    blockSave: rule.blockSave !== false,
                    message: typeof rule.getMessage === 'function' ? rule.getMessage() : (rule.message || '')
                });
            }
        }
        return {
            isValid: errors.filter(err => err.blockSave).length === 0,
            errors
        };
    },

    /**
     * Main validation function returning a simple boolean (true if saving is allowed).
     * @param {Object} state Form state object
     * @returns {boolean} True if valid for saving, false if invalid
     */
    isFormValid: function(state) {
        return this.validate(state).isValid;
    },

    /**
     * Updates visibility and renders warning banner elements in the DOM dynamically.
     * Shows only the first active warning banner. If multiple warnings exist, displays a count badge.
     * @param {Object} state Form state object
     */
    updateWarningBanners: function(state) {
        const result = this.validate(state);
        const bannerErrors = result.errors.filter(err => err.showBanner);
        const container = document.getElementById("flwp-warning-banners-container");

        if (container) {
            container.innerHTML = "";
            if (bannerErrors.length > 0) {
                const firstError = bannerErrors[0];
                const tmpl = document.getElementById("flwp-tmpl-warning-banner");

                if (tmpl && tmpl.content) {
                    const clone = tmpl.content.cloneNode(true);
                    const bannerEl = clone.querySelector(".flwp-submit-warning-banner");
                    const textEl = clone.querySelector(".flwp-warning-text") || clone.querySelector("span");
                    if (textEl) {
                        textEl.textContent = firstError.message;
                    }
                    if (firstError.elementId && bannerEl) {
                        bannerEl.id = firstError.elementId;
                    }

                    const badgeEl = clone.querySelector(".flwp-warning-count-badge");
                    if (badgeEl && bannerErrors.length > 1) {
                        badgeEl.textContent = `+${bannerErrors.length - 1}`;
                        badgeEl.title = __('validation.error.active_warnings', { count: bannerErrors.length });
                        badgeEl.style.display = "inline-block";
                    }

                    container.appendChild(clone);
                } else {
                    const bannerEl = document.createElement("div");
                    bannerEl.className = "flwp-submit-warning-banner";
                    if (firstError.elementId) {
                        bannerEl.id = firstError.elementId;
                    }
                    let badgeHtml = "";
                    if (bannerErrors.length > 1) {
                        badgeHtml = `<span class="flwp-warning-count-badge" title="${__('validation.error.active_warnings', { count: bannerErrors.length })}" style="display: inline-block;">+${bannerErrors.length - 1}</span>`;
                    }
                    bannerEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span class="flwp-warning-text"></span>${badgeHtml}`;
                    bannerEl.querySelector(".flwp-warning-text").textContent = firstError.message;
                    container.appendChild(bannerEl);
                }
            }
        } else {
            // Fallback for static elements in DOM
            for (const rule of this.rules) {
                if (rule.elementId && rule.showBanner !== false) {
                    const el = document.getElementById(rule.elementId);
                    if (el) {
                        el.style.display = (bannerErrors.length > 0 && bannerErrors[0].id === rule.id) ? "flex" : "none";
                    }
                }
            }
        }
    },

    /**
     * Validates the form state and displays a toast notification for the first blocking rule if invalid.
     * @param {Object} state Form state object
     * @returns {boolean} True if valid for saving, false if blocked
     */
    checkAndShowToasts: function(state) {
        const result = this.validate(state);
        const blockingErrors = result.errors.filter(err => err.blockSave);

        if (blockingErrors.length > 0) {
            utils.showToast(blockingErrors[0].message, "error");
            return false;
        }
        return true;
    }
};
