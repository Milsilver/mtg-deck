import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (email: string, password: string) =>
        api.post('/auth/register', { email, password }),
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
};

export const deckAPI = {
    getAll: (userId: string) => api.get(`/decks?userId=${userId}`),
    getOne: (id: string) => api.get(`/decks/${id}`),
    create: (data: any) => api.post('/decks', data),
    update: (id: string, data: any) => api.put(`/decks/${id}`, data),
    delete: (id: string) => api.delete(`/decks/${id}`),
    addCard: (deckId: string, data: any) => api.post(`/decks/${deckId}/cards`, data),
    removeCard: (deckId: string, cardId: string) =>
        api.delete(`/decks/${deckId}/cards/${cardId}`),
};

export const folderAPI = {
    getAll: (userId: string) => api.get(`/folders?userId=${userId}`),
    create: (data: any) => api.post('/folders', data),
    update: (id: string, data: any) => api.put(`/folders/${id}`, data),
    delete: (id: string) => api.delete(`/folders/${id}`),
};

export const cardAPI = {
    search: (query: string) => api.get(`/cards/search?q=${query}`),
    getOne: (id: string) => api.get(`/cards/${id}`),
    fetch: (scryfallId: string) => api.post('/cards/fetch', { scryfallId }),
};

export default api;
