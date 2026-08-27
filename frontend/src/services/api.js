import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const BusinessService = {
  getBusinesses: async () => {
    const res = await api.get('/businesses');
    return res.data;
  },
  createBusiness: async (data) => {
    const res = await api.post('/businesses', data);
    return res.data;
  },
  seedDemoData: async () => {
    const res = await api.post('/businesses/seed-demo');
    return res.data;
  }
};

export const FeedbackService = {
  getFeedback: async (params = {}) => {
    const res = await api.get('/feedback', { params });
    return res.data;
  },
  submitSingle: async (data) => {
    const res = await api.post('/feedback/single', data);
    return res.data;
  },
  analyzeText: async (data) => {
    const res = await api.post('/feedback/analyze', data);
    return res.data;
  },
  uploadCsv: async (file, businessId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (businessId) {
      formData.append('business_id', businessId);
    }
    const res = await api.post('/feedback/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  fetchGoogleReviews: async (data) => {
    const res = await api.post('/feedback/fetch-google', data);
    return res.data;
  },
  deleteFeedback: async (id) => {
    const res = await api.delete(`/feedback/${id}`);
    return res.data;
  }
};

export const AnalyticsService = {
  getSummary: async (businessId = null) => {
    const params = businessId ? { business_id: businessId } : {};
    const res = await api.get('/analytics/summary', { params });
    return res.data;
  },
  getTrends: async (businessId = null) => {
    const params = businessId ? { business_id: businessId } : {};
    const res = await api.get('/analytics/sentiment-trend', { params });
    return res.data;
  },
  getTopTopics: async (businessId = null) => {
    const params = businessId ? { business_id: businessId } : {};
    const res = await api.get('/analytics/top-topics', { params });
    return res.data;
  }
};

export default api;
