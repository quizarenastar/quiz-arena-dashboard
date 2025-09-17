import ApiUrl from '../config/ApiUrl';
import { authHeader } from '../utils/authToken';

const UserService = {
    getUserList: async () => {
        try {
            const response = await fetch(ApiUrl.USERS.USER_LIST, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(),
                },
            });
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch user list');
        }
    },

    getDashboardUserList: async () => {
        try {
            const response = await fetch(ApiUrl.USERS.DASHBOARD_USER_LIST, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(),
                },
            });
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch dashboard user list');
        }
    },
};

export default UserService;
