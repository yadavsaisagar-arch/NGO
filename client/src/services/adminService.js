import api from './api';

export const adminService = {
  // Get aggregated dashboard statistics and recent activities
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get user management list
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
};

export default adminService;
