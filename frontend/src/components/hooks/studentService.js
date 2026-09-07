import api from '../../api/axios'
export const getStudents = () => {
    return api.get('/students');
};
export const getStudentById = (id) => {
    return api.get(`/students/${id}`);
};
export const createStudent = (data) => {
    return api.post('/students', data);
};
export const updateStudent = (id, data) => {
    return api.put(`/students/${id}`, data);
};
export const deleteStudent = (id) => {
    return api.delete(`/students/${id}`);
};