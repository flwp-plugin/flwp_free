<?php
if (!defined('ABSPATH')) {
	exit;
}

$proNoticeModalPath = FLWP_PLUGIN_PATH . 'templates/admin/partial/flwp-pro-notice-modal.php';
if (isset($proNoticeModalPath) && file_exists($proNoticeModalPath)) {
    $proNoticeHeadline = esc_html__('admin.page.export.pro_notice.headline', 'flwp');

    $proNoticeIntro = wp_kses(__('admin.page.export.pro_notice.intro', 'flwp'), ['strong' => []]);
    $proNoticeAdvantages = [
            esc_html__('admin.page.export.pro_notice.advantage.1', 'flwp'),
            esc_html__('admin.page.export.pro_notice.advantage.2', 'flwp'),
            esc_html__('admin.page.export.pro_notice.advantage.3', 'flwp'),
            esc_html__('admin.page.export.pro_notice.advantage.4', 'flwp')
    ];

    include $proNoticeModalPath;
}
?>

<?php include FLWP_PLUGIN_PATH . 'templates/admin/partial/mockup/export.php'; ?>