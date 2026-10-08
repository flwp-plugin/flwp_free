import { utils } from './flwp-form-utils.js';
import { config } from './flwp-form-config.js';

import { __ } from './flwp-i18n.js';

/**
 * Shared Component Registry for form fields
 */
export const fields = {
    /**
     * Creates a default field structure with default settings.
     * @param {string} type - Field type
     * @param {string} defaultLabel - Default label for the field
     * @returns {Object} Newly created field object
     */
    createDefaultElement: function(type, defaultLabel) {
        const newField = {
            id: `flwp-el-${Date.now()}`,
            type: type,
            label: defaultLabel,
            settings: {}
        };

        if (type === 'headline' || type === 'description') {
            newField.settings.alignment = 'left';
        } else if (type === 'rating') {
            newField.settings.stars = 5;
            newField.settings.required = true;
            newField.settings.alignment = 'left';
            newField.settings.step2Enabled = false;
        } else if (type === 'thumbs' || type === 'smileys' || type === 'nps') {
            newField.settings.required = true;
            newField.settings.alignment = 'left';
            newField.settings.step2Enabled = false;
            if (type === 'smileys') newField.settings.smileyLegend = true;
            if (type === 'nps') newField.settings.stars = 10;
        } else if (type === 'textarea') {
            newField.settings.placeholder = __("admin.builder.default_feedback_placeholder");
            newField.settings.required = true;
        } else if (type === 'button') {
            newField.settings.buttonType = "submit";
            newField.settings.icon = "fa-paper-plane";
            newField.settings.iconPosition = "right";
            newField.settings.alignment = 'left';
            newField.settings.step2Enabled = false;
        }

        return newField;
    },

    /**
     * Helper to create a field label DOM element (for interactive mode)
     */
    createLabel: function(item) {
        const labelEl = document.createElement("label");
        labelEl.className = "flwp-fd-label";
        const labelStyle = utils.getSharedLabelStyleString(item, false);
        if (labelStyle) {
            labelEl.setAttribute("style", labelStyle);
        }
        const requiredStar = (item.settings && item.settings.required) ? '<span class="flwp-fd-required-star">*</span>' : '';
        labelEl.innerHTML = `${utils.escapeHtml(item.label)}${requiredStar}`;
        return labelEl;
    },

    /**
     * Main render router for all field types
     * @param {Object} item - Field item configuration
     * @param {string} mode - 'builder' or 'interactive'
     * @param {Object} stateObj - Global form state object (for theme styles)
     * @param {Object} options - Action hooks & state for interactive mode
     */
    render: function(item, mode, stateObj = null, options = {}) {
        const isBuilder = mode === 'builder';
        const align = item.settings.alignment || 'left';
        const label = item.label || __("fields.unnamed");
        const requiredStar = (item.settings && item.settings.required) ? '<span class="flwp-el-required-star">*</span>' : '';
        const labelStyle = utils.getSharedLabelStyleString(item, true);

        switch(item.type) {
            case 'headline': {
                const finalIconName = item.settings.icon || 'fa-times';
                const iconPrefix = ['fa-paper-plane', 'fa-heart', 'fa-comment', 'fa-laugh-beam', 'fa-futbol', 'fa-lightbulb', 'fa-comment-dots'].includes(finalIconName) ? 'far' : 'fas';
                const hIcon = finalIconName !== 'fa-times' ? `<i class="${iconPrefix} ${finalIconName}"></i>` : '';
                const iconPos = item.settings.iconPosition || 'left';

                let headlineStyle = utils.getSharedLabelStyleString(item, true, false);
                if (item.settings && item.settings.bold) {
                    headlineStyle += '; font-weight: bold';
                }
                if (item.settings && item.settings.italic) {
                    headlineStyle += '; font-style: italic';
                }
                if (item.settings && item.settings.underline) {
                    headlineStyle += '; text-decoration: underline';
                }
                if (options.isReadOnly === false && item.settings.customColorsEnabled && item.settings.textColor) {
                    headlineStyle += `; color: ${item.settings.textColor}`;
                }

                let headlineContent = '';
                if (hIcon) {
                    if (iconPos === 'left') {
                        headlineContent = `${hIcon}<span>${utils.escapeHtml(label)}</span>`;
                    } else {
                        headlineContent = `<span>${utils.escapeHtml(label)}</span>${hIcon}`;
                    }
                    const justify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                    headlineStyle += `; display: flex; align-items: baseline; gap: 8px; justify-content: ${justify}; width: 100%;`;
                } else {
                    headlineContent = `<span>${utils.escapeHtml(label)}</span>`;
                }

                const tag = (item.settings && item.settings.hType) || 'h3';

                if (isBuilder) {
                    return `<${tag} class="flwp-visual-mock-headline" style="${headlineStyle}">${headlineContent}</${tag}>`;
                } else {
                    const el = document.createElement(tag);
                    el.className = `flwp-fd-headline flwp-fd-text-${align}`;
                    el.innerHTML = headlineContent;
                    el.setAttribute("style", headlineStyle);
                    return el;
                }
            }

            case 'description': {
                let descStyle = utils.getSharedLabelStyleString(item, true, false);
                if (item.settings && item.settings.bold) {
                    descStyle += '; font-weight: bold';
                }
                if (item.settings && item.settings.italic) {
                    descStyle += '; font-style: italic';
                }
                if (item.settings && item.settings.underline) {
                    descStyle += '; text-decoration: underline';
                }
                if (options.isReadOnly === false && item.settings.customColorsEnabled && item.settings.textColor) {
                    descStyle += `; color: ${item.settings.textColor}`;
                }

                if (options.isReadOnly) {
                    descStyle = '';
                }

                if (isBuilder) {
                    return `<p class="flwp-visual-mock-description" style="${descStyle}">${utils.escapeHtml(label)}</p>`;
                } else {
                    const el = document.createElement("p");
                    el.className = `flwp-fd-description flwp-fd-text-${align}`;
                    el.innerHTML = utils.escapeHtml(label);
                    el.setAttribute("style", descStyle);
                    return el;
                }
            }

            case 'button': {
                const { bType, normalBg, normalColor, normalBorder, hoverBg, hoverColor, hoverBorder, isBack, isSubmit } = utils.resolveSharedButtonStyle(item, stateObj, isBuilder);
                const finalIconName = item.settings.icon || (bType === 'back' ? 'fa-arrow-left' : 'fa-arrow-right');
                const iconPrefix = ['fa-paper-plane', 'fa-heart', 'fa-comment', 'fa-laugh-beam', 'fa-futbol', 'fa-lightbulb', 'fa-comment-dots'].includes(finalIconName) ? 'far' : 'fas';
                const btnIcon = finalIconName !== 'fa-times' ? `<i class="${iconPrefix} ${finalIconName}"></i>` : '';
                const iconPos = item.settings.iconPosition || (bType === 'back' ? 'left' : 'right');

                // Layout styling
                let btnJustify = 'center';
                let widthStyle = '';
                let containerJustify = 'flex-start';

                if (item.settings.fullWidth !== false) {
                    btnJustify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                    widthStyle = `width: 100%; justify-content: ${btnJustify};`;
                    containerJustify = 'center';
                } else {
                    btnJustify = 'center';
                    widthStyle = 'width: auto; justify-content: center;';
                    containerJustify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                }

                let extraBtnStyles = '';
                if (item.settings.fontSize && item.settings.fontSize !== 'inherit') {
                    extraBtnStyles += `font-size: ${item.settings.fontSize}; `;
                }
                if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') {
                    extraBtnStyles += `line-height: ${item.settings.lineHeight}; `;
                }
                if (item.settings.borderRadius && item.settings.borderRadius !== 'inherit') {
                    extraBtnStyles += `border-radius: ${item.settings.borderRadius}; `;
                }

                if (isBuilder) {
                    const hoverEvents = `onmouseenter="this.style.backgroundColor='${hoverBg}'; this.style.color='${hoverColor}'; this.style.borderColor='${hoverBorder}';" onmouseleave="this.style.backgroundColor='${normalBg}'; this.style.color='${normalColor}'; this.style.borderColor='${normalBorder}';"`;
                    const combinedBtnStyle = `background-color: ${normalBg}; color: ${normalColor}; border: 1px solid ${normalBorder}; ${extraBtnStyles} ${widthStyle}`;
                    const badgeText = isSubmit ? `<span style="font-size: 10px; color: var(--flwp-text-secondary); display: block; margin-top: 4px;">${__("admin.builder.submit_action")}</span>` : (isBack ? `<span style="font-size: 10px; color: var(--flwp-text-secondary); display: block; margin-top: 4px;">${__("admin.builder.back_action")}</span>` : '');

                    let btnHtml = '';
                    if (iconPos === 'left') {
                        btnHtml = `<div class="flwp-visual-mock-btn" style="${combinedBtnStyle}" ${hoverEvents}>${btnIcon}<span>${utils.escapeHtml(label)}</span></div>`;
                    } else {
                        btnHtml = `<div class="flwp-visual-mock-btn" style="${combinedBtnStyle}" ${hoverEvents}><span>${utils.escapeHtml(label)}</span>${btnIcon}</div>`;
                    }

                    let htmlMarkup = `<div style="display: flex; justify-content: ${containerJustify}; width: 100%;">${btnHtml}</div>${badgeText}`;

                    if (bType === 'next' && item.settings.step2Enabled) {
                        htmlMarkup += `<div style="display: flex; justify-content: ${containerJustify}; width: 100%;"><span class="flwp-step2-connection-badge flwp-step2-connected-btn" style="cursor: pointer;" data-trigger="${item.id}"><i class="fas fa-link"></i> ${__("admin.builder.step2_connected")}</span></div>`;
                    }
                    return htmlMarkup;
                } else {
                    // Interactive runtime element utilizing CSS Custom variables
                    const btn = document.createElement("button");
                    btn.className = "flwp-btn flwp-fd-btn-border";

                    if (isSubmit) {
                        btn.classList.add("flwp-btn-submit", "flwp-btn-primary");
                    } else if (isBack) {
                        btn.classList.add("flwp-btn-back");
                    } else {
                        btn.classList.add("flwp-btn-standard", "flwp-btn-primary");
                    }

                    // Apply CSS Variables for declarative hover styling
                    btn.style.setProperty('--el-normal-bg', normalBg);
                    btn.style.setProperty('--el-normal-color', normalColor);
                    btn.style.setProperty('--el-normal-border', normalBorder);
                    btn.style.setProperty('--el-hover-bg', hoverBg);
                    btn.style.setProperty('--el-hover-color', hoverColor);
                    btn.style.setProperty('--el-hover-border', hoverBorder);

                    if (item.settings.fontSize && item.settings.fontSize !== 'inherit') {
                        btn.style.fontSize = item.settings.fontSize;
                    }
                    if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') {
                        btn.style.lineHeight = item.settings.lineHeight;
                    }
                    if (item.settings.borderRadius && item.settings.borderRadius !== 'inherit') {
                        btn.style.borderRadius = item.settings.borderRadius;
                    }

                    if (iconPos === 'left') {
                        btn.innerHTML = `${btnIcon}<span>${utils.escapeHtml(item.label)}</span>`;
                    } else {
                        btn.innerHTML = `<span>${utils.escapeHtml(item.label)}</span>${btnIcon}`;
                    }

                      if (options.isReadOnly) {
                        btn.style.pointerEvents = "none";
                        btn.style.cursor = "default";
                      } else {
                        btn.addEventListener("click", () => {
                          if (bType === 'back') {
                            options.goToStep(1);
                          } else if (bType === 'submit') {
                            options.goToStep("confirmed");
                          } else {
                            if (item.settings.step2Enabled && options.isStep2AcType) {
                              options.goToStep(2, item.id);
                            } else {
                              options.goToStep("confirmed");
                            }
                          }
                        });
                      }

                    const btnContainer = document.createElement("div");
                    btnContainer.style.display = "flex";
                    btnContainer.style.width = "100%";

                    if (item.settings.fullWidth !== false) {
                        btn.classList.add("flwp-fd-btn-full");
                        const justifyValue = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                        btn.style.justifyContent = justifyValue;
                        btnContainer.className = "flwp-fd-justify-center flwp-fd-btn-container flwp-fd-btn-full-container";
                    } else {
                        btn.style.width = "auto";
                        btn.style.justifyContent = "center";
                        btnContainer.className = `flwp-fd-justify-${align} flwp-fd-btn-container`;
                    }

                    btnContainer.appendChild(btn);
                    return btnContainer;
                }
            }

            case 'rating': {
                const justify = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
                const starCount = parseInt(item.settings.stars) || 5;
                let color = (item.settings.customColorsEnabled && item.settings.textColor) ? item.settings.textColor : '#cbd5e1';
                let activeColor = (item.settings.customColorsEnabled && item.settings.hoverTextColor)
                    ? item.settings.hoverTextColor
                    : (stateObj && stateObj.settings && (stateObj.settings.styles ? stateObj.settings.styles.secondaryColor : '#555555'));

                if (options.isReadOnly) {
                    color = '#cbd5e1';
                    activeColor = '#555555';
                }

                if (isBuilder) {
                    let starsHtml = '';
                    for (let s = 1; s <= starCount; s++) {
                        starsHtml += `<span class="flwp-visual-mock-star" style="color: #000; border-color: #cbd5e1;"><i class="fas fa-star" style="color: #000;"></i></span>`;
                    }
                    let htmlMarkup = `
            <span class="flwp-el-label" style="${labelStyle}">${utils.escapeHtml(label)}${requiredStar}</span>
            <div class="flwp-visual-mock-stars-row" style="display: flex; justify-content: ${justify};">${starsHtml}</div>
          `;
                    if (item.settings.step2Enabled) {
                        htmlMarkup += `<div style="display: flex; width: 100%; justify-content: ${justify};"><span class="flwp-step2-connection-badge" style="cursor: pointer;" data-trigger="${item.id}"><i class="fas fa-project-diagram"></i> ${__("admin.builder.step2_connected")}</span></div>`;
                    }
                    return htmlMarkup;
                } else {
                    // Interactive rating stars
                    const container = document.createElement("div");
                    container.className = `flwp-fd-group-rating flwp-fd-align-${align}`;
                    container.appendChild(fields.createLabel(item));

                    const starsRow = document.createElement("div");
                    starsRow.className = `flwp-fd-stars-row flwp-fd-justify-${align}`;

                    let clickedStarIndex = (options.answers && options.answers[item.id] !== undefined)
                        ? parseInt(options.answers[item.id]) - 1
                        : -1;

                    const updateStarsUI = (hoveredIndex = -1) => {
                        for (let i = 0; i < starCount; i++) {
                            const starNode = starsRow.children[i];
                            if (!starNode) continue;
                            const iconNode = starNode.querySelector("i");
                            if (!iconNode) continue;
                            const indexToCompare = hoveredIndex !== -1 ? hoveredIndex : clickedStarIndex;
                            if (i <= indexToCompare) {
                                starNode.style.color = activeColor;
                                iconNode.className = "fas fa-star";
                            } else {
                                starNode.style.color = color;
                                iconNode.className = "far fa-star";
                            }
                        }
                    };

                    if (options.isReadOnly) {
                        starsRow.style.pointerEvents = "none";
                    }

                    for (let s = 1; s <= starCount; s++) {
                        const star = document.createElement("span");
                        star.className = "flwp-fd-star";
                        star.style.color = color;
                        star.innerHTML = `<i class="far fa-star" style="pointer-events: none;"></i>`;

                        if (options.isReadOnly) {
                          star.style.cursor = "default";
                        } else {
                          star.addEventListener("mouseenter", () => updateStarsUI(s - 1));
                          star.addEventListener("mouseleave", () => updateStarsUI(-1));

                          star.addEventListener("click", () => {
                            clickedStarIndex = s - 1;
                            options.onAnswerChange(item.id, s);
                            updateStarsUI(-1);
                            if (options.markFieldValid) options.markFieldValid();

                            if (options.enableAutoAdvance) {
                              setTimeout(() => {
                                if (item.settings.step2Enabled && options.isStep2AcType) {
                                  options.goToStep(2, item.id);
                                } else {
                                  options.goToStep("confirmed");
                                }
                              }, 200);
                            }
                          });
                        }
                        starsRow.appendChild(star);
                    }
                    container.appendChild(starsRow);

                    if (clickedStarIndex !== -1) {
                        setTimeout(() => updateStarsUI(-1), 0);
                    }
                    return container;
                }
            }


            case 'textarea': {
                const placeholder = item.settings.placeholder || '';
                let txStyle = '';
                if (item.settings.fontSize && item.settings.fontSize !== 'inherit') {
                    txStyle += `font-size: ${item.settings.fontSize}; `;
                }
                if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') {
                    txStyle += `line-height: ${item.settings.lineHeight}; `;
                }

                if (isBuilder) {
                    const txStyleAttr = txStyle ? `style="${txStyle}"` : '';
                    return `
            <label class="flwp-el-label" ${txStyle ? `style="${txStyle}"` : ''}>${utils.escapeHtml(label)}${requiredStar}</label>
            <div class="flwp-visual-mock-textarea" ${txStyleAttr}>${utils.escapeHtml(placeholder)}</div>
          `;
                } else {
                    // Interactive textarea box
                    const container = document.createElement("div");
                    container.className = "flwp-fd-group-textarea";
                    container.appendChild(fields.createLabel(item));

                    const textarea = document.createElement("textarea");
                    textarea.className = "flwp-form-textarea flwp-fd-textarea";
                    textarea.placeholder = placeholder;
                    textarea.value = (options.answers && options.answers[item.id]) || "";

                    if (item.settings.fontSize && item.settings.fontSize !== 'inherit') {
                        textarea.style.fontSize = item.settings.fontSize;
                    }
                    if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') {
                        textarea.style.lineHeight = item.settings.lineHeight;
                    }

                      if (options.isReadOnly) {
                        textarea.readOnly = true;
                      } else {
                        textarea.addEventListener("input", () => {
                          options.onAnswerChange(item.id, textarea.value);
                          if (options.markFieldValid) {
                            if (textarea.value.trim().length > 0 || !(item.settings && item.settings.required)) {
                              options.markFieldValid();
                            }
                          }
                        });
                      }

                    container.appendChild(textarea);
                    return container;
                }
            }
        }
    }
};
