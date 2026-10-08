<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package FLWP
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
	exit;
}

require_once plugin_dir_path(__FILE__) . 'flwp.php';

if (class_exists('\FLWP\Database\Database')) {
	\FLWP\Database\Database::uninstall_cleanup();
}