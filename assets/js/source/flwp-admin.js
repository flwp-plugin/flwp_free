import { config as globalConfig } from '../components/flwp-form-config.js';

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
};

const controller = {
    init: function() {
        this.setupPostboxToggles();

        if (document.getElementById('flwp-feedback-trend-chart')) {
            api.getChartRecentFeedbacks().then(() => {
                this.initTrendChart();
            }).catch(err => console.error(err));
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
