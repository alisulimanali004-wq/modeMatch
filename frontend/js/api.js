const API_BASE = 'https://modematch-production.up.railway.app/api';

class ModaMatchAPI {
    static async login(email, password) {
        try {
            console.log('Attempting login:', email);

            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            console.log('Login successful');
            return data;

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            console.log('Attempting registration:', userData.email);

            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            console.log('Registration successful');
            return data;

        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async getOutfitSuggestions(filters) {
        try {
            const response = await fetch(`${API_BASE}/outfits/suggest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(filters)
            });

            return await response.json();
        } catch (error) {
            console.error('Outfit suggestions error:', error);
            throw error;
        }
    }

    static async sendContactMessage(formData) {
        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            return await response.json();
        } catch (error) {
            console.error('Contact message error:', error);
            throw error;
        }
    }

    static async resetPassword(email, newPassword) {
        try {
            const response = await fetch(`${API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, newPassword })
            });

            return await response.json();
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }

    static isLoggedIn() {
        const user = localStorage.getItem('user');
        return user !== null;
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static logout() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    // Get all outfits from database
    static async getAllOutfits() {
        try {
            const response = await fetch(`${API_BASE}/outfits`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Get outfits error:', error);
            throw error;
        }
    }

    // AI Recommendation with full context
    static async getAIRecommendation(data) {
        try {
            const response = await fetch(`${API_BASE}/ai/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('AI recommendation error:', error);
            throw error;
        }
    }
}

function askAIRecommendation() {
    const gender = document.getElementById("gender").value;
    const occasion = document.getElementById("occasion").value;
    const season = document.getElementById("season").value;

    fetch(API_BASE + "/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, occasion, season }),
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("aiResult").innerText =
                "Recommended Outfit: " + data.recommendation;
        });
}

function askAIText() {
    const text = document.getElementById("aiInput").value;

    fetch(API_BASE + "/ai/recommend-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("aiResult").innerText =
                data.recommendation;
        });
}
