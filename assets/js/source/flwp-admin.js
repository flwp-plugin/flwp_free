import { config as globalConfig } from '../components/flwp-form-config.js';
import { __ } from '../components/flwp-i18n';

const flwpAdmin = window.flwpAdmin;

const state = {
    chartFeedback: null
};

const api = {
    async getChartRecentFeedbacks() {
        const formData = new FormData();
        formData.append('action', 'flwp_get_chart_recent_feedbacks');
        formData.append('nonce', flwpAdmin.nonce);

        try {
            const response = await fetch(flwpAdmin.ajaxurl, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                state.chartFeedback = result.data.feedback;
            } else {
                throw new Error(result.data);
            }
        } catch (error) {
            console.error('Refresh data error:', error);
            throw error;
        }
    },

    async fetchAndShowFormFeedbackDetails(id) {
        const url = new URL(flwpAdmin.ajaxurl, window.location.origin);
        url.searchParams.append('action', 'flwp_get_form_feedback_by_id');
        url.searchParams.append('nonce', flwpAdmin.nonce);
        url.searchParams.append('id', id);

        try {
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                controller.showOverlay(result.data);
            } else {
                alert(result.data || __('admin.feedback.load_error'));
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            alert(__('admin.feedback.load_network_error'));
        }
    },

    async deleteFeedback(feedbackId, row) {
        const formData = new FormData();
        formData.append('action', 'flwp_delete_feedback');
        formData.append('nonce', flwpAdmin.nonce);
        formData.append('id', feedbackId);

        try {
            const response = await fetch(flwpAdmin.ajaxurl, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                if (row) {
                    row.style.transition = 'opacity 0.5s';
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 500);
                }
            } else {
                alert(result.data || __('admin.feedback.delete_error'));
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(__('admin.feedback.delete_network_error'));
        }
    }
};

const controller = {
    init: function() {
        this.attachTableRowListeners();
        this.setupFeedbackDeleteConfirmation();
        this.setupDeleteConfirmation();
        this.setupTableDateFilters();
        this.setupPostboxToggles();

        if (document.getElementById('flwp-feedback-trend-chart')) {
            api.getChartRecentFeedbacks().then(() => {
                this.initTrendChart();
            }).catch(err => console.error(err));
        }
    },

    setupTableDateFilters: function() {
        const rangeSelect = document.getElementById('filter-range-select');
        const customDateFields = rangeSelect ? rangeSelect.parentElement.querySelector('.custom-date-fields') : null;

        if (rangeSelect && customDateFields) {
            const toggleCustomDateFields = () => {
                customDateFields.style.display = rangeSelect.value === 'custom' ? 'inline-block' : 'none';
            };
            toggleCustomDateFields();
            rangeSelect.addEventListener('change', toggleCustomDateFields);
        }
    },

    setupPostboxToggles: function() {
        if (typeof jQuery !== 'undefined' && typeof postboxes !== 'undefined') {
            postboxes.add_postbox_toggles('flwp-about');
        }
    },

    initTrendChart: function() {
        const canvas = document.getElementById('flwp-feedback-trend-chart');
        if (!canvas || !state.chartFeedback) return;

        const ctx = canvas.getContext('2d');
        const last30Days = [];
        const counts = [];
        const now = new Date();

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            last30Days.push(d.toLocaleDateString(globalConfig.localeV2, { day: '2-digit', month: '2-digit' }));

            const dayCount = state.chartFeedback.filter(f => f.time && f.time.startsWith(dateStr)).length;
            counts.push(dayCount);
        }

        if (window.appTrendChart) window.appTrendChart.destroy();

        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        window.appTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days,
                datasets: [{
                    label: 'Feedback',
                    data: counts,
                    borderColor: '#2271b1',
                    backgroundColor: 'rgba(34, 113, 177, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    attachTableRowListeners: function() {
        document.addEventListener('click', function(e) {
            const tr = e.target.closest('.flwp-form-feedback-list .wp-list-table tbody tr');
            if (!tr) return;

            if (e.target.closest('.row-actions') || e.target.closest('input[type="checkbox"]')) {
                if (!e.target.classList.contains('flwp-view-feedback')) {
                    return;
                }
            }

            const idCell = tr.querySelector('.column-id');
            if (idCell) {
                const match = idCell.textContent.match(/#(\d+)/);
                if (match) {
                    api.fetchAndShowFormFeedbackDetails(match[1]);
                }
            }
        });
    },

    setupDeleteConfirmation: function() {
        document.addEventListener('click', function(e) {
            const deleteLink = e.target.closest('.flwp-delete-form-js');
            if (!deleteLink) return;

            const formName = deleteLink.getAttribute('data-name') || __('fields.unnamed');
            const message = __('admin.feedback.delete_form_confirm', { name: formName });

            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    },

    setupFeedbackDeleteConfirmation: function() {
        document.addEventListener('click', function(e) {
            const deleteLink = e.target.closest('.flwp-delete-form-feedback');
            if (!deleteLink) return;

            e.preventDefault();

            const feedbackId = deleteLink.getAttribute('data-id');
            const message = __('admin.feedback.delete_confirm', { id: feedbackId });

            if (!confirm(message)) {
                return;
            }

            const row = deleteLink.closest('tr');
            api.deleteFeedback(feedbackId, row);
        });
    },

    handleButtonClick: function(btn, status, successMessage, errorMessage = __('admin.feedback.delete_error'), preservedHtml = '') {
        if (!btn) return;

        if (status === 'loading') {
            const currentHtml = btn.innerHTML;
            btn.classList.add('loading');
            btn.innerHTML = `<div class="flwp-spinner"></div> ${__('admin.feedback.saving')}`;
            return currentHtml;
        }

        if (status === 'success') {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.innerHTML = `<i class="fas fa-check"></i> ${successMessage}`;
        } else if (status === 'error') {
            btn.classList.remove('loading');
            btn.classList.add('error');
            btn.innerHTML = `<i class="fas fa-times"></i> ${errorMessage}`;
        }

        setTimeout(() => {
            btn.classList.remove('success', 'error');
            if (preservedHtml) {
                btn.innerHTML = preservedHtml;
            }
        }, 1500);
    },

    showOverlay: function(data) {
        let backdrop = document.getElementById('flwp-modal-backdrop');
        let container = document.getElementById('flwp-modal-container');
        const template = document.getElementById('flwp-feedback-details-modal');

        if (!backdrop || !container || !template) return;

        const feedback = data.feedback;
        const steps = data.steps;
        const userValues = data.user_values;
        const accentColor = data.accent_color;
        let pagePath = feedback.tracking_page_url || '-';

        try {
            const url = new URL(feedback.tracking_page_url);
            pagePath = url.pathname + url.search + url.hash;
        } catch (e) {
        }

        const modalContent = template.content.cloneNode(true);

        const idTitle = modalContent.getElementById('flwp-modal-feedback-id-title');
        if (idTitle) {
            idTitle.textContent = idTitle.textContent.replace('{{id}}', feedback.id);
        }

        const dateText = modalContent.getElementById('flwp-modal-date-text');
        if (dateText) {
            dateText.textContent = feedback.created;
        }

        const rawTracking = JSON.parse(feedback.tracking_data || '{}');

        const trackUserAgent = modalContent.getElementById('flwp-track-useragent');
        if (trackUserAgent) {
            trackUserAgent.textContent = rawTracking.userAgent || '-';
        }

        const inputSourceUrl = modalContent.getElementById('flwp-input-source-url');
        const btnCopyUrl = modalContent.getElementById('flwp-btn-copy-url');
        const btnOpenUrl = modalContent.getElementById('flwp-btn-open-url');

        if (inputSourceUrl) {
            inputSourceUrl.value = pagePath;
            inputSourceUrl.title = pagePath;

            if (pagePath === '-') {
                if (btnCopyUrl) btnCopyUrl.style.display = 'none';
                if (btnOpenUrl) btnOpenUrl.style.display = 'none';
            }
        }

        if (btnCopyUrl && inputSourceUrl && pagePath !== '-') {
            btnCopyUrl.onclick = () => {
                const urlVal = feedback.tracking_page_url;
                if (urlVal && urlVal !== '-') {
                    navigator.clipboard.writeText(urlVal).then(() => {
                        const originalIcon = btnCopyUrl.innerHTML;
                        btnCopyUrl.innerHTML = '<i class="fas fa-check" style="color: #00a32a;"></i>';
                        setTimeout(() => {
                            btnCopyUrl.innerHTML = originalIcon;
                        }, 1500);
                    });
                }
            };
        }

        if (btnOpenUrl && inputSourceUrl && pagePath !== '-') {
            btnOpenUrl.onclick = () => {
                const urlVal = feedback.tracking_page_url;
                if (urlVal && urlVal !== '-') {
                    try {
                        window.open(urlVal, '_blank');
                    } catch (e) {
                        console.error(__('admin.feedback.url_open_error'), e);
                    }
                }
            };
        }

        const btnRawToggle = modalContent.getElementById('flwp-btn-raw-toggle');
        const rawBlock = modalContent.getElementById('flwp-raw-json-block');
        const rawChevron = modalContent.getElementById('flwp-raw-chevron');
        if (btnRawToggle && rawBlock) {
            rawBlock.textContent = JSON.stringify(rawTracking, null, 2);
            btnRawToggle.onclick = () => {
                const isHidden = rawBlock.classList.contains('hidden');
                if (isHidden) {
                    rawBlock.classList.remove('hidden');
                    if (rawChevron) rawChevron.className = 'fas fa-chevron-up';
                } else {
                    rawBlock.classList.add('hidden');
                    if (rawChevron) rawChevron.className = 'fas fa-chevron-down';
                }
            };
        }

        const statusButtons = modalContent.querySelectorAll('#flwp-modal-status-control .flwp-status-btn');
        const currentStatus = feedback.status || 'unread';
        let isStatusAnimating = false;

        statusButtons.forEach(btn => {
            const btnStatus = btn.getAttribute('data-status');
            if (btnStatus === currentStatus) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }

            btn.onclick = () => {
                if (isStatusAnimating) return;
                if (btn.classList.contains('active')) return;

                isStatusAnimating = true;

                const icon = btn.querySelector('i');
                const originalIconClass = icon ? icon.className : '';

                if (icon) {
                    icon.className = 'fas fa-spinner fa-spin';
                }

                const formData = new FormData();
                formData.append('action', 'flwp_update_form_feedback_status');
                formData.append('nonce', flwpAdmin.nonce);
                formData.append('feedback_id', feedback.id);
                formData.append('status', btnStatus);

                fetch(flwpAdmin.ajaxurl, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(result => {
                        setTimeout(() => {
                            if (result.success) {
                                statusButtons.forEach(b => {
                                    b.classList.remove('active');
                                    const otherIcon = b.querySelector('i');
                                    if (otherIcon) {
                                        otherIcon.classList.remove('flwp-fade-in');
                                    }
                                });

                                btn.classList.add('active');
                                feedback.status = btnStatus;

                                const rows = document.querySelectorAll(`.wp-list-table tbody tr`);
                                rows.forEach(r => {
                                    if (r.querySelector('.column-id') && r.querySelector('.column-id').textContent.includes(`#${feedback.id}`)) {
                                        const statusCol = r.querySelector('.column-status');
                                        if (statusCol) {
                                            console.log(btnStatus.charAt(0).toUpperCase());
                                            console.log(btnStatus);

                                            console.log(__('admin.form_list.filter.status.read'));

                                            let statusLabel = '';
                                            switch (btnStatus) {
                                                case 'read':
                                                    statusLabel = __('admin.form_list.filter.status.read');
                                                    break;
                                                case 'archived':
                                                    statusLabel = __('admin.form_list.filter.status.archived');
                                                    break;
                                                case 'unread':
                                                default:
                                                    statusLabel = __('admin.form_list.filter.status.unread');
                                                    break;
                                            }

                                            statusCol.innerHTML = `<span class="flwp-status-badge ${btnStatus}">${statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}</span>`;
                                        }
                                    }
                                });
                            } else {
                                alert(result.data || __('admin.feedback.status_update_error'));
                            }

                            if (icon) {
                                icon.className = originalIconClass + ' flwp-fade-in';
                                setTimeout(() => {
                                    icon.classList.remove('flwp-fade-in');
                                }, 350);
                            }

                            isStatusAnimating = false;
                        }, 400);
                    })
                    .catch(error => {
                        console.error('Error updating status:', error);
                        if (icon) icon.className = originalIconClass;
                        isStatusAnimating = false;
                    });
            };
        });

        container.innerHTML = '';
        container.appendChild(modalContent);

        container.classList.remove('hidden');
        container.classList.add('flwp-modal-large');
        backdrop.classList.remove('hidden');

        const renderContainer = document.getElementById('flwp-admin-feedback-form-render');
        if (renderContainer && window.FLWPFrontend) {
            const stateObj = {
                settings: {
                    styles: {
                        accentColor: accentColor
                    }
                },
                steps: steps
            };

            window.FLWPFrontend.render(renderContainer, stateObj, {
                isReadOnly: true,
                answers: userValues
            });
        }

        const closeModal = () => {
            backdrop.classList.add('hidden');
            container.classList.add('hidden');
            container.innerHTML = '';
        };

        const closeButtons = [
            document.getElementById('flwp-modal-btn-close-modal'),
            document.getElementById('flwp-modal-btn-modal-done'),
            backdrop
        ];

        closeButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', closeModal);
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => controller.init());
} else {
    controller.init();
}

window.FLWPAdmin = {
    init: () => controller.init(),
    state,
    api,
    controller
};

export { state, api, controller };
export default window.FLWPAdmin;
