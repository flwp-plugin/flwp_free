<?php
/**
 * Template for Form Overlay Widget
 */
if (!defined('ABSPATH')) exit;?>

<template id="flwp-general-overlay-template">
    <div class="flwp-feedback-plugin flwp-general-overlay-backdrop" role="dialog" aria-modal="true" aria-labelledby="flwp-general-overlay-title">
        <div class="flwp-general-overlay-modal flwp-overlay-card-pos-center">
            <!-- HEADER -->
            <div class="flwp-overlay-header">

                <button id="flwp-general-overlay-back-button" class="flwp-general-overlay-icon-btn" aria-label="Back" style="display: none;">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>

                <div id="flwp-general-overlay-header-indicator-wrapper" class="flwp-overlay-header-indicator-wrapper">
                    <div id="flwp-general-overlay-progress-bar-container" class="flwp-general-overlay-progress-bar-container" style="display: none;">
                        <div id="flwp-general-overlay-progress-bar" class="flwp-general-overlay-progress-bar"></div>
                    </div>

                    <div id="flwp-general-overlay-title" class="flwp-overlay-header-title" style="display: none;">Feedback</div>

                    <div id="flwp-general-overlay-step-indicator" class="flwp-overlay-header-step-indicator" style="display: none;"></div>
                </div>

                <button id="flwp-general-overlay-close-button" class="flwp-general-overlay-icon-btn" aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- BODY -->
            <div class="flwp-overlay-body">
                <div id="flwp-general-overlay-content" class="flwp-feedback-type-placeholder flwp-form-id-1" data-type="overlay" data-form-id="1" data-form-updated="20260717120405"></div>
            </div>

            <!-- FOOTER -->
            <div class="flwp-overlay-footer">
                <?php esc_html_e('admin.frontend.default_footer_text', 'flwp') ?>
            </div>
        </div>
    </div>
</template>