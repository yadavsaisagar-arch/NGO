import api from './api';

export const volunteerService = {
  // Register or update volunteer profile
  registerVolunteer: async (volunteerData) => {
    const response = await api.post('/volunteers', volunteerData);
    return response.data;
  },

  // Get logged-in user's volunteer profile
  getMyProfile: async () => {
    const response = await api.get('/volunteers/my');
    return response.data;
  },

  // Admin: Get all volunteers
  getAllVolunteersAdmin: async (params = {}) => {
    const response = await api.get('/admin/volunteers', { params });
    return response.data;
  },

  // Admin: Update volunteer status (Active / Inactive)
  updateStatusAdmin: async (id, status) => {
    const response = await api.patch(`/admin/volunteers/${id}/status`, { status });
    return response.data;
  },
};

export default volunteerService;
