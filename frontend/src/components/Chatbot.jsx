import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const systemInstruction = `Eres un asistente virtual amigable y servicial de "Audioprod", una empresa especializada en soluciones auditivas. Tu único propósito es ayudar a los usuarios con preguntas sobre los siguientes temas:
- Tipos de audífonos para la sordera.
- Pilas y accesorios para audífonos.
- Cómo agendar una consulta auditiva.
- Información sobre los servicios y precios disponibles.
- Información general sobre la pérdida de audición y el cuidado de los audífonos.

Aquí están los servicios que ofrecemos para agendar citas, junto con sus precios:
- **Video Otoscopia**: 50 Bs.
- **Audiometría**: 80 Bs.
- **Logoaudiometría**: 70 Bs.
- **Limpieza**: 40 Bs.

Cuando un usuario pregunte por los servicios o cómo agendar una cita, debes informarle sobre estas opciones y guiarlo para que visite la sección "Servicios" de nuestra página web para completar la reserva.
NO debes responder ninguna pregunta que se salga de estos temas (por ejemplo: política, deportes, clima, historia, chistes, etc.).
Si un usuario te pregunta algo no relacionado, debes declinar amablemente la respuesta y redirigirlo a tus áreas de especialización.

Información adicional:
**Dirección de Audioprod:**  
Edificio Atenas, calle Alicia Suarez, 4to anillo entre Av. Beni y Av. Alemana, Santa Cruz de la Sierra  

Si un usuario pregunta por la ubicación, debes proporcionar esta información y sugerirle que visite la sección "Contacto" de nuestra página web para ver la ubicación en el mapa.

Ejemplo de cómo debes responder a una pregunta fuera de tema:
Usuario: "¿Cuál es la capital de Francia?"
Tu respuesta: "Mi especialidad es ayudarte con todo lo relacionado a la salud auditiva en Audioprod. ¿Tienes alguna consulta sobre nuestros audífonos, servicios o cómo agendar una cita?"`;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente virtual de Audioprod. ¿Cómo puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [dynamicSystemInstruction, setDynamicSystemInstruction] =
    useState(systemInstruction);

  // Manejar clic fuera del chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/comercio/productos/"
        );
        const fetchedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.nombre,
          price: product.precio,
          description: product.descripcion,
          stock: product.stock,
          category: product.categoria.nombre,
          image: product.imagen,
        }));
        setProductos(fetchedProducts);

        // Construir la lista de productos para el systemInstruction
        const productosInfo = fetchedProducts
          .map(
            (p) =>
              `- ${p.name} (${p.category}): ${p.description} - ${p.price} Bs.`
          )
          .join("\n");

        // Actualizar el systemInstruction dinámicamente
        setDynamicSystemInstruction(
          systemInstruction + "\n\nProductos disponibles:\n" + productosInfo
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Si el usuario pregunta por productos
    if (input.toLowerCase().includes("producto")) {
      const productosList = productos
        .map(
          (p) =>
            `- ${p.name} (${p.category}): ${p.description} - ${p.price} Bs.`
        )
        .join("\n");
      const botMessage = {
        role: "assistant",
        content: `Estos son algunos de nuestros productos:\n${productosList}`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsLoading(false);
      return;
    }

    try {
      // Gemini API: chat history must start with a user message
      // Skip the initial assistant message if it's the first message
      let chatHistory = messages;
      if (messages.length > 0 && messages[0].role === "assistant") {
        chatHistory = messages.slice(1);
      }
      const formattedHistory = chatHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: dynamicSystemInstruction,
      });

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      const botMessage = { role: "assistant", content: text };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      const errorMessage = {
        role: "assistant",
        content: "Lo siento, no pude procesar tu solicitud en este momento.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatRef}>
      {/* Botón flotante del chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all duration-300"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Contenedor del chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-card rounded-lg shadow-xl overflow-hidden border border-border flex flex-col h-[60vh]">
          {/* Encabezado del chat */}
          <div className="bg-primary text-primary-foreground p-4">
            <h3 className="font-semibold">Audioprod - Asistente Virtual</h3>
          </div>

          {/* Contenido del chat */}
          <div
            ref={chatBodyRef}
            className="p-4 flex-grow overflow-y-auto bg-background space-y-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
                  <p>Escribiendo...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input del chat */}
          <div className="p-4 border-t border-border bg-background">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-grow p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 disabled:bg-primary/50"
                disabled={isLoading}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
