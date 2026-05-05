import api from "../api/api.js";

const chatService = {
  // Channels
  getChannels: () => api.get("/chat/channels"),
  createChannel: (data) => api.post("/chat/channels", data),
  getChannelById: (channelId) => api.get(`/chat/channels/${channelId}`),
  addMemberToChannel: (channelId, userId) => 
    api.put(`/chat/channels/${channelId}/members`, { userId }),
  removeMemberFromChannel: (channelId, userId) => 
    api.delete(`/chat/channels/${channelId}/members/${userId}`),
  deleteChannel: (channelId) => api.delete(`/chat/channels/${channelId}`),

  // Messages
  getMessages: (channelId, params) => 
    api.get(`/chat/channels/${channelId}/messages`, { params }),
  sendMessage: (channelId, data) => 
    api.post(`/chat/channels/${channelId}/messages`, data),
  editMessage: (messageId, data) => 
    api.put(`/messages/${messageId}`, data),
  deleteMessage: (messageId) => 
    api.delete(`/messages/${messageId}`),

  // Notices (CEO)
  sendNotice: (data) => api.post("/chat/notices", data),

  // Private Chats (CEO)
  getEmployees: () => api.get("/chat/employees"),
  sendPrivateMessage: (data) => api.post("/chat/private", data),
  getPrivateChannels: () => api.get("/chat/private/channels"),

  // Search
  searchMessages: (params) => api.get("/chat/search", { params }),
};

export default chatService;
