import { api } from '../../api/axios';
export const getUserById = (id) => api.get(`/users/${id}`).then((response) => response.data);
export const listerUtilisateurs = ({ page = 1, limit = 5, role } = {}) => {
    const params = { page, limit };
    if (role) params.role = role;
    return api.get('/users/list', { params }).then((response) => response.data);
};
export const ajouterUtilisateur = (formData) =>
    api
        .post('/users/ajouter', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => response.data);
export const updateUtilisateur = (id, updateData) =>
    api.put(`/users/${id}`, updateData).then((response) => response.data);
export const updateUserAvatar = (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api
        .put(`/users/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => response.data);
};
export const deleteUtilisateur = (id) => api.delete(`/users/${id}`).then((response) => response.data);