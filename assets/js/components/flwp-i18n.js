/**
 * i18n translations dictionary and utility helper
 */
export function __(text, args = null) {
    let translated = wp.i18n.__(text, 'flwp');

    if (args) {
        for (const key in args) {
            translated = translated.replace(`{${key}}`, args[key]);
        }
    }
    return translated;
}
