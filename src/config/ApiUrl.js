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
        USER_DETAIL: (userId) => `${BASE_URL}/users/userlist/${userId}`,
        GIVE_BONUS: (userId) => `${BASE_URL}/users/userlist/${userId}/bonus`,
        GIVE_BONUS_ALL: `${BASE_URL}/users/bonus-all`,
    },

    CONTACT: {
        CONTACT_LIST: `${BASE_URL}/contact`,
        UPDATE_STATUS: (contactId) => `${BASE_URL}/contact/${contactId}/status`,
    },

    STATS: {
        // Dashboard counts for stats cards
        DASHBOARD_COUNTS: `${BASE_URL}/stats/counts`,
        // Analytics
        DASHBOARD_STATS: `${BASE_URL}/stats`,
        QUIZ_ANALYTICS: `${BASE_URL}/stats/analytics/quiz`,
        USER_GROWTH: `${BASE_URL}/stats/analytics/user-growth`,
        CATEGORY_PARTICIPATION: `${BASE_URL}/stats/analytics/category-participation`,
        ANTI_CHEAT: `${BASE_URL}/stats/analytics/anti-cheat`,
        REVENUE_DISTRIBUTION: `${BASE_URL}/stats/analytics/revenue-distribution`,
    },

    QUIZZES: {
        // Quiz Management
        PENDING_QUIZZES: `${BASE_URL}/quizzes/pending`,
        APPROVE_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/approve`,
        REJECT_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/reject`,
        DELETE_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}`,
        ALL_QUIZZES: `${BASE_URL}/quizzes`,
        QUIZ_DETAILS: (quizId) => `${BASE_URL}/quizzes/${quizId}/review`,
        QUIZ_FULL_DETAIL: (quizId) => `${BASE_URL}/quizzes/${quizId}/detail`,
        CANCEL_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/cancel`,
        REVOKE_REWARD: (quizId) =>
            `${BASE_URL}/quizzes/${quizId}/revoke-reward`,
    },

    WALLET: {
        // Transaction Management
        TRANSACTIONS: `${BASE_URL}/wallet/transactions`,
        APPROVE_WITHDRAWAL: (transactionId) =>
            `${BASE_URL}/wallet/withdrawal/${transactionId}/approve`,
        REJECT_WITHDRAWAL: (transactionId) =>
            `${BASE_URL}/wallet/withdrawal/${transactionId}/reject`,
        PROCESS_REFUND: `${BASE_URL}/wallet/transactions/refund`,

        // Wallet Management
        APPROVE_FUND_ADDITION: (transactionId) =>
            `${BASE_URL}/wallet/fund-addition/${transactionId}/approve`,
        REJECT_FUND_ADDITION: (transactionId) =>
            `${BASE_URL}/wallet/fund-addition/${transactionId}/reject`,
    },

    WAR_ROOMS: {
        STATS: `${BASE_URL}/war-rooms/stats`,
        ALL: `${BASE_URL}/war-rooms`,
        DETAILS: (roomId) => `${BASE_URL}/war-rooms/${roomId}`,
        DELETE: (roomId) => `${BASE_URL}/war-rooms/${roomId}`,
    },

    EMAILS: {
        LOGS: `${BASE_URL}/emails`,
        STATS: `${BASE_URL}/emails/stats`,
    },
};

export default ApiUrl;
