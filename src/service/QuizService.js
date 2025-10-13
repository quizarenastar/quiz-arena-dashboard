import ApiUrl from '../config/ApiUrl.js';

class QuizService {
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

    // Quiz Management
    async getPendingQuizzes() {
        return this.makeRequest(ApiUrl.QUIZZES.PENDING_QUIZZES);
    }

    async approveQuiz(quizId, feedback = '') {
        return this.makeRequest(ApiUrl.QUIZZES.APPROVE_QUIZ(quizId), {
            method: 'POST',
            body: JSON.stringify({ feedback }),
        });
    }

    async rejectQuiz(quizId, reason) {
        return this.makeRequest(ApiUrl.QUIZZES.REJECT_QUIZ(quizId), {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async getAllQuizzes(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.QUIZZES.ALL_QUIZZES}?${queryParams}`
            : ApiUrl.QUIZZES.ALL_QUIZZES;
        return this.makeRequest(url);
    }

    async getQuizDetails(quizId) {
        return this.makeRequest(ApiUrl.QUIZZES.QUIZ_DETAILS(quizId));
    }
}

export default new QuizService();
