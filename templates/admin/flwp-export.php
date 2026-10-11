<?php
if (!defined('ABSPATH')) {
	exit;
}

$flwpProNoticeModalPath = FLWP_PLUGIN_PATH . 'templates/admin/partial/flwp-pro-notice-modal.php';
if (isset($flwpProNoticeModalPath) && file_exists($flwpProNoticeModalPath)) {
	$flwpProNoticeHeadline = esc_html__('admin.page.export.pro_notice.headline', 'flwp');

	$flwpProNoticeIntro = wp_kses(__('admin.page.export.pro_notice.intro', 'flwp'), ['strong' => []]);
	$flwpProNoticeAdvantages = [
		esc_html__('admin.page.export.pro_notice.advantage.1', 'flwp'),
		esc_html__('admin.page.export.pro_notice.advantage.2', 'flwp'),
		esc_html__('admin.page.export.pro_notice.advantage.3', 'flwp'),
		esc_html__('admin.page.export.pro_notice.advantage.4', 'flwp')
	];

	include $flwpProNoticeModalPath;
}
?>

<?php include FLWP_PLUGIN_PATH . 'templates/admin/partial/mockup/export.php'; ?>