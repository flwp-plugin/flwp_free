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
        } else if (type === 'textarea') {
            newField.settings.placeholder = __("admin.builder.default_feedback_placeholder");
            newField.settings.required = true;
        } else if (type === 'button') {
            newField.settings.buttonType = "submit";
            newField.settings.icon = "fa-paper-plane";
            newField.settings.iconPosition = "right";
            newField.settings.alignment = 'left';
            newField.settings.step2Enabled = false;
        } else if (type === 'dropdown') {
            newField.settings.required = false;
            newField.settings.choices = [
                { text: __("fields.choices_list.general"), icon: "" },
                { text: __("fields.choices_list.pre_purchase"), icon: "" },
                { text: __("fields.choices_list.technical_support"), icon: "" }
            ];
            newField.settings.defaultChoice = __("fields.choices_list.general");
        } else if (type === 'chips') {
            newField.settings.required = true;
            newField.settings.alignment = 'left';
            newField.settings.iconPosition = 'left';
            newField.settings.borderRadius = '20px';
            newField.settings.fontSize = 'inherit';
            newField.settings.lineHeight = '1.4';
            newField.settings.choices = [
                { text: __("fields.choices_list.general"), icon: "fa-question" },
                { text: __("fields.choices_list.pre_purchase"), icon: "fa-shopping-cart" },
                { text: __("fields.choices_list.technical_support"), icon: "fa-bug" },
            ];
            newField.settings.defaultChoice = __("fields.choices_list.general");
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

            case 'dropdown': {
                const rawChoices = (item.settings && Array.isArray(item.settings.choices)) ? item.settings.choices : [];
                const choices = rawChoices.map(c => typeof c === 'object' && c !== null ? (c.text || '') : String(c));
                const defaultChoice = (item.settings && item.settings.defaultChoice) ? item.settings.defaultChoice : '';
                const selectedVal = (options.answers && options.answers[item.id] !== undefined)
                    ? options.answers[item.id]
                    : defaultChoice;

                if (isBuilder) {
                    const displayVal = selectedVal || choices[0] || __("fields.choices_list.placeholder");
                    return `
                        <label class="flwp-el-label" style="${labelStyle}">${utils.escapeHtml(label)}${requiredStar}</label>
                        <div class="flwp-visual-mock-dropdown">
                            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${utils.escapeHtml(displayVal)}</span>
                            <i class="fas fa-chevron-down" style="color: #64748b; font-size: 11px; margin-left: 8px; flex-shrink: 0;"></i>
                        </div>
                    `;
                } else {
                    const container = document.createElement("div");
                    container.className = "flwp-fd-group-dropdown";
                    container.appendChild(fields.createLabel(item));

                    const selectWrapper = document.createElement("div");
                    selectWrapper.className = "flwp-fd-select-wrapper";

                    const select = document.createElement("select");
                    select.className = "flwp-form-select flwp-fd-select";

                    if (!item.settings.required && !defaultChoice) {
                        const emptyOpt = document.createElement("option");
                        emptyOpt.value = "";
                        emptyOpt.textContent = `— ${__("fields.choices_list.placeholder")} —`;
                        if (!selectedVal) emptyOpt.selected = true;
                        select.appendChild(emptyOpt);
                    }

                    choices.forEach(choiceText => {
                        const opt = document.createElement("option");
                        opt.value = choiceText;
                        opt.textContent = choiceText;
                        if (choiceText === selectedVal) {
                            opt.selected = true;
                        }
                        select.appendChild(opt);
                    });

                    if (options.isReadOnly) {
                        select.disabled = true;
                        select.style.cursor = "default";
                    } else {
                        if (selectedVal && options.onAnswerChange) {
                            options.onAnswerChange(item.id, selectedVal);
                        }

                        select.addEventListener("change", () => {
                            options.onAnswerChange(item.id, select.value);
                            if (options.markFieldValid) {
                                if (select.value.trim().length > 0 || !(item.settings && item.settings.required)) {
                                    options.markFieldValid();
                                }
                            }
                        });
                    }

                    selectWrapper.appendChild(select);
                    container.appendChild(selectWrapper);
                    return container;
                }
            }

            case 'chips': {
                const rawChoices = (item.settings && Array.isArray(item.settings.choices)) ? item.settings.choices : [];
                const choices = rawChoices.map(c => {
                    if (typeof c === 'object' && c !== null) {
                        return { text: c.text || '', icon: c.icon || '' };
                    }
                    return { text: String(c), icon: '' };
                });
                const defaultChoice = (item.settings && item.settings.defaultChoice) ? item.settings.defaultChoice : (choices[0] ? choices[0].text : '');
                const selectedVal = (options.answers && options.answers[item.id] !== undefined)
                    ? options.answers[item.id]
                    : defaultChoice;

                const iconPos = item.settings.iconPosition || 'left';
                const accentColor = (stateObj && stateObj.settings && stateObj.settings.styles && stateObj.settings.styles.secondaryColor) || '#104689';

                const standardBg = (item.settings.customColorsEnabled && item.settings.bgColor) ? item.settings.bgColor : '#f1f5f9';
                const standardColor = (item.settings.customColorsEnabled && item.settings.textColor) ? item.settings.textColor : '#334155';
                const standardBorder = (item.settings.customColorsEnabled && item.settings.borderColor) ? item.settings.borderColor : '#e2e8f0';

                const activeBg = (item.settings.customColorsEnabled && item.settings.hoverBgColor) ? item.settings.hoverBgColor : accentColor;
                const activeColor = (item.settings.customColorsEnabled && item.settings.hoverTextColor) ? item.settings.hoverTextColor : '#ffffff';
                const activeBorder = (item.settings.customColorsEnabled && item.settings.hoverBorderColor) ? item.settings.hoverBorderColor : activeBg;

                const bRadius = item.settings.borderRadius || '20px';
                let extraFont = '';
                if (item.settings.fontSize && item.settings.fontSize !== 'inherit') extraFont += `font-size: ${item.settings.fontSize}; `;
                if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') extraFont += `line-height: ${item.settings.lineHeight}; `;

                const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
                const justifyVal = justifyMap[align] || 'flex-start';

                if (isBuilder) {
                    const chipsHtml = choices.map(choice => {
                        const isSelected = (choice.text === selectedVal && choice.text !== '');
                        const bg = isSelected ? activeBg : standardBg;
                        const fg = isSelected ? activeColor : standardColor;
                        const bd = isSelected ? activeBorder : standardBorder;

                        let iconHtml = '';
                        if (choice.icon && choice.icon !== 'fa-times' && choice.icon !== 'none') {
                            iconHtml = `<i class="fas ${choice.icon} flwp-chip-icon"></i>`;
                        }

                        const styleStr = `background-color: ${bg}; color: ${fg}; border: 1px solid ${bd}; border-radius: ${bRadius}; ${extraFont}`;

                        const iconLeftHtml = (iconPos === 'left' && iconHtml) ? iconHtml : '';
                        const iconRightHtml = (iconPos === 'right' && iconHtml) ? iconHtml : '';

                        return `<div class="flwp-chip ${isSelected ? 'is-active' : ''}" style="${styleStr}">${iconLeftHtml}<span class="flwp-chip-text">${utils.escapeHtml(choice.text)}</span>${iconRightHtml}</div>`;
                    }).join('');

                    return `
                        <label class="flwp-el-label" style="${labelStyle}">${utils.escapeHtml(label)}${requiredStar}</label>
                        <div class="flwp-visual-mock-chips" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: ${justifyVal}; align-items: center;">
                            ${chipsHtml}
                        </div>
                    `;
                } else {
                    const container = document.createElement("div");
                    container.className = "flwp-fd-group-chips";
                    container.appendChild(fields.createLabel(item));

                    const chipsWrapper = document.createElement("div");
                    chipsWrapper.className = "flwp-chips-container";
                    chipsWrapper.style.display = "flex";
                    chipsWrapper.style.flexWrap = "wrap";
                    chipsWrapper.style.gap = "8px";
                    chipsWrapper.style.justifyContent = justifyVal;
                    chipsWrapper.style.alignItems = "center";

                    if (selectedVal && options.onAnswerChange) {
                        options.onAnswerChange(item.id, selectedVal);
                    }

                    const chipButtons = [];

                    choices.forEach(choice => {
                        const btn = document.createElement("button");
                        btn.type = "button";
                        btn.className = "flwp-chip";
                        btn.dataset.value = choice.text;
                        btn.style.borderRadius = bRadius;
                        if (item.settings.fontSize && item.settings.fontSize !== 'inherit') btn.style.fontSize = item.settings.fontSize;
                        if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') btn.style.lineHeight = item.settings.lineHeight;

                        let iconEl = null;
                        if (choice.icon && choice.icon !== 'fa-times' && choice.icon !== 'none') {
                            iconEl = document.createElement("i");
                            iconEl.className = `fas ${choice.icon} flwp-chip-icon`;
                        }

                        const textSpan = document.createElement("span");
                        textSpan.className = "flwp-chip-text";
                        textSpan.textContent = choice.text;

                        if (iconPos === 'left' && iconEl) btn.appendChild(iconEl);
                        btn.appendChild(textSpan);
                        if (iconPos === 'right' && iconEl) btn.appendChild(iconEl);

                        const applyState = (active) => {
                            if (active) {
                                btn.classList.add("is-active");
                                btn.style.backgroundColor = activeBg;
                                btn.style.color = activeColor;
                                btn.style.borderColor = activeBorder;
                            } else {
                                btn.classList.remove("is-active");
                                btn.style.backgroundColor = standardBg;
                                btn.style.color = standardColor;
                                btn.style.borderColor = standardBorder;
                            }
                        };

                        const isInitialSelected = (choice.text === selectedVal && choice.text !== '');
                        applyState(isInitialSelected);

                        if (options.isReadOnly) {
                            btn.disabled = true;
                            btn.style.cursor = "default";
                        } else {
                            btn.addEventListener("click", () => {
                                chipButtons.forEach(b => b._applyState(b._choiceText === choice.text));
                                if (options.onAnswerChange) {
                                    options.onAnswerChange(item.id, choice.text);
                                }
                                if (options.markFieldValid) {
                                    if (choice.text.trim().length > 0 || !(item.settings && item.settings.required)) {
                                        options.markFieldValid();
                                    }
                                }
                            });
                        }

                        btn._applyState = applyState;
                        btn._choiceText = choice.text;
                        chipButtons.push(btn);
                        chipsWrapper.appendChild(btn);
                    });

                    container.appendChild(chipsWrapper);
                    return container;
                }
            }
        }
    },

    /**
     * Sets up the interactive Choices List editor for Dropdown options (supportedSetting: choicesList)
     */
    setupChoicesListControl: function(containerEl, element, applyChange, SortableLib = null) {
        if (!containerEl || !element) return;

        if (!element.settings) element.settings = {};
        if (!Array.isArray(element.settings.choices) || element.settings.choices.length === 0) {
            if (element.type === 'chips') {
                element.settings.choices = [
                    { text: __("fields.choices_list.general"), icon: "fa-lightbulb" },
                    { text: __("fields.choices_list.pre_purchase"), icon: "fa-rocket" },
                    { text: __("fields.choices_list.technical_support"), icon: "fa-palette" },
                ];
                element.settings.defaultChoice = __("fields.choices_list.general");
            } else {
                element.settings.choices = [
                    { text: __("fields.choices_list.general"), icon: "" },
                    { text: __("fields.choices_list.pre_purchase"), icon: "" },
                    { text: __("fields.choices_list.technical_support"), icon: "" }
                ];
                element.settings.defaultChoice = __("fields.choices_list.general");
            }
        } else {
            element.settings.choices = element.settings.choices.map(c => {
                if (typeof c === 'string') return { text: c, icon: '' };
                return { text: c.text || '', icon: c.icon || '' };
            });
        }

        const fieldConfig = config.FIELD_TYPES_CONFIG[element.type];
        const supportsChoiceIcons = fieldConfig && fieldConfig.supportedSettings && fieldConfig.supportedSettings.includes('icon');

        const renderRows = () => {
            containerEl.innerHTML = "";

            const currentChoices = element.settings.choices || [];
            const currentDefault = element.settings.defaultChoice || "";

            currentChoices.forEach((choiceObj, index) => {
                const choiceText = choiceObj.text || "";
                const choiceIcon = choiceObj.icon || "";
                const row = document.createElement("div");
                row.className = "flwp-choice-row";
                row.dataset.index = String(index);

                // Drag handle
                const dragHandle = document.createElement("span");
                dragHandle.className = "flwp-choice-drag-handle";
                dragHandle.title = __("fields.choices_list.drag_to_sort");
                dragHandle.innerHTML = '<i class="fas fa-grip-lines"></i>';

                // Radio button for default choice
                const radioWrap = document.createElement("label");
                radioWrap.className = "flwp-choice-radio-wrap";
                radioWrap.title = __("fields.choices_list.set_as_default");

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `flwp-choice-default-${element.id}`;
                radio.className = "flwp-choice-radio";
                radio.checked = (choiceText === currentDefault && choiceText !== "");

                radio.addEventListener("change", () => {
                    applyChange(el => {
                        el.settings.defaultChoice = choiceText;
                    });
                    renderRows();
                });
                radioWrap.appendChild(radio);


                // Icon button (if supported by field)
                let btnIcon = null;
                if (supportsChoiceIcons) {
                    btnIcon = document.createElement("button");
                    btnIcon.type = "button";
                    btnIcon.className = "flwp-choice-icon-btn";
                    btnIcon.title = "Icon auswählen";
                    btnIcon.innerHTML = choiceIcon ? `<i class="fas ${choiceIcon}"></i>` : `<i class="fas fa-icons" style="opacity: 0.35;"></i>`;

                    btnIcon.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const existingPopover = document.querySelector(".flwp-choice-icon-popover");
                        if (existingPopover) existingPopover.remove();

                        const popover = document.createElement("div");
                        popover.className = "flwp-choice-icon-popover";

                        const iconList = [
                            "fa-lightbulb", "fa-rocket", "fa-palette", "fa-comment",
                            "fa-bug", "fa-star", "fa-heart", "fa-question",
                            "fa-gear", "fa-bullhorn", "fa-shopping-cart", "fa-box",
                            "fa-lock", "fa-bolt", "fa-thumbs-up", "fa-thumbs-down",
                            "fa-tag", "fa-check", "fa-circle-info", "fa-paper-plane",
                            "fa-smile", "fa-times"
                        ];

                        const searchInput = document.createElement("input");
                        searchInput.type = "text";
                        searchInput.className = "flwp-choice-icon-search";
                        searchInput.placeholder = "Icon suchen (z.B. fa-rocket)...";
                        searchInput.value = choiceIcon;

                        const grid = document.createElement("div");
                        grid.className = "flwp-choice-icon-grid";

                        const renderGrid = (filter = "") => {
                            grid.innerHTML = "";
                            const filtered = iconList.filter(ic => !filter || ic.toLowerCase().includes(filter.toLowerCase()));
                            filtered.forEach(ic => {
                                const opt = document.createElement("div");
                                opt.className = `flwp-choice-icon-opt ${ic === choiceIcon ? 'is-selected' : ''}`;
                                opt.title = ic === 'fa-times' ? 'Kein Icon' : ic;
                                opt.innerHTML = ic === 'fa-times' ? '<i class="fas fa-ban"></i>' : `<i class="fas ${ic}"></i>`;
                                opt.addEventListener("click", () => {
                                    const newIcon = ic === 'fa-times' ? '' : ic;
                                    applyChange(el => {
                                        el.settings.choices[index].icon = newIcon;
                                    });
                                    renderRows();
                                    popover.remove();
                                });
                                grid.appendChild(opt);
                            });
                        };

                        renderGrid();

                        searchInput.addEventListener("input", () => {
                            renderGrid(searchInput.value.trim());
                        });

                        searchInput.addEventListener("keydown", (evt) => {
                            if (evt.key === "Enter") {
                                evt.preventDefault();
                                const val = searchInput.value.trim();
                                applyChange(el => {
                                    el.settings.choices[index].icon = val === 'fa-times' ? '' : val;
                                });
                                renderRows();
                                popover.remove();
                            }
                        });

                        popover.appendChild(searchInput);
                        popover.appendChild(grid);

                        document.body.appendChild(popover);

                        const rect = btnIcon.getBoundingClientRect();
                        popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
                        popover.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 240)}px`;

                        const handleOutsideClick = (evt) => {
                            if (!popover.contains(evt.target) && evt.target !== btnIcon) {
                                popover.remove();
                                document.removeEventListener("click", handleOutsideClick);
                            }
                        };
                        setTimeout(() => {
                            document.addEventListener("click", handleOutsideClick);
                            searchInput.focus();
                        }, 10);
                    });
                }

                // Text input
                const textInput = document.createElement("input");
                textInput.type = "text";
                textInput.className = "flwp-choice-input";
                textInput.value = choiceText;
                textInput.placeholder = `Option ${index + 1}`;

                textInput.addEventListener("input", (e) => {
                    const target = e.target;
                    const newVal = target ? target.value : "";
                    const oldVal = element.settings.choices[index].text;
                    const isDefault = (element.settings.defaultChoice === oldVal);

                    element.settings.choices[index].text = newVal;
                    if (isDefault) {
                        element.settings.defaultChoice = newVal;
                    }

                    applyChange(el => {
                        el.settings.choices[index].text = newVal;
                        if (isDefault) {
                            el.settings.defaultChoice = newVal;
                        }
                    });
                });

                // Plus button
                const btnAdd = document.createElement("button");
                btnAdd.type = "button";
                btnAdd.className = "flwp-choice-btn flwp-choice-btn-add";
                btnAdd.title = __("fields.choices_list.add_option");
                btnAdd.innerHTML = '<i class="fas fa-plus"></i>';

                btnAdd.addEventListener("click", () => {
                    const newChoice = {
                        text: `Option ${element.settings.choices.length + 1}`,
                        icon: supportsChoiceIcons ? "fa-tag" : ""
                    };
                    applyChange(el => {
                        if (!Array.isArray(el.settings.choices)) el.settings.choices = [];
                        el.settings.choices.splice(index + 1, 0, newChoice);
                    });
                    renderRows();
                    const allInputs = containerEl.querySelectorAll(".flwp-choice-input");
                    const nextInput = allInputs[index + 1];
                    if (nextInput) {
                        nextInput.focus();
                        nextInput.select();
                    }
                });

                // Minus button
                const btnRemove = document.createElement("button");
                btnRemove.type = "button";
                btnRemove.className = "flwp-choice-btn flwp-choice-btn-remove";
                btnRemove.title = __("fields.choices_list.remove_option");
                btnRemove.innerHTML = '<i class="fas fa-minus"></i>';

                btnRemove.addEventListener("click", () => {
                    if (element.settings.choices.length <= 1) {
                        utils.showToast(__("fields.choices_list.at_least_one_option"), "warning");
                        return;
                    }
                    const removedVal = element.settings.choices[index].text;
                    applyChange(el => {
                        el.settings.choices.splice(index, 1);
                        if (el.settings.defaultChoice === removedVal) {
                            el.settings.defaultChoice = el.settings.choices[0] ? el.settings.choices[0].text : "";
                        }
                    });
                    renderRows();
                });

                row.appendChild(dragHandle);
                row.appendChild(radioWrap);
                if (supportsChoiceIcons && btnIcon) {
                    row.appendChild(btnIcon);
                }
                row.appendChild(textInput);
                row.appendChild(btnAdd);
                row.appendChild(btnRemove);

                containerEl.appendChild(row);
            });

            // Initialize Sortable
            const SortableConstructor = SortableLib || (typeof window !== "undefined" ? window.Sortable : null);
            if (SortableConstructor) {
                if (containerEl._sortableInstance) {
                    try {
                        containerEl._sortableInstance.destroy();
                    } catch (_) {
                    }
                }
                containerEl._sortableInstance = new SortableConstructor(containerEl, {
                    handle: ".flwp-choice-drag-handle",
                    animation: 150,
                    ghostClass: "flwp-choice-ghost",
                    onEnd: () => {
                        const rows = containerEl.querySelectorAll(".flwp-choice-row");
                        const updatedChoices = [];
                        let updatedDefault = "";

                        rows.forEach(r => {
                            const originalIdx = parseInt(r.dataset.index, 10);
                            const inp = r.querySelector(".flwp-choice-input");
                            const rad = r.querySelector(".flwp-choice-radio");
                            const existingIcon = (element.settings.choices[originalIdx] && element.settings.choices[originalIdx].icon) || "";
                            const textVal = inp ? inp.value : "";
                            updatedChoices.push({
                                text: textVal,
                                icon: existingIcon
                            });
                            if (rad && rad.checked) {
                                updatedDefault = textVal;
                            }
                        });

                        applyChange(el => {
                            el.settings.choices = updatedChoices;
                            if (updatedDefault) el.settings.defaultChoice = updatedDefault;
                        });
                        renderRows();
                    }
                });
            }
        };

        renderRows();
    }
};
