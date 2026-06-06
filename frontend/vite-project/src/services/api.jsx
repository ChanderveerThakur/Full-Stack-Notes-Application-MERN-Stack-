import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
};

export const notesAPI = {
  getAll: () => api.get("/note"),
  create: (data) => api.post("/note/create", data),
  delete: (id) => api.delete(`/note/${id}`),
};