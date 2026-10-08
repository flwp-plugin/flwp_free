import { utils, logger } from '../components/flwp-form-utils.js';
import { config } from '../components/flwp-form-config.js';
import { FLWPFormValidator } from '../components/flwp-form-frontend-form-validation.js';
import { __ } from '../components/flwp-i18n.js';
import { fields } from '../components/flwp-form-fields.js';

(function() {
    let parsedOverlays = [];
    if (typeof window.flwpActiveOverlayData !== "undefined" && window.flwpActiveOverlayData.overlayData) {
        try {
            const parsed = JSON.parse(window.flwpActiveOverlayData.overlayData);
            if (Array.isArray(parsed)) {
                parsedOverlays = parsed;
            }
        } catch (e) {
            console.error("FLWP: Error while parsing flwpActiveOverlayData.overlayData:", e);
        }
    } else if (Array.isArray(window.flwpActiveOverlays)) {
        parsedOverlays = window.flwpActiveOverlays;
    }
    window.flwpActiveOverlays = parsedOverlays;
})();

const api = {
    fetchFormsData: function(formIds) {
        if (typeof flwpFormFrontend === "undefined") {
            console.error("FLWP: flwpFormFrontend is not defined. AJAX cannot be performed.");
            return Promise.reject("flwpFormFrontend not defined");
        }
        const formData = new FormData();
        formData.append('action', 'flwp_get_forms_data');
        formData.append('nonce', flwpFormFrontend.nonce);
        Array.from(formIds).forEach(id => formData.append('form_ids[]', id));

        return fetch(flwpFormFrontend.ajaxurl, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                    });
                }
                return response.json();
            });
    },

    submitFeedback: function(formId, answers, formType = 'shortcode', containerEl = null, activeStep2TriggerId = '') {
        if (typeof flwpFormFrontend === "undefined") {
            console.error("FLWP: flwpFormFrontend is not defined. AJAX cannot be performed.");
            return Promise.reject("flwpFormFrontend not defined");
        }
        const formData = new FormData();
        formData.append('action', 'flwp_submit_feedback');
        formData.append('nonce', flwpFormFrontend.nonce);
        formData.append('form_id', formId);
        formData.append('form_type', formType);
        formData.append('answers', JSON.stringify(answers));

        // Get activeStep2TriggerId
        let finalTriggerId = activeStep2TriggerId || '';
        if (!finalTriggerId && containerEl) {
            finalTriggerId = containerEl.flwpStep2TriggerId || '';
        }
        if (finalTriggerId) {
            formData.append('active_step2_trigger_id', finalTriggerId);
        }

        const stateObj = containerEl ? containerEl.flwpStateObj : null;
        const trackingData = utils.getTrackingData(stateObj);
        formData.append('tracking_data', JSON.stringify(trackingData));

        let hpValue = "";
        if (containerEl) {
            const hpInput = containerEl.querySelector('input[name="flwp_hp_field"]');
            if (hpInput) {
                hpValue = hpInput.value;
            }
        } else {
            const hpInput = document.querySelector(`[data-form-id="${formId}"] input[name="flwp_hp_field"]`);
            if (hpInput) {
                hpValue = hpInput.value;
            }
        }
        formData.append('flwp_hp_field', hpValue);

        return fetch(flwpFormFrontend.ajaxurl, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                    });
                }
                return response.json();
            });
    }
};

class FLWPOverlayController {
    static instances = new Set();

    static closeAll(formId) {
        FLWPOverlayController.instances.forEach(instance => {
            if (String(instance.formId) === String(formId)) {
                instance.close();
            }
        });
    }

    constructor(config) {
        this.config = config;
        this.formId = config.id;
        this.overlayId = `flwp-overlay-container-${this.formId}`;
        this.overlayEl = null;
        this.innerPlaceholderEl = null;
        this.standardBtnEl = null;
        this.isTriggered = false;
        this.delayTimer = null;
        this.scrollListener = null;
        this.escKeyListener = null;
        this.backdropListener = null;

        FLWPOverlayController.instances.add(this);
    }

    init() {
        if (this.isFrequencyCapped()) {
            console.log(`FLWP Overlay: Form ${this.formId} is frequency capped. Skipping trigger registration.`);
            this.hideTrigger();
            return;
        }

        if (this.config.triggerSettings.useStandard) {
            this.createFeedbackButton();

            window.addEventListener('resize', () => {
                const feedbackButton = document.querySelector('.flwp-feedback-button-widget-button');
                if (feedbackButton) {
                    document.body.removeChild(feedbackButton.parentNode);
                }

                this.createFeedbackButton();
            });
        }

        this.setupTrigger();
    }

    hideTrigger() {
        // Hide standard feedback button if it exists
        if (this.standardBtnEl) {
            const wrapper = this.standardBtnEl.closest(".flwp-feedback-plugin");
            if (wrapper) {
                wrapper.style.display = "none";
            } else {
                this.standardBtnEl.style.display = "none";
            }
        }

        // Hide custom click selectors if defined
        if (this.config.trigger === 'click' && this.config.triggerSettings && this.config.triggerSettings.clickSelector) {
            try {
                const targets = document.querySelectorAll(this.config.triggerSettings.clickSelector);
                targets.forEach(target => {
                    target.style.display = "none";
                });
            } catch (e) {
                console.warn("FLWP: Error hiding custom selectors", e);
            }
        }
    }

    isFrequencyCapped() {
        if (this.config && this.config.isPreview) {
            return false;
        }
        const scope = (this.config.globalData && this.config.globalData.cookieScope) || "domain";
        const pathHash = (window.flwpFormFrontend && window.flwpFormFrontend.pathHash) ? `_${window.flwpFormFrontend.pathHash}` : "";
        const pathKey = scope === "page" ? pathHash : "";
        const closeCookie = `flwp_closed_${this.formId}${pathKey}`;
        const submitCookie = `flwp_submitted_${this.formId}${pathKey}`;
        if (utils.getCookie(closeCookie) || utils.getCookie(submitCookie)) {
            return true;
        }
        return false;
    }

    createFeedbackButton() {
        const targetContainer = (this.config && this.config.targetContainer) || document.body;
        if (targetContainer.querySelector('.flwp-feedback-button-widget-button')) {
            console.log("FLWP Overlay: feedback-button already exists in this container.");
            return;
        }

        const btnId = `flwp-standard-feedback-btn-${this.formId}`;
        const btn = document.createElement("button");
        btn.id = btnId;

        const fbConf = (this.config.triggerSettings && this.config.triggerSettings.feedbackButton) || {};

        btn.classList = `flwp-feedback-button-widget-button`;
        if (window.matchMedia("(max-width: 767px)").matches) {
            const icon = document.createElement("i");
            icon.className = "fa-solid fa-comment-dots flwp-feedback-button-widget-button-icon";
            btn.appendChild(icon);
        } else {
            const textSpan = document.createElement("span");
            textSpan.className = "flwp-feedback-button-widget-button-text";
            textSpan.textContent = fbConf.text || "Feedback";
            btn.appendChild(textSpan);

            const position = fbConf.position || "right-middle";
            const posClass = `flwp-feedback-button-widget-button--${position}`;
            btn.classList.add(posClass);
        }

        if (fbConf.customStylesEnabled !== false) {
            if (fbConf.bgColor) btn.style.setProperty('--flwp-fb-btn-bg', fbConf.bgColor);
            if (fbConf.textColor) btn.style.setProperty('--flwp-fb-btn-color', fbConf.textColor);
            if (fbConf.borderColor) btn.style.setProperty('--flwp-fb-btn-border', fbConf.borderColor);
            if (fbConf.hoverBgColor) btn.style.setProperty('--flwp-fb-btn-hover-bg-color', fbConf.hoverBgColor);
            if (fbConf.hoverTextColor) btn.style.setProperty('--flwp-fb-btn-hover-color', fbConf.hoverTextColor);
            if (fbConf.hoverBorderColor) btn.style.setProperty('--flwp-fb-btn-hover-border-color', fbConf.hoverBorderColor);
            if (fbConf.fontSize) btn.style.fontSize = `${fbConf.fontSize}px`;
        }

        btn.addEventListener("click", () => {
            this.open();
            targetContainer.classList.add("flwp-feedback-button-widget-is-open");
        });

        const wrapper = document.createElement("div");
        wrapper.className = "flwp-feedback-plugin";
        wrapper.appendChild(btn);

        targetContainer.appendChild(wrapper);
        this.standardBtnEl = btn;

        if (this.config && this.config.isPreview) {
            btn.classList.add('flwp-feedback-button-widget-button--visible');
        } else {
            const handleScroll = () => {
                if (window.matchMedia("(min-width: 768px)").matches) {
                    const scrollThreshold = 400;
                    const maxScroll = Math.max(
                        0,
                        document.documentElement.scrollHeight - window.innerHeight
                    );

                    // Wenn die Seite weniger als 400px scrollbar ist: immer anzeigen
                    // Andernfalls: erst ab Erreichen der 400px anzeigen
                    const isShortPage = maxScroll < scrollThreshold;
                    const hasScrolledPastThreshold = window.scrollY > scrollThreshold;

                    if (isShortPage || hasScrolledPastThreshold) {
                        btn.classList.add('flwp-feedback-button-widget-button--visible');
                    } else {
                        btn.classList.remove('flwp-feedback-button-widget-button--visible');
                    }
                } else {
                    btn.classList.remove('flwp-feedback-button-widget-button--visible');
                }
            };

            window.addEventListener('scroll', handleScroll);
            handleScroll();
        }
    }

    setupTrigger() {
        const type = this.config.trigger || "click";

        if (type === "click") {
            const selector = this.config.triggerSettings.clickSelector;
            if (selector) {
                const setupClickListeners = () => {
                    try {
                        const targets = document.querySelectorAll(selector);
                        targets.forEach(target => {
                            if (!target.dataset.flwpHasOverlayListener) {
                                target.dataset.flwpHasOverlayListener = "true";
                                target.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.open();
                                });
                            }
                        });
                    } catch (e) {}
                };
                setupClickListeners();
                setTimeout(setupClickListeners, 1000);
                setTimeout(setupClickListeners, 3000);
            }
        } else if (type === "exit-intent") {
            let triggeredOnThisSession = false;
            const sessionStartTime = Date.now();
            const exitDelay = (this.config.triggerSettings && this.config.triggerSettings.exitIntentDelay) || "immediate";
            let requiredMs = 0;
            if (exitDelay === "5s") requiredMs = 5000;
            else if (exitDelay === "10s") requiredMs = 10000;
            else if (exitDelay === "60s") requiredMs = 60000;

            const exitListener = (e) => {
                if (triggeredOnThisSession) return;
                if (Date.now() - sessionStartTime < requiredMs) return;
                if (e.clientY < 20) {
                    triggeredOnThisSession = true;
                    document.removeEventListener("mouseleave", exitListener);
                    this.open();
                }
            };
            document.addEventListener("mouseleave", exitListener);
        } else if (type === "delay") {
            const delaySeconds = this.config.triggerSettings.delaySeconds || 5;
            this.delayTimer = setTimeout(() => {
                this.open();
            }, delaySeconds * 1000);
        } else if (type === "scroll") {
            const scrollType = this.config.triggerSettings.scrollType || "end";
            const percent = this.config.triggerSettings.scrollPercent || 50;

            this.scrollListener = () => {
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (docHeight <= 0) return;

                const scrolled = window.scrollY;
                if (scrollType === "end") {
                    if (scrolled >= docHeight - 10) {
                        this.open();
                    }
                } else if (scrollType === "percent") {
                    const currentPercent = (scrolled / docHeight) * 100;
                    if (currentPercent >= percent) {
                        this.open();
                    }
                }
            };

            window.addEventListener("scroll", this.scrollListener);
        }
    }

    open() {
        if (!this.config.isPreview && this.isTriggered) return;
        if (this.isTriggered) return;
        if (this.isFrequencyCapped()) return;

        this.isTriggered = true;

        if (this.scrollListener) {
            window.removeEventListener("scroll", this.scrollListener);
            this.scrollListener = null;
        }

        const targetContainer = (this.config && this.config.targetContainer) || document.body;
        let overlay = document.getElementById(this.overlayId);

        if (!overlay) {
            const template = document.getElementById("flwp-general-overlay-template");
            const position = this.config.globalData.position || "center";
            const showBackdrop = this.config.globalData.showBackdrop !== false && this.config.globalData.showBackdrop !== "0" && this.config.globalData.showBackdrop !== 0;
            const noBackdropClass = showBackdrop ? "" : " flwp-overlay-no-backdrop";

            if (template) {
                const clone = template.content.cloneNode(true);
                overlay = clone.querySelector(".flwp-feedback-plugin");

                overlay.id = this.overlayId;
                const previewClass = this.config.isPreview ? " flwp-preview-mode" : "";
                overlay.className = `flwp-feedback-plugin flwp-general-overlay-backdrop flwp-overlay-pos-${position}${noBackdropClass}${previewClass}`;

                const customStyleClasses = this.config?.style?.customClasses || '';
                if (customStyleClasses) {
                    overlay.classList.add(...this.config.style.customClasses.split(" ").filter(Boolean));
                }

                const modal = overlay.querySelector(".flwp-general-overlay-modal");
                if (modal) {
                    modal.className = `flwp-general-overlay-modal flwp-overlay-card-pos-${position}`;
                }

                const closeBtn = overlay.querySelector("#flwp-general-overlay-close-button") || overlay.querySelector(".flwp-general-overlay-close-button");
                if (closeBtn) {
                    closeBtn.addEventListener("click", () => this.close());
                }

                const placeholder = overlay.querySelector("#flwp-general-overlay-content") || overlay.querySelector(".flwp-feedback-type-placeholder");
                if (placeholder) {
                    placeholder.id = `flwp-general-overlay-content-${this.formId}`;
                    placeholder.setAttribute("data-form-id", this.formId);
                    placeholder.setAttribute("data-type", "overlay");
                    this.innerPlaceholderEl = placeholder;
                }

                targetContainer.appendChild(overlay);
                this.overlayEl = overlay;
            } else {
                overlay = document.createElement("div");
                overlay.id = this.overlayId;
                const previewClass = this.config.isPreview ? " flwp-preview-mode" : "";
                overlay.className = `flwp-feedback-plugin flwp-general-overlay-backdrop flwp-overlay-pos-${position}${noBackdropClass}${previewClass}`;

                const container = document.createElement("div");
                container.className = `flwp-general-overlay-modal flwp-overlay-card-pos-${position}`;

                const header = document.createElement("div");
                header.className = "flwp-overlay-header";

                const backBtn = document.createElement("button");
                backBtn.id = "flwp-general-overlay-back-button";
                backBtn.className = "flwp-general-overlay-icon-btn";
                backBtn.style.cssText = "display: none;";
                backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
                header.appendChild(backBtn);

                const indicatorWrapper = document.createElement("div");
                indicatorWrapper.className = "flwp-overlay-header-indicator-wrapper";

                const pbContainer = document.createElement("div");
                pbContainer.className = "flwp-general-overlay-progress-bar-container";
                pbContainer.style.cssText = "display: none;";
                const pbBar = document.createElement("div");
                pbBar.className = "flwp-general-overlay-progress-bar";
                pbContainer.appendChild(pbBar);
                indicatorWrapper.appendChild(pbContainer);

                const titleEl = document.createElement("div");
                titleEl.className = "flwp-overlay-header-title";
                titleEl.style.cssText = "display: none;";
                titleEl.textContent = this.config.name || "Feedback";
                indicatorWrapper.appendChild(titleEl);

                const stepIndicator = document.createElement("div");
                stepIndicator.className = "flwp-overlay-header-step-indicator";
                stepIndicator.style.cssText = "display: none;";
                indicatorWrapper.appendChild(stepIndicator);

                header.appendChild(indicatorWrapper);

                const closeBtn = document.createElement("button");
                closeBtn.id = "flwp-general-overlay-close-button";
                closeBtn.className = "flwp-general-overlay-icon-btn";
                closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                closeBtn.addEventListener("click", () => this.close());
                header.appendChild(closeBtn);

                container.appendChild(header);

                const body = document.createElement("div");
                body.className = "flwp-overlay-body";

                const placeholder = document.createElement("div");
                placeholder.className = "flwp-feedback-type-placeholder";
                placeholder.id = `flwp-general-overlay-content-${this.formId}`;
                placeholder.setAttribute("data-form-id", this.formId);
                placeholder.setAttribute("data-type", "overlay");
                body.appendChild(placeholder);

                container.appendChild(body);

                const footer = document.createElement("div");
                footer.className = "flwp-overlay-footer";
                footer.textContent = (this.config.style && this.config.style.customFooterText !== undefined && this.config.style.customFooterText !== null && this.config.style.customFooterText !== "")
                    ? this.config.style.customFooterText
                    : __('admin.frontend.default_footer_text');
                container.appendChild(footer);

                overlay.appendChild(container);
                targetContainer.appendChild(overlay);

                this.overlayEl = overlay;
                this.innerPlaceholderEl = placeholder;
            }
        } else {
            this.overlayEl = overlay;
            this.innerPlaceholderEl = overlay.querySelector(".flwp-feedback-type-placeholder") || overlay.querySelector(`#flwp-general-overlay-content-${this.formId}`);
        }

        this.overlayEl.offsetHeight;

        // Apply slide-in animations (resetting previous states if reused)
        const modal = this.overlayEl.querySelector(".flwp-general-overlay-modal");

        if (modal) {
            const subType = this.config.displaySubType || "modal";
            const position = this.config.globalData.position || "center";
            modal.classList.remove("slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");

            if (subType === "slide-in") {
                const isLeft = position.includes("left") || position === "left-middle";
                const isRight = position.includes("right") || position === "right-middle";
                if (isLeft) modal.classList.add("slide-in-left");
                else if (isRight) modal.classList.add("slide-in-right");
            }
        }

        this.overlayEl.classList.add("flwp-overlay-is-visible");

        const allowScroll = (this.config.globalData && this.config.globalData.allowBodyScroll);
        if (!this.config.isPreview && !allowScroll) {
            document.body.style.overflow = "hidden";
        }

        // Hide header/footer if configured
        const hideHeader = (this.config.globalData && this.config.globalData.hideHeader);
        const hideFooter = (this.config.globalData && this.config.globalData.hideFooter);
        const headerEl = this.overlayEl.querySelector(".flwp-overlay-header");
        const footerEl = this.overlayEl.querySelector(".flwp-overlay-footer");
        if (hideHeader && headerEl) headerEl.style.display = "none";
        if (hideFooter && footerEl) footerEl.style.display = "none";

        this.loadFormContent();
    }

    loadFormContent() {
        if (this.config && this.config.stateObj) {
            this.renderForm(this.config.stateObj);
            return;
        }
        const checkAndRender = () => {
            const cachedForm = window.flwpCachedData && window.flwpCachedData[this.formId];
            if (cachedForm && cachedForm.formData) {
                const stateObj = cachedForm.formData;
                this.renderForm(stateObj);
            } else {
                setTimeout(checkAndRender, 100);
            }
        };
        checkAndRender();
    }

    renderForm(stateObj) {
        const display = stateObj?.settings?.display || {};
        const displayType = display.displayType || "overlay";
        const displaySubType = display.displaySubType || "modal";
        const subTypeSettings = display.subTypeData?.[displaySubType] || {};

        const headerIndicator = (displayType === "overlay" && this.config && this.config.style) ? (this.config.style.headerIndicator || "title") : ((subTypeSettings.globalData && subTypeSettings.globalData.design && subTypeSettings.globalData.design.headerIndicator !== undefined)
            ? subTypeSettings.globalData.design.headerIndicator
            : 'none');
        const customTitle = (this.config && this.config.style && this.config.style.headerTitle) ? this.config.style.headerTitle.trim() : ((subTypeSettings.globalData && subTypeSettings.globalData.design && subTypeSettings.globalData.design.headerTitle)
            ? subTypeSettings.globalData.design.headerTitle.trim()
            : "");
        const formName = customTitle || this.config.name || "Feedback";
        const hideHeader = (this.config.globalData && this.config.globalData.hideHeader);
        const hideFooter = (this.config.globalData && this.config.globalData.hideFooter);

        const updateFooterUI = (step) => {
            if (!this.overlayEl) return;
            const footerEl = this.overlayEl.querySelector(".flwp-overlay-footer");
            if (!footerEl) return;
            if (hideFooter === true) return;

            const showFooterText = (this.config && this.config.style && this.config.style.showFooterText !== undefined)
                ? this.config.style.showFooterText
                : ((subTypeSettings.globalData && subTypeSettings.globalData.design && subTypeSettings.globalData.design.showFooterText !== undefined)
                    ? subTypeSettings.globalData.design.showFooterText
                    : true);

            if (showFooterText) {
                footerEl.style.display = "block";
                footerEl.innerHTML = "";
                const customFooter = (this.config && this.config.style && this.config.style.customFooterText !== undefined && this.config.style.customFooterText !== null)
                    ? this.config.style.customFooterText.trim()
                    : ((subTypeSettings.globalData && subTypeSettings.globalData.design && subTypeSettings.globalData.design.customFooterText)
                        ? subTypeSettings.globalData.design.customFooterText.trim()
                        : "");
                footerEl.textContent = customFooter !== "" ? customFooter : __('admin.frontend.default_footer_text');
            } else {
                const isFeedbackButton = (displayType === "overlay") && (displaySubType === "feedback-button");
                const hideOptionEnabled = isFeedbackButton && subTypeSettings.hideOptionEnabled;

                if (hideOptionEnabled && String(step) === "1") {
                    footerEl.style.display = "block";
                    footerEl.innerHTML = "";
                    const hideLink = document.createElement("a");
                    hideLink.href = "#";
                    hideLink.className = "flwp-feedback-button-widget-hide-link";
                    hideLink.setAttribute("data-action", "hide");
                    hideLink.textContent = __("widget.feedback_button.hide_button");
                    hideLink.addEventListener("click", (e) => {
                        e.preventDefault();

                        let submitDays = 30;
                        if ((this.config.globalData.submitDays !== undefined) && parseInt(this.config.globalData.submitDays, 10) > 10) {
                            submitDays = parseInt(this.config.globalData.submitDays, 10);
                        }

                        this.config.globalData.closeDays = submitDays;

                        this.close();
                        this.hideTrigger();
                    });
                    footerEl.appendChild(hideLink);
                } else {
                    footerEl.style.display = "none";
                    footerEl.innerHTML = "";
                }
            }
        };

        const getHeaderElements = () => {
            const ov = this.overlayEl;
            if (!ov) return null;
            return {
                backBtn: ov.querySelector("#flwp-general-overlay-back-button") || ov.querySelector(".flwp-general-overlay-icon-btn") || ov.querySelector(".flwp-feedback-button-widget-icon-button"),
                pbContainer: ov.querySelector(".flwp-general-overlay-progress-bar-container") || ov.querySelector(".flwp-feedback-button-widget-progress-bar-container"),
                pbBar: ov.querySelector(".flwp-general-overlay-progress-bar") || ov.querySelector(".flwp-feedback-button-widget-progress-bar"),
                titleEl: ov.querySelector(".flwp-overlay-header-title"),
                stepIndicator: ov.querySelector(".flwp-overlay-header-step-indicator")
            };
        };

        const updateHeaderUI = (step) => {
            const els = getHeaderElements();
            if (!els) return;

            const headerEl = this.overlayEl.querySelector(".flwp-overlay-header");

            switch (step) {
                case 1:
                    if (hideHeader) {
                        headerEl.style.display = "none";
                    }
                    break;
                default:
                    headerEl.style.display = "flex";
                    break;
            }

            if (step === 2) {
                els.backBtn.style.display = "block";
            } else {
                els.backBtn.style.display = "none";
            }

            els.pbContainer.style.display = "none";
            els.titleEl.style.display = "none";
            els.stepIndicator.style.display = "none";

            const hasStep2 = utils.isOptionStep2ActiveOnStep1(stateObj);
            const totalSteps = hasStep2 ? 2 : 1;

            if (headerIndicator === "progress") {
                els.pbContainer.style.display = "block";
                let progress = "35%";
                if (step === 2) progress = "75%";
                else if (step === "confirmed") progress = "100%";
                els.pbBar.style.width = progress;
            } else if (headerIndicator === "title") {
                els.titleEl.style.display = "block";
                els.titleEl.textContent = formName;
            } else if (headerIndicator === "step") {
                els.stepIndicator.style.display = "block";
                if (step === "confirmed") {
                    els.stepIndicator.textContent = __('widget.status_completed');
                } else {
                    els.stepIndicator.textContent = __('widget.step_indicator_full', { step: step, total: totalSteps });
                }
            }
        };

        const els = getHeaderElements();
        if (els && els.backBtn && !els.backBtn.dataset.hasListener) {
            els.backBtn.dataset.hasListener = "true";
            els.backBtn.addEventListener("click", () => {
                if (this.innerPlaceholderEl && this.innerPlaceholderEl.flwpGoToStep) {
                    this.innerPlaceholderEl.flwpGoToStep(1);
                }
            });
        }

        updateHeaderUI(1);
        updateFooterUI(1);

        engine.render(this.innerPlaceholderEl, stateObj, {
            isSplit: false,
            isPreview: !!this.config.isPreview,
            onStepChange: (step, triggerId) => {
                updateHeaderUI(step);
                updateFooterUI(step);
            },
            onConfirm: (answers, activeStep2TriggerId = '') => {
                updateHeaderUI("confirmed");
                updateFooterUI("confirmed");

                if (!this.config.isPreview) {
                    const submitDays = this.config.globalData.submitDays !== undefined ? parseInt(this.config.globalData.submitDays, 10) : 30;

                    api.submitFeedback(this.formId, answers, displaySubType, this.innerPlaceholderEl, activeStep2TriggerId)
                        .then(data => {
                            this.innerPlaceholderEl.flwpAnswers = {};
                            this.innerPlaceholderEl.flwpStep2TriggerId = null;

                            if (submitDays > 0) {
                                const scope = (this.config.globalData && this.config.globalData.cookieScope) || "domain";
                                const pathHash = (window.flwpFormFrontend && window.flwpFormFrontend.pathHash) ? `_${window.flwpFormFrontend.pathHash}` : "";
                                const pathKey = scope === "page" ? pathHash : "";
                                const cookiePath = scope === "page" ? window.location.pathname : "/";
                                utils.setCookie(`flwp_submitted_${this.formId}${pathKey}`, "1", submitDays, cookiePath);
                            }
                        })
                        .catch(err => {
                            console.error("FLWP: Error while sending the feedbacks:", err);
                        });

                    if (submitDays > 0) {
                        // Hide trigger if configured or if standard feedback button
                        if ((this.config.triggerSettings && this.config.triggerSettings.hideOnSubmit) || this.config.triggerSettings.useStandard) {
                            this.hideTrigger();
                        }
                    }
                } else {
                    console.log("[Preview] Simulation of feedback confirmation:", answers);
                }

                setTimeout(() => {
                    this.close();
                }, 3000);
            }
        });

        const showBackdrop = this.config.globalData.showBackdrop !== false && this.config.globalData.showBackdrop !== "0" && this.config.globalData.showBackdrop !== 0;
        if (!showBackdrop) {
            this.overlayEl.classList.add("flwp-overlay-no-backdrop");
        } else {
            this.overlayEl.classList.remove("flwp-overlay-no-backdrop");
        }

        const modal = this.overlayEl.querySelector(".flwp-general-overlay-modal");
        if (modal) {
            const customWidth = this.config.globalData && this.config.globalData.overlayWidth;
            if (customWidth && parseInt(customWidth, 10) > 0) {
                modal.style.maxWidth = `${parseInt(customWidth, 10)}px`;
            } else {
                modal.style.maxWidth = "";
            }
        }

        if (this.backdropListener) {
            this.overlayEl.removeEventListener("click", this.backdropListener);
            this.backdropListener = null;
        }

        if (this.config.globalData.closeOnBackdrop) {
            this.overlayEl.classList.add("flwp-close-on-backdrop");
            this.backdropListener = (e) => {
                if (e.target === this.overlayEl) {
                    this.close();
                }
            };
            this.overlayEl.addEventListener("click", this.backdropListener);
        } else {
            this.overlayEl.classList.remove("flwp-close-on-backdrop");
        }

        if (this.escKeyListener) {
            document.removeEventListener("keydown", this.escKeyListener);
            this.escKeyListener = null;
        }

        if (this.config.globalData.closeOnEsc) {
            this.escKeyListener = (e) => {
                if (e.key === "Escape") {
                    this.close();
                }
            };
            document.addEventListener("keydown", this.escKeyListener);
        }
    }

    close() {
        if (!this.overlayEl) return;

        const subType = this.config.displaySubType || "modal";
        const modal = this.overlayEl.querySelector(".flwp-general-overlay-modal");
        const position = this.config.position || "center";

        if (subType === "slide-in" && modal) {
            const isLeft = position.includes("left") || position === "left-middle";
            const isRight = position.includes("right") || position === "right-middle";

            modal.classList.remove("slide-in-left", "slide-in-right");
            if (isLeft) modal.classList.add("slide-out-left");
            else if (isRight) modal.classList.add("slide-out-right");
        }

        this.overlayEl.classList.remove("flwp-overlay-is-visible");

        const targetContainer = (this.config && this.config.targetContainer) || document.body;
        targetContainer.classList.remove("flwp-feedback-button-widget-is-open");
        document.body.style.overflow = "";

        if (this.escKeyListener) {
            document.removeEventListener("keydown", this.escKeyListener);
            this.escKeyListener = null;
        }
        if (this.backdropListener) {
            this.overlayEl.removeEventListener("click", this.backdropListener);
            this.backdropListener = null;
        }

        if (!this.config.isPreview) {
            const closeDays = this.config.globalData.closeDays !== undefined ? parseInt(this.config.globalData.closeDays, 10) : 1;
            if (closeDays > 0) {
                const scope = (this.config.globalData && this.config.globalData.cookieScope) || "domain";
                const pathHash = (window.flwpFormFrontend && window.flwpFormFrontend.pathHash) ? `_${window.flwpFormFrontend.pathHash}` : "";
                const pathKey = scope === "page" ? pathHash : "";
                const cookiePath = scope === "page" ? window.location.pathname : "/";
                utils.setCookie(`flwp_closed_${this.formId}${pathKey}`, "1", closeDays, cookiePath);

                // Hide trigger if configured or if standard feedback button
                if ((this.config.triggerSettings && this.config.triggerSettings.hideOnClose) || this.config.triggerSettings.useStandard) {
                    this.hideTrigger();
                }
            }
        }

        setTimeout(() => {
            if (this.innerPlaceholderEl) {
                this.innerPlaceholderEl.flwpCurrentStep = 1;
                this.innerPlaceholderEl.flwpAnswers = {};
                this.innerPlaceholderEl.flwpStep2TriggerId = null;
                const stateObj = (this.config && this.config.stateObj) || (window.flwpCachedData && window.flwpCachedData[this.formId] && window.flwpCachedData[this.formId].formData);
                if (stateObj) {
                    engine.render(this.innerPlaceholderEl, stateObj, {});
                }
            }
            this.isTriggered = false;
        }, 300);
    }

    destroy() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
        if (this.scrollListener) {
            window.removeEventListener("scroll", this.scrollListener);
            this.scrollListener = null;
        }
        if (this.escKeyListener) {
            document.removeEventListener("keydown", this.escKeyListener);
            this.escKeyListener = null;
        }
        if (this.backdropListener && this.overlayEl) {
            this.overlayEl.removeEventListener("click", this.backdropListener);
            this.backdropListener = null;
        }
        if (this.overlayEl && this.overlayEl.parentNode) {
            this.overlayEl.parentNode.removeChild(this.overlayEl);
            this.overlayEl = null;
        }
        if (this.standardBtnEl) {
            const wrapper = this.standardBtnEl.closest(".flwp-feedback-plugin");
            if (wrapper && wrapper.parentNode) {
                wrapper.parentNode.removeChild(wrapper);
            } else if (this.standardBtnEl.parentNode) {
                this.standardBtnEl.parentNode.removeChild(this.standardBtnEl);
            }
            this.standardBtnEl = null;
        }
        if (this.config && this.config.targetContainer) {
            this.config.targetContainer.classList.remove("flwp-feedback-button-widget-is-open");
        }
        FLWPOverlayController.instances.delete(this);
    }
}

const engine = {
    render: function(containerEl, stateObj, options = {}) {
        if (!containerEl || !stateObj) return;

        // shortcode, pre-content, post-content, feedback-button, exit-intent
        const formType = containerEl.getAttribute("data-type");

        containerEl.flwpStateObj = stateObj;
        containerEl.flwpOptions = options;

        const isSplit = !!options.isSplit;
        const indicatorEl = options.indicatorEl || null;

        // Encapsulate answers & step state per container element
        if (options.answers) {
            containerEl.flwpAnswers = { ...options.answers };
        } else if (!Object.prototype.hasOwnProperty.call(containerEl, 'flwpAnswers')) {
            containerEl.flwpAnswers = {};
        }
        if (!Object.prototype.hasOwnProperty.call(containerEl, 'getAnswers')) {
            containerEl.getAnswers = function() {
                return this.flwpAnswers;
            };
        }
        if (!Object.prototype.hasOwnProperty.call(containerEl, 'flwpAnswersArray')) {
            Object.defineProperty(containerEl, 'flwpAnswersArray', {
                get: function() {
                    return Object.entries(this.flwpAnswers || {}).map(([key, value]) => ({
                        elementId: key,
                        value: value
                    }));
                },
                configurable: true
            });
        }

        if (typeof containerEl.flwpCurrentStep === "undefined") {
            containerEl.flwpCurrentStep = 1;
        }
        if (typeof containerEl.flwpStep2TriggerId === "undefined") {
            containerEl.flwpStep2TriggerId = null;
        }

        const isStep2AcType = utils.isOptionStep2ActiveOnStep1(stateObj);

        // We clear the root container to inject the static wrapper skeletons once per state render
        containerEl.innerHTML = '';

        // Create Honeypot field if enabled
        if (stateObj.settings && stateObj.settings.main && stateObj.settings.main.honeypot !== false) {
            const hpWrap = document.createElement("div");
            hpWrap.style.cssText = "display:none !important; position:absolute; width:1px; height:1px; overflow:hidden;";
            const hpInput = document.createElement("input");
            hpInput.type = "text";
            hpInput.name = "flwp_hp_field";
            hpInput.setAttribute("tabindex", "-1");
            hpInput.setAttribute("autocomplete", "off");
            hpWrap.appendChild(hpInput);
            containerEl.appendChild(hpWrap);
        }

        // Create Step 1 Wrapper
        const step1Wrap = document.createElement("div");
        step1Wrap.className = "flwp-fd-step";
        step1Wrap.setAttribute("data-step", "1");
        containerEl.appendChild(step1Wrap);

        const step1List = (stateObj.steps && stateObj.steps.step1) ? stateObj.steps.step1 : [];
        engine.renderElementsListToContainer(step1Wrap, step1List, containerEl, goToStep, stateObj, isStep2AcType);

        // Create Step 2 Wrappers for each trigger element with step2Enabled = true
        const itemsWithStep2 = step1List.filter(item => {
            return (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(item.type)) && item.settings && item.settings.step2Enabled === true;
        });

        const uniqueStep2TriggerIds = new Set(itemsWithStep2.map(i => i.id));

        Array.from(uniqueStep2TriggerIds).forEach(triggerId => {
            const step2Wrap = document.createElement("div");
            step2Wrap.className = "flwp-fd-step";
            step2Wrap.setAttribute("data-step", "2");
            step2Wrap.setAttribute("data-trigger-id", triggerId);
            containerEl.appendChild(step2Wrap);

            const step2List = utils.getStep2List(stateObj, triggerId);
            engine.renderElementsListToContainer(step2Wrap, step2List, containerEl, goToStep, stateObj, isStep2AcType);
        });

        // Create Success / Confirmation Wrapper
        const successWrap = document.createElement("div");
        successWrap.className = "flwp-fd-success";
        containerEl.appendChild(successWrap);
        engine.renderConfirmation(successWrap, stateObj);

        // Define transition controller function
        function validateCurrentStep() {
            const currentStep = containerEl.flwpCurrentStep;
            let activeStepWrap = null;
            if (currentStep === 1) {
                activeStepWrap = containerEl.querySelector('.flwp-fd-step[data-step="1"]');
            } else if (currentStep === 2) {
                const actId = containerEl.flwpStep2TriggerId || (itemsWithStep2[0] ? itemsWithStep2[0].id : null);
                activeStepWrap = containerEl.querySelector(`.flwp-fd-step[data-step="2"][data-trigger-id="${actId}"]`);
            }

            if (!activeStepWrap) return true;

            const requiredGroups = activeStepWrap.querySelectorAll('.flwp-fd-group[data-required="true"]');
            let allValid = true;
            let firstInvalidGroup = null;

            requiredGroups.forEach(group => {
                const elementId = group.getAttribute("data-element-id");
                const val = containerEl.flwpAnswers[elementId];
                const isInvalid = (val === undefined || val === null || (typeof val === 'string' && val.trim() === ''));

                if (isInvalid) {
                    allValid = false;
                    if (!firstInvalidGroup) {
                        firstInvalidGroup = group;
                    }
                    group.classList.add("flwp-fd-invalid");
                    if (!group.querySelector(".flwp-fd-error-msg")) {
                        const errMsg = document.createElement("div");
                        errMsg.className = "flwp-fd-error-msg";
                        errMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${__("validation.error.required")}`;
                        group.appendChild(errMsg);
                    }
                } else {
                    group.classList.remove("flwp-fd-invalid");
                    const err = group.querySelector(".flwp-fd-error-msg");
                    if (err) err.remove();
                }
            });

            if (!allValid && firstInvalidGroup) {
                firstInvalidGroup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            return allValid;
        }

        function goToStep(step, step2TriggerId = null) {
            const currentStep = containerEl.flwpCurrentStep;

            let targetStep = step;
            let targetTriggerId = step2TriggerId;

            if (currentStep === 1 && step === "confirmed" && isStep2AcType) {
                // Find if any of the answered items have step 2 enabled
                const answeredTrigger = itemsWithStep2.find(item => {
                    const val = containerEl.flwpAnswers[item.id];
                    return (val !== undefined && val !== null && val !== '');
                });
                if (answeredTrigger) {
                    targetStep = 2;
                    targetTriggerId = answeredTrigger.id;
                }
            }

            if (
                (currentStep === 1 && (targetStep === 2 || targetStep === "confirmed")) ||
                (currentStep === 2 && targetStep === "confirmed")
            ) {
                if (!validateCurrentStep()) {
                    console.warn("FLWP: Validation failed for step", currentStep);
                    return;
                }
            }

            containerEl.flwpCurrentStep = targetStep;
            if (targetTriggerId) {
                containerEl.flwpStep2TriggerId = targetTriggerId;
            }

            // Hide all steps/success wrappers
            const allSteps = containerEl.querySelectorAll('.flwp-fd-step, .flwp-fd-success');
            allSteps.forEach(el => el.classList.remove('is-active'));

            if (targetStep === 2) {
                const actId = targetTriggerId || containerEl.flwpStep2TriggerId || (itemsWithStep2[0] ? itemsWithStep2[0].id : null);
                const targetStep2 = containerEl.querySelector(`.flwp-fd-step[data-step="2"][data-trigger-id="${actId}"]`);
                if (targetStep2) {
                    targetStep2.classList.add('is-active');
                } else {
                    const fallbackStep2 = containerEl.querySelector(`.flwp-fd-step[data-step="2"]`);
                    if (fallbackStep2) fallbackStep2.classList.add('is-active');
                }
                if (indicatorEl) {
                    indicatorEl.textContent = __("widget.step_indicator", { step: 2, total: 2 });
                }
                if (options.onStepChange) options.onStepChange(targetStep, actId);
            } else if (targetStep === "confirmed") {
                const answersArr = containerEl.flwpAnswersArray || [];

                let activeStep2TriggerId = '';
                if (currentStep === 2 && containerEl.flwpStep2TriggerId) {
                    activeStep2TriggerId = containerEl.flwpStep2TriggerId;
                }

                if (options.onConfirm) options.onConfirm(answersArr, activeStep2TriggerId);

                const confirm = (stateObj && stateObj.confirmation) || { type: 'message', message: __("confirmation.message.default") };
                let isRedirect = false;
                let redirectUrl = '';

                if (confirm.type !== 'message') {
                    redirectUrl = confirm.extUrl || '';
                    if (redirectUrl) {
                        const isAdminPreviewMode = !!(
                            document.getElementById("flwp-split-widget-live-inner-form") ||
                            document.getElementById("flwp-widget-live-inner-form") ||
                            document.getElementById("flwp-preview-inner-form")
                        );
                        if (!isAdminPreviewMode) {
                            isRedirect = true;
                        }
                    }
                }

                const targetSuccess = containerEl.querySelector('.flwp-fd-success');
                if (targetSuccess) {
                    targetSuccess.classList.add('is-active');
                }
                if (indicatorEl) {
                    indicatorEl.textContent = __("widget.status_confirmed");
                }

                if (isRedirect && redirectUrl) {
                    let countdown = 3;
                    const countdownEl = containerEl.querySelector('.flwp-fd-countdown-number');
                    const interval = setInterval(() => {
                        countdown--;
                        if (countdownEl) {
                            countdownEl.textContent = countdown;
                        }
                        if (countdown <= 0) {
                            clearInterval(interval);
                            window.location.href = redirectUrl;
                        }
                    }, 1000);
                } else if (redirectUrl) {
                    // Admin/Preview simulation
                    let countdown = 3;
                    const countdownEl = containerEl.querySelector('.flwp-fd-countdown-number');
                    const interval = setInterval(() => {
                        countdown--;
                        if (countdownEl) {
                            countdownEl.textContent = countdown;
                        }
                        if (countdown <= 0) {
                            clearInterval(interval);
                            const badgeEl = containerEl.querySelector('.flwp-fd-confirm-badge');
                            if (badgeEl) {
                                badgeEl.innerHTML = `<span style="color: #104689; font-weight: bold;"><i class="fas fa-info-circle"></i> ${__("admin.builder.simulation_redirect_msg")}</span><br>${redirectUrl}`;
                            }
                        }
                    }, 1000);
                }
            } else {
                // Step 1
                const targetStep1 = containerEl.querySelector('.flwp-fd-step[data-step="1"]');
                if (targetStep1) {
                    targetStep1.classList.add('is-active');
                }
                if (indicatorEl) {
                    indicatorEl.textContent = isStep2AcType ? __("widget.step_indicator", { step: 1, total: 2 }) : __("widget.step_single", { step: 1 });
                }
                if (options.onStepChange) options.onStepChange(step, null);
            }

            // Update progress bar & back button elements in the closest widget container if present on the page
            const pWid = containerEl.closest('#flwp-feedback-button-widget-container');
            if (pWid) {
                const pb = pWid.querySelector('#flwp-feedback-button-widget-progress-bar');
                if (pb) {
                    let progress = '35%';
                    if (step === 2) progress = '75%';
                    else if (step === 'confirmed') progress = '100%';
                    pb.style.width = progress;
                }
                const bb = pWid.querySelector('#flwp-feedback-button-widget-back-button');
                if (bb) {
                    if (step === 2) {
                        bb.hidden = false;
                        bb.style.display = 'block';
                    } else {
                        bb.hidden = true;
                        bb.style.display = 'none';
                    }
                }
            }
        }

        containerEl.flwpGoToStep = goToStep;

        // Initial active step visualization
        goToStep(containerEl.flwpCurrentStep, containerEl.flwpStep2TriggerId);
    },

    renderElementsListToContainer: function(stepWrap, itemsList, containerEl, goToStep, stateObj, isStep2AcType) {
        stepWrap.innerHTML = '';
        if (itemsList.length === 0) {
            stepWrap.innerHTML = `<div class="flwp-fd-empty-message">${__("widget.no_elements")}</div>`;
            return;
        }

        const markFieldValid = (groupEl) => {
            if (groupEl.classList.contains("flwp-fd-invalid")) {
                groupEl.classList.remove("flwp-fd-invalid");
                const err = groupEl.querySelector(".flwp-fd-error-msg");
                if (err) err.remove();
            }
        };

        const processedItemsList = [...itemsList];

        const interactiveElements = processedItemsList.filter(i => ['nps', 'thumbs', 'rating', 'smileys', 'textarea'].includes(i.type));
        const hasSubmitButton = processedItemsList.some(i => i.type === 'button' && i.settings && i.settings.buttonType === 'submit');
        const enableAutoAdvance = (interactiveElements.length === 1) && !hasSubmitButton;

        processedItemsList.forEach(item => {
            if (item.settings && item.settings.clearBefore) {
                const breakEl = document.createElement("div");
                breakEl.className = "flwp-fd-break";
                stepWrap.appendChild(breakEl);
            }

            const g = document.createElement("div");
            g.className = "flwp-fd-group";
            g.setAttribute("data-element-id", item.id);
            g.setAttribute("data-element-type", item.type);
            if (item.settings && item.settings.required) {
                g.setAttribute("data-required", "true");
            }

            const w = (item.settings && item.settings.width) || "100%";
            g.classList.add(`flwp-fd-width-${w.replace("%", "")}`);

            const interactiveNode = fields.render(item, 'interactive', stateObj, {
                answers: containerEl.flwpAnswers,
                onAnswerChange: (fieldId, value) => {
                    containerEl.flwpAnswers[fieldId] = value;
                },
                goToStep: goToStep,
                isStep2AcType: isStep2AcType,
                markFieldValid: () => markFieldValid(g),
                isReadOnly: !!(containerEl.flwpOptions && containerEl.flwpOptions.isReadOnly),
                enableAutoAdvance: enableAutoAdvance
            });

            if (interactiveNode) {
                g.appendChild(interactiveNode);
            }

            if (g) {
                stepWrap.appendChild(g);
            }
        });
    },

    renderConfirmation: function(successWrap, stateObj) {
        const confirm = (stateObj && stateObj.confirmation) || { type: 'message', message: __("confirmation.message.default") };
        const formattedMsg = (confirm.message || '').replace(/\n/g, '<br>');
        const color = confirm.textColor || stateObj?.settings?.style?.accentColor || "#000000";

        if (confirm.type === 'message') {
            successWrap.innerHTML = `
        <div class="flwp-fd-confirm-msg">
          <div class="flwp-fd-confirm-icon" style="color: ${color};"><i class="fas fa-check-circle"></i></div>
          <div class="flwp-fd-confirm-text" style="color: ${color};">${formattedMsg}</div>
        </div>
      `;
        } else {
            let url = confirm.extUrl || '';
            successWrap.innerHTML = `
        <div class="flwp-fd-confirm-msg">
          <div class="flwp-fd-confirm-icon" style="color: ${color};"><i class="fas fa-check-circle"></i></div>
          <div class="flwp-fd-confirm-text" style="color: ${color};">
            <div>${formattedMsg || __("confirmation.message.default")}</div>
            <p style="margin: 10px 0 6px 0; font-size: 0.9em; opacity: 0.95;">
              ${__("confirmation.message.redirecting", { seconds: `<span class="flwp-fd-countdown-number" style="font-weight: bold; color: ${color}; font-size: 1.1em;">3</span>` })}
            </p>
            <div class="flwp-fd-confirm-badge" style="margin-top: 8px; font-size: 0.8em; opacity: 0.8; word-break: break-all; padding: 4px 8px; background: #f1f5f9; border-radius: 4px; border-left: 3px solid ${color}; display: inline-block; text-align: left;">
              ${__("confirmation.message.target")} ${url}
            </div>
          </div>
        </div>
      `;
        }
    },

    initAutoRender: function() {
        // Initialize anonymizedSessionId early on load (before rendering or interaction)
        utils.initSessionId();

        // Perform cleanup
        utils.cleanupExpiredLocalStorage();

        // Decide if we are executing within Admin preview workspace or standard site frontend
        const placeholders = document.querySelectorAll(".flwp-feedback-type-placeholder");
        const overlays = window.flwpActiveOverlays;

        if (placeholders.length === 0 && overlays.length === 0) {
            // Im Admin steuert die flwp-admin.js das Rendern explizit. Keine doppelten Event-Listener nötig.
            return;
        }

        // --- FRONT-END PRODUCTION VISITOR ENGINE ---
        const formsToFetch = new Set();
        const cachedData = {};

        placeholders.forEach(el => {
            const id = el.getAttribute("data-form-id");
            const formUpdated = el.getAttribute("data-form-updated");
            if (id) {
                const cached = utils.getFromLocalStorage(id, formUpdated);
                if (cached) {
                    cachedData[id] = cached;
                    window.flwpCachedData = window.flwpCachedData || {};
                    window.flwpCachedData[id] = cached;
                } else {
                    formsToFetch.add(parseInt(id));
                }
            }
        });

        overlays.forEach(config => {
            if (config.id) {
                const id = config.id.toString();
                const formUpdated = config.formUpdated || "";
                const cached = utils.getFromLocalStorage(id, formUpdated);
                if (cached) {
                    cachedData[id] = cached;
                    window.flwpCachedData = window.flwpCachedData || {};
                    window.flwpCachedData[id] = cached;
                } else {
                    formsToFetch.add(parseInt(id));
                }
            }
        });

        const renderAll = () => {
            // 1. Render all explicitly placed placeholders for forms (shortcodes, inline containers)
            placeholders.forEach(el => {
                const id = el.getAttribute("data-form-id");
                const type = el.getAttribute("data-type");

                // If the form is configured as in-content or shortcode, render it!
                if (cachedData[id]) {
                    const stateObj = cachedData[id].formData;

                    logger.log('[Frontend] Rendering in-content placeholder:', { id, type, stateObj });

                    let displaySubType = (stateObj && stateObj.settings && stateObj.settings.display.displaySubType) || "shortcode";
                    if (type === "pre-content" || type === "post-content") {
                        displaySubType = "in-content";
                    }

                    // Validate targeting
                    const targeting = (stateObj && stateObj.targeting && stateObj.targeting[displaySubType]) || {};
                    const isTargetingValid = FLWPFormValidator.validateTargeting(targeting, config.CONTEXT);

                    // Only render inline if the displayType is in-content / shortcode
                    if ((displaySubType === "in-content" || type === "shortcode") && isTargetingValid) {
                        engine.renderPlaceholder(el, cachedData[id]);
                    } else {
                        el.style.display = "none";
                    }
                }
            });
        };

        // Wenn alles im Cache ist, sofort rendern
        if (formsToFetch.size === 0) {
            renderAll();
        } else {
            // Fehlende Daten laden
            api.fetchFormsData(formsToFetch)
                .then(res => {
                    if (res.success && res.data) {
                        Object.keys(res.data).forEach(id => {
                            const resultData = res.data[id];
                            if (resultData && resultData.formData) {
                                utils.saveToLocalStorage(resultData);
                                cachedData[id] = resultData;
                                window.flwpCachedData = window.flwpCachedData || {};
                                window.flwpCachedData[id] = resultData;
                            }
                        });
                    }
                    renderAll();
                })
                .catch(err => {
                    console.error("FLWP Error: fetching placeholders data failed", err);
                    renderAll(); // Trotzdem rendern, was wir haben
                });
        }
    },

    renderPlaceholder: function (el, resultData) {
        const formId = el.getAttribute("data-form-id");
        const type = el.getAttribute("data-type");
        const stateObj = resultData.formData;

        const scope = (stateObj.settings.display.subTypeData && stateObj.settings.display.subTypeData.shortcode && stateObj.settings.display.subTypeData.shortcode.globalData.main.cookieScope) || "domain";
        const pathHash = (window.flwpFormFrontend && window.flwpFormFrontend.pathHash) ? `_${window.flwpFormFrontend.pathHash}` : "";
        const pathKey = scope === "page" ? pathHash : "";
        const submitCookie = `flwp_submitted_${formId}_${type}${pathKey}`;
        if (utils.getCookie(submitCookie)) {
            // Hide placeholder
            if (el) {
                const wrapper = el.closest(".flwp-feedback-plugin");
                if (wrapper) {
                    wrapper.style.display = "none";
                } else {
                    el.style.display = "none";
                }
            }

            return false;
        }

        engine.render(el, stateObj, {
            isSplit: false,
            onConfirm: (answers, activeStep2TriggerId = '') => {
                const submitDays = stateObj.settings.display.subTypeData.shortcode.globalData.main.cookieSubmitDays !== undefined ? parseInt(stateObj.settings.display.subTypeData.shortcode.globalData.main.cookieSubmitDays, 10) : 30;

                api.submitFeedback(formId, answers, type, el, activeStep2TriggerId)
                    .then(data => {
                        el.flwpAnswers = {};
                        el.flwpStep2TriggerId = null; // Reset for next interactions

                        if (submitDays > 0) {
                            const pathHash = (window.flwpFormFrontend && window.flwpFormFrontend.pathHash) ? `_${window.flwpFormFrontend.pathHash}` : "";
                            const pathKey = scope === "page" ? pathHash : "";
                            const cookiePath = scope === "page" ? window.location.pathname : "/";
                            utils.setCookie(`flwp_submitted_${formId}_${type}${pathKey}`, "1", submitDays, cookiePath);
                        }
                    })
                    .catch(err => {
                        console.error("FLWP Error: sending feedback", err);
                    });

                setTimeout(() => {
                    if (submitDays > 0) {
                        // Hide placeholder
                        if (el) {
                            const wrapper = el.closest(".flwp-feedback-plugin");
                            if (wrapper) {
                                wrapper.style.display = "none";
                            } else {
                                el.style.display = "none";
                            }
                        }
                    }
                }, 5000);
            }
        });

        utils.applyInContentStyles(el, stateObj);

        el.style.visibility = "visible";
    }
};

// Public Interface exposure (Bridge pattern ensuring backward compatibility)
window.FLWPFrontend = {
    render: engine.render,
    initAutoRender: engine.initAutoRender
};

window.FLWPOverlayController = FLWPOverlayController;

// Automate initialization sequence
engine.initAutoRender();

document.addEventListener("DOMContentLoaded", () => {
    window.flwpActiveOverlays.forEach(overlayConfig => {
        const targeting = (overlayConfig.targeting && overlayConfig.targeting.overlay) || {};

        const overlayId = overlayConfig.id || "";
        const overlayName = overlayConfig.name || "";
        const overlayType = overlayConfig.displaySubType || "";

        logger.log('[Frontend] Rendering overlay:', { overlayId, overlayName, overlayType, overlayConfig });

        if (FLWPFormValidator.validateTargeting(targeting, config.CONTEXT)) {
            const controller = new FLWPOverlayController(overlayConfig);
            controller.init();
        }
    });
});