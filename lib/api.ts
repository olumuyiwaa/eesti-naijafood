import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API functions
export const bookingAPI = {
    create: (data: any) => api.post('/api/bookings', data),
    checkAvailability: (date: string) => api.get(`/api/bookings/availability?date=${date}`),
    cancel: (bookingRef: string, email: string) => api.delete(`/api/bookings/${bookingRef}`, { data: { email } }),
};

export const cateringAPI = {
    requestQuote: (data: FormData) => api.post('/api/catering/quote', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getPackages: () => api.get('/api/catering/packages'),
};

export const menuAPI = {
    getAll: () => api.get('/api/menu'),
    getCategory: (category: string) => api.get(`/api/menu/${category}`),
    getDishOfWeek: () => api.get('/api/menu/special/dish-of-the-week'),
};

export const eventsAPI = {
    getUpcoming: () => api.get('/api/events/upcoming'),
    getGallery: () => api.get('/api/events/gallery'),
    getAfricanExperience: () => api.get('/api/events/african-experience'),
};

export const contactAPI = {
    send: (data: any) => api.post('/api/contact', data),
    getInfo: () => api.get('/api/contact/info'),
};

export const newsletterAPI = {
    subscribe: (data: any) => api.post('/api/newsletter/subscribe', data),
    unsubscribe: (email: string) => api.post('/api/newsletter/unsubscribe', { email }),
};

export const reviewsAPI = {
    create: (data: any) => api.post('/api/reviews', data),
    getAll: (page = 1, limit = 10) => api.get(`/api/reviews?page=${page}&limit=${limit}`),
    getStats: () => api.get('/api/reviews/stats'),
};