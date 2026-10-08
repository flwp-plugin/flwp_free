<?php

namespace FLWP;

/**
 * FLWP environment compatibility check.
 *
 * Note: This file must not contain PHP code that does not run on PHP < 7.4!
 */
defined('ABSPATH') || die('No direct script access allowed!');

class EnvironmentChecks {
    /**
     * Cached result of the environment checks.
     *
     * @var bool|null
     */
    private static $result = null;

    /**
     * Minimum required WordPress version.
     */
    const MIN_WP_VERSION = '6.7';

    /**
     * Minimum required PHP version ID.
     */
    const MIN_PHP_VERSION_ID = 70400;

    /**
     * Minimum required PHP version string.
     */
    const MIN_PHP_VERSION = '7.4';

    /**
     * Runs all environment checks.
     *
     * @return bool True if all checks passed, false otherwise.
     */
    public static function check(): bool {
        if (null !== self::$result) {
            return self::$result;
        }

        self::$result = true;

        if (!self::check_wp_version()) {
            self::$result = false;
        }

        if (self::$result && !self::check_php_version()) {
            self::$result = false;
        }

        return self::$result;
    }

    /**
     * Checks if the installed WordPress version is supported.
     *
     * @return bool
     */
    private static function check_wp_version(): bool {
        // Include an unmodified $wp_version.
        global $wp_version;

        if (version_compare(str_replace('-src', '', $wp_version), self::MIN_WP_VERSION, '<')) {
            add_action('admin_notices', [self::class, 'admin_error_notice_minimum_version_wp']);
            return false;
        }

        return true;
    }

    /**
     * Checks if the server is running a supported PHP version.
     *
     * @return bool
     */
    private static function check_php_version(): bool {
        if (PHP_VERSION_ID < self::MIN_PHP_VERSION_ID) {
            add_action('admin_notices', [self::class, 'admin_error_notice_minimum_version_php']);
            return false;
        }

        return true;
    }

    /**
     * Show an error notice to admins if the installed version of WordPress is not supported.
     */
    public static function admin_error_notice_minimum_version_wp() {
        ?>
        <div class="notice notice-error notice-alt notice-large">
            <h3><em>
                <span aria-hidden="true" class="dashicons dashicons-warning" style="color:#d63638;vertical-align:bottom"></span>
                <?php esc_html_e('admin.env_check.error.title', 'flwp'); ?>
            </em></h3>
            <p style="font-size:14px">
                <?php esc_html_e('admin.env_check.wp.too_old', 'flwp'); ?>
            </p>
            <p style="font-size:14px">
                <strong>
                <?php
                if (current_user_can('update_core')) {
                    printf(esc_html__('admin.env_check.wp.update_core', 'flwp'), esc_url(self_admin_url('update-core.php')), self::MIN_WP_VERSION);
                } else {
                    printf(esc_html__('admin.env_check.wp.ask_admin', 'flwp'), self::MIN_WP_VERSION);
                }
                ?>
                </strong>
            </p>
        </div>
        <?php
    }

    /**
     * Show an error notice to admins if the installed version of PHP is not supported.
     */
    public static function admin_error_notice_minimum_version_php() {
        ?>
        <div class="notice notice-error notice-alt notice-large">
            <h3><em>
                <span aria-hidden="true" class="dashicons dashicons-warning" style="color:#d63638;vertical-align:bottom"></span>
                <?php esc_html_e('admin.env_check.error.title', 'flwp'); ?>
            </em></h3>
            <p style="font-size:14px">
                <?php printf(esc_html__('admin.env_check.php.too_old', 'flwp'), self::MIN_PHP_VERSION); ?>
            </p>
            <p style="font-size:14px">
                <strong><?php printf(esc_html__('admin.env_check.php.update_link', 'flwp'), esc_url(wp_get_update_php_url())); ?></strong>
            </p>
        </div>
        <?php
    }
}
