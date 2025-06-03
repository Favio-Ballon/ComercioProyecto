import { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import {
  FaHeadphones,
  FaBatteryFull,
  FaCogs,
  FaStethoscope,
  FaTools,
  FaUserMd,
} from "react-icons/fa";
import { Header } from "../components/header";

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const testimonials = [
    {
      name: "María García",
      quote:
        "Los audífonos han cambiado mi vida completamente. Ahora puedo disfrutar de conversaciones con mi familia.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    },
    {
      name: "Juan Pérez",
      quote:
        "El servicio profesional y la atención personalizada fueron excepcionales.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
    {
      name: "Ana Martínez",
      quote:
        "Gracias al centro auditivo, he recuperado mi confianza en situaciones sociales.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    },
  ];

  const brands = [
    "https://scontent.flpb3-1.fna.fbcdn.net/v/t39.30808-6/271287492_133245362486852_2422225584544992567_n.png?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=q5eC0GRAGywQ7kNvwENOxud&_nc_oc=AdmdzsUtZY1Ksf6Tl53Rg_mNX_w6n575ldIiR_cno4CcQxRDOrXbKU4RucpJWvOLZbA&_nc_zt=23&_nc_ht=scontent.flpb3-1.fna&_nc_gid=KbwmOy3v2zwGRYP9l3I3AA&oh=00_AfIBIlpFwcL6kL6twyyEQI4lrKWtr-NY0Y8jd6VhklChYQ&oe=6844F502",
    "https://scontent.flpb3-1.fna.fbcdn.net/v/t39.30808-6/302576337_447996880682548_4577359523770518974_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PXtzi3xxJRcQ7kNvwGsybDv&_nc_oc=AdndAr0XySbBCmhbXZsK3X4EU3ctTj9DpbsCuBsMZwD5kjHBhWEuM5qwoDJw-_874oQ&_nc_zt=23&_nc_ht=scontent.flpb3-1.fna&_nc_gid=Yp6iR8FFIuzmHXAt4APPiA&oh=00_AfJ3auIFt1HctOlii_ynU34Nq9GzLtcbWO-qWBp5OIaiBA&oe=68450E73",
    "data:image/png;base64,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",
    "data:image/png;base64,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",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1590650153855-d9e808231d41"
            alt="Hearing aids"
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
      </div>

      {/* Quick Access Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <div className="grid grid-cols-3 gap-4">
              <button className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaHeadphones className="h-8 w-8 mb-2" />
                <span>Audífonos</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaBatteryFull className="h-8 w-8 mb-2" />
                <span>Pilas</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaCogs className="h-8 w-8 mb-2" />
                <span>Accesorios</span>
              </button>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Servicios</h2>
            <div className="grid grid-cols-3 gap-4">
              <button className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaStethoscope className="h-8 w-8 mb-2" />
                <span>Exámenes</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaUserMd className="h-8 w-8 mb-2" />
                <span>Adaptación</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaTools className="h-8 w-8 mb-2" />
                <span>Mantenimiento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Quiénes Somos
              </h2>
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
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                alt="Equipo profesional"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="bg-card py-16">
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
      </div>

      {/* Brands Distribution */}
      <div className="bg-background py-16">
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
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-8">
            ¿Listo para mejorar tu audición?
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
          >
            Agendar Cita
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contacto
              </h3>
              <p className="text-accent">Email: info@auditorycenter.com</p>
              <p className="text-accent">Teléfono: +1 234 567 890</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-accent hover:text-primary">
                    Productos
                  </button>
                </li>
                <li>
                  <button className="text-accent hover:text-primary">
                    Servicios
                  </button>
                </li>
                <li>
                  <button className="text-accent hover:text-primary">
                    Sobre Nosotros
                  </button>
                </li>
                <li>
                  <button className="text-accent hover:text-primary">
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
                <button className="text-accent hover:text-primary">
                  Facebook
                </button>
                <button className="text-accent hover:text-primary">
                  Twitter
                </button>
                <button className="text-accent hover:text-primary">
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
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors">
                  Suscribir
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-input text-center">
            <p className="text-accent">
              &copy; 2024 Auditory Center. Todos los derechos reservados.
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
