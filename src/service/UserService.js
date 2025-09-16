import ApiUrl from '../config/ApiUrl';

const UserService = {
    getUserList: async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(ApiUrl.USERS.USER_LIST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch user list');
        }
    },

    getDashboardUserList: async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(ApiUrl.USERS.DASHBOARD_USER_LIST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch dashboard user list');
        }
    },
};

export default UserService;
