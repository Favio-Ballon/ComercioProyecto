import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo_audioprod.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
              <button className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Servicios
              </button>
              <button className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Sobre Nosotros
              </button>
              <button className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Contacto
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-foreground hover:text-primary">
              <FiShoppingCart className="h-6 w-6" />
            </button>
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
    </nav>
  );
};
