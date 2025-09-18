import ApiUrl from '../config/ApiUrl';

const AuthService = {
    loginUser: async (credentials) => {
        try {
            const response = await fetch(ApiUrl.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Login service failed');
        }
    },

    signupUser: async (userData) => {
        try {
            const response = await fetch(ApiUrl.AUTH.SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Signup service failed');
        }
    },
};

export default AuthService;
