import { useState, useEffect } from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Header } from "../components/header";
import { ProductoService } from "../services/ProductoService";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import apiClient from "../services/interceptors";

// ---- Mock Data (reemplaza esto con los datos reales de tu app) ----
const mockCartItems = [
  { id: 1, name: "Audífono Modelo X", price: 1500, quantity: 1 },
  { id: 2, name: "Pilas para audífono (6-pack)", price: 80, quantity: 2 },
];

// -------------------------------------------------------------

// Carga tu clave pública de Stripe desde las variables de entorno.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Carrito = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    getProductosEnCarrito();
  }, []);

  const getProductosEnCarrito = async () => {
    try {
      const results = await new ProductoService().getProductosCarrito();
      const items = [];

      results.forEach((usuario) => {
        usuario.carrito_items.forEach((item) => {
          const producto = item.producto;
          items.push({
            id: producto.id,
            title: producto.nombre,
            author: producto.categoria.nombre,
            price: parseFloat(producto.precio),
            quantity: item.cantidad,
            image: producto.imagen,
          });
        });
      });
      setCartItems(items);
    } catch (error) {
      console.error("Error al cargar los productos del carrito:", error);
    }
  };

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await new ProductoService().removeFromCart(productId);
      console.log("Producto eliminado del carrito:", response);

      if (response.status === 200) {
        setNotification("Producto eliminado del carrito exitosamente.");
        setTimeout(() => setNotification(""), 2500);
      } else {
        setNotification("No se pudo eliminar el producto del carrito.");
        setTimeout(() => setNotification(""), 2500);
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      setNotification("Ocurrió un error al eliminar el producto.");
      setTimeout(() => setNotification(""), 2500);
    }
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    handleRemoveFromCart(id);
    setShowModal(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Paso 1: Crear la orden en tu backend.
      const orderResponse = await apiClient.post(
        "ordenes/crear_desde_carrito/"
      );
      console.log(orderResponse);

      if (orderResponse.status !== 201) {
        const errorData = await orderResponse.data;
        throw new Error(errorData.error || "Error al crear la orden.");
      }

      const orderData = await orderResponse.data;
      const orden_id = orderData.orden_id; // Ajusta esto según la respuesta de tu API

      if (!orden_id) {
        throw new Error("La respuesta del servidor no incluyó un ID de orden.");
      }
      console.log(orden_id);
      // Paso 2: Crear el Payment Intent con el ID de la orden.
      const paymentIntentResponse = await apiClient.post(
        "pagos/create-payment-intent/",
        {
          orden_id: orden_id,
        }
      );
      console.log(paymentIntentResponse);
      if (paymentIntentResponse.status !== 200) {
        const errorData = await paymentIntentResponse.data;
        throw new Error(errorData.error || "Error al iniciar el pago.");
      }

      const paymentData = await paymentIntentResponse.data;
      setPaymentId(paymentData.payment.id);
      console.log(paymentData.clientSecret);
      setClientSecret(paymentData.clientSecret);
      setShowPaymentModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    console.log("Pago exitoso:", paymentIntent);
    setPaymentSuccess(true);
    //limpiar carrito post a comercio/carrito/limpiar/
    const response = await apiClient.post("carrito/limpiar/");
    console.log(response);
    const paymentResponse = await apiClient.post(
      `pagos/${paymentId}/update-status/`
    );
    console.log(paymentResponse);
    setShowPaymentModal(false);
    //wait 5 seconds and then redirect to /comercio/carrito/
    setTimeout(() => {
      setPaymentSuccess(false);
      window.location.href = "/ordenes";
    }, 5000);
    setCartItems([]); // Limpiar el carrito después de un pago exitoso
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 h-screen">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-lg">Tu pago ha sido procesado exitosamente.</p>
        <p className="text-gray-600">
          Recibirás un correo de confirmación pronto.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-13">
          <h1 className="text-heading font-heading text-foreground mb-8">
            Carrito de Compras
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg shadow-sm">
              <p className="text-accent-foreground text-lg">
                Tu carrito está vacío
              </p>
              <p className="text-muted-foreground mt-2">
                ¡Agrega productos para comenzar!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card p-6 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <div className="w-20 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e";
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-heading text-lg text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-accent">{item.author}</p>
                      <p className="text-primary font-semibold mt-2">
                        {item.price} Bs
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-accent hover:text-primary transition-colors"
                        >
                          <FaMinus />
                        </button>
                        <span className="text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-accent hover:text-primary transition-colors"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-destructive hover:text-destructive-foreground transition-colors p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card p-6 rounded-lg shadow-sm sticky top-4">
                  <h2 className="font-heading text-lg text-foreground mb-4">
                    Resumen del Pedido
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-accent">
                      <span>Artículos ({cartItems.length})</span>
                      <span>{calculateTotal().toFixed(2)} Bs</span>
                    </div>
                    <div className="flex justify-between text-accent">
                      <span>Envío</span>
                      <span>Gratis</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-heading text-lg text-foreground">
                        <span>Total</span>
                        <span>{calculateTotal().toFixed(2)} Bs</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartItems.length === 0}
                    onClick={handleCheckout}
                  >
                    {isLoading ? "Procesando..." : "Proceder al Pago"}
                  </button>
                  {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-foreground bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="font-heading text-lg text-foreground mb-4">
                  Confirmar Eliminación
                </h3>
                <p className="text-accent mb-6">
                  ¿Estás seguro de que quieres eliminar {itemToDelete?.title} de
                  tu carrito?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => removeItem(itemToDelete?.id)}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPaymentModal && clientSecret && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentModal(false)}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all animate-fade-in">
          {notification}
        </div>
      )}
    </>
  );
};

export default Carrito;
