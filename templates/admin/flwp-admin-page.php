<?php
if (!defined('ABSPATH')) {
	exit;
}

if (!\FLWP\EnvironmentChecks::check()) {
    include FLWP_PLUGIN_PATH . 'templates/admin/flwp-admin-env-error.php';

    return;
}

?>
<div class="wrap">
    <div id="flwp-feedback-admin" class="flwp-admin-container <?php echo esc_attr($page)?>">
        <h1 class="wp-heading-inline" style="display:none;"></h1>
        <hr class="wp-header-end" style="display:none;">

        <nav class="flwp-admin-nav">
            <div class="flwp-nav-brand">
                <i class="fas fa-comment-dots"></i>
                <span><?php esc_html_e('admin.horizontal_navigation.brand', 'flwp'); ?></span>
            </div>
            <ul class="flwp-nav-tabs">
                <li class="flwp-nav-item <?php echo ($page === 'flwp-dashboard') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-dashboard&nonce=' . $nonce)); ?>">
                        <i class="fas fa-home"></i> <?php esc_html_e('admin.horizontal_navigation.dashboard', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($page === 'flwp-forms') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-forms&nonce=' . $nonce)); ?>">
                        <i class="fas fa-file-alt"></i> <?php esc_html_e('admin.horizontal_navigation.all_forms', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($page === 'flwp-form-builder' && empty($id)) ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-form-builder&nonce=' . $nonce)); ?>">
                        <i class="fas fa-plus-circle"></i> <?php esc_html_e('admin.horizontal_navigation.add_form', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($page === 'flwp-form-feedbacks') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-form-feedbacks&nonce=' . $nonce)); ?>">
                        <i class="fas fa-list"></i> <?php esc_html_e('admin.horizontal_navigation.feedback_list', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($page === 'flwp-export') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-export&nonce=' . $nonce)); ?>">
                        <i class="fas fa-file-export"></i> <?php esc_html_e('admin.horizontal_navigation.export', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($page === 'flwp-about') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-about&nonce=' . $nonce)); ?>">
                        <i class="fas fa-info-circle"></i> <?php esc_html_e('admin.horizontal_navigation.about', 'flwp'); ?>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="flwp-admin-content" id="flwp-main-content">
            <?php
            if (isset($admin_template) && file_exists($admin_template)) {
                include $admin_template;
            }
            ?>
        </div>
    </div>

</div>

