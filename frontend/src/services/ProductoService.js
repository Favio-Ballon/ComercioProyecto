import apiClient from "./interceptors";

export class ProductoService {
  handleAddToCart = async (productId) => {
    return new Promise((resolve, reject) => {
      apiClient
        .post("carrito/add/", {
          producto: String(productId),
          cantidad: "1",
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al añadir producto al carrito:", error);
          reject(
            new Error("Error al añadir producto al carrito: " + error.message)
          );
        });
    });
  };

  removeFromCart = async (productId) => {
    return new Promise((resolve, reject) => {
      apiClient
        .post("carrito/remove/", {
          producto: String(productId),
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error("Error al eliminar producto del carrito:", error);
          reject(
            new Error(
              "Error al eliminar producto del carrito: " + error.message
            )
          );
        });
    });
  };

  getProductosCarrito = async () => {
    return new Promise((resolve, reject) => {
      apiClient
        .get("carrito/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener productos del carrito:", error);
          reject(
            new Error(
              "Error al obtener productos del carrito: " + error.message
            )
          );
        });
    });
  };

  getOrdenesUsuario = async () => {
    return new Promise((resolve, reject) => {
      apiClient
        .get("pagos/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener órdenes del usuario:", error);
          reject(
            new Error("Error al obtener órdenes del usuario: " + error.message)
          );
        });
    });
  };

  getDetalleOrden = async (ordenId) => {
    return new Promise((resolve, reject) => {
      apiClient
        .get(`pagos/${ordenId}/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener detalle de la orden:", error);
          reject(
            new Error("Error al obtener detalle de la orden: " + error.message)
          );
        });
    });
  };

  getOrdenInfo = async (ordenId) => {
    return new Promise((resolve, reject) => {
      apiClient
        .get(`ordenes/${ordenId}/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener información de la orden:", error);
          reject(
            new Error(
              "Error al obtener información de la orden: " + error.message
            )
          );
        });
    });
  };
}
