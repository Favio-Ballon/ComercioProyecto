import apiClient from "./interceptors"; // Asumiendo que tienes un api.js que exporta una instancia de axios configurada

// Esta función llama al endpoint para crear una orden a partir del carrito del usuario.
export const createOrderFromCart = async () => {
  try {
    // El interceptor de Axios se encargará de añadir el token de autorización.
    const response = await apiClient.post(
      "/comercio/ordenes/crear_desde_carrito/"
    );
    // Devuelve la data de la respuesta, que contiene el orden_id.
    // Ej: { mensaje: "...", orden_id: 5, total: 80 }
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear la orden:",
      error.response?.data || error.message
    );
    const errorMessage =
      error.response?.data?.error || "No se pudo crear la orden.";
    throw new Error(errorMessage);
  }
};

// Esta función crea el PaymentIntent de Stripe usando el ID de la orden.
export const createPaymentIntent = async (ordenId) => {
  try {
    const response = await apiClient.post(
      "/api/payments/create_payment_intent/",
      { orden_id: ordenId }
    );
    // Devuelve la data que contiene el clientSecret.
    // Ej: { clientSecret: "pi_...", payment: {...} }
    return response.data;
  } catch (error) {
    console.error(
      "Error al iniciar el pago con Stripe:",
      error.response?.data || error.message
    );
    const errorMessage =
      error.response?.data?.error || "No se pudo iniciar el proceso de pago.";
    throw new Error(errorMessage);
  }
};
