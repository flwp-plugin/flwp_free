/**
 * Config definitions, options, and templates for FLWP FormBuilder
 */

import { __ } from './flwp-i18n.js';

let fieldTypesConfig = '';
let formTemplates = '';
let isPro = false;
let upgradeUrl = 'https://flwp.de';
let locale = 'en_GB';
let can_use_premium_code = false;
if (typeof flwpFormBuilder !== "undefined") {
    const backendIsPro = parseInt(flwpFormBuilder.isPro || flwpAdmin.isPro);
    fieldTypesConfig = flwpFormBuilder.fieldTypesConfig || '';
    formTemplates = flwpFormBuilder.formTemplates || '';
    isPro = backendIsPro === 1;
    upgradeUrl = flwpFormBuilder.upgradeUrl || 'https://flwp.de';
    locale = flwpFormBuilder.locale || 'en_GB';
    can_use_premium_code = flwpFormBuilder.can_use_premium_code || false;
}

if (typeof flwpAdmin !== "undefined") {
    const backendIsPro = parseInt(flwpAdmin.isPro || 0);
    isPro = backendIsPro === 1;
    upgradeUrl = flwpAdmin.upgradeUrl || 'https://flwp.de';
    locale = flwpAdmin.locale || 'en_GB';
    can_use_premium_code = flwpAdmin.can_use_premium_code || false;
}

export const config = {
    isPro: isPro,
    upgradeUrl: upgradeUrl,
    can_use_premium_code: can_use_premium_code,
    locale: locale,
    localeV2: locale.replace('_', '-'),
    CONTEXT: {
        get currentUrl() { return window.location.pathname; },
        get currentPostType() { return (typeof flwpFormFrontend !== "undefined" && flwpFormFrontend.postType) ? flwpFormFrontend.postType : ''; },
        get currentDevice() { return window.matchMedia("(max-width: 767px)").matches ? 'mobile' : 'desktop'; },
        get isFrontpage() { return !!(typeof flwpFormFrontend !== "undefined" && flwpFormFrontend.isFrontpage); }
    },
    SMILEY_DEFINITIONS: [
        { cls: "far fa-face-angry", solidCls: "fa-regular fa-face-angry", color: "#104689", legend: __("fields.smileys.legend.very_unsatisfied") },
        { cls: "far fa-face-frown", solidCls: "fa-regular fa-face-frown", color: "#fb923c", legend: __("fields.smileys.legend.unsatisfied") },
        { cls: "far fa-face-meh", solidCls: "fa-regular fa-face-meh", color: "#facc15", legend: __("fields.smileys.legend.neutral") },
        { cls: "far fa-face-smile", solidCls: "fa-regular fa-face-smile", color: "#a3e635", legend: __("fields.smileys.legend.satisfied") },
        { cls: "far fa-face-laugh-beam", solidCls: "fa-regular fa-face-laugh-beam", color: "#4ade80", legend: __("fields.smileys.legend.very_satisfied") }
    ],

    FIELD_TYPES_CONFIG: fieldTypesConfig,

    FORM_TEMPLATES: formTemplates
};
