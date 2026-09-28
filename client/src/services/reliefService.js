import api from './api';

export const reliefService = {
  // Add new relief material
  addMaterial: async (materialData) => {
    const response = await api.post('/relief', materialData);
    return response.data;
  },

  // Get aggregated relief statistics from database
  getSummary: async () => {
    const response = await api.get('/relief/summary');
    return response.data;
  },

  // Get user's own contributed materials
  getMyMaterials: async () => {
    const response = await api.get('/relief/my');
    return response.data;
  },

  // Get material by ID
  getMaterialById: async (id) => {
    const response = await api.get(`/relief/${id}`);
    return response.data;
  },

  // Update material
  updateMaterial: async (id, data) => {
    const response = await api.patch(`/relief/${id}`, data);
    return response.data;
  },

  // Delete material
  deleteMaterial: async (id) => {
    const response = await api.delete(`/relief/${id}`);
    return response.data;
  },

  // Admin: Get all materials
  getAllMaterialsAdmin: async (params = {}) => {
    const response = await api.get('/admin/relief', { params });
    return response.data;
  },
};

export default reliefService;
