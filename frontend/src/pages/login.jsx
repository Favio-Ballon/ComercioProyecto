import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { isLoggedIn } from "../services/AuthService";
import { Header } from "../components/header";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await new AuthService().login(
        data.username,
        data.password
      );
      console.log("Login successful", response);
      const { access, refresh } = response;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      alert("Error en el inicio de sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/30">
        <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-[1.02]">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="username"
                {...register("username", { required: true })}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={`w-full px-4 py-2 border ${
                  errors.username ? "border-destructive" : "border-input"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-transparent peer placeholder-transparent`}
                placeholder="Username"
                aria-label="Username"
              />
              <label
                htmlFor="username"
                className="absolute left-4 -top-2.5 bg-card px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm text-accent"
              >
                Username
              </label>
              {errors.username && (
                <p className="mt-1 text-sm text-destructive">
                  Este campo es requerido
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                id="password"
                {...register("password", { required: true })}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-destructive" : "border-input"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-transparent peer placeholder-transparent`}
                placeholder="Password"
                aria-label="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-card px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm text-accent"
              >
                Password
              </label>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  Este campo es requerido
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? "Ingresando..." : "Login"}
            </button>

            <p className="text-sm text-center text-accent">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="text-primary hover:underline">
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
