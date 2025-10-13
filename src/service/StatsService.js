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

    // Analytics
    async getDashboardStats() {
        return this.makeRequest(ApiUrl.ADMIN.DASHBOARD_STATS);
    }

    async getUserAnalytics(period = '30d') {
        return this.makeRequest(
            `${ApiUrl.ADMIN.USER_ANALYTICS}?period=${period}`
        );
    }
}

export default new StatsService();
