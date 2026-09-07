import { api } from './api';
export const getStudents = (params) => api.get('/students', { params }).then((response) => response.data);
export const createStudent = (student) => api.post('/students', student).then((response) => response.data);
export const updateStudent = (id, student) => api.put(`/students/${id}`, student).then((response) => response.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`).then((response) => response.data);