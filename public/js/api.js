const API_BASE = '/api';

const api = {
    token: localStorage.getItem('token'),

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    async register(email, username, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password })
        });
    },

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async getMe() {
        return this.request('/auth/me');
    },

    // Generic methods for admin panel
    async get(endpoint) {
        return this.request(endpoint);
    },

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    },

    // Courses
    async getCourses() {
        return this.request('/courses');
    },

    async getCourse(id) {
        return this.request(`/courses/${id}`);
    },

    async startCourse(id) {
        return this.request(`/courses/${id}/start`, {
            method: 'POST'
        });
    },

    // Levels
    async getLevel(id) {
        return this.request(`/levels/${id}`);
    },

    // Submissions
    async submitCode(challengeId, code, languageId) {
        return this.request('/submissions', {
            method: 'POST',
            body: JSON.stringify({ challengeId, code, languageId })
        });
    },

    async getSubmissionResult(token) {
        return this.request(`/submissions/${token}`);
    },

    // Users
    async getProfile() {
        return this.request('/users/profile');
    },

    async getLeaderboard(limit = 10) {
        return this.request(`/users/leaderboard?limit=${limit}`);
    }
};
