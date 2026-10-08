import { utils } from './flwp-form-utils.js';
import { config } from './flwp-form-config.js';

import { __ } from './flwp-i18n.js';

export const FormBuilderTemplates = {
    init: function() {
        const container = document.getElementById("flwp-templates-container");
        if (!container) return;

        container.innerHTML = "";

        // Helper to check if a template contains any PRO fields
        const hasProFields = (tmpl) => {
            if (!tmpl || !tmpl.steps) return false;

            const step1List = tmpl.steps.step1 || [];
            for (const item of step1List) {
                const fieldCfg = config.FIELD_TYPES_CONFIG[item.type];
                if (fieldCfg && fieldCfg.isPro) return true;
            }

            const step2Groups = tmpl.steps.step2 || {};
            for (const key in step2Groups) {
                const groupList = step2Groups[key] || [];
                for (const item of groupList) {
                    const fieldCfg = config.FIELD_TYPES_CONFIG[item.type];
                    if (fieldCfg && fieldCfg.isPro) return true;
                }
            }

            return false;
        };

        // Render each template dynamically
        Object.entries(config.FORM_TEMPLATES).forEach(([key, tmpl]) => {
            const isProTemplate = hasProFields(tmpl);
            const isLocked = isProTemplate && !config.isPro;

            // Create card element
            const card = document.createElement("div");
            card.className = `flwp-template-card-new ${isLocked ? 'flwp-template-card-locked' : ''}`;
            card.dataset.template = key;

            // Card Header
            const header = document.createElement("div");
            header.className = "flwp-template-card-header";

            const title = document.createElement("h4");
            title.className = "flwp-template-card-title";
            title.textContent = tmpl.title;
            header.appendChild(title);

            if (isProTemplate && !config.isPro) {
                const badge = document.createElement("span");
                badge.className = "flwp-pro-inline-badge";
                badge.textContent = "PRO";
                header.appendChild(badge);
            }

            // Refresh Button for Resetting the Preview
            const refreshBtn = document.createElement("button");
            refreshBtn.className = "flwp-template-card-refresh-btn";
            refreshBtn.type = "button";
            refreshBtn.title = __("admin.builder.reset_preview");
            refreshBtn.innerHTML = '<i class="fas fa-redo"></i>';
            header.appendChild(refreshBtn);

            card.appendChild(header);

            // Card Body (scrollable form preview area)
            const body = document.createElement("div");
            body.className = "flwp-template-card-body flwp-feedback-plugin";
            body.id = `flwp-tmpl-preview-${key}`;
            // Mark for lazy rendering
            body.dataset.rendered = "false";
            card.appendChild(body);

            // Function to render/re-render this preview form
            const renderPreview = () => {
                if (window.FLWPFrontend) {
                    body.flwpCurrentStep = 1;
                    body.flwpStep2TriggerId = null;
                    body.flwpAnswers = {};

                    const tempState = {
                        settings: {
                            styles: {
                                accentColor: '#000000',
                                secondaryColor: '#555555',
                            }
                        },
                        title: tmpl.title,
                        steps: tmpl.steps,
                    };

                    window.FLWPFrontend.render(body, tempState, {
                        isPreview: true,
                        isSplit: false,
                        onConfirm: () => {
                            console.log(`FLWP: Dummy confirm on template preview ${key}`);
                        }
                    });
                }
                body.dataset.rendered = "true";
            };

            // Attach render function for lazy load & refresh button
            body.flwpRenderPreview = renderPreview;

            refreshBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                renderPreview();
            });

            // Card Footer
            const footer = document.createElement("div");
            footer.className = "flwp-template-card-footer";

            const footerBtn = document.createElement("button");
            footerBtn.className = `flwp-template-card-btn ${isLocked ? 'flwp-template-card-btn-locked' : ''}`;
            footerBtn.type = "button";

            if (isLocked) {
                footerBtn.innerHTML = '<i class="fas fa-lock"></i> ' + __("admin.builder.unlock_pro");
            } else {
                footerBtn.innerHTML = '<i class="fas fa-plus"></i> ' + __("admin.builder.use_template");
            }

            footer.appendChild(footerBtn);
            card.appendChild(footer);

            // Add card to grid
            container.appendChild(card);

            // Click Handler for Template Loading or PRO Upgrade (on the button, not card)
            footerBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const formBuilder = window.FLWPFormBuilder;
                if (!formBuilder) return;

                if (isLocked) {
                    formBuilder.engine.openProUpgradeModal();
                    return;
                }

                if (confirm(__("admin.confirm.load_template"))) {
                    formBuilder.state.settings.main.title = tmpl.title;
                    formBuilder.state.steps = JSON.parse(JSON.stringify(tmpl.steps));

                    if (key === 'blank') formBuilder.state.activeStep2TriggerId = "";
                    else if (key === 'nps') formBuilder.state.activeStep2TriggerId = "nps-3";
                    else if (key === 'website') formBuilder.state.activeStep2TriggerId = "web-2";
                    else formBuilder.state.activeStep2TriggerId = "";

                    formBuilder.controller.loadFormStateToInputs();
                    formBuilder.engine.renderStepCanvas(1);
                    formBuilder.engine.renderStepCanvas(2);
                    formBuilder.controller.setStepFocus(1);

                    const modal = document.getElementById("flwp-modal-templates");
                    if (modal) modal.classList.remove("flwp-modal-overlay-active");

                    utils.showToast(__("admin.toast.template_loaded", { title: tmpl.title }), "success");
                    formBuilder.api.saveStateToLocalStorage();
                }
            });
        });

        // Setup IntersectionObserver for Lazy Rendering of the form templates
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: document.querySelector("#flwp-modal-templates .flwp-modal-body") || null,
                rootMargin: "50px",
                threshold: 0.01
            };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bodyEl = entry.target;
                        if (bodyEl.dataset.rendered === "false") {
                            if (typeof bodyEl.flwpRenderPreview === "function") {
                                bodyEl.flwpRenderPreview();
                            }
                            obs.unobserve(bodyEl); // Render once, then stop observing
                        }
                    }
                });
            }, observerOptions);

            // Observe all bodies
            document.querySelectorAll(".flwp-template-card-body").forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver (render everything immediately)
            document.querySelectorAll(".flwp-template-card-body").forEach(bodyEl => {
                if (typeof bodyEl.flwpRenderPreview === "function") {
                    bodyEl.flwpRenderPreview();
                }
            });
        }
    }
};
