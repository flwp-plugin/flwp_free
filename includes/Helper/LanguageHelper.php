<?php

namespace FLWP\Helper;

class LanguageHelper {

	public function get_current_locale(): string {
		$wpLocale = get_locale();

		// Fallback auf en_GB, falls nicht Deutsch
		$currentLocale = strpos($wpLocale, 'de_') !== false ? 'de_DE' : 'en_GB';

		return $currentLocale;
	}

	public function load_textdomain(): bool {
		$domain = 'flwp';
		$path = FLWP_PLUGIN_PATH . 'languages/';
		$currentLocale = $this->get_current_locale();

		$mofile = $path . $domain . '-' . $currentLocale . '.mo';

		if (file_exists($mofile)) {
			return load_textdomain($domain, $mofile);
		}

		return false;
	}
}