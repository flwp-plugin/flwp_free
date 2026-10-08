import { __ } from './flwp-i18n.js';

export const CONDITION_TYPES_CONFIG = {
    url: {
        type: "url",
        label: __('admin.conditions.url.label'),
        isPro: true,
        unique: false,
        defaultOperator: "contains",
        defaultValue: "",
        operators: [
            { value: "contains", label: __('admin.conditions.operators.contains') },
            { value: "not_contains", label: __('admin.conditions.operators.not_contains') },
            { value: "exact", label: __('admin.conditions.operators.exact') },
            { value: "not_exact", label: __('admin.conditions.operators.not_exact') }
        ],
        controlType: "text",
        placeholder: __('admin.conditions.placeholder.url'),
        autoFormatUrl: true
    },
    page_type: {
        type: "page_type",
        label: __('admin.conditions.page_type.label'),
        isPro: false,
        unique: true,
        defaultOperator: "in",
        defaultValue: ["page", "post"],
        operators: [
            { value: "in", label: __('admin.conditions.operators.in') }
        ],
        controlType: "multi-pills",
        options: [
            { value: "page", label: __('admin.conditions.options.pages'), icon: "fas fa-file-alt" },
            { value: "post", label: __('admin.conditions.options.posts'), icon: "fas fa-newspaper" }
        ]
    },
    device: {
        type: "device",
        label: __('admin.conditions.device.label'),
        isPro: false,
        unique: true,
        defaultOperator: "in",
        defaultValue: ["desktop", "mobile"],
        operators: [
            { value: "in", label: __('admin.conditions.operators.in') }
        ],
        controlType: "multi-pills",
        options: [
            { value: "desktop", label: __('admin.conditions.options.desktop'), icon: "fas fa-desktop" },
            { value: "mobile", label: __('admin.conditions.options.mobile'), icon: "fas fa-mobile-alt" }
        ]
    },
    cookie: {
        type: "cookie",
        label: __('admin.conditions.cookie.label'),
        isPro: true,
        unique: false,
        defaultOperator: "exact",
        defaultValue: "",
        operators: [
            { value: "contains", label: __('admin.conditions.operators.contains') },
            { value: "not_contains", label: __('admin.conditions.operators.not_contains') },
            { value: "exact", label: __('admin.conditions.operators.exact') },
            { value: "not_exact", label: __('admin.conditions.operators.not_exact') }
        ],
        controlType: "dual-text",
        placeholderName: __('admin.conditions.placeholder.cookie_name'),
        placeholderValue: __('admin.conditions.placeholder.cookie_value')
    }
};

export class FLWPConditionBuilder {
    constructor(container, targetingConfig, onChange, options = {}) {
        if (!container) throw new Error("Container element is required for FLWPConditionBuilder");
        this.container = container;
        this.onChange = onChange || (() => {});

        this.isPro = options.isPro !== false;
        this.openProUpgradeModal = options.openProUpgradeModal || (() => {});

        this.config = this.migrateOldData(targetingConfig);
        this.render();
    }

    migrateOldData(config) {
        if (!config.singleRules || typeof config.singleRules !== 'object') {
            config.singleRules = {};
        }
        if (!config.andRules || !Array.isArray(config.andRules)) {
            config.andRules = [];
        }
        if (!config.orRules || !Array.isArray(config.orRules)) {
            config.orRules = [];
        }

        // Default frontpage to true if not set in singleRules
        if (config.singleRules.show_on_frontpage === undefined) {
            config.singleRules.show_on_frontpage = true;
        }

        return config;
    }

    notifyChange() {
        this.onChange(this.config);
    }

    addRule(groupType, type = null) {
        const group = groupType === "and" ? this.config.andRules : this.config.orRules;
        const allRules = [...this.config.andRules, ...this.config.orRules];

        if (type === null) {
            // Find the first available type that is not unique or not already in use
            const availableType = Object.keys(CONDITION_TYPES_CONFIG).find(key => {
                const cfg = CONDITION_TYPES_CONFIG[key];
                if (!this.isPro && cfg.isPro) return false;
                if (cfg.unique && allRules.some(r => r.type === key)) return false;
                return true;
            });
            type = availableType || (this.isPro ? "url" : "frontpage");
        }

        const cfg = CONDITION_TYPES_CONFIG[type];
        if (!cfg) return;

        if (!this.isPro && cfg.isPro) {
            this.openProUpgradeModal();
            return;
        }

        const id = "rule-" + Math.random().toString(36).substr(2, 9);
        let rule = {
            id,
            type,
            operator: cfg.defaultOperator,
            value: Array.isArray(cfg.defaultValue) ? [...cfg.defaultValue] : cfg.defaultValue
        };

        if (cfg.controlType === "dual-text") {
            rule.cookieName = "";
        }

        group.push(rule);
        this.notifyChange();
        this.render();
    }

    removeRule(groupType, id) {
        if (groupType === "and") {
            this.config.andRules = this.config.andRules.filter(r => r.id !== id);
        } else {
            this.config.orRules = this.config.orRules.filter(r => r.id !== id);
        }
        this.notifyChange();
        this.render();
    }

    handleTypeChange(groupType, rule, newType) {
        const cfg = CONDITION_TYPES_CONFIG[newType];
        if (!cfg) return;

        if (!this.isPro && cfg.isPro) {
            this.openProUpgradeModal();
            this.render();
            return;
        }

        const allRules = [...this.config.andRules, ...this.config.orRules];
        if (cfg.unique && allRules.some(r => r.id !== rule.id && r.type === newType)) {
            this.render();
            return;
        }

        rule.type = newType;
        rule.operator = cfg.defaultOperator;
        rule.value = Array.isArray(cfg.defaultValue) ? [...cfg.defaultValue] : cfg.defaultValue;

        if (cfg.controlType === "dual-text") {
            rule.cookieName = "";
        } else {
            delete rule.cookieName;
        }

        this.notifyChange();
        this.render();
    }

    render() {
        this.container.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.className = "flwp-cb-container";

        const header = document.createElement("div");
        header.className = "flwp-cb-header";

        const title = document.createElement("div");
        title.className = "flwp-cb-title";
        title.innerHTML = `<i class="fas fa-sliders-h"></i> ${__('admin.conditions.title')}`;

        header.appendChild(title);
        wrapper.appendChild(header);

        // Render Top-Level Settings (Frontpage Toggle)
        const topSettings = document.createElement("div");
        topSettings.className = "flwp-cb-top-settings";
        topSettings.style.cssText = "background: #fff; border: 1px solid var(--flwp-border); border-radius: 8px; padding: 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;";

        const leftSide = document.createElement("div");
        leftSide.innerHTML = `
            <div style="font-weight: 600; color: var(--flwp-text); font-size: 13.5px;">${__('admin.conditions.show_on_frontpage')}</div>
            <div style="font-size: 11.5px; color: var(--flwp-text-secondary); margin-top: 2px;">${__('admin.conditions.show_on_frontpage_desc')}</div>
        `;

        const toggleWrapper = document.createElement("div");
        const isFrontpage = this.config.singleRules.show_on_frontpage;
        const toggleId = "flwp-frontpage-toggle-" + Math.random().toString(36).substr(2, 9);
        
        toggleWrapper.innerHTML = `
            <label class="flwp-switch-wrapper" for="${toggleId}">
                <input type="checkbox" id="${toggleId}" ${isFrontpage ? 'checked' : ''}>
                <span class="flwp-switch-slider"></span>
            </label>
        `;

        const checkbox = toggleWrapper.querySelector('input');
        checkbox.addEventListener("change", () => {
            this.config.singleRules.show_on_frontpage = checkbox.checked;
            this.notifyChange();
            this.render();
        });

        topSettings.appendChild(leftSide);
        topSettings.appendChild(toggleWrapper);
        wrapper.appendChild(topSettings);

        // Render AND Group
        const andGroup = this.createGroupSection("and", __('admin.conditions.and_group'), "fas fa-link", "andRules");
        wrapper.appendChild(andGroup);

        // Render Group Connector
        const connector = document.createElement("div");
        connector.className = "flwp-cb-group-connector";
        connector.innerHTML = `
          <div class="flwp-cb-group-connector-line"></div>
          <div class="flwp-cb-group-connector-badge"><i class="fas fa-plus-circle"></i> ${__('admin.conditions.connector')}</div>
          <div class="flwp-cb-group-connector-line"></div>
        `;
        wrapper.appendChild(connector);

        // Render OR Group
        const orGroup = this.createGroupSection("or", __('admin.conditions.or_group'), "fas fa-random", "orRules");
        wrapper.appendChild(orGroup);

        this.container.appendChild(wrapper);

        // Render Hint Box
        const hintBox = document.createElement("div");
        hintBox.className = "flwp-cb-hint-container";
        hintBox.innerHTML = `
          <h5 class="flwp-cb-hint-title"><i class="fas fa-question-circle"></i> ${__('admin.conditions.hint.title')}</h5>
          <p class="flwp-cb-hint-text">
            ${__('admin.conditions.hint.text')}
          </p>
        `;
        this.container.appendChild(hintBox);
    }

    createGroupSection(groupType, groupTitle, iconClass, rulesKey) {
        const section = document.createElement("div");
        section.className = `flwp-cb-group-container flwp-cb-${groupType}-group`;

        const groupHeader = document.createElement("div");
        groupHeader.className = "flwp-cb-group-header";

        const title = document.createElement("div");
        title.className = "flwp-cb-group-title";
        title.innerHTML = `<i class="${iconClass}"></i> ${groupTitle}`;

        const typeLabel = groupType === "and" ? __('admin.conditions.type.and') : __('admin.conditions.type.or');

        const badge = document.createElement("div");
        badge.className = `flwp-cb-group-badge flwp-cb-group-badge-${groupType}`;
        badge.textContent = typeLabel;

        groupHeader.appendChild(title);
        groupHeader.appendChild(badge);
        section.appendChild(groupHeader);

        const rulesList = document.createElement("div");
        rulesList.className = "flwp-cb-rules-list";

        const rules = this.config[rulesKey];

        if (rules.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "flwp-cb-empty-state flwp-cb-empty-state-small";
            if (groupType === "and") {
                emptyState.innerHTML = `
          <i class="fas fa-link" style="font-size: 16px;"></i>
          <p>${__('admin.conditions.empty_state', { type: typeLabel })}</p>
        `;
            } else {
                emptyState.innerHTML = `
          <i class="fas fa-random" style="font-size: 16px;"></i>
          <p>${__('admin.conditions.empty_state', { type: typeLabel })}</p>
        `;
            }
            rulesList.appendChild(emptyState);
        } else {
            rules.forEach((rule, idx) => {
                const row = this.createRuleRow(groupType, rule, idx);
                rulesList.appendChild(row);
            });
        }

        section.appendChild(rulesList);

        const groupFooter = document.createElement("div");
        groupFooter.className = "flwp-cb-group-footer";

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "flwp-cb-add-btn";
        addBtn.innerHTML = `<i class="fas fa-plus"></i> ${__('admin.conditions.add_button')}`;

        const allRules = [...this.config.andRules, ...this.config.orRules];
        const canAddMore = Object.keys(CONDITION_TYPES_CONFIG).some(key => {
            const cfg = CONDITION_TYPES_CONFIG[key];
            if (!this.isPro && cfg.isPro) return false;
            if (cfg.unique && allRules.some(r => r.type === key)) return false;
            return true;
        });

        if (!canAddMore) {
            addBtn.disabled = true;
            addBtn.style.opacity = "0.5";
            addBtn.style.cursor = "not-allowed";
            addBtn.title = __('admin.conditions.add_button_disabled_title');
        }

        addBtn.addEventListener("click", () => {
            if (!canAddMore) return;
            this.addRule(groupType);
        });

        groupFooter.appendChild(addBtn);
        section.appendChild(groupFooter);

        return section;
    }

    createRuleRow(groupType, rule, idx) {
        const row = document.createElement("div");
        row.className = "flwp-cb-rule-row";

        const numSpan = document.createElement("div");
        numSpan.className = "flwp-cb-rule-index";
        numSpan.textContent = idx + 1;

        row.appendChild(numSpan);

        const typeSelect = document.createElement("select");
        typeSelect.className = "flwp-form-select flwp-cb-field-select";

        let optionsHtml = "";
        const allRules = [...this.config.andRules, ...this.config.orRules];
        Object.keys(CONDITION_TYPES_CONFIG).forEach(key => {
            const cfg = CONDITION_TYPES_CONFIG[key];
            const isSelected = rule.type === key ? "selected" : "";
            const isUniqueAndUsed = cfg.unique && key !== rule.type && allRules.some(r => r.type === key);
            const disabledAttr = isUniqueAndUsed ? "disabled" : "";
            const proSuffix = !this.isPro && cfg.isPro ? " [PRO]" : "";
            optionsHtml += `<option value="${key}" ${isSelected} ${disabledAttr}>${cfg.label}${proSuffix}</option>`;
        });
        typeSelect.innerHTML = optionsHtml;
        typeSelect.addEventListener("change", (e) => {
            this.handleTypeChange(groupType, rule, e.target.value);
        });
        row.appendChild(typeSelect);

        const opSelect = document.createElement("select");
        opSelect.className = "flwp-form-select flwp-cb-operator-select";

        const cfg = CONDITION_TYPES_CONFIG[rule.type];
        if (cfg && cfg.operators) {
            let opHtml = "";
            cfg.operators.forEach(op => {
                const isSelected = rule.operator === op.value ? "selected" : "";
                opHtml += `<option value="${op.value}" ${isSelected}>${op.label}</option>`;
            });
            opSelect.innerHTML = opHtml;
        }

        opSelect.addEventListener("change", (e) => {
            rule.operator = e.target.value;
            this.notifyChange();
        });
        row.appendChild(opSelect);

        const valueContainer = document.createElement("div");
        valueContainer.className = "flwp-cb-value-container";

        if (cfg.controlType === "pills") {
            if (typeof rule.value !== "string") {
                rule.value = cfg.defaultValue;
            }
            const group = document.createElement("div");
            group.className = "flwp-cb-pills-group";

            cfg.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                const isActive = rule.value === opt.value;
                btn.className = "flwp-cb-pill" + (isActive ? " flwp-cb-pill-active" : "");
                btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.label}`;
                btn.addEventListener("click", () => {
                    rule.value = opt.value;
                    this.notifyChange();
                    this.render();
                });
                group.appendChild(btn);
            });
            valueContainer.appendChild(group);

        } else if (cfg.controlType === "multi-pills") {
            if (!Array.isArray(rule.value)) {
                rule.value = [...cfg.defaultValue];
            }
            const group = document.createElement("div");
            group.className = "flwp-cb-pills-group";

            cfg.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                const isActive = rule.value.includes(opt.value);
                btn.className = "flwp-cb-pill" + (isActive ? " flwp-cb-pill-active" : "");
                btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.label}`;
                btn.addEventListener("click", () => {
                    const currentlyActive = rule.value.includes(opt.value);
                    if (currentlyActive) {
                        rule.value = rule.value.filter(v => v !== opt.value);
                    } else {
                        if (!rule.value.includes(opt.value)) {
                            rule.value.push(opt.value);
                        }
                    }
                    this.notifyChange();
                    this.render();
                });
                group.appendChild(btn);
            });
            valueContainer.appendChild(group);

        } else if (cfg.controlType === "text") {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "flwp-cb-input";
            input.placeholder = cfg.placeholder || "";
            input.value = rule.value || "";

            input.addEventListener("input", (e) => {
                let val = e.target.value.trim();
                if (cfg.autoFormatUrl && val && !val.startsWith("http://") && !val.startsWith("https://")) {
                    if (!val.startsWith("/")) val = "/" + val;
                    if (!val.endsWith("/")) val = val + "/";
                }
                rule.value = val;
                this.notifyChange();
            });
            input.addEventListener("blur", (e) => {
                e.target.value = rule.value || "";
            });

            valueContainer.appendChild(input);

        } else if (cfg.controlType === "dual-text") {
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.className = "flwp-cb-input flwp-cb-input-half";
            nameInput.placeholder = cfg.placeholderName || "";
            nameInput.value = rule.cookieName || "";
            nameInput.addEventListener("input", (e) => {
                rule.cookieName = e.target.value.trim();
                this.notifyChange();
            });

            const valInput = document.createElement("input");
            valInput.type = "text";
            valInput.className = "flwp-cb-input flwp-cb-input-half";
            valInput.placeholder = cfg.placeholderValue || "";
            valInput.value = rule.value || "";
            valInput.addEventListener("input", (e) => {
                rule.value = e.target.value.trim();
                this.notifyChange();
            });

            valueContainer.appendChild(nameInput);
            valueContainer.appendChild(valInput);
        }

        row.appendChild(valueContainer);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "flwp-cb-delete-btn";
        deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        deleteBtn.title = __('admin.conditions.delete_condition');
        deleteBtn.addEventListener("click", () => {
            this.removeRule(groupType, rule.id);
        });

        row.appendChild(deleteBtn);

        return row;
    }
}
