<?php

namespace FLWP\Page;

/**
 * About Page class.
 */
class About extends Page {

    /**
     * @return string
     */
    protected function get_template_path(): string {
        return FLWP_PLUGIN_PATH . 'templates/admin/flwp-about.php';
    }

    /**
     * Registers meta boxes for the About page.
     */
    public function register_meta_boxes() {
        add_meta_box('flwp-about-plugin', esc_html__('admin.page.about.box.about', 'flwp'), [$this, 'postbox_about_plugin'], 'flwp-about', 'normal');
        add_meta_box('flwp-usage', esc_html__('admin.page.about.box.usage', 'flwp'), [$this, 'postbox_usage'], 'flwp-about', 'normal');
        add_meta_box('flwp-more-information', esc_html__('admin.page.about.box.more_info', 'flwp'), [$this, 'postbox_more_information'], 'flwp-about', 'normal');
        add_meta_box('flwp-help-support', esc_html__('admin.page.about.box.support', 'flwp'), [$this, 'postbox_help_support'], 'flwp-about', 'normal');
        add_meta_box('flwp-affiliate-program', esc_html__('admin.page.about.box.affiliate', 'flwp'), [$this, 'postbox_affiliate_program'], 'flwp-about', 'normal');
        add_meta_box('flwp-about-author', esc_html__('admin.page.about.box.author', 'flwp'), [$this, 'postbox_about_author'], 'flwp-about', 'side');
        add_meta_box('flwp-debug-info', esc_html__('admin.page.about.box.debug', 'flwp'), [$this, 'postbox_debug_information'], 'flwp-about', 'side');
    }

    /**
     * Content of the about plugin meta box.
     */
    public function postbox_about_plugin() {
        ?>
        <p>
            <?php esc_html_e('admin.page.about.about_text', 'flwp'); ?>
        </p>
        <p>
            <?php esc_html_e('admin.page.about.usage_text', 'flwp'); ?>
        </p>
        <?php
    }

    /**
     * Content of the usage meta box.
     */
    public function postbox_usage() {
        ?>
        <p>
            <?php esc_html_e('admin.page.about.usage.step1', 'flwp'); ?>
            <?php esc_html_e('admin.page.about.usage.step2', 'flwp'); ?>
        </p>
        <p>
            <?php esc_html_e('admin.page.about.usage.step3', 'flwp'); ?>
        </p>
        <?php
    }

    /**
     * Content of the more information meta box.
     */
    public function postbox_more_information() {
        ?>
        <p>
	        <?php echo sprintf(
				esc_html__( 'admin.page.about.more_info.link', 'flwp' ),
	            '<a href="' . esc_url( 'https://flwp.de/docs/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'admin.page.about.more_info.official_website', 'flwp' ) . '</a>'
			); ?>
        </p>
        <?php
    }

    /**
     * Content of the help and support meta box.
     */
    public function postbox_help_support() {
        ?>
        <p>
			<?php echo sprintf(
				esc_html__( 'admin.page.about.support.link', 'flwp' ),
	            '<a href="' . esc_url( 'https://flwp.de/docs/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'admin.page.about.documentation.title', 'flwp' ) . '</a>',
				'<a href="' . esc_url( 'https://flwp.de/support-forum/' ) . '" target="_blank" rel="noopener noreferrer">Support-Forum</a>'
			);?>
        </p>
        <?php
    }

    /**
     * Content of the affiliate program meta box.
     */
    public function postbox_affiliate_program() {
        ?>
        <p>
			<?php echo sprintf(
				esc_html__( 'admin.page.about.affiliate.link', 'flwp' ),
	            '<a href="' . esc_url( 'https://flwp.de/affiliate/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__('admin.page.about.affiliate', 'flwp') . '</a>'
			);?>
        </p>
        <p>
            <?php esc_html_e('admin.page.about.affiliate.text', 'flwp'); ?>
        </p>
        <?php
    }

    /**
     * Content of the author meta box.
     */
    public function postbox_about_author() {
        ?>
        <p>
	        <?php echo sprintf(
				esc_html__( 'admin.page.about.author.text', 'flwp' ),
	            '<a href="' . esc_url( 'https://flwp.de/' ) . '" target="_blank" rel="noopener noreferrer">Kai Steudten</a>'
			);?>
        </p>
        <?php
    }

    /**
     * Content of the debug information meta box.
     */
    public function postbox_debug_information() {
        global $wpdb;
        ?>
        <p>
            <strong><?php esc_html_e('admin.page.about.debug.hint', 'flwp'); ?></strong>
        </p>
        <ul>
            <li>Website: <?php echo esc_url(site_url()); ?></li>
            <li>Block Theme: <?php echo wp_is_block_theme() ? 'yes' : 'no'; ?></li>
            <li>FLWP: <?php echo esc_html(FLWP_VERSION); ?></li>
            <li>FLWP (DB): <?php echo esc_html(FLWP_DB_VERSION); ?></li>
            <li>Plan: <?php echo flwp_fs()->can_use_premium_code__premium_only() ? 'Pro' : 'Free'?></li>
            <li>WordPress: <?php echo esc_html(wp_get_wp_version()); ?></li>
            <li>Multisite: <?php echo is_multisite() ? 'yes' : 'no'; ?></li>
            <li>PHP: <?php echo esc_html(PHP_VERSION); ?></li>
            <li>mySQL (Server): <?php echo esc_html($wpdb->db_server_info()); ?></li>
            <li>mbstring: <?php echo extension_loaded( 'mbstring' ) ? 'yes' : '<span style="color:#800000;font-weight:bold;">no</span>'; ?></li>
            <li>ZipArchive: <?php echo class_exists( 'ZipArchive', false ) ? 'yes' : '<span style="color:#800000;font-weight:bold;">no</span>'; ?></li>
            <li>DOMDocument: <?php echo class_exists( 'DOMDocument', false ) ? 'yes' : '<span style="color:#800000;font-weight:bold;">no</span>'; ?></li>
            <li>simplexml_load_string: <?php echo function_exists( 'simplexml_load_string' ) ? 'yes' : '<span style="color:#800000;font-weight:bold;">no</span>'; ?></li>
            <li>libxml_disable_entity_loader: <?php echo function_exists( 'libxml_disable_entity_loader' ) ? 'yes' : '<span style="color:#800000;font-weight:bold;">no</span>'; ?></li>
            <li>UTF-8 conversion: <?php echo ( function_exists( 'mb_detect_encoding' ) && function_exists( 'iconv' ) ) ? 'yes' : '<span style="color:#800000;font-weight:bold;">no</span>'; ?></li>
            <li>WP Memory Limit: <?php echo esc_html(WP_MEMORY_LIMIT); ?></li>
            <li>Server Memory Limit: <?php echo esc_html( @ini_get( 'memory_limit' ) ); ?></li>
            <li>WP_DEBUG: <?php echo WP_DEBUG ? 'true' : 'false'; ?></li>
            <li>WP_POST_REVISIONS: <?php echo is_bool( WP_POST_REVISIONS ) ? ( WP_POST_REVISIONS ? 'true' : 'false' ) : esc_html( WP_POST_REVISIONS ); ?></li>
        </ul>
        <?php
    }

    /**
     * Renders the page.
     */
    public function render() {
        $this->register_meta_boxes();
        parent::render();
    }
}
