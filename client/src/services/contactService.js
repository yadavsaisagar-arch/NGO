import api from './api';

export const contactService = {
  // Submit contact message
  sendMessage: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  // Admin: Get all contact messages
  getAllMessagesAdmin: async (params = {}) => {
    const response = await api.get('/admin/contact', { params });
    return response.data;
  },

  // Admin: Update message status (Read / Archived)
  updateStatusAdmin: async (id, status) => {
    const response = await api.patch(`/admin/contact/${id}/status`, { status });
    return response.data;
  },

  // Admin: Delete message
  deleteMessageAdmin: async (id) => {
    const response = await api.delete(`/admin/contact/${id}`);
    return response.data;
  },
};

export default contactService;
