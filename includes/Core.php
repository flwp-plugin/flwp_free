<?php

namespace FLWP;

use FLWP\Database\Database as DB;

class Core {
    public function run() {
		if (!EnvironmentChecks::check()) {
			return;
		}

        if (is_admin()) {
            new Admin();
        }

        // DB-Update Check
        DB::update_check();

        // Always initialize FormFrontend as it handles both Frontend rendering and AJAX
        new FormFrontend();
    }

	public static function plugin_activation() {
		$pluginBasename = 'flwp/flwp.php';
		if (is_plugin_active($pluginBasename)) {
			deactivate_plugins($pluginBasename);
		}

		\FLWP\Database\Database::update_check();
	}
}
