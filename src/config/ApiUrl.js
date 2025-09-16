const BASE_URL = 'https://api.quizarena.in/dashboard/v1';

const ApiUrl = {
    AUTH: {
        LOGIN: `${BASE_URL}/users/login`,
        SIGNUP: `${BASE_URL}/users/signup`,
    },
    USERS: {
        USER_LIST: `${BASE_URL}/users/userlist`,
        DASHBOARD_USER_LIST: `${BASE_URL}/users/dashboarduserlist`,
    },
};

export default ApiUrl;
