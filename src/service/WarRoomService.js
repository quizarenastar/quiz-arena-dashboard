import ApiUrl from '../config/ApiUrl.js';

class WarRoomService {
    async makeRequest(url, options = {}) {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('War Room API Error:', error);
            throw error;
        }
    }

    // Get war room statistics
    async getStats() {
        return this.makeRequest(ApiUrl.WAR_ROOMS.STATS);
    }

    // List all war rooms (paginated)
    async getAllRooms(params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = query
            ? `${ApiUrl.WAR_ROOMS.ALL}?${query}`
            : ApiUrl.WAR_ROOMS.ALL;
        return this.makeRequest(url);
    }

    // Get room details
    async getRoomDetails(roomId) {
        return this.makeRequest(ApiUrl.WAR_ROOMS.DETAILS(roomId));
    }

    // Delete a room
    async deleteRoom(roomId) {
        return this.makeRequest(ApiUrl.WAR_ROOMS.DELETE(roomId), {
            method: 'DELETE',
        });
    }
}

export default new WarRoomService();
