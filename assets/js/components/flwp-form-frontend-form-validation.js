import { utils, logger } from './flwp-form-utils.js';

/**
 * FLWP Form Targeting Validator
 * 
 * Validates form targeting rules client-side.
 * Mirrors the logic from IndexBuilder.php
 */

export const FLWPFormValidator = {
    /**
     * Evaluates a single targeting rule.
     */
    evaluateRule: (rule, context) => {
        if (!rule || !context) {
            logger.warn('[FormValidator] evaluateRule called with missing rule or context', { rule, context });
            return false;
        }

        const { type, operator, value } = rule;
        let result = false;

        switch (type) {
            case 'page_type':
                if (operator === 'in' && Array.isArray(value)) {
                    result = value.includes(context.currentPostType);
                } else {
                    result = context.currentPostType === value;
                }
                logger.log(`[FormValidator] Evaluating page_type rule: currentPostType="${context.currentPostType}" ${operator} ${JSON.stringify(value)} => ${result}`);
                return result;

            case 'device':
                if (operator === 'in' && Array.isArray(value)) {
                    result = value.includes(context.currentDevice);
                } else {
                    result = context.currentDevice === value;
                }
                logger.log(`[FormValidator] Evaluating device rule: currentDevice="${context.currentDevice}" ${operator} ${JSON.stringify(value)} => ${result}`);
                return result;

            case 'url':
                switch (operator) {
                    case 'contains':
                        result = typeof context.currentUrl === 'string' && context.currentUrl.includes(value);
                        break;
                    case 'not_contains':
                        result = typeof context.currentUrl === 'string' && !context.currentUrl.includes(value);
                        break;
                    case 'exact':
                        result = context.currentUrl === value;
                        break;
                    case 'not_exact':
                        result = context.currentUrl !== value;
                        break;
                }
                logger.log(`[FormValidator] Evaluating url rule: currentUrl="${context.currentUrl}" ${operator} "${value}" => ${result}`);
                return result;

            case 'cookie':
                const cookieName = rule.cookieName || rule.cookie_name;
                const cookieValue = utils.getCookie(cookieName) || '';
                switch (operator) {
                    case 'exact':
                        result = cookieValue === String(value);
                        break;
                    case 'not_exact':
                        result = cookieValue !== String(value);
                        break;
                    case 'contains':
                        result = cookieValue.includes(String(value));
                        break;
                    case 'not_contains':
                        result = !cookieValue.includes(String(value));
                        break;
                    case 'exists':
                        result = utils.getCookie(cookieName) !== null;
                        break;
                    case 'not_exists':
                        result = utils.getCookie(cookieName) === null;
                        break;
                }
                logger.log(`[FormValidator] Evaluating cookie rule: "${cookieName}" (value="${cookieValue}") ${operator} "${value ?? ''}" => ${result}`);
                return result;

            default:
                logger.warn(`[FormValidator] Unknown rule type "${type}"`, rule);
                return false;
        }
    },

    /**
     * Validates the full targeting structure for a form.
     */
    validateTargeting: (targeting, context) => {
        const contextValues = context ? {
            currentUrl: context.currentUrl,
            currentPostType: context.currentPostType,
            currentDevice: context.currentDevice,
            isFrontpage: context.isFrontpage,
            ...context
        } : null;
        logger.log('[FormValidator] Starting targeting validation', { targeting, context: contextValues });

        if (!targeting) {
            logger.log('[FormValidator] No targeting rules found, validation passed');
            return true;
        }

        const { singleRules, andRules, orRules } = targeting;

        // 1. Evaluate singleRules
        if (singleRules && singleRules.show_on_frontpage === false && context && context.isFrontpage) {
            logger.log('[FormValidator] Targeting failed: form is hidden on frontpage (singleRules.show_on_frontpage = false)');
            return false;
        }

        // 2. Evaluate andRules (all must be true)
        if (andRules && andRules.length > 0) {
            logger.log(`[FormValidator] Evaluating ${andRules.length} AND rule(s)...`);
            for (let i = 0; i < andRules.length; i++) {
                const rule = andRules[i];
                const match = FLWPFormValidator.evaluateRule(rule, context);
                if (!match) {
                    logger.log(`[FormValidator] Targeting failed: AND rule #${i + 1} did not match`, rule);
                    return false;
                }
            }
        }

        // 3. Evaluate orRules (at least one must be true, if any exist)
        if (orRules && orRules.length > 0) {
            logger.log(`[FormValidator] Evaluating ${orRules.length} OR rule(s)...`);
            const anyOrMatch = orRules.some(rule => FLWPFormValidator.evaluateRule(rule, context));
            if (!anyOrMatch) {
                logger.log('[FormValidator] Targeting failed: none of the OR rules matched', orRules);
                return false;
            }
        }

        logger.log('[FormValidator] Targeting validation passed successfully');
        return true;
    }
};
