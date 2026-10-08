<?php

namespace FLWP\Page;

/**
 * Base class for Admin Pages.
 */
abstract class Page {

    /**
     * Page title.
     * @var string
     */
    protected $page_title = '';

    /**
     * Data to be passed to the template.
     * @var array
     */
    protected $data = [];

    /**
     * Constructor.
     */
    public function __construct() {
        $this->page_title = esc_html__('FLWP', 'flwp');
    }

    /**
     * Renders the page.
     */
    public function render() {
        $admin_template = $this->get_template_path();
        
        // Extract data for the template
        if (!empty($this->data)) {
            extract($this->data);
        }

        // We use the common admin page wrapper
        include FLWP_PLUGIN_PATH . 'templates/admin/flwp-admin-page.php';
    }

    /**
     * Returns the path to the template file.
     * 
     * @return string
     */
    abstract protected function get_template_path(): string;

    /**
     * Registers meta boxes for the page.
     */
    public function register_meta_boxes() {
        // Optional: Override in child classes
    }
}
