import ApiUrl from '../config/ApiUrl.js';

class AdminService {
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

    // Quiz Management
    async getPendingQuizzes() {
        return this.makeRequest(ApiUrl.ADMIN.PENDING_QUIZZES);
    }

    async approveQuiz(quizId, feedback = '') {
        return this.makeRequest(ApiUrl.ADMIN.APPROVE_QUIZ(quizId), {
            method: 'POST',
            body: JSON.stringify({ feedback }),
        });
    }

    async rejectQuiz(quizId, reason) {
        return this.makeRequest(ApiUrl.ADMIN.REJECT_QUIZ(quizId), {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async getAllQuizzes(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.ADMIN.ALL_QUIZZES}?${queryParams}`
            : ApiUrl.ADMIN.ALL_QUIZZES;
        return this.makeRequest(url);
    }

    async getQuizDetails(quizId) {
        return this.makeRequest(ApiUrl.ADMIN.QUIZ_DETAILS(quizId));
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

    async getQuizAnalytics(period = '30d') {
        return this.makeRequest(
            `${ApiUrl.ADMIN.QUIZ_ANALYTICS}?period=${period}`
        );
    }

    async getRevenueAnalytics(period = '30d') {
        return this.makeRequest(
            `${ApiUrl.ADMIN.REVENUE_ANALYTICS}?period=${period}`
        );
    }

    // Transaction Management
    async getTransactions(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.ADMIN.TRANSACTIONS}?${queryParams}`
            : ApiUrl.ADMIN.TRANSACTIONS;
        return this.makeRequest(url);
    }

    async approveWithdrawal(transactionId) {
        return this.makeRequest(
            ApiUrl.ADMIN.APPROVE_WITHDRAWAL(transactionId),
            {
                method: 'POST',
            }
        );
    }

    async rejectWithdrawal(transactionId, reason) {
        return this.makeRequest(ApiUrl.ADMIN.REJECT_WITHDRAWAL(transactionId), {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async processRefund(refundData) {
        return this.makeRequest(ApiUrl.ADMIN.PROCESS_REFUND, {
            method: 'POST',
            body: JSON.stringify(refundData),
        });
    }

    // User Management
    async getUserDetails(userId) {
        return this.makeRequest(ApiUrl.ADMIN.USER_DETAILS(userId));
    }

    async suspendUser(userId, reason) {
        return this.makeRequest(ApiUrl.ADMIN.SUSPEND_USER(userId), {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async unsuspendUser(userId) {
        return this.makeRequest(ApiUrl.ADMIN.UNSUSPEND_USER(userId), {
            method: 'POST',
        });
    }

    // System Monitoring
    async getSystemHealth() {
        return this.makeRequest(ApiUrl.ADMIN.SYSTEM_HEALTH);
    }

    async getActivityLogs(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.ADMIN.ACTIVITY_LOGS}?${queryParams}`
            : ApiUrl.ADMIN.ACTIVITY_LOGS;
        return this.makeRequest(url);
    }

    // Utility methods
    formatAmount(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    }

    getStatusColor(status) {
        const colors = {
            approved: 'green',
            pending: 'yellow',
            rejected: 'red',
            active: 'green',
            suspended: 'red',
            completed: 'green',
            failed: 'red',
        };
        return colors[status] || 'gray';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}

export default new AdminService();
