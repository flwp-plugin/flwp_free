
/**
 * PreviewEngine: Central component for rendering preview simulations.
 */

import {utils} from './flwp-form-utils.js';

import { __ } from './flwp-i18n.js';

// Static variable to persist viewport across renders
let currentViewport = 'desktop';

// Persisted state for rendering
let activeContainer, activeState, activeConfig;
let activeController;

export const PreviewEngine = {
    /**
     * Render the preview into a container.
     * @param {HTMLElement} [container] - The target container.
     * @param {Object} [state] - The current application state.
     * @param {Object} [config] - Configuration object.
     */
    render: function(container, state, config) {
        const localContainer = container || activeContainer;
        const localState = state || activeState;
        const localConfig = config || activeConfig;

        if (!localContainer) return;

        // Cleanup previous controller for THIS container if it was the active one
        // Note: In a true multi-instance scenario, we'd need a map of controllers per container.
        // For now, we still maintain the "activeController" for the last rendered one (mostly for modal).
        if (activeController && activeContainer === localContainer && typeof activeController.destroy === 'function') {
            activeController.destroy();
        }

        // Force a small delay to ensure DOM is cleared and old listeners are removed
        localContainer.innerHTML = "";
        
        // Return a promise to allow caller to wait for render completion if needed
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                // Clone template
                const template = document.getElementById('flwp-preview-shell-template');
                if (!template) {
                    console.error('Preview template not found');
                    resolve(null);
                    return;
                }

                const shell = document.importNode(template.content, true).firstElementChild;
                shell.classList.add(`flwp-preview-shell--${localConfig.mode}`);

                // Restore persisted viewport
                if (currentViewport === 'mobile') {
                    shell.classList.add("viewport-mobile");
                }

                localContainer.appendChild(shell);

                const slots = {
                    header: shell.querySelector('[data-slot="header"]'),
                    body: shell.querySelector('[data-slot="body"]'),
                    footer: shell.querySelector('[data-slot="footer"]'),
                    innerHeader: shell.querySelector('[data-slot="inner-header"]'),
                    innerBody: shell.querySelector('[data-slot="inner-body"]'),
                    innerFooter: shell.querySelector('[data-slot="inner-footer"]')
                };

                this.populateShellElements(slots, localConfig);
                this.attachSimulatorListeners(shell, localConfig.onTrigger);
                this.setupActionButtons(shell, slots, localConfig, localContainer, localState);

                // Return potential controller for overlay mode
                const controller = this.renderContent(slots, localConfig, localState);
                
                // Track globally for singleton-like access (mostly for the modal)
                activeContainer = localContainer;
                activeState = localState;
                activeConfig = localConfig;
                activeController = controller;

                resolve(controller);
            });
        });
    },

    destroy: function() {
        if (activeController && typeof activeController.destroy === 'function') {
            activeController.destroy();
        }
        activeController = null;
        if (activeContainer) {
            activeContainer.innerHTML = '';
        }
        activeContainer = null;
        activeState = null;
        activeConfig = null;
    },

    reinit: function() {
        if (activeContainer && activeState && activeConfig) {
            this.render(activeContainer, activeState, activeConfig);
        }
    },

    getActiveController: function() {
        return activeController;
    },

    renderContent: function(slots, config, state) {
        // Get renderer based on mode (e.g., 'in-content', 'overlay')
        const renderer = this.getRenderer(config.mode);
        return renderer.render(slots.innerBody, config, state);
    },

    attachSimulatorListeners: function(shell, onTrigger) {
        const demoTriggerBtn = shell.querySelector('#flwp-display-trigger-action-demo');
        if (demoTriggerBtn) {
            demoTriggerBtn.addEventListener('click', onTrigger);
        }
    },

    setupActionButtons: function(shell, slots, config, localContainer, localState) {
        const header = slots.header;
        const viewportBtns = header.querySelectorAll(".flwp-form-builder-template-display-viewport-btn[data-viewport]");
        const refreshBtn = header.querySelector("#flwp-btn-refresh-preview");
        const closeBtn = header.querySelector("#flwp-btn-close-preview");

        // Initialize buttons based on current state
        viewportBtns.forEach(btn => {
            const viewportAttr = btn.getAttribute("data-viewport");
            if (viewportAttr === currentViewport) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }

            btn.addEventListener("click", () => {
                viewportBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentViewport = btn.getAttribute("data-viewport");

                if (currentViewport === "mobile") {
                    shell.classList.add("viewport-mobile");
                } else {
                    shell.classList.remove("viewport-mobile");
                }
            });
        });

        if (refreshBtn) {
            refreshBtn.addEventListener("click", () => {
                this.render(localContainer, localState, config);
            });
        }

        if (closeBtn && config.onClose) {
            closeBtn.addEventListener("click", config.onClose);
        }
    },

    populateShellElements: function(slots, config) {
        if (slots.header) {
            const headerConfig = config.header || { 
                left: ['dots', 'address'],
                right: ['viewports', 'refresh'],
                title: __('admin.preview.title')
            };

            const ELEMENT_GENERATORS = {
                dots: () => `
                    <div class="flwp-form-builder-template-display-preview-dots">
                        <span class="dot red"></span>
                        <span class="dot yellow"></span>
                        <span class="dot green"></span>
                    </div>`,
                title: (cfg) => `
                    <div class="flwp-form-builder-template-display-preview-title" style="font-weight: 600;">
                        ${cfg.title || __('admin.preview.title')}
                    </div>`,
                address: (cfg) => `
                    <div class="flwp-form-builder-template-display-preview-address" style="font-weight: 600;">
                        ${cfg.address || __('admin.preview.address_placeholder')}
                    </div>`,
                viewports: () => `
                    <div class="flwp-form-builder-template-display-preview-viewports">
                        <button type="button" class="flwp-form-builder-template-display-viewport-btn active" data-viewport="desktop" title="${__('admin.preview.desktop_view')}">
                            <i class="fas fa-desktop"></i>
                        </button>
                        <button type="button" class="flwp-form-builder-template-display-viewport-btn" data-viewport="mobile" title="${__('admin.preview.mobile_view')}">
                            <i class="fas fa-mobile-alt"></i>
                        </button>
                    </div>`,
                refresh: () => `
                    <button type="button" class="flwp-form-builder-template-display-viewport-btn bg" id="flwp-btn-refresh-preview" title="${__('admin.preview.refresh_preview')}">
                        <i class="fas fa-sync"></i>
                    </button>`,
                close: () => `
                    <button type="button" class="flwp-form-builder-template-display-viewport-btn bg" id="flwp-btn-close-preview" title="${__('admin.preview.close_preview')}">
                        <i class="fas fa-times"></i>
                    </button>`
            };

            const generate = (items) => items.map(item => {
                return ELEMENT_GENERATORS[item] ? ELEMENT_GENERATORS[item](headerConfig) : '';
            }).join('');

            slots.header.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${generate(headerConfig.left || [])}
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${generate(headerConfig.right || [])}
                </div>
            `;
        }

        if (slots.footer) {
            const labelName = this.getActiveModeLabel(config);
            const showTrigger = config.mode === 'overlay';
            slots.footer.innerHTML = `
                <span id="flwp-display-preview-status-indicator"><i class="fas fa-circle-info" style="color: var(--flwp-primary, #104689);"></i> ${__('admin.preview.active_mode_label')} <strong>${labelName}</strong></span>
                <button type="button" id="flwp-display-trigger-action-demo" class="flwp-btn" style="display: ${showTrigger ? 'inline-flex' : 'none'}; padding: 3px 8px; font-size: 11px; height: 24px;">
                    <i class="fas fa-play"></i> ${__('admin.preview.simulate_trigger')}
                </button>
            `;
        }
    },

    getActiveModeLabel: function(config) {
        const mode = config.mode;
        const subtype = config.activeSubtype || "";

        if (mode === 'in-content') {
            const typeLabel = subtype === "shortcode" ? __('admin.preview.modes.in_content_shortcode') : __('admin.preview.modes.in_content_inline');
            return __('admin.preview.modes.in_content', { type: typeLabel });
        } else if (mode === 'overlay') {
            if (subtype === "feedback-button") {
                return __('admin.preview.modes.feedback_button');
            } else if (subtype === "slide-in") {
                return __('admin.preview.modes.slide_in');
            } else {
                return __('admin.preview.modes.overlay_modal');
            }
        }
        return mode;
    },

    renderMockArticle: function(target, includeSlot = false) {
        target.innerHTML = `
            <div class="flwp-form-builder-template-display-mock-nav">
                <div class="flwp-form-builder-template-display-mock-logo">${__('admin.preview.mock.logo')}</div>
            </div>
            <div class="flwp-form-builder-template-display-mock-article">
                <h2>${__('admin.preview.mock.headline')}</h2>
                <p>${__('admin.preview.mock.desc1')}</p>
                ${includeSlot ? '<div id="flwp-display-incontent-slot" class="flwp-form-builder-template-display-widget-slot"></div>' : ''}
                <p>${__('admin.preview.mock.desc2')}</p>
                <p>${__('admin.preview.mock.desc3')}</p>
                <p>${__('admin.preview.mock.desc4')}</p>
            </div>
        `;
    },

    getRenderer: function(mode) {
        return RENDERERS[mode] || RENDERERS['default'];
    }
};

const RENDERERS = {
    'default': {
        render: (target) => null
    },
    'in-content': {
        render: (target, config, state) => {
            const subType = config.subType || 'in-content';

            if (subType === 'form-only') {
                target.style.display = 'flex';
                target.style.alignItems = 'center';
                target.style.justifyContent = 'center';
                target.style.minHeight = '300px'; // Force height
                target.style.flexDirection = 'column';
            }
            if (config.showMockArticle !== false) {
                PreviewEngine.renderMockArticle(target, true);
            }

            let incontentSlot = target.querySelector('#flwp-display-incontent-slot');
            if (!incontentSlot) {
                incontentSlot = document.createElement('div');
                incontentSlot.id = 'flwp-display-incontent-slot';
                if (subType === 'in-content') {
                    incontentSlot.className = 'flwp-form-builder-template-display-widget-slot';
                }
                target.appendChild(incontentSlot);
            }

            incontentSlot.classList.add("flwp-feedback-plugin");
            if (window.FLWPFrontend && typeof window.FLWPFrontend.render === "function") {
                window.FLWPFrontend.render(incontentSlot, state, { isPreview: true });
                if (typeof incontentSlot.flwpGoToStep === "function") {
                    incontentSlot.flwpGoToStep(1);
                }

                utils.applyInContentStyles(incontentSlot, state);

                const gDS = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.spacing`, {});

                incontentSlot.style.width = "100%";

                const padding = gDS.padding || { top: "16", right: "16", bottom: "16", left: "16", unit: "px" };
                const pUnit = padding.unit || "px";
                const pTop = (padding.top !== undefined && padding.top !== "") ? `${padding.top}${pUnit}` : `16${pUnit}`;
                const pRight = (padding.right !== undefined && padding.right !== "") ? `${padding.right}${pUnit}` : `16${pUnit}`;
                const pBottom = (padding.bottom !== undefined && padding.bottom !== "") ? `${padding.bottom}${pUnit}` : `16${pUnit}`;
                const pLeft = (padding.left !== undefined && padding.left !== "") ? `${padding.left}${pUnit}` : `16${pUnit}`;
                incontentSlot.style.padding = `${pTop} ${pRight} ${pBottom} ${pLeft}`;

                const margin = gDS.margin || { top: "0", right: "auto", bottom: "0", left: "auto", unit: "px" };
                const mUnit = margin.unit || "px";
                const formatMarginVal = (val, defaultVal) => {
                    if (val === undefined || val === "") return defaultVal;
                    if (val === "auto") return "auto";
                    return `${val}${mUnit}`;
                };
                const mTop = formatMarginVal(margin.top, "0");
                const mRight = formatMarginVal(margin.right, "auto");
                const mBottom = formatMarginVal(margin.bottom, "0");
                const mLeft = formatMarginVal(margin.left, "auto");
                incontentSlot.style.margin = `${mTop} ${mRight} ${mBottom} ${mLeft}`;
            }
        }
    },
    'overlay': {
        render: (target, config, state) => {
            // Mock Article Content (to show overlay in context)
            PreviewEngine.renderMockArticle(target, false);

            if (window.FLWPOverlayController) {
                const overlayConfigTmp = config.overlayConfig || {};
                const activeSubtype = state.settings.display.displaySubType || 'modal';
                const subTypeData = state.settings.display.subTypeData?.[activeSubtype] || {};
                const settings = state.settings;
                const triggerData = subTypeData.triggerData || {};
                const globalData = subTypeData.globalData || {};
                const design = globalData.design || {};
                const spacing = globalData.spacing || {};
                const main = globalData.main || {};
                const clickConf = triggerData.click || {};

                const overlayConfig = {
                    id: overlayConfigTmp.id || 'display-preview',
                    isPreview: true,
                    stateObj: state,
                    name: settings.main?.title ?? 'Feedback',
                    trigger: subTypeData.trigger ?? 'click',
                    displaySubType: activeSubtype,
                    globalData: {
                        position: spacing.position ?? 'center',
                        closeDays: main.cookieCloseDays ?? 1,
                        submitDays: main.cookieSubmitDays ?? 30,
                        cookieScope: main.cookieScope ?? 'domain',
                        overlayWidth: spacing.overlayWidth ?? '',
                        showBackdrop: main.showBackdrop !== false,
                        closeOnBackdrop: main.closeOnBackdrop !== false,
                        closeOnEsc: main.closeOnEsc !== false,
                        hideHeader: main.hideHeader !== false,
                        hideFooter: main.hideFooter !== false,
                    },
                    triggerSettings: {
                        clickSelector: clickConf.selector ?? '',
                        hideOnClose: !!clickConf.hideOnClose,
                        hideOnSubmit: !!clickConf.hideOnSubmit,
                        useStandard: activeSubtype === "feedback-button",
                        feedbackButton: settings.display.subTypeData?.['feedback-button'] ?? {},
                        delaySeconds: triggerData.delay?.seconds ?? 5,
                        scrollType: triggerData.scroll?.type ?? 'end',
                        scrollPercent: triggerData.scroll?.percent ?? 50,
                        exitIntentDelay: triggerData.exitIntent?.delay ?? 'immediate',
                    },
                    style: {
                        customClasses: settings.main?.customClasses ?? '',
                        headerIndicator: design.headerIndicator ?? 'title',
                        headerTitle: design.headerTitle ?? '',
                        showFooterText: design.showFooterText !== false,
                        customFooterText: design.customFooterText ?? __('admin.preview.default_footer_text'),
                    },
                    targetContainer: target
                };

                const controller = new window.FLWPOverlayController(overlayConfig);
                controller.init();

                if (config.activeSubtype === "slide-in" || config.activeSubtype === "modal") {
                    controller.open();
                }
                return controller;
            }
        }
    }
};
