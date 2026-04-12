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
            console.error(error);
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
            console.error(error);
            throw new Error('Failed to fetch dashboard user list');
        }
    },

    getUserDetail: async (userId) => {
        try {
            const response = await fetch(ApiUrl.USERS.USER_DETAIL(userId), {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(),
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch user detail');
        }
    },

    giveBonusToUser: async (userId, amount, reason) => {
        try {
            const response = await fetch(ApiUrl.USERS.GIVE_BONUS(userId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(),
                },
                body: JSON.stringify({ amount, reason }),
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to give bonus');
        }
    },

    giveBonusToAllUsers: async (amount, reason) => {
        try {
            const response = await fetch(ApiUrl.USERS.GIVE_BONUS_ALL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(),
                },
                body: JSON.stringify({ amount, reason }),
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to give bonus to all users');
        }
    },
};

export default UserService;
