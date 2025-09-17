import ApiUrl from '../config/ApiUrl';
import { getAuthToken } from '../utils/authToken';

class ContactService {
    static async getContactList() {
        try {
            const response = await fetch(`${ApiUrl.CONTACT.CONTACT_LIST}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching contact list:', error);
            throw error;
        }
    }

    static async updateContactStatus(contactId, status) {
        try {
            const response = await fetch(
                `${ApiUrl.CONTACT.UPDATE_STATUS(contactId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating contact status:', error);
            throw error;
        }
    }
}

export default ContactService;
