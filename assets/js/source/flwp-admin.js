import { config as globalConfig } from '../components/flwp-form-config.js';

if (typeof window.flwpAdmin === 'undefined') {
    window.flwpAdmin = {
        nonce: 'mock-nonce',
        ajaxurl: '/api/mock-ajax'
    };
}
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
        if (globalConfig.isPro) {
            this.attachTableRowListeners();
            this.setupExportActions();
            this.setupFeedbackDeleteConfirmation();
            this.setupExportDateFilters();
            this.setupMultiSelectCheckboxes();
        }
        this.setupDeleteConfirmation();
        this.setupTableDateFilters();
        this.setupPostboxToggles();

        if (document.getElementById('flwp-feedback-trend-chart')) {
            api.getChartRecentFeedbacks().then(() => {
                this.initTrendChart();
            }).catch(err => console.error(err));
        }
    },

    setupExportDateFilters: function() {
        const rangeSelect = document.getElementById('flwp-export-feedback-range');
        const customDateFields = document.querySelector('.custom-date-fields');

        if (rangeSelect && customDateFields) {
            const toggleCustomDateFields = () => {
                customDateFields.style.display = rangeSelect.value === 'custom' ? 'grid' : 'none';
            };
            toggleCustomDateFields();
            rangeSelect.addEventListener('change', toggleCustomDateFields);
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

    setupMultiSelectCheckboxes: function() {
        const setups = [
            {
                selectAll: 'export-feedback-select-all',
                items: '.export-feedback-checkbox'
            },
            {
                selectAll: 'export-form-select-all',
                items: '.export-form-checkbox'
            }
        ];

        setups.forEach(setup => {
            const selectAllCheckbox = document.getElementById(setup.selectAll);
            const itemCheckboxes = document.querySelectorAll(setup.items);

            if (selectAllCheckbox && itemCheckboxes.length > 0) {
                selectAllCheckbox.addEventListener('change', function() {
                    const isChecked = this.checked;
                    itemCheckboxes.forEach(cb => {
                        cb.checked = isChecked;
                    });
                });

                itemCheckboxes.forEach(cb => {
                    cb.addEventListener('change', function() {
                        const allChecked = Array.from(itemCheckboxes).every(item => item.checked);
                        const noneChecked = Array.from(itemCheckboxes).every(item => !item.checked);

                        selectAllCheckbox.checked = allChecked;
                        selectAllCheckbox.indeterminate = (!allChecked && !noneChecked);
                    });
                });
            }
        });
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

    setupExportActions: function() {
        const csvBtn = document.getElementById('flwp-btn-export-csv-feedback');
        const jsonBtn = document.getElementById('flwp-btn-export-json-feedback');
        const formsBtn = document.getElementById('flwp-btn-export-forms');

        const createExportForm = (action, params = {}) => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = flwpAdmin.ajaxurl;

            const baseParams = {
                action: action,
                nonce: flwpAdmin.nonce
            };

            const allParams = { ...baseParams, ...params };

            for (const key in allParams) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = allParams[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        };

        if (csvBtn) csvBtn.addEventListener('click', () => {
            const rangeSelect = document.getElementById('flwp-export-feedback-range');
            const feedbackCheckboxes = document.querySelectorAll('.export-feedback-checkbox:checked');
            const formIds = Array.from(feedbackCheckboxes).map(cb => cb.value).join(',');

            if (!formIds || formIds.length === 0) {
                alert(__('admin.feedback.select_exactly_one_csv'));
                return;
            }

            if (formIds.split(',').length > 1) {
                alert(__('admin.feedback.select_only_one_csv_error'));
                return;
            }

            const params = {
                form_id: formIds || 'all',
                range: rangeSelect?.value || '',
                status: document.getElementById('flwp-export-csv-status')?.value || 'all',
                start_date: document.getElementById('flwp-export-csv-start-date')?.value || '',
                end_date: document.getElementById('flwp-export-csv-end-date')?.value || ''
            };
            createExportForm('flwp_export_csv', params);
        });

        if (jsonBtn) jsonBtn.addEventListener('click', () => {
            const feedbackCheckboxes = document.querySelectorAll('.export-feedback-checkbox:checked');
            const formIds = Array.from(feedbackCheckboxes).map(cb => cb.value).join(',');

            if (!formIds || formIds.length === 0) {
                alert(__('admin.feedback.select_at_least_one'));
                return;
            }

            const rangeValue = document.getElementById('flwp-export-feedback-range')?.value || '';
            createExportForm('flwp_export_json', {
                export_type: 'feedback',
                form_id: formIds,
                range: rangeValue,
                status: document.getElementById('flwp-export-csv-status')?.value || 'all',
                start_date: rangeValue === 'custom' ? (document.getElementById('flwp-export-csv-start-date')?.value || '') : '',
                end_date: rangeValue === 'custom' ? (document.getElementById('flwp-export-csv-end-date')?.value || '') : ''
            });
        });

        if (formsBtn) formsBtn.addEventListener('click', () => {
            const formCheckboxes = document.querySelectorAll('.export-form-checkbox:checked');
            const formIds = Array.from(formCheckboxes).map(cb => cb.value).join(',');

            if (!formIds || formIds.length === 0) {
                alert(__('admin.feedback.select_at_least_one'));
                return;
            }

            createExportForm('flwp_export_json', {
                export_type: 'forms',
                form_id: formIds
            });
        });

        const importConfigs = [
            {
                trigger: document.getElementById('flwp-btn-import-trigger'),
                input: document.getElementById('flwp-input-import'),
                defaultType: 'forms'
            },
            {
                trigger: document.getElementById('flwp-btn-feedback-import-trigger'),
                input: document.getElementById('flwp-input-feedback-import'),
                defaultType: 'feedback'
            }
        ];

        importConfigs.forEach(config => {
            if (config.trigger && config.input) {
                config.trigger.addEventListener('click', () => config.input.click());
                config.input.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('action', 'flwp_import_json');
                    formData.append('nonce', flwpAdmin.nonce);
                    formData.append('import_file', file);
                    formData.append('type', config.trigger.getAttribute('data-type') || config.defaultType);

                    const preservedHtml = controller.handleButtonClick(config.trigger, 'loading', '');

                    try {
                        const response = await fetch(flwpAdmin.ajaxurl, {
                            method: 'POST',
                            body: formData
                        });
                        const result = await response.json();

                        if (result.success) {
                            const successMsg = config.defaultType === 'forms'
                                ? __('admin.feedback.import_success_forms')
                                : __('admin.feedback.import_success_feedback');
                            controller.handleButtonClick(config.trigger, 'success', result.data || successMsg, '', '');
                        } else {
                            controller.handleButtonClick(config.trigger, 'error', '', result.data || __('admin.toast.import_error', { error: '' }), preservedHtml);
                        }
                    } catch (error) {
                        console.error('Import error:', error);
                        controller.handleButtonClick(config.trigger, 'error', '', __('admin.toast.network_error'), preservedHtml);
                    }
                });
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

        const trackDevice = modalContent.getElementById('flwp-track-device');
        if (trackDevice) {
            const deviceType = feedback.tracking_device_type || '';
            const deviceStr = deviceType === 'desktop'
                ? __('admin.feedback.device_desktop')
                : (deviceType === 'mobile' || deviceType === 'tablet' ? __('admin.feedback.device_mobile') : '-');

            let os = '-';
            const ua = rawTracking.userAgent || '';
            if (ua.includes('Windows')) os = 'Windows';
            else if (ua.includes('Macintosh')) os = 'macOS';
            else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
            else if (ua.includes('Android')) os = 'Android';
            else if (ua.includes('Linux')) os = 'Linux';
            else if (ua) os = __('admin.feedback.unknown');

            if (deviceStr !== '-' && os !== '-') {
                trackDevice.textContent = `${deviceStr} (${os})`;
            } else if (deviceStr !== '-') {
                trackDevice.textContent = deviceStr;
            } else if (os !== '-') {
                trackDevice.textContent = os;
            } else {
                trackDevice.textContent = '-';
            }

            const deviceIcon = modalContent.getElementById('flwp-device-icon');
            if (deviceIcon) {
                deviceIcon.className = deviceType === 'desktop' ? 'fas fa-desktop' : (deviceType ? 'fas fa-mobile-alt' : 'fas fa-desktop');
            }
        }

        const trackConnection = modalContent.getElementById('flwp-track-connection');
        if (trackConnection) {
            const conn = feedback.tracking_conn_type ? feedback.tracking_conn_type.toUpperCase() : '-';
            trackConnection.textContent = conn === '-' ? '-' : `${conn} (${__('admin.feedback.broadband')})`;
        }

        const trackResolution = modalContent.getElementById('flwp-track-resolution');
        if (trackResolution) {
            const res = feedback.tracking_screen_res_w ? `${feedback.tracking_screen_res_w}x${feedback.tracking_screen_res_h}` : '-';
            const vp = feedback.tracking_viewport_w ? `${feedback.tracking_viewport_w}x${feedback.tracking_viewport_h}` : '-';
            trackResolution.textContent = res === '-' && vp === '-' ? '-' : `${res} (${vp})`;
        }

        const trackTimespent = modalContent.getElementById('flwp-track-timespent');
        if (trackTimespent) {
            const time = feedback.tracking_time_on_page;
            trackTimespent.textContent = (time !== null && time !== undefined) ? `${time} ${__('admin.feedback.seconds')}` : '-';
        }

        const trackLanguage = modalContent.getElementById('flwp-track-language');
        if (trackLanguage) {
            const lang = feedback.tracking_language || '-';
            const tz = feedback.tracking_timezone || '-';
            trackLanguage.textContent = lang === '-' && tz === '-' ? '-' : `${lang} (${tz})`;
        }

        const trackColorScheme = modalContent.getElementById('flwp-track-colorscheme');
        if (trackColorScheme) {
            let colorScheme = '-';
            if (feedback.tracking_color_scheme === 'dark') colorScheme = __('admin.feedback.theme_dark');
            else if (feedback.tracking_color_scheme === 'light') colorScheme = __('admin.feedback.theme_light');
            trackColorScheme.textContent = colorScheme;
        }

        const trackSession = modalContent.getElementById('flwp-track-session');
        if (trackSession) {
            trackSession.textContent = feedback.tracking_session_id || '-';
        }

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
                                            statusCol.innerHTML = `<span class="flwp-status-badge ${btnStatus}">${btnStatus.charAt(0).toUpperCase() + btnStatus.slice(1)}</span>`;
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
