<?php
/**
 * Plugin Name:       FLWP – User Feedback & Surveys
 * Plugin URI:        https://flwp.de
 * Description:       Collect and analyze user feedback directly in WordPress with a visual form builder, flexible display options, smart triggers, and targeting.
 * Version:           1.0.5
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Kai Steudten
 * License:           GPLv2+
 * Text Domain:       flwp
 * Domain Path:       /languages
 *
 * @package         FLWP
 * @author          FLWP
 * @copyright       Copyright (c) FLWP
 *
 * FLWP is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as published by
 * the Free Software Foundation.
 *
 * FLWP is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with WordPress. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
 *
 * Note: This file must not contain PHP code that does not run on PHP < 7.4!
 */

if (!defined('ABSPATH')) {
    exit;
}

if ( ! function_exists( 'flwp_fs' ) ) {
    // Create a helper function for easy SDK access.
    function flwp_fs() {
        global $flwp_fs;

        if ( ! isset( $flwp_fs ) ) {
            // Include Freemius SDK.
            require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';

            $flwp_fs = fs_dynamic_init( array(
                'id'                  => '34450',
                'slug'                => 'flwp',
                'type'                => 'plugin',
                'public_key'          => 'pk_2425a5921378f3dd6a5cb14b00a30',
                'is_premium'          => true,
                'premium_suffix'      => 'Pro',
                // If your plugin is a serviceware, set this option to false.
                'has_premium_version' => true,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                // Automatically removed in the free version. If you're not using the
                // auto-generated free version, delete this line before uploading to wp.org.
                'wp_org_gatekeeper'   => 'OA7#BoRiBNqdf52FvzEf!!074aRLPs8fspif$7K1#4u4Csys1fQlCecVcUTOs2mcpeVHi#C2j9d09fOTvbC0HloPT7fFee5WdS3G',
                'has_affiliation'     => 'all',
                'menu'                => array(
                    'slug'           => 'flwp-dashboard',
                    'first-path'     => 'admin.php?page=flwp-dashboard',
                    'contact'        => false,
                    'support'        => false,
                ),
            ) );
        }

        return $flwp_fs;
    }

    // Init Freemius.
    flwp_fs();
    // Signal that SDK was initiated.
    do_action( 'flwp_fs_loaded' );
}

/**
 * Cleanup data when uninstall.
 *
 * Since Freemius tracks the uninstall event, using uninstall.php, the uninstall data will not be sent, including
 * the feedback from the user. So, we'll need to hook into Freemius's "after_uninstall".
 *
 * @since 1.0.2
 */
if (!function_exists('flwp_fs_uninstall_cleanup')) {
	function flwp_fs_uninstall_cleanup()
	{
		\FLWP\Database\Database::uninstall_cleanup();
	}
}

flwp_fs()->add_action( 'after_uninstall', 'flwp_fs_uninstall_cleanup' );

// Konstanten definieren
if (!defined('FLWP_PLUGIN_NAME_PREFIX')) {
	define('FLWP_PLUGIN_NAME_PREFIX', 'FLWP_');
	define('FLWP_PLUGIN_PATH', plugin_dir_path(__FILE__));
	define('FLWP_PLUGIN_URL', plugin_dir_url(__FILE__));
	define('FLWP_VERSION', '1.0.5');
	define('FLWP_DB_VERSION', '1.0.2');
}

// Autoloader (einfach gehalten für dieses Plugin)
spl_autoload_register(function ($class) {
    $prefix = 'FLWP\\';
    $base_dir = FLWP_PLUGIN_PATH . 'includes/';

    $len = strlen($prefix);
    if (strpos($class, $prefix) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    // Ersetze Namespace-Backslashes durch Slashes für den Pfad
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // Debugging oder Fallback für Case-Sensitivity (Linux/WSL)
    // Wenn die Datei nicht existiert, versuchen wir es kleingeschrieben für den Ordnerpfad
    if (!file_exists($file)) {
        $parts = explode('\\', $relative_class);
        if (count($parts) > 1) {
            $class_name = array_pop($parts);
            $sub_dir = strtolower(implode('/', $parts));
            $file = $base_dir . $sub_dir . '/' . $class_name . '.php';
        }
    }

    if (file_exists($file)) {
        require_once $file;
    }
});

require_once FLWP_PLUGIN_PATH . 'includes/Core.php';
if (!function_exists('flwp_activate')) {
    function flwp_activate() {
        if (!function_exists('is_plugin_active')) {
            require_once(ABSPATH . 'wp-admin/includes/plugin.php');
        }

        if (is_plugin_active('flwp-premium/flwp.php')) {
             wp_die('The Pro version of FLWP is already active. Please deactivate the Pro version first before activating the free version.');
        }

        if (!class_exists('\FLWP\Core')) {
            require_once FLWP_PLUGIN_PATH . 'includes/Core.php';
        }
        \FLWP\Core::plugin_activation();
    }
}
register_activation_hook( __FILE__, 'flwp_activate' );

add_filter('load_script_translation_file', function ($file, $handle, $domain) {
	if ($domain !== 'flwp') {
		return $file;
	}

	// If WordPress did not find a translation file for the active locale
	if (!$file || !file_exists($file)) {
		// Construct the path to the en_GB fallback file
		// Replaces any locale in the filename (or empty) with en_GB
		$locale = determine_locale();
		$fallback_file = str_replace("-{$locale}-", '-en_GB-', (string) $file);

		if ($fallback_file && file_exists($fallback_file)) {
			return $fallback_file;
		}
	}

	return $file;
}, 10, 3);

// Start
add_action('init', function() {
	$languageHelper = new \FLWP\Helper\LanguageHelper();
	$languageHelper->load_textdomain();

	$plugin = new \FLWP\Core();
	$plugin->run();
}, 5);
