import React, { useState, useEffect } from "react";
import { format, isAfter, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import {
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
} from "react-icons/fi";
import { Header } from "../components/header";

export const Citas = () => {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const examTypes = {
    "Video Otoscopia": {
      price: 50,
      duration: "30 min",
      description: "Examen visual del canal auditivo y tímpano",
    },
    Audiometría: {
      price: 80,
      duration: "45 min",
      description: "Evaluación completa de la capacidad auditiva",
    },
    Logoaudiometría: {
      price: 70,
      duration: "40 min",
      description: "Prueba de comprensión del habla",
    },
    Limpieza: {
      price: 40,
      duration: "30 min",
      description: "Limpieza profesional del canal auditivo",
    },
  };

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = "Nombre debe tener al menos 2 caracteres";
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Teléfono debe tener 10 dígitos";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Simulated API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert("Cita agendada con éxito!");
        // Reset form
        setSelectedExam("");
        setSelectedDate("");
        setSelectedTime("");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          notes: "",
        });
      } catch (error) {
        alert("Error al agendar la cita. Por favor intente nuevamente.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-6 md:p-8 mt-10">
          <h1 className="text-heading font-heading text-foreground mb-2">
            Agendar Examen Auditivo
          </h1>
          <p className="text-accent mb-8">
            Selecciona tu examen y agenda tu cita
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Exam Selection */}
            <div className="space-y-4">
              <label className="block text-foreground font-semibold">
                Tipo de Examen
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(examTypes).map(([name, details]) => (
                  <div
                    key={name}
                    onClick={() => setSelectedExam(name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExam === name
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <h3 className="font-semibold text-foreground">{name}</h3>
                    <p className="text-accent text-sm mt-2">
                      {details.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="flex items-center text-accent">
                        <FiClock className="mr-2" />
                        {details.duration}
                      </span>
                      <span className="flex items-center text-primary font-semibold">
                        {details.price} Bs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  min={format(startOfToday(), "yyyy-MM-dd")}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Hora
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-sm ${
                        selectedTime === time
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${
                    errors.fullName ? "border-destructive" : "border-input"
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                  required
                />
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${
                    errors.phone ? "border-destructive" : "border-input"
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                  required
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border ${
                    errors.email ? "border-destructive" : "border-input"
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                  required
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent h-24"
                />
              </div>
            </div>

            {/* Summary */}
            {selectedExam && selectedDate && selectedTime && (
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">
                  Resumen de la Cita
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center text-accent">
                    <FiFileText className="mr-2" />
                    Examen: {selectedExam}
                  </p>
                  <p className="flex items-center text-accent">
                    <FiCalendar className="mr-2" />
                    Fecha:{" "}
                    {format(new Date(selectedDate), "PPP", { locale: es })}
                  </p>
                  <p className="flex items-center text-accent">
                    <FiClock className="mr-2" />
                    Hora: {selectedTime}
                  </p>
                  <p className="flex items-center text-primary font-semibold">
                    <FiDollarSign className="mr-2" />
                    Total: {examTypes[selectedExam].price} Bs
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                !selectedExam || !selectedDate || !selectedTime || isSubmitting
              }
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-primary/90"
            >
              {isSubmitting ? "Procesando..." : "Confirmar Cita"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
