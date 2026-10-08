<?php
if (!defined('ABSPATH')) {
	exit;
}

$proNoticeModalPath = FLWP_PLUGIN_PATH . 'templates/admin/partial/flwp-pro-notice-modal.php';
if (isset($proNoticeModalPath) && file_exists($proNoticeModalPath)) {
    $proNoticeHeadline = esc_html__('admin.page.feedback_list.pro_notice.headline', 'flwp');
    $proNoticeIntro = wp_kses(__('admin.page.feedback_list.pro_notice.intro', 'flwp'), ['strong' => []]);
    $proNoticeAdvantages = [
        esc_html__('admin.page.feedback_list.pro_notice.advantage.1', 'flwp'),
        esc_html__('admin.page.feedback_list.pro_notice.advantage.2', 'flwp'),
        esc_html__('admin.page.feedback_list.pro_notice.advantage.3', 'flwp'),
        esc_html__('admin.page.feedback_list.pro_notice.advantage.4', 'flwp')
    ];

    include $proNoticeModalPath;
}
?>

<section id="flwp-view-start" class="flwp-view-section flwp-form-feedback-list">
    <header class="flwp-view-header flex-row">
        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 25px 0; color: var(--flwp-primary-color);"><?php esc_html_e('admin.page.feedback_list.title', 'flwp'); ?></h2>
    </header>

	<?php include FLWP_PLUGIN_PATH . 'templates/admin/partial/mockup/feedback-list.php'; ?>

</section>