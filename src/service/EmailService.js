import ApiUrl from '../config/ApiUrl';
import { getAuthToken } from '../utils/authToken';

class EmailService {
    static async getEmailLogs({ page = 1, limit = 25, type, status, search } = {}) {
        try {
            const params = new URLSearchParams({ page, limit });
            if (type && type !== 'all') params.append('type', type);
            if (status && status !== 'all') params.append('status', status);
            if (search) params.append('search', search);

            const response = await fetch(`${ApiUrl.EMAILS.LOGS}?${params}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching email logs:', error);
            throw error;
        }
    }

    static async getEmailStats() {
        try {
            const response = await fetch(ApiUrl.EMAILS.STATS, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching email stats:', error);
            throw error;
        }
    }
}

export default EmailService;
