import { FiShoppingCart, FiMenu, FiX, FiPackage } from "react-icons/fi";
import logo from "../assets/logo_audioprod.webp";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/AuthService";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const location = useLocation();
  const currentSection = location.pathname.split("/")[1];

  return (
    <nav className="bg-card shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              className="h-22 w-auto"
              onClick={() => {
                navigate("/");
              }}
              src={logo}
              alt="Logo"
            />
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                  currentSection === "productos" ? "text-primary" : ""
                }`}
                onClick={() => {
                  navigate("/productos");
                }}
              >
                Productos
              </button>
              <button
                className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                  currentSection === "servicios" ? "text-primary" : ""
                }`}
                onClick={() => {
                  navigate("/servicios");
                }}
              >
                Servicios
              </button>
              <button className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Sobre Nosotros
              </button>
              <button
                className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                  currentSection === "contacto" ? "text-primary" : ""
                }`}
                onClick={() => {
                  navigate("/contacto");
                }}
              >
                Contacto
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="text-foreground hover:text-primary">
                  <FiShoppingCart
                    onClick={() => {
                      navigate("/carrito");
                    }}
                    className={`h-6 w-6 ${
                      currentSection === "carrito" ? "text-primary" : ""
                    }`}
                  />
                </button>
                <button
                  className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                    currentSection === "ordenes" ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    navigate("/ordenes");
                  }}
                >
                  Mis Compras
                </button>
                {/* cerrar sesion */}
                <button
                  className="text-foreground hover:text-primary pl-5"
                  onClick={() => {
                    //eliminar token
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    setIsAuthenticated(false);
                    navigate("/login");
                  }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                  currentSection === "login" ? "text-primary" : ""
                }`}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Iniciar Sesión
              </button>
            )}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary"
              >
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
            <button
              className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                currentSection === "productos" ? "text-primary" : ""
              }`}
              onClick={() => {
                navigate("/productos");
                setIsMenuOpen(false);
              }}
            >
              Productos
            </button>
            <button
              className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                currentSection === "servicios" ? "text-primary" : ""
              }`}
              onClick={() => {
                navigate("/servicios");
                setIsMenuOpen(false);
              }}
            >
              Servicios
            </button>
            <button className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              Sobre Nosotros
            </button>
            <button
              className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                currentSection === "contacto" ? "text-primary" : ""
              }`}
              onClick={() => {
                navigate("/contacto");
                setIsMenuOpen(false);
              }}
            >
              Contacto
            </button>

            {isAuthenticated && (
              <>
                <button
                  className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    currentSection === "carrito" ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    navigate("/carrito");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FiShoppingCart />
                    Carrito
                  </div>
                </button>
                <button
                  className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    currentSection === "ordenes" ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    navigate("/ordenes");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FiPackage />
                    Mis Compras
                  </div>
                </button>
                <button
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    setIsAuthenticated(false);
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Cerrar Sesión
                </button>
              </>
            )}

            {!isAuthenticated && (
              <button
                className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  currentSection === "login" ? "text-primary" : ""
                }`}
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
