import axios from "axios";
import apiClient from "./interceptors";

export class AuthService {
  login(username, password) {
    return new Promise((resolve, reject) => {
      apiClient
        .post(
          "auth/login/",
          {
            username: username,
            password: password,
          },
          { withCredentials: true }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al iniciar sesión: " + error.message));
        });
    });
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      axios
        .post(
          "http://localhost:8000/auth/refresh/",
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al refrescar el token: " + error.message));
        });
    });
  }

  register(email, password, username, nombre, apellido, telefono, direccion) {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:8000/comercio/auth/register/", {
          email,
          password,
          username,
          nombre,
          apellido,
          telefono,
          direccion,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al registrar el usuario: " + error.message));
        });
    });
  }

  me() {
    return new Promise((resolve, reject) => {
      apiClient
        .get("usuarios/me/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            new Error(
              "Error al obtener la información del usuario: " + error.message
            )
          );
        });
    });
  }
}

export const isLoggedIn = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Token inválido:", error);
    return false;
  }
};
