<?php
if (!defined('ABSPATH')) {
	exit;
}

$current_page = sanitize_text_field(wp_unslash($_GET['page'] ?? ''));
$blurTable = $blurTable ?? false;

if (!\FLWP\EnvironmentChecks::check()) {
    include FLWP_PLUGIN_PATH . 'templates/admin/flwp-admin-env-error.php';

    return;
}

?>
<div class="wrap">
    <div id="flwp-feedback-admin" class="flwp-admin-container <?php echo esc_attr($current_page)?>">
        <h1 class="wp-heading-inline" style="display:none;"></h1>
        <hr class="wp-header-end" style="display:none;">

        <nav class="flwp-admin-nav">
            <div class="flwp-nav-brand">
                <i class="fas fa-comment-dots"></i>
                <span><?php esc_html_e('admin.horizontal_navigation.brand', 'flwp'); ?></span>
            </div>
            <ul class="flwp-nav-tabs">
                <li class="flwp-nav-item <?php echo ($current_page === 'flwp-dashboard') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-dashboard')); ?>">
                        <i class="fas fa-home"></i> <?php esc_html_e('admin.horizontal_navigation.dashboard', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($current_page === 'flwp-forms') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-forms')); ?>">
                        <i class="fas fa-file-alt"></i> <?php esc_html_e('admin.horizontal_navigation.all_forms', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($current_page === 'flwp-form-builder' && !isset($_GET['id'])) ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-form-builder')); ?>">
                        <i class="fas fa-plus-circle"></i> <?php esc_html_e('admin.horizontal_navigation.add_form', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($current_page === 'flwp-form-feedbacks') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-form-feedbacks')); ?>">
                        <i class="fas fa-list"></i> <?php esc_html_e('admin.horizontal_navigation.feedback_list', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($current_page === 'flwp-export') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-export')); ?>">
                        <i class="fas fa-file-export"></i> <?php esc_html_e('admin.horizontal_navigation.export', 'flwp'); ?>
                    </a>
                </li>
                <li class="flwp-nav-item <?php echo ($current_page === 'flwp-about') ? 'active' : ''; ?>">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=flwp-about')); ?>">
                        <i class="fas fa-info-circle"></i> <?php esc_html_e('admin.horizontal_navigation.about', 'flwp'); ?>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="flwp-admin-content <?php echo $blurTable ? 'flwp-entries-list-upgrade' : '';  ?>" id="flwp-main-content">
            <?php
            if (isset($admin_template) && file_exists($admin_template)) {
                include $admin_template;
            }
            ?>
        </div>
    </div>

</div>

