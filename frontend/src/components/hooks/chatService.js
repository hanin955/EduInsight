import { api } from '../../api/axios';
export const sendMessage = async ({ message, studentId }) => {
    const response = await api.post('/chat', { message, studentId });
    return response.data;
};