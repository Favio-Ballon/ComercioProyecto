import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./pages/home";
import { Productos } from "./pages/productos";
import { Carrito } from "./pages/carrito";
import { Citas } from "./pages/citas";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/productos",
    element: <Productos />,
  },
  {
    path: "/carrito",
    element: <Carrito />,
  },
  {
    path: "/citas",
    element: <Citas />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
