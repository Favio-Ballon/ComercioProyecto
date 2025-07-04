import { useState, useEffect } from "react";
import {
  FaHeadphones,
  FaBatteryFull,
  FaCogs,
  FaStethoscope,
  FaTools,
  FaUserMd,
} from "react-icons/fa";
import { Header } from "../components/header";
import hero from "../assets/hero-optimized.webp";
import beltone from "../assets/beltone-optimized.webp";
import resound from "../assets/resound-optimized.webp";
import duracell from "../assets/duracell-optimized.webp";
import rayovac from "../assets/rayovac-optimized.webp";
import equipo from "../assets/equipo-optimized.webp";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const brands = [beltone, resound, duracell, rayovac];

  useEffect(() => {
    const interval = setInterval(() => {
      // setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={hero}
            alt="Hearing aids"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Mejorando tu Audición,
            <br />
            Mejorando tu Vida
          </h1>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Productos</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Ver productos de audífonos"
              >
                <FaHeadphones className="h-8 w-8 mb-2" />
                <span>Audífonos</span>
              </button>
              <button
                className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Ver productos de pilas"
              >
                <FaBatteryFull className="h-8 w-8 mb-2" />
                <span>Pilas</span>
              </button>
              <button
                className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Ver accesorios"
              >
                <FaCogs className="h-8 w-8 mb-2" />
                <span>Accesorios</span>
              </button>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Servicios</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Ver servicios de exámenes auditivos"
              >
                <FaStethoscope className="h-8 w-8 mb-2" />
                <span>Exámenes</span>
              </button>
              <button
                className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Ver servicios de adaptación de audífonos"
              >
                <FaUserMd className="h-8 w-8 mb-2" />
                <span>Adaptación</span>
              </button>
              <button
                className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Ver servicios de mantenimiento"
              >
                <FaTools className="h-8 w-8 mb-2" />
                <span>Mantenimiento</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Quiénes Somos
          </h2>
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <p className="text-accent mb-4">
                Somos un centro auditivo comprometido con mejorar la calidad de
                vida de nuestros pacientes a través de soluciones auditivas
                innovadoras y personalizadas.
              </p>
              <p className="text-accent">
                Nuestra misión es proporcionar la mejor atención y tecnología en
                salud auditiva, garantizando un servicio profesional y cercano.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <img
                className="rounded-lg shadow-lg"
                src={equipo}
                alt="Equipo profesional"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      {/* <div className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Testimonios
          </h2>
          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={() =>
                  setCurrentSlide(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="absolute left-0 z-10 text-primary hover:text-primary-foreground"
              >
                <BsChevronLeft className="h-8 w-8" />
              </button>
              <div className="text-center px-12">
                <img
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-lg text-accent mb-4">
                  {testimonials[currentSlide].quote}
                </p>
                <p className="font-semibold text-foreground">
                  {testimonials[currentSlide].name}
                </p>
              </div>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % testimonials.length)
                }
                className="absolute right-0 z-10 text-primary hover:text-primary-foreground"
              >
                <BsChevronRight className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Brands Distribution */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Marcas Distribuidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <img
                key={index}
                src={brand}
                alt="Brand logo"
                className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-8">
            ¿Listo para mejorar tu audición?
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
            aria-label="Abrir formulario para agendar cita"
          >
            Agendar Cita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card" aria-label="Pie de página">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="sr-only">Información de pie de página</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contacto
              </h3>
              <p className="text-accent">Email: audioprod@gmail.com</p>
              <p className="text-accent">Teléfono: 76650703</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    className="text-accent hover:text-primary"
                    aria-label="Ir a página de productos"
                  >
                    Productos
                  </button>
                </li>
                <li>
                  <button
                    className="text-accent hover:text-primary"
                    aria-label="Ir a página de servicios"
                  >
                    Servicios
                  </button>
                </li>
                <li>
                  <button
                    className="text-accent hover:text-primary"
                    aria-label="Ir a página sobre nosotros"
                  >
                    Sobre Nosotros
                  </button>
                </li>
                <li>
                  <button
                    className="text-accent hover:text-primary"
                    aria-label="Ir a página de contacto"
                  >
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Redes Sociales
              </h3>
              <div className="flex space-x-4">
                <button
                  className="text-accent hover:text-primary"
                  aria-label="Visitar página de Facebook"
                >
                  Facebook
                </button>
                <button
                  className="text-accent hover:text-primary"
                  aria-label="Visitar página de Twitter"
                >
                  Twitter
                </button>
                <button
                  className="text-accent hover:text-primary"
                  aria-label="Visitar página de Instagram"
                >
                  Instagram
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Newsletter
              </h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-4 py-2 rounded-l-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
                  aria-label="Suscribirse al newsletter"
                >
                  Suscribir
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-input text-center">
            <p className="text-accent">
              &copy; 2025 Audioprod. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Agendar Cita
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Mensaje"
                rows="4"
                className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-accent hover:text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
