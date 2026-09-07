import { api } from '../../api/axios';
export const getRecommendations = (studentId) =>
    api.get(`/recommendations/student/${studentId}`).then((response) => response.data);
export const generateRecommendations = (studentId) =>
    api.post('/recommendations/generate', { studentId }).then((response) => response.data);
export const markRecommendationAsRead = (id) =>
    api.put(`/recommendations/${id}/read`).then((response) => response.data);
export const markAllRecommendationsAsRead = (studentId) =>
    api.put('/recommendations/read-all', { studentId }).then((response) => response.data);