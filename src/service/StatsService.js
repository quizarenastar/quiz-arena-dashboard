import ApiUrl from '../config/ApiUrl.js';

class StatsService {
    // Helper method for API calls
    async makeRequest(url, options = {}) {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('Admin API Error:', error);
            throw error;
        }
    }

    // Get dashboard counts for stats cards
    async getDashboardCounts() {
        return this.makeRequest(ApiUrl.STATS.DASHBOARD_COUNTS);
    }

    // Get comprehensive dashboard statistics
    async getDashboardStats() {
        return this.makeRequest(ApiUrl.STATS.DASHBOARD_STATS);
    }

    // Get quiz analytics with optional period filter
    async getQuizAnalytics(period = '30') {
        return this.makeRequest(
            `${ApiUrl.STATS.QUIZ_ANALYTICS}?period=${period}`
        );
    }
}

export default new StatsService();
