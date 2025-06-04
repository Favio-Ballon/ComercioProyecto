import { useState, useEffect } from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Header } from "../components/header";
import { isLoggedIn } from "../services/AuthService";
import { ProductoService } from "../services/ProductoService";

export const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    getProductosEnCarrito();
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
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
                    onClick={() => {
                      if (!isAuthenticated) {
                        alert(
                          "Por favor, inicia sesión para proceder al pago."
                        );
                      }
                    }}
                  >
                    Proceder al Pago
                  </button>
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
