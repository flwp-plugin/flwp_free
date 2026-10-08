<?php
if (!defined('ABSPATH')) {
	exit;
}

use FLWP\Helper\FormHelper;

$formHelper = new FormHelper();
?>

<section id="flwp-view-start" class="flwp-view-section">
    <header class="flwp-view-header">
        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 5px 0; color: var(--flwp-primary-color);"><?php esc_html_e('admin.page.dashboard.welcome', 'flwp'); ?></h2>
        <p><?php esc_html_e('admin.page.dashboard.overview', 'flwp'); ?></p>
    </header>
    <div class="flwp-stats-grid bento-grid">
        <div class="flwp-stat-card card-span-2">
            <div class="flwp-stat-info" style="width: 100%;">
                <span class="flwp-stat-label"><?php esc_html_e('admin.page.dashboard.summary', 'flwp'); ?></span>
                <div style="display: flex; justify-content: space-between; margin-top: 15px; gap: 15px; flex-wrap: wrap;">
                    <div>
                        <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; display: block;"><?php esc_html_e('admin.page.dashboard.total', 'flwp'); ?></span>
                        <span class="flwp-stat-value" id="flwp-stat-total" style="font-size: 24px; margin: 0;"><?php echo (int) $stats['total']; ?></span>
                    </div>
                    <div>
                        <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; display: block;"><?php esc_html_e('admin.page.dashboard.today', 'flwp'); ?></span>
                        <span class="flwp-stat-value" id="flwp-stat-today" style="font-size: 24px; margin: 0;"><?php echo (int) $stats['today']; ?></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flwp-stat-card card-span-2">
            <div class="flwp-stat-info">
                <span class="flwp-stat-label"><?php esc_html_e('admin.page.dashboard.distribution_by_type', 'flwp'); ?></span>
                <div id="flwp-stat-types" style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; min-width: 80px;"><?php esc_html_e('admin.page.dashboard.type.shortcode', 'flwp'); ?></span>
                            <span class="flwp-badge" style="background:#f6f7f7; color:#50575e"><?php echo (int) ($stats['types']['shortcode']['total'] ?? 0); ?></span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; min-width: 80px;"><?php esc_html_e('admin.page.dashboard.type.pre_content', 'flwp'); ?></span>
                            <span class="flwp-badge" style="background:#f6f7f7; color:#50575e"><?php echo (int) ($stats['types']['pre-content']['total'] ?? 0); ?></span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; min-width: 80px;"><?php esc_html_e('admin.page.dashboard.type.post_content', 'flwp'); ?></span>
                            <span class="flwp-badge" style="background:#f6f7f7; color:#50575e"><?php echo (int) ($stats['types']['post-content']['total'] ?? 0); ?></span>
                        </div>
	                    <div style="display: flex; align-items: center; gap: 10px;">
		                    <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; min-width: 80px;"><?php esc_html_e('admin.page.dashboard.type.overlay', 'flwp'); ?></span>
		                    <span class="flwp-badge" style="background:#f6f7f7; color:#50575e"><?php echo (int) ($stats['types']['modal']['total'] ?? 0); ?></span>
	                    </div>
	                    <div style="display: flex; align-items: center; gap: 10px;">
		                    <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; min-width: 80px;"><?php esc_html_e('admin.page.dashboard.type.slide_in', 'flwp'); ?></span>
		                    <span class="flwp-badge" style="background:#f6f7f7; color:#50575e"><?php echo (int) ($stats['types']['slide-in']['total'] ?? 0); ?></span>
	                    </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 11px; color: var(--flwp-text-secondary); text-transform: uppercase; min-width: 80px;"><?php esc_html_e('admin.page.dashboard.type.feedback_button', 'flwp'); ?></span>
                            <span class="flwp-badge" style="background:#f6f7f7; color:#50575e"><?php echo (int) ($stats['types']['feedback-button']['total'] ?? 0); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flwp-recent-activity card-span-4 card-span-2">
            <h3><?php esc_html_e('admin.page.dashboard.recent_activities', 'flwp'); ?></h3>
            <ul id="flwp-activity-list" class="flwp-list-simple">
                <?php 
                $form_feedback_db = new \FLWP\Database\FormFeedback();
                $recentFeedbacks = $form_feedback_db->get_feedbacks(['limit' => 5]);
                if (empty($recentFeedbacks)): 
                ?>
                    <li><?php esc_html_e('admin.page.dashboard.no_activities', 'flwp'); ?></li>
                <?php else: ?>
                    <?php foreach ($recentFeedbacks as $feedback_entity):
                        $item = $feedback_entity->toArray();
                        $data = $feedback_entity->getDecodedFeedbackData();
                        ?>
                        <li>
                            <div style="display: flex; flex-direction: column; width: 100%;">
                                <span style="display: block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    <strong><?php echo esc_html($formHelper->get_form_type_name($item['form_type'])); ?>:</strong>
                                    <?php echo esc_html($data['title'] ?? '-'); ?>
                                </span>
                                <small style="color: var(--flwp-text-secondary); font-size: 11px;">
                                    <?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($item['created']))); ?>
                                    <span style="margin-left: 2px; opacity: 0.8;">| #<?php echo (int) $item['id']; ?></span>
                                </small>
                            </div>
                        </li>
                    <?php endforeach; ?>
                <?php endif; ?>
            </ul>
        </div>
    </div>

    <div class="flwp-dashboard-chart-container">
        <h3><?php esc_html_e('admin.page.dashboard.feedback_trend', 'flwp'); ?></h3>
        <div style="height: 300px; width: 100%;">
            <canvas id="flwp-feedback-trend-chart"></canvas>
        </div>
    </div>
</section>
