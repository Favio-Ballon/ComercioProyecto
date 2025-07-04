import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new AuthService().register(
        data.email,
        data.password,
        data.username,
        data.nombre,
        data.apellidos,
        data.telefono,
        data.direccion
      );
      navigate("/login");
      console.log("Registro exitoso");
    } catch (error) {
      console.error("Error en el registro", error);
      alert("Error al registrar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const campos = [
    { id: "nombre", label: "Nombre", type: "text" },
    { id: "apellidos", label: "Apellidos", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "telefono", label: "Teléfono", type: "text" },
    { id: "direccion", label: "Dirección", type: "text" },
    { id: "username", label: "Nombre de usuario", type: "text" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/30">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Registro
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {campos.map((campo) => (
            <div className="relative" key={campo.id}>
              <input
                type={campo.type}
                id={campo.id}
                {...register(campo.id, { required: true })}
                className={`w-full px-4 py-2 border ${
                  errors[campo.id] ? "border-destructive" : "border-input"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-transparent peer placeholder-transparent`}
                placeholder={campo.label}
              />
              <label
                htmlFor={campo.id}
                className="absolute left-4 -top-2.5 bg-card px-1 text-sm text-accent transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm"
              >
                {campo.label}
              </label>
              {errors[campo.id] && (
                <p className="mt-1 text-sm text-destructive">
                  Este campo es requerido
                </p>
              )}
            </div>
          ))}

          {/* Contraseña */}
          <div className="relative">
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-destructive" : "border-input"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-transparent peer placeholder-transparent pr-10`}
              placeholder="Contraseña"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-2.5 bg-card px-1 text-sm text-accent transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm"
            >
              Contraseña
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
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="text-sm text-center text-accent">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-primary hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
