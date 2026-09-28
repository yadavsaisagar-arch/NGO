import api from './api';

export const emergencyService = {
  // Create emergency request
  createRequest: async (requestData) => {
    const response = await api.post('/emergency', requestData);
    return response.data;
  },

  // Get user's own emergency requests
  getMyRequests: async () => {
    const response = await api.get('/emergency/my');
    return response.data;
  },

  // Get single request by ID
  getRequestById: async (id) => {
    const response = await api.get(`/emergency/${id}`);
    return response.data;
  },

  // Admin: Get all emergency requests with optional filters
  getAllRequestsAdmin: async (params = {}) => {
    const response = await api.get('/admin/emergency', { params });
    return response.data;
  },

  // Admin: Update request status
  updateStatusAdmin: async (id, status) => {
    const response = await api.patch(`/admin/emergency/${id}/status`, { status });
    return response.data;
  },
};

export default emergencyService;
