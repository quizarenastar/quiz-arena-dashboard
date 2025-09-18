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
};

export default ApiUrl;
