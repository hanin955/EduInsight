import { api } from '../../api/axios';
const API_ORIGIN = "http://localhost:5000";
export const listMyDocuments = () => api.get('/documents').then((res) => res.data);
export const uploadDocument = (file, title) => {
    const formData = new FormData();
    formData.append('document', file);
    if (title) formData.append('title', title);
    return api
        .post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => res.data);
};
export const uploadSharedDocument = (file, title) => {
    const formData = new FormData();
    formData.append('document', file);
    if (title) formData.append('title', title);
    return api
        .post('/documents/shared', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => res.data);
};
export const listMySharedDocuments = () => api.get('/documents/shared/mine').then((res) => res.data);
export const listSharedDocumentsForStudent = () => api.get('/documents/shared/student').then((res) => res.data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`).then((res) => res.data);
export const getDocumentUrl = (fileName) => `${API_ORIGIN}/uploads/${fileName}`;