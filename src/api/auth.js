import axios from "axios";

const api = axios.create({
  baseURL: "https://alzconnect-server.onrender.com/api", // ajusta a tu backend
  withCredentials: true,
});

// login
export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data; // contiene { token, user }
};

// cambiar contraseña
export const changePassword = async (newPassword) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/change-password",
    { newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
};
