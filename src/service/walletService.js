import ApiUrl from '../config/ApiUrl.js';

class WalletService {
    // Helper method for API calls
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
            console.error('Admin API Error:', error);
            throw error;
        }
    }

    // Transaction Management
    async getTransactions(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.WALLET.TRANSACTIONS}?${queryParams}`
            : ApiUrl.WALLET.TRANSACTIONS;
        return this.makeRequest(url);
    }

    async approveWithdrawal(transactionId) {
        return this.makeRequest(
            ApiUrl.WALLET.APPROVE_WITHDRAWAL(transactionId),
            {
                method: 'POST',
            }
        );
    }

    async rejectWithdrawal(transactionId, reason) {
        return this.makeRequest(
            ApiUrl.WALLET.REJECT_WITHDRAWAL(transactionId),
            {
                method: 'POST',
                body: JSON.stringify({ reason }),
            }
        );
    }

    async processRefund(refundData) {
        return this.makeRequest(ApiUrl.WALLET.PROCESS_REFUND, {
            method: 'POST',
            body: JSON.stringify(refundData),
        });
    }
}

export default new WalletService();
