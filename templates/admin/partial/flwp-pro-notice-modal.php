<?php
if (!defined('ABSPATH')) {
	exit;
}

$finalProNoticeHeadline = (!empty($proNoticeHeadline) ? $proNoticeHeadline : __('admin.builder.pro.headline', 'flwp'));
$finalProNoticeIntro = (!empty($proNoticeIntro) ? $proNoticeIntro : __('admin.builder.pro.intro', 'flwp'));
$finalProNoticeAdvantages = $proNoticeAdvantages ?? [
    esc_html__('admin.builder.pro.advantage.1', 'flwp'),
    esc_html__('admin.builder.pro.advantage.2', 'flwp'),
    esc_html__('admin.builder.pro.advantage.3', 'flwp')
];

?>

<!-- PRO / Freemius Upgrade Modal -->
<div id="flwp-modal-pro-upgrade" class="flwp-form-builder flwp-modal-overlay flwp-modal-overlay-active" role="dialog" aria-modal="true" aria-labelledby="flwp-pro-title">
    <div class="flwp-modal-box" style="max-width: 500px;">
        <div class="flwp-modal-header" style="background-color: var(--flwp-primary-light); border-bottom: 1px solid var(--flwp-border); padding: 16px 24px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <h3 class="flwp-modal-title" id="flwp-pro-title" style="color: var(--flwp-primary); font-weight: 700;">
                <i class="fas fa-crown" style="color: var(--flwp-warning);"></i> <?php esc_html_e('admin.builder.pro.title', 'flwp'); ?>
            </h3>
        </div>
        <div class="flwp-modal-body" style="padding: 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px; color: var(--flwp-warning);">
                    <i class="fas fa-gem"></i>
                </div>
                <h4 style="font-size: 18px; font-weight: 700; color: var(--flwp-text); margin-bottom: 8px;"><?php echo esc_html($finalProNoticeHeadline) ?></h4>
                <p style="color: var(--flwp-text-secondary); font-size: 13.5px; line-height: 1.5; margin: 0;">
                    <?php echo wp_kses($finalProNoticeIntro, ['strong' => []]) ?>
                </p>
            </div>

            <div style="background-color: var(--flwp-bg); border: 1px solid var(--flwp-border); border-radius: 8px; padding: 16px; margin-bottom: 4px;">
                <h5 style="font-weight: 700; font-size: 13px; color: var(--flwp-text); margin-bottom: 12px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.05em;"><?php esc_html_e('admin.builder.pro.advantages_title', 'flwp'); ?></h5>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; padding-left: 0; margin: 0;">
                    <?php foreach ($finalProNoticeAdvantages as $advantage) : ?>
                    <li style="display: flex; align-items: flex-start; gap: 8px; color: var(--flwp-text);">
                        <i class="fas fa-check-circle" style="color: var(--flwp-success); margin-top: 2px;"></i>
                        <span><?php echo esc_html($advantage) ?></span>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
        <div class="flwp-modal-footer" style="padding: 16px 24px; border-top: 1px solid var(--flwp-border); display: flex; justify-content: center; gap: 12px; background-color: var(--flwp-bg); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
            <a href="<?php echo esc_url('https://flwp.de') ?>" target="_blank" class="flwp-btn" id="flwp-btn-pro-upgrade-cta" style="background-color: var(--flwp-primary); color: white; font-weight: 600; padding: 8px 20px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--flwp-primary); box-shadow: var(--flwp-shadow-md); transition: all 0.2s; height: auto;">
                <i class="fas fa-shopping-cart"></i> <?php esc_html_e('admin.builder.pro.cta_text', 'flwp'); ?>
            </a>
        </div>
    </div>
</div>