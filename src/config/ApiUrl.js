const BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/dashboard/v1';

const ApiUrl = {
    AUTH: {
        LOGIN: `${BASE_URL}/users/login`,
        SIGNUP: `${BASE_URL}/users/signup`,
    },
    USERS: {
        USER_LIST: `${BASE_URL}/users/userlist`,
        DASHBOARD_USER_LIST: `${BASE_URL}/users/dashboarduserlist`,
    },

    CONTACT: {
        CONTACT_LIST: `${BASE_URL}/contact`,
        UPDATE_STATUS: (contactId) => `${BASE_URL}/contact/${contactId}/status`,
    },

    ADMIN: {
        // Quiz Management
        PENDING_QUIZZES: `${BASE_URL}/admin/quizzes/pending`,
        APPROVE_QUIZ: (quizId) => `${BASE_URL}/admin/quizzes/${quizId}/approve`,
        REJECT_QUIZ: (quizId) => `${BASE_URL}/admin/quizzes/${quizId}/reject`,
        ALL_QUIZZES: `${BASE_URL}/admin/quizzes`,
        QUIZ_DETAILS: (quizId) => `${BASE_URL}/admin/quizzes/${quizId}/review`,

        // Analytics
        DASHBOARD_STATS: `${BASE_URL}/admin/stats`,
        USER_ANALYTICS: `${BASE_URL}/admin/analytics/users`,
        QUIZ_ANALYTICS: `${BASE_URL}/admin/analytics/quizzes`,
        REVENUE_ANALYTICS: `${BASE_URL}/admin/analytics/revenue`,

        // Transaction Management
        TRANSACTIONS: `${BASE_URL}/admin/transactions`,
        APPROVE_WITHDRAWAL: (transactionId) =>
            `${BASE_URL}/admin/transactions/${transactionId}/approve`,
        REJECT_WITHDRAWAL: (transactionId) =>
            `${BASE_URL}/admin/transactions/${transactionId}/reject`,
        PROCESS_REFUND: `${BASE_URL}/admin/transactions/refund`,

        // User Management
        USER_DETAILS: (userId) => `${BASE_URL}/admin/users/${userId}`,
        SUSPEND_USER: (userId) => `${BASE_URL}/admin/users/${userId}/suspend`,
        UNSUSPEND_USER: (userId) =>
            `${BASE_URL}/admin/users/${userId}/unsuspend`,

        // System Monitoring
        SYSTEM_HEALTH: `${BASE_URL}/admin/system/health`,
        ACTIVITY_LOGS: `${BASE_URL}/admin/system/logs`,
    },
};

export default ApiUrl;
