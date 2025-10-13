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

    STATS: {
        // Analytics
        DASHBOARD_STATS: `${BASE_URL}/stats`,
        QUIZ_ANALYTICS: `${BASE_URL}/stats/analytics/quiz`,
    },

    QUIZZES: {
        // Quiz Management
        PENDING_QUIZZES: `${BASE_URL}/quizzes/pending`,
        APPROVE_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/approve`,
        REJECT_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/reject`,
        ALL_QUIZZES: `${BASE_URL}/quizzes`,
        QUIZ_DETAILS: (quizId) => `${BASE_URL}/quizzes/${quizId}/review`,
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
};

export default ApiUrl;
