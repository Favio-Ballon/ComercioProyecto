import React, { useState } from "react";
import { Header } from "../components/header";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    // Limpiar el formulario
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h1 className="text-4xl font-bold text-primary-foreground text-center">
            Contáctanos
          </h1>
          <p className="mt-4 text-xl text-primary-foreground text-center">
            Estamos aquí para ayudarte con cualquier consulta
          </p>
        </div>
      </div>

      {/* Contact Information and Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <FaEnvelope className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-accent">audioprod@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaPhone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Teléfono</h3>
                    <p className="text-accent">76650703</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Dirección</h3>
                    <p className="text-accent">Edificio Atenas, Alicia Suarez y, Santa Cruz de la Sierra</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaClock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      Horario de Atención
                    </h3>
                    <p className="text-accent">
                      Lunes a Viernes: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-accent">Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Ubicación
              </h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237.4917076277843!2d-63.16605907880327!3d-17.75088967002343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e7da4e23546f%3A0x8b8661f23cec2668!2sCentro%20Auditivo%20Audioprod!5e0!3m2!1ses-419!2sbo!4v1750777795591!5m2!1ses-419!2sbo"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Envíanos un Mensaje
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
