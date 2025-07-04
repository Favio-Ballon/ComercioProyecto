import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { ProductoService } from "../services/ProductoService";
import { isLoggedIn } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    cargarOrdenes();
  }, [navigate]);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const ordenesData = await new ProductoService().getOrdenesUsuario();
      console.log("Órdenes cargadas:", ordenesData);
      setOrdenes(ordenesData);
    } catch (err) {
      setError("Error al cargar las órdenes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const verDetalleOrden = async (ordenId) => {
    try {
      const detalle = await new ProductoService().getDetalleOrden(ordenId);
      console.log("Detalle de la orden:", detalle);
      setSelectedOrden(detalle);
      setShowModal(true);
    } catch (err) {
      setError("Error al cargar el detalle de la orden: " + err.message);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoColor = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
      case "canceled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getEstadoTexto = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return "Completado";
      case "pending":
        return "Pendiente";
      case "failed":
        return "Fallido";
      case "canceled":
        return "Cancelado";
      default:
        return status || "Desconocido";
    }
  };

  const getEstadoIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return <FiCheckCircle className="h-4 w-4" />;
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "failed":
      case "canceled":
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiPackage className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto mt-13">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-13">
          <div className="flex items-center gap-3 mb-8">
            <FiPackage className="h-8 w-8 text-primary" />
            <h1 className="text-heading font-heading text-foreground">
              Mis Compras
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {ordenes.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg shadow-sm">
              <FiPackage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-accent-foreground text-lg">
                No tienes compras aún
              </p>
              <p className="text-muted-foreground mt-2">
                ¡Realiza tu primera compra para ver tu historial aquí!
              </p>
              <button
                onClick={() => navigate("/productos")}
                className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {ordenes.map((pago) => (
                <div
                  key={pago.id}
                  className="bg-card p-6 rounded-lg shadow-sm border border-border"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-heading text-lg text-foreground">
                          Compra #{pago.orden}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getEstadoColor(
                            pago.status
                          )}`}
                        >
                          {getEstadoIcon(pago.status)}
                          {getEstadoTexto(pago.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-muted-foreground" />
                          <span className="text-accent">
                            {formatearFecha(pago.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-muted-foreground" />
                          <span className="text-accent font-medium">
                            {parseFloat(pago.amount).toFixed(2)} {pago.currency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="text-muted-foreground" />
                          <span className="text-accent">
                            ID: {pago.payment_intent_id?.slice(-8) || "N/A"}
                          </span>
                        </div>
                      </div>

                      {pago.error_message && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-700 text-sm">
                            <strong>Error:</strong> {pago.error_message}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => verDetalleOrden(pago.id)}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <FiEye />
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Orden */}
      {showModal && selectedOrden && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading text-foreground">
                  Detalle de Compra #{selectedOrden.orden}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Información del Pago */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      {getEstadoIcon(selectedOrden.status)}
                      {getEstadoTexto(selectedOrden.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de Creación
                    </p>
                    <p className="font-medium text-foreground">
                      {formatearFecha(selectedOrden.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monto</p>
                    <p className="font-medium text-foreground">
                      {parseFloat(selectedOrden.amount).toFixed(2)}{" "}
                      {selectedOrden.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Moneda</p>
                    <p className="font-medium text-foreground">
                      {selectedOrden.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID de Pago</p>
                    <p className="font-medium text-foreground text-sm">
                      {selectedOrden.payment_intent_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Última Actualización
                    </p>
                    <p className="font-medium text-foreground">
                      {formatearFecha(selectedOrden.updated_at)}
                    </p>
                  </div>
                </div>

                {/* Información de la Orden */}
                {selectedOrden.orden && (
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-4">
                      Información de la Orden
                    </h3>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-foreground">
                        <strong>ID de Orden:</strong> {selectedOrden.orden}
                      </p>
                      {/* Aquí puedes agregar más información de la orden si está disponible */}
                    </div>
                  </div>
                )}

                {/* Mensaje de Error */}
                {selectedOrden.error_message && (
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-4">
                      Información del Error
                    </h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700">
                        <strong>Error:</strong> {selectedOrden.error_message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ordenes;
