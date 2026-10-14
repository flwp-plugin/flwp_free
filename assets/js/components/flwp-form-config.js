/**
 * Config definitions, options, and templates for FLWP FormBuilder
 */

let fieldTypesConfig = '';
let formTemplates = '';
let upgradeUrl = 'https://flwp.de';
let locale = 'en_GB';
if (typeof flwpFormBuilder !== "undefined") {
    fieldTypesConfig = flwpFormBuilder.fieldTypesConfig || '';
    formTemplates = flwpFormBuilder.formTemplates || '';
    locale = flwpFormBuilder.locale || 'en_GB';
}

if (typeof flwpAdmin !== "undefined") {
    locale = flwpAdmin.locale || 'en_GB';
}

export const config = {
    upgradeUrl: upgradeUrl,
    locale: locale,
    localeV2: locale.replace('_', '-'),
    CONTEXT: {
        get currentUrl() { return window.location.pathname; },
        get currentPostType() { return (typeof flwpFormFrontend !== "undefined" && flwpFormFrontend.postType) ? flwpFormFrontend.postType : ''; },
        get currentDevice() { return window.matchMedia("(max-width: 767px)").matches ? 'mobile' : 'desktop'; },
        get isFrontpage() { return !!(typeof flwpFormFrontend !== "undefined" && flwpFormFrontend.isFrontpage); }
    },
    FIELD_TYPES_CONFIG: fieldTypesConfig,
    FORM_TEMPLATES: formTemplates
};
