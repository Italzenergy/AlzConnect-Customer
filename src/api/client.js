// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://alzconnect-server.onrender.com/api",
});

// Adjunta el token en TODAS las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// --- helpers de auth opcionales ---
export const login = async (email, password) => {
  const { data } = await api.post("/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user)); // <- importante
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
