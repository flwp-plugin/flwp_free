<?php

namespace FLWP\Database;

use FLWP\Helper\LanguageHelper;

abstract class Database {
    protected $table_name;
    protected $wpdb;

    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    abstract public function create_table();

    public static function update_check() {
        $installed_version = get_option('flwp_db_version');
        if ($installed_version != FLWP_DB_VERSION) {
            $languageHelper = new LanguageHelper();
            $languageHelper->load_textdomain();

            $form = new Form();
            $form->create_table();

            $formFeedback = new FormFeedback();
            $formFeedback->create_table();

            // Initial-Formulare anlegen, falls noch keine existieren
            if ($form->get_form_count() === 0) {
                $form->create_initial_forms();
            }

            update_option('flwp_db_version', FLWP_DB_VERSION);
        }
    }

    /**
     * Cleanup data when uninstall.
     *
     * @since 1.0.2
     */
    public static function uninstall_cleanup() {
        global $wpdb;

        // Check if the other version of the plugin is active to avoid deleting shared data
        if (!function_exists('is_plugin_active')) {
            require_once(ABSPATH . 'wp-admin/includes/plugin.php');
        }

        // Determine if we are in 'flwp' (Free) or 'flwp-premium' (Pro) folder
        $current_dir = basename(rtrim(FLWP_PLUGIN_PATH, '/'));
        $other_plugin = ($current_dir === 'flwp') ? 'flwp-premium/flwp.php' : 'flwp/flwp.php';

        if (is_plugin_active($other_plugin)) {
            return;
        }

        // Delete database tables
        $wpdb->query( "DROP TABLE IF EXISTS " . $wpdb->prefix . "flwp_form_feedback" );
        $wpdb->query( "DROP TABLE IF EXISTS " . $wpdb->prefix . "flwp_form_data" );

        // Delete FLWP options
        $wpdb->query( "DELETE FROM `" . $wpdb->prefix . "options` WHERE `option_name` LIKE ('flwp_%')" );

        // Delete transients
        $wpdb->query( "DELETE FROM `" . $wpdb->prefix . "options` WHERE `option_name` LIKE ('_transient_flwp_%')" );
    }
}
