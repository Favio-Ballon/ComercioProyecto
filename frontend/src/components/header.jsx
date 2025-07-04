import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
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
    <header className="bg-card shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="h-22 w-auto focus:outline-none"
              aria-label="Ir a la página principal"
              onClick={() => {
                navigate("/");
              }}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <img
                src={logo}
                alt="Logo Auditory Center"
                className="h-22 w-auto"
              />
            </button>
          </div>

          <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="ml-10 flex items-baseline space-x-4">
              <li>
                <button
                  aria-label="Ir a página de productos"
                  role="link"
                  name="productos"
                  className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                    currentSection === "productos" ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    navigate("/productos");
                  }}
                >
                  Productos
                </button>
              </li>
              <li>
                <button
                  aria-label="Ir a página de servicios"
                  role="link"
                  name="servicios"
                  className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                    currentSection === "servicios" ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    navigate("/servicios");
                  }}
                >
                  Servicios
                </button>
              </li>
              <li>
                <button
                  aria-label="Ir a página de sobre nosotros"
                  role="link"
                  name="sobre nosotros"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  aria-label="Ir a página de contacto"
                  role="link"
                  name="contacto"
                  className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                    currentSection === "contacto" ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    navigate("/contacto");
                  }}
                >
                  Contacto
                </button>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  className="text-foreground hover:text-primary"
                  aria-label="Ir al carrito"
                >
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
                  aria-label="Ir a página de mis compras"
                  role="link"
                  name="mis compras"
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
                  aria-label="Cerrar sesión"
                  role="button"
                  name="cerrar sesion"
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
                aria-label="Iniciar sesión"
                role="link"
                name="iniciar sesion"
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
                aria-label="Abrir menú"
                role="button"
                name="menu"
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
        <nav className="md:hidden" aria-label="Navegación móvil">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
            <li>
              <button
                aria-label="Ir a página de productos"
                role="link"
                name="productos"
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
            </li>
            <li>
              <button
                aria-label="Ir a página de servicios"
                role="link"
                name="servicios"
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
            </li>
            <li>
              <button
                aria-label="Ir a página de Sobre Nosotros"
                role="link"
                name="sobre nosotros"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Sobre Nosotros
              </button>
            </li>
            <li>
              <button
                aria-label="Ir a página de contacto"
                role="link"
                name="contacto"
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
            </li>
            <li>
              {isAuthenticated ? (
                <>
                  <button
                    className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    aria-label="Ir al carrito"
                    onClick={() => {
                      navigate("/carrito");
                      setIsMenuOpen(false);
                    }}
                  >
                    Carrito
                  </button>
                  <button
                    aria-label="Ir a página de mis compras"
                    role="link"
                    name="mis compras"
                    className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                      currentSection === "ordenes" ? "text-primary" : ""
                    }`}
                    onClick={() => {
                      navigate("/ordenes");
                      setIsMenuOpen(false);
                    }}
                  >
                    Mis Compras
                  </button>
                  <button
                    aria-label="Cerrar sesión"
                    role="button"
                    name="cerrar sesion"
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
              ) : (
                <button
                  aria-label="Iniciar sesión"
                  role="link"
                  name="iniciar sesion"
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
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
