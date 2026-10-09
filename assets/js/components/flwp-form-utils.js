/**
 * Shared utility methods for FLWP FormBuilder and Form Frontend
 */

import { __ } from './flwp-i18n.js';

export const logger = {
    isDebug() {
        return Boolean(
            (typeof window !== 'undefined' && window.FLWP_DEBUG) ||
            (typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('flwp_debug=1')) ||
            (typeof localStorage !== 'undefined' && localStorage.getItem('flwp_debug') === 'true')
        );
    },
    log(...args) {
        if (this.isDebug()) {
            console.log('[FLWP]', ...args);
        }
    },
    error(...args) {
        if (this.isDebug()) {
            console.error('[FLWP]', ...args);
        }
    },
    warn(...args) {
        if (this.isDebug()) {
            console.warn('[FLWP]', ...args);
        }
    },
    info(...args) {
        if (this.isDebug()) {
            console.info('[FLWP]', ...args);
        }
    }
};

if (typeof window !== 'undefined') {
    window.flwpEnableDebug = (enable = true) => {
        try {
            localStorage.setItem('flwp_debug', enable ? 'true' : 'false');
            console.log(`[FLWP] Debug-Modus ${enable ? 'aktiviert' : 'deaktiviert'}. Bitte Seite neu laden.`);
        } catch (e) {
            console.error('[FLWP] Fehler beim Setzen von localStorage:', e);
        }
    };
}

export const utils = {
    logger,
    /**
     * Formats a date object, string or timestamp into the desired German format: DD.MM.YYYY HH:mm Uhr
     */
    formatDate: function(date, locale = 'en_GB') {
        if (!date) return '-';

        let d;
        // Check if it's a numeric timestamp (seconds or milliseconds as string/number)
        if (!isNaN(date) && !isNaN(parseFloat(date))) {
            const timestamp = parseFloat(date);
            // If it's less than 10^12, assume it's seconds and convert to ms
            if (timestamp < 10000000000) {
                d = new Date(timestamp * 1000);
            } else {
                d = new Date(timestamp);
            }
        } else {
            d = new Date(date);
        }

        if (isNaN(d.getTime())) return date;

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        if (locale === 'de_DE') {
            return `${day}.${month}.${year} ${hours}:${minutes} Uhr`;
        }

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    },

    /**
     * Escapes HTML to prevent XSS
     */
    escapeHtml: function(string) {
        if (!string) return '';
        return String(string)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    /**
     * Checks if step1 contains multiple interactive fields or textarea, but no submit button.
     * @param {Array} step1Items List of items in Step 1
     * @returns {boolean} True if there's a missing submit button issue
     */
    hasSubmitProblem: function(step1Items) {
        if (!Array.isArray(step1Items)) return false;
        const interactiveElements = step1Items.filter(i => ['nps', 'thumbs', 'rating', 'smileys', 'textarea'].includes(i.type));
        const hasSubmitButton = step1Items.some(i => i.type === 'button' && i.settings && (i.settings.buttonType === 'submit' || i.settings.step2Enabled === true));
        const hasTextarea = step1Items.some(i => i.type === 'textarea');

        return !hasSubmitButton && (interactiveElements.length > 1 || hasTextarea);
    },

    /**
     * Checks if step1 contains any trigger element with step2Enabled = true that has no elements defined in step2.
     * @param {Object} stateObj Full state object containing steps
     * @returns {boolean} True if there's an empty step2 problem
     */
    hasStep2Problem: function(stateObj) {
        if (!stateObj || !stateObj.steps || !Array.isArray(stateObj.steps.step1)) return false;

        const triggers = stateObj.steps.step1.filter(item =>
            ['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(item.type) &&
            item.settings && item.settings.step2Enabled === true
        );

        if (triggers.length === 0) return false;

        for (const trigger of triggers) {
            let list = null;
            if (stateObj.steps.step2 && !Array.isArray(stateObj.steps.step2)) {
                list = stateObj.steps.step2[trigger.id];
            } else if (Array.isArray(stateObj.steps.step2)) {
                list = stateObj.steps.step2;
            }
            if (!list || !Array.isArray(list) || list.length === 0) {
                return true;
            }
        }

        return false;
    },

    /**
     * Checks if step2 contains input fields but no submit button.
     * @param {Object} stateObj Full state object containing steps
     * @returns {boolean} True if there's a missing submit button issue in step2
     */
    hasStep2SubmitProblem: function(stateObj) {
        if (!stateObj || !stateObj.steps || !Array.isArray(stateObj.steps.step1)) return false;

        const triggers = stateObj.steps.step1.filter(item =>
            ['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(item.type) &&
            item.settings && item.settings.step2Enabled === true
        );

        for (const trigger of triggers) {
            let list = null;
            if (stateObj.steps.step2 && !Array.isArray(stateObj.steps.step2)) {
                list = stateObj.steps.step2[trigger.id];
            } else if (Array.isArray(stateObj.steps.step2)) {
                list = stateObj.steps.step2;
            }

            if (list && Array.isArray(list) && list.length > 0) {
                const interactiveElements = list.filter(i => ['nps', 'thumbs', 'rating', 'smileys'].includes(i.type));
                const hasSubmitButton = list.some(i => i.type === 'button' && i.settings && i.settings.buttonType === 'submit');

                if (interactiveElements.length === 0 && !hasSubmitButton) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Resolves button background, text, and border colors based on active/custom states
     */
    resolveSharedButtonStyle: function(item, stateObj = null, forCanvas = true) {
        const bType = item.settings.buttonType || 'next';
        const isBack = bType === 'back';
        const isSubmit = bType === 'submit';

        let normalBg, normalColor, normalBorder;
        let hoverBg, hoverColor, hoverBorder;

        // Fetch theme-based fallback colors if available
        const themeAccent = (stateObj && stateObj.settings && (stateObj.settings.styles ? stateObj.settings.styles.accentColor : '#104689')) || 'var(--flwp-primary)';
        const themeSecondary = (stateObj && stateObj.settings && (stateObj.settings.styles ? stateObj.settings.styles.secondaryColor : '#0b3363')) || 'var(--flwp-secondary)';

        if (item.settings.customColorsEnabled) {
            normalBg = item.settings.bgColor || themeAccent;
            normalColor = item.settings.textColor || '#ffffff';
            normalBorder = item.settings.borderColor || normalBg;
            hoverBg = item.settings.hoverBgColor || normalBg;
            hoverColor = item.settings.hoverTextColor || normalColor;
            hoverBorder = item.settings.hoverBorderColor || normalBorder;
        } else {
            if (isSubmit) {
                normalBg = themeAccent;
                normalBorder = themeAccent;
                normalColor = '#ffffff';
                hoverBg = themeSecondary;
                hoverColor = '#ffffff';
                hoverBorder = themeSecondary;
            } else if (isBack) {
                normalBg = '#ffffff';
                normalBorder = '#e5e5e5';
                normalColor = '#000';
                hoverBg = '#f5f5f5';
                hoverColor = '#171717';
                hoverBorder = '#e5e5e5';
            } else {
                normalBg = themeAccent;
                normalBorder = themeAccent;
                normalColor = '#ffffff';
                hoverBg = themeSecondary;
                hoverColor = '#ffffff';
                hoverBorder = themeSecondary;
            }
        }

        return { bType, normalBg, normalColor, normalBorder, hoverBg, hoverColor, hoverBorder, isBack, isSubmit };
    },

    /**
     * Applies custom styles to the in-content placeholder container.
     */
    applyInContentStyles: function(container, state) {
        const customColorsToggle = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.design.customStylesEnabled`, false);
        if (customColorsToggle) {
            container.style.borderRadius = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.design.borderRadius`, "0") + "px";
            container.style.borderStyle = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.design.borderStyle`, "solid");
            container.style.borderWidth = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.design.borderWidth`, "0") + "px";
            container.style.backgroundColor = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.design.bgColor`, '#ffffff');
            container.style.borderColor = utils.getDeepState(state, `settings.display.subTypeData.shortcode.globalData.design.borderColor`, "#ffffff");
        }
    },

    /**
     * Renders a form simulator into a container using PreviewEngine.
     * Logic extracted from renderDisplaySimulator in flwp-form-builder-template-display.js.
     * 
     * @param {HTMLElement} container The target container
     * @param {Object} state The current form state
     * @param {Object} PreviewEngine The PreviewEngine component
     * @param {Object} options Optional overrides
     */
    renderFormSimulator: function(container, state, PreviewEngine, options = {}) {
        if (!container || !state || !PreviewEngine) return null;

        const activeType = options.mode || state.settings.display.displayType || "in-content";
        const activeSubtype = options.activeSubtype || state.settings.display.displaySubType || (activeType === "in-content" ? "shortcode" : "modal");

        const trigger = this.getDeepState(state, "settings.display.subTypeData.overlay.trigger", "click");
        const grM = this.getDeepState(state, "settings.display.globalData.main", {});
        
        const overlayConfig = {
            id: options.id || "display-preview",
            isPreview: true,
            targetContainer: container,
            stateObj: state,
            name: state.name || "Feedback",
            trigger: trigger,
            displaySubType: activeSubtype,
            triggerSettings: {
                clickSelector: this.getDeepState(state, "settings.display.subTypeData.overlay.click.selector", ""),
                useStandard: activeSubtype === "feedback-button",
                feedbackButton: options.feedbackButton || {},
                delaySeconds: this.getDeepState(state, "settings.display.subTypeData.overlay.delay.seconds", 5),
                scrollType: this.getDeepState(state, "settings.display.subTypeData.overlay.scroll.type", "end"),
                scrollPercent: this.getDeepState(state, "settings.display.subTypeData.overlay.scroll.percent", 50),
                exitIntentDelay: this.getDeepState(state, "settings.subTypeData.display.overlay.exitIntent.delay", "immediate")
            },
            globalData: {
                position: options.position || this.getDeepState(state, "settings.display.globalData.spacing.position", (activeSubtype === "slide-in" ? "bottom-right" : (activeSubtype === "feedback-button" ? "right-middle" : "center"))),
                showBackdrop: options.showBackdrop !== undefined ? options.showBackdrop : (grM.showBackdrop !== false),
                closeOnBackdrop: options.closeOnBackdrop !== undefined ? options.closeOnBackdrop : (grM.closeOnBackdrop !== false),
                closeOnEsc: options.closeOnEsc !== undefined ? options.closeOnEsc : (grM.closeOnEsc !== false),
                overlayWidth: options.maxWidth || "",
                cookieCloseDays: grM.cookieCloseDays !== undefined ? grM.cookieCloseDays : 1,
                cookieSubmitDays: grM.cookieSubmitDays !== undefined ? grM.cookieSubmitDays : 30,
                cookieScope: grM.cookieScope || "domain",
                hideHeader: options.hideHeader !== undefined ? options.hideHeader : (grM.hideHeader !== false),
                hideFooter: options.hideFooter !== undefined ? options.hideFooter : (grM.hideFooter !== false),
            }
        };

        const renderConfig = {
            mode: activeType,
            activeSubtype,
            overlayConfig,
            ...options,
            onTrigger: () => {
                const controller = PreviewEngine.getActiveController();
                if (controller && typeof controller.open === 'function') {
                    controller.open();
                }
                if (typeof options.onTrigger === 'function') {
                    options.onTrigger(controller);
                }
            }
        };

        return PreviewEngine.render(container, state, renderConfig);
    },

    /**
     * Generates inline style strings or rules for label sizes/alignments
     */
    getSharedLabelStyleString: function(item, forCanvas = true, addTextColor = true) {
        const align = item.settings.alignment || 'left';
        const inlineStyles = [];
        if (item.type !== 'textarea') {
            if (item.settings.fontSize && item.settings.fontSize !== 'inherit') {
                inlineStyles.push(`font-size: ${item.settings.fontSize}`);
            }
            if (item.settings.lineHeight && item.settings.lineHeight !== 'inherit') {
                inlineStyles.push(`line-height: ${item.settings.lineHeight}`);
            }
        }
        if (addTextColor && item.settings.textColor && (item.type === 'headline' || item.type === 'description')) {
            inlineStyles.push(`color: ${item.settings.textColor}`);
        }
        if (item.settings.hideLabel === true) {
            inlineStyles.push(`display: none`);
        } else {
            inlineStyles.push(`text-align: ${align}`);
            inlineStyles.push(`width: 100%`);
            inlineStyles.push(`display: block`);
        }
        if (!forCanvas) {
            inlineStyles.push(`font-weight: 600`);
            inlineStyles.push(`font-size: 0.95em`);
        }
        return inlineStyles.join('; ');
    },

    /**
     * Standardized toast alert feedback system
     */
    showToast: function(message, type = "success") {
        const container = document.getElementById("flwp-toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = `flwp-toast flwp-toast-${type}`;

        const iconClass = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
        toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${utils.escapeHtml(message)}</span>`;

        container.appendChild(toast);

        setTimeout(() => { toast.classList.add("flwp-toast-active"); }, 10);

        setTimeout(() => {
            toast.classList.remove("flwp-toast-active");
            setTimeout(() => { toast.remove(); }, 300);
        }, 4000);
    },

    /**
     * Measures scrollbar width for modal body scroll blocking
     */
    getScrollbarWidth: function() {
        return window.innerWidth - document.documentElement.clientWidth;
    },

    /**
     * Simple responsiveness breakpoint helper
     */
    isMobile: function() {
        return window.innerWidth <= 768;
    },

    /**
     * Cookie retrieval
     */
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    /**
     * Cookie writer with SameSite security options
     */
    setCookie: function(name, value, days, path = "/") {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        const cookiePath = path || "/";
        document.cookie = name + "=" + (value || "") + expires + "; path=" + cookiePath + "; SameSite=Lax";
    },

    /**
     * Cookie deleter
     */
    deleteCookie: function(name, path = "/") {
        utils.setCookie(name, "", -1, path);
    },

    /**
     * Initializes or retrieves an anonymized session ID
     */
    initSessionId: function() {
        try {
            let anonymizedSessionId = sessionStorage.getItem("flwp_anon_sid");
            if (!anonymizedSessionId) {
                anonymizedSessionId = "sid_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                sessionStorage.setItem("flwp_anon_sid", anonymizedSessionId);
            }
            return anonymizedSessionId;
        } catch (e) {
            return "";
        }
    },

    /**
     * Collects tracking data based on form configuration
     */
    getTrackingData: function(stateObj = null) {
        let trackingConfig = {
            enabled: true,
            url: true,
            pageTitle: true,
            referrer: true,
            userAgent: true,
            language: false,
            screenResolution: false,
            viewportSize: false,
            timezone: false,
            connectionType: false,
            deviceType: false,
            anonymizedSessionId: false,
            timeOnPageSeconds: false,
            colorScheme: false
        };

        if (stateObj && stateObj.settings && stateObj.settings.tracking) {
            trackingConfig = Object.assign({}, trackingConfig, stateObj.settings.tracking);
        }

        if (trackingConfig.enabled === false) {
            return { trackingEnabled: false };
        }

        const data = {};

        if (trackingConfig.url !== false) {
            data.url = window.location.href;
        }

        if (trackingConfig.pageTitle !== false) {
            data.pageTitle = document.title;
        }

        if (trackingConfig.referrer !== false) {
            data.referrer = document.referrer || "";
        }

        if (trackingConfig.userAgent !== false) {
            data.userAgent = window.navigator.userAgent;
        }

        if (trackingConfig.language !== false) {
            data.language = window.navigator.language || window.navigator.userLanguage || "";
        }

        if (trackingConfig.screenResolution !== false) {
            data.screenResolution = `${window.screen.width}x${window.screen.height}`;
        }

        if (trackingConfig.viewportSize !== false) {
            data.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
        }

        if (trackingConfig.timezone !== false) {
            let timezone = "";
            try {
                timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            } catch (e) {}
            data.timezone = timezone;
        }

        if (trackingConfig.connectionType !== false) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            data.connectionType = conn ? conn.effectiveType || conn.type || "unknown" : "unknown";
        }

        if (trackingConfig.deviceType !== false) {
            let deviceType = "desktop";
            if (utils.isMobile()) {
                deviceType = "mobile";
            } else if (window.innerWidth <= 1024) {
                deviceType = "tablet";
            }
            data.deviceType = deviceType;
        }

        if (trackingConfig.anonymizedSessionId !== false) {
            data.anonymizedSessionId = utils.initSessionId();
        }

        if (trackingConfig.timeOnPageSeconds !== false) {
            let timeOnPageSeconds = 0;
            try {
                timeOnPageSeconds = Math.round(performance.now() / 1000);
            } catch (e) {}
            data.timeOnPageSeconds = timeOnPageSeconds;
        }

        if (trackingConfig.colorScheme !== false) {
            let colorScheme = "unknown";
            try {
                if (window.matchMedia) {
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                        colorScheme = "dark";
                    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                        colorScheme = "light";
                    }
                }
            } catch (e) {}
            data.colorScheme = colorScheme;
        }

        return data;
    },

    getStorageKey: function (keyData) {
        const rawKey = keyData.version + "_" + keyData.formId + "_" + keyData.formUpdated + "_" + flwpFormFrontend.pluginVersion;
        return "flwp_form_" + utils.base64(rawKey);
    },

    base64: function (string) {
        return btoa(encodeURIComponent(string));
    },

    saveToLocalStorage: function (resultData) {
        try {
            const key = utils.getStorageKey(resultData);
            const ttl = 24 * 60 * 60 * 1000; // 1 Tag in Millisekunden
            const item = {
                value: resultData,
                expiry: Date.now() + ttl
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.error("FLWP: Failed to save to local storage", e);
        }
    },

    getFromLocalStorage: function (formId, formUpdated = null) {
        try {
            // Wenn wir einen formUpdated Zeitstempel haben, können wir gezielter suchen
            if (formUpdated) {
                const keyObj = {
                    formId: formId,
                    formUpdated: formUpdated,
                    version: flwpFormFrontend.version
                };

                const storageKey = utils.getStorageKey(keyObj);
                const stored = localStorage.getItem(storageKey);

                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.value !== undefined && parsed.expiry !== undefined) {
                        if (Date.now() > parsed.expiry) {
                            localStorage.removeItem(storageKey);
                            return null;
                        }
                        return parsed.value;
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.error("FLWP: Failed to get from local storage", e);
        }
        return null;
    },

    /**
     * Checks whether step2 triggers are active on step1
     */
    isOptionStep2ActiveOnStep1: function(stateObj) {
        if (!stateObj || !stateObj.steps || !stateObj.steps.step1) return false;
        return stateObj.steps.step1.some(item => {
            return (['rating', 'thumbs', 'smileys', 'nps', 'button'].includes(item.type)) && item.settings.step2Enabled === true;
        });
    },

    /**
     * Retrieves step 2 fields list for a specific trigger element
     */
    getStep2List: function(stateObj, triggerId) {
        if (!stateObj) return [];
        if (!triggerId) {
            if (stateObj.activeStep2TriggerId) {
                triggerId = stateObj.activeStep2TriggerId;
            } else if (stateObj.steps && stateObj.steps.step1) {
                const firstWithStep2 = stateObj.steps.step1.find(item => item.settings && item.settings.step2Enabled === true);
                if (firstWithStep2) triggerId = firstWithStep2.id;
            }
        }
        if (!triggerId) return [];

        if (!stateObj.steps.step2 || Array.isArray(stateObj.steps.step2)) {
            const legacyArr = Array.isArray(stateObj.steps.step2) ? stateObj.steps.step2 : [];
            stateObj.steps.step2 = {};
            if (triggerId) {
                stateObj.steps.step2[triggerId] = legacyArr;
            }
        }

        if (!stateObj.steps.step2[triggerId] || !stateObj.steps.step2[triggerId].length) {
            const baseMs = Date.now();
            stateObj.steps.step2[triggerId] = [
                { id: `flwp-el-${baseMs}`, type: "headline", label: __("admin.builder.default_step2.headline"), settings: { fontSize: "inherit", alignment: "left" } },
                { id: `flwp-el-${baseMs + 1}`, type: "textarea", label: __("admin.builder.default_step2.textarea_label"), settings: { placeholder: __("admin.builder.default_step2.textarea_placeholder"), required: true, fontSize: "inherit" } },
                { id: `flwp-el-${baseMs + 2}`, type: "button", label: __("admin.builder.default_step2.button_label"), settings: { icon: "fa-paper-plane", buttonType: "submit", fontSize: "inherit" } }
            ];
        }

        return stateObj.steps.step2[triggerId];
    },

    cleanupExpiredLocalStorage: function () {
        try {
            const lastCleanup = utils.getCookie("flwp_cleanup_last");
            const now = Date.now();
            if (lastCleanup && (now - parseInt(lastCleanup)) < (24 * 60 * 60 * 1000)) {
                return;
            }

            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("flwp_form_")) {
                    const val = localStorage.getItem(key);
                    if (val) {
                        try {
                            const parsed = JSON.parse(val);
                            if (parsed && parsed.expiry !== undefined && now > parsed.expiry) {
                                keysToRemove.push(key);
                            }
                        } catch (err) {
                            // Ignore
                        }
                    }
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            utils.setCookie("flwp_cleanup_last", now.toString(), 1);
        } catch (e) {
            console.warn("FLWP: LocalStorage cleanup error:", e);
        }
    },

    /**
     * Support for WordPress wp_editor / TinyMCE listeners
     */
    setupTinyMCEListener: function(editorId, setter, saveCallback) {
        if (window.tinymce) {
            const editor = window.tinymce.get(editorId);
            if (editor) {
                editor.on("change keyup NodeChange ExecCommand", () => {
                    const content = editor.getContent();

                    if (typeof setter === 'function') {
                        setter(content);
                    }

                    if (typeof saveCallback === 'function') {
                        saveCallback();
                    }

                    // Keep textarea synchronized
                    window.tinymce.triggerSave();
                });
            } else {
                // If TinyMCE is not yet initialized, retry after short delay
                setTimeout(() => utils.setupTinyMCEListener(editorId, setter, saveCallback), 500);
            }
        }
    },

    /**
     * Synchronisiert einen Farbwähler (Color-Input und Hex-Textfeld) mit einem Farbwert.
     * @param {string|HTMLElement} picker - ID oder Element des Color-Inputs
     * @param {string|HTMLElement} hex - ID oder Element des Hex-Text-Inputs
     * @param {string} value - Der Farbwert (z.B. "#FFFFFF")
     */
    syncColorValue: function(picker, hex, value) {
        const pickerEl = typeof picker === "string" ? document.getElementById(picker) : picker;
        const hexEl = typeof hex === "string" ? document.getElementById(hex) : hex;
        if (pickerEl && value) pickerEl.value = value;
        if (hexEl && value) hexEl.value = value.toUpperCase();
    },

    /**
     * Registriert Event-Listener für einen Farbwähler (Color-Input und Hex-Textfeld).
     * @param {string|HTMLElement} picker - ID oder Element des Color-Inputs
     * @param {string|HTMLElement} hex - ID oder Element des Hex-Text-Inputs
     * @param {function(string)} onUpdate - Callback bei Wertänderung
     */
    registerColorPickerPair: function(picker, hex, onUpdate) {
        const pickerEl = typeof picker === "string" ? document.getElementById(picker) : picker;
        const hexEl = typeof hex === "string" ? document.getElementById(hex) : hex;

        if (pickerEl && hexEl) {
            pickerEl.addEventListener("input", (e) => {
                const val = e.target.value;
                if (hexEl) hexEl.value = val.toUpperCase();
                if (typeof onUpdate === "function") {
                    onUpdate(val);
                }
            });

            hexEl.addEventListener("input", (e) => {
                let val = e.target.value.trim();
                if (val && !val.startsWith("#")) {
                    val = "#" + val;
                }
                if (/^#[0-9A-F]{6}$/i.test(val)) {
                    pickerEl.value = val;
                    if (typeof onUpdate === "function") {
                        onUpdate(val);
                    }
                }
            });
        }
    },

    /**
     * Setzt einen Wert tief in einem Objektpfad.
     * Erstellt automatisch fehlende Objekte im Pfad.
     */
    setDeepState: function(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key]) current[key] = {};
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    },

    /**
     * Ruft einen Wert tief aus einem Objektpfad ab.
     * Gibt defaultValue zurück, wenn der Pfad nicht existiert.
     */
    getDeepState: function(obj, path, defaultValue = undefined) {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current === undefined || current === null || typeof current !== 'object') return defaultValue;
            current = current[key];
        }
        return current !== undefined ? current : defaultValue;
    },

    /**
     * Helper to sync a control UI if it exists
     */
    syncControl: function(control, settings) {
        if (control && typeof control.syncUI === "function") {
            control.syncUI(settings);
        }
    },

    /**
     * Standard helper for Box Model Binding (Margin/Padding)
     */
    setupBoxModelControl: function(prefix, getSettingsObj, onChangeCallback) {
        const elUnit = document.getElementById(`${prefix}-unit`);
        const elTop = document.getElementById(`${prefix}-top`);
        const elRight = document.getElementById(`${prefix}-right`);
        const elBottom = document.getElementById(`${prefix}-bottom`);
        const elLeft = document.getElementById(`${prefix}-left`);
        const elLink = document.getElementById(`${prefix}-link`);
        const btnReset = document.getElementById(`${prefix}-reset`);

        if (!elUnit || !elTop || !elRight || !elBottom || !elLeft || !elLink) return null;

        if (btnReset) {
            btnReset.addEventListener("click", () => {
                const settingsObj = getSettingsObj();
                if (!settingsObj) return;

                const vals = [elTop.placeholder || "0", elRight.placeholder || "0", elBottom.placeholder || "0", elLeft.placeholder || "0"];

                elTop.value = vals[0];
                elRight.value = vals[1];
                elBottom.value = vals[2];
                elLeft.value = vals[3];

                settingsObj.top = vals[0];
                settingsObj.right = vals[1];
                settingsObj.bottom = vals[2];
                settingsObj.left = vals[3];

                onChangeCallback();
            });
        }

        const isPadding = prefix.includes("padding");

        const sanitizeValue = (val) => {
            if (isPadding) {
                // Only digits and a single dot
                let cleaned = val.replace(/[^0-9.]/g, "");
                const parts = cleaned.split(".");
                if (parts.length > 2) {
                    cleaned = parts[0] + "." + parts.slice(1).join("");
                }
                return cleaned;
            } else {
                // Margin: allow negative sign at start, digits, dot, or characters of 'auto'
                const lower = val.toLowerCase().trim();
                if (lower && "auto".startsWith(lower)) {
                    return lower;
                }
                let cleaned = val.replace(/[^0-9.-]/g, "");
                // Ensure minus sign is only at the beginning
                if (cleaned.includes("-")) {
                    const hasMinusAtStart = cleaned.startsWith("-");
                    cleaned = (hasMinusAtStart ? "-" : "") + cleaned.replace(/-/g, "");
                }
                // Ensure only one dot
                const parts = cleaned.split(".");
                if (parts.length > 2) {
                    cleaned = parts[0] + "." + parts.slice(1).join("");
                }
                return cleaned;
            }
        };

        const finalizeValue = (val) => {
            if (isPadding) {
                if (val === "." || val === "") return "0";
                const num = parseFloat(val);
                return isNaN(num) ? "0" : String(num);
            } else {
                if (val === "auto") return "auto";
                if (val === "." || val === "-" || val === "" || "auto".startsWith(val)) {
                    return val === "auto" ? "auto" : "0";
                }
                const num = parseFloat(val);
                return isNaN(num) ? "0" : String(num);
            }
        };

        elLink.addEventListener("click", () => {
            const settingsObj = getSettingsObj();
            if (!settingsObj) return;
            const isLinked = elLink.classList.toggle("is-linked");
            settingsObj.linked = isLinked;
            const icon = elLink.querySelector("i");
            if (icon) {
                if (isLinked) {
                    icon.className = "fas fa-link";
                    elLink.title = __("admin.builder.unlink_values");
                    const val = elTop.value || "0";
                    elRight.value = val;
                    elBottom.value = val;
                    elLeft.value = val;
                    settingsObj.top = val;
                    settingsObj.right = val;
                    settingsObj.bottom = val;
                    settingsObj.left = val;
                } else {
                    icon.className = "fas fa-unlink";
                    elLink.title = __("admin.builder.link_values");
                }
            }
            onChangeCallback();
        });

        const handleValueInput = (e, side) => {
            const settingsObj = getSettingsObj();
            if (!settingsObj) return;
            const sanitized = sanitizeValue(e.target.value);
            e.target.value = sanitized;

            const valueToSave = sanitized || "0";

            if (elLink.classList.contains("is-linked")) {
                elTop.value = sanitized;
                elRight.value = sanitized;
                elBottom.value = sanitized;
                elLeft.value = sanitized;
                settingsObj.top = valueToSave;
                settingsObj.right = valueToSave;
                settingsObj.bottom = valueToSave;
                settingsObj.left = valueToSave;
            } else {
                settingsObj[side] = valueToSave;
            }
            onChangeCallback();
        };

        const handleValueBlur = (e, side) => {
            const settingsObj = getSettingsObj();
            if (!settingsObj) return;
            const finalized = finalizeValue(e.target.value);
            e.target.value = finalized;

            if (elLink.classList.contains("is-linked")) {
                elTop.value = finalized;
                elRight.value = finalized;
                elBottom.value = finalized;
                elLeft.value = finalized;
                settingsObj.top = finalized;
                settingsObj.right = finalized;
                settingsObj.bottom = finalized;
                settingsObj.left = finalized;
            } else {
                settingsObj[side] = finalized;
            }
            onChangeCallback();
        };

        elTop.addEventListener("input", (e) => handleValueInput(e, "top"));
        elRight.addEventListener("input", (e) => handleValueInput(e, "right"));
        elBottom.addEventListener("input", (e) => handleValueInput(e, "bottom"));
        elLeft.addEventListener("input", (e) => handleValueInput(e, "left"));

        elTop.addEventListener("blur", (e) => handleValueBlur(e, "top"));
        elRight.addEventListener("blur", (e) => handleValueBlur(e, "right"));
        elBottom.addEventListener("blur", (e) => handleValueBlur(e, "bottom"));
        elLeft.addEventListener("blur", (e) => handleValueBlur(e, "left"));

        elUnit.addEventListener("change", (e) => {
            const settingsObj = getSettingsObj();
            if (!settingsObj) return;
            settingsObj.unit = e.target.value;
            onChangeCallback();
        });

        return {
            syncUI: (newSettings) => {
                if (!newSettings) return;
                elUnit.value = newSettings.unit || "px";
                elTop.value = newSettings.top !== undefined ? newSettings.top : "";
                elRight.value = newSettings.right !== undefined ? newSettings.right : "";
                elBottom.value = newSettings.bottom !== undefined ? newSettings.bottom : "";
                elLeft.value = newSettings.left !== undefined ? newSettings.left : "";

                const isLinked = !!newSettings.linked;
                elLink.classList.toggle("is-linked", isLinked);
                const icon = elLink.querySelector("i");
                if (icon) {
                    if (isLinked) {
                        icon.className = "fas fa-link";
                        elLink.title = __("admin.builder.unlink_values");
                    } else {
                        icon.className = "fas fa-unlink";
                        elLink.title = __("admin.builder.link_values");
                    }
                }
            }
        };
    }
};
