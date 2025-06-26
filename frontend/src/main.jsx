import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./pages/home";
import { Productos } from "./pages/productos";
import { Carrito } from "./pages/carrito";
import { Citas } from "./pages/citas";
import { LoginForm } from "./pages/login";
import { RegisterForm } from "./pages/register";
import Layout from "./components/Layout";
import Contacto from "./pages/contacto";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: "/productos",
    element: (
      <Layout>
        <Productos />
      </Layout>
    ),
  },
  {
    path: "/carrito",
    element: (
      <Layout>
        <Carrito />
      </Layout>
    ),
  },
  {
    path: "/servicios",
    element: (
      <Layout>
        <Citas />
      </Layout>
    ),
  },
  {
    path: "/contacto",
    element: (
      <Layout>
        <Contacto />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
