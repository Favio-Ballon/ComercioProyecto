import axios from "axios";
import { AuthService } from "./AuthService";

// Cliente Axios configurado
const apiClient = axios.create({
  baseURL: "http://localhost:8000/comercio/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Interceptor para agregar token antes de cada solicitud
apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.error("Error en la solicitud a la API:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const authService = new AuthService();
        const newToken = await authService.refreshToken();

        localStorage.setItem("access_token", newToken.access);
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken.access}`;

        return apiClient(originalRequest);
      } catch (authError) {
        console.error("Error al refrescar el token:", authError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(authError);
      }
    }

    console.error("Error en la respuesta de la API:", error.response);
    return Promise.reject(error);
  }
);

export default apiClient;
