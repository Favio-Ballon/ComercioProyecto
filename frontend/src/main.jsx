import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Register service worker for caching
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Lazy load all page components
const App = lazy(() => import("./pages/home"));
const Productos = lazy(() => import("./pages/productos"));
const Carrito = lazy(() => import("./pages/carrito"));
const Citas = lazy(() => import("./pages/citas"));
const LoginForm = lazy(() => import("./pages/login"));
const RegisterForm = lazy(() => import("./pages/register"));
const Ordenes = lazy(() => import("./pages/ordenes"));
const Layout = lazy(() => import("./components/Layout"));
const Contacto = lazy(() => import("./pages/contacto"));

// Performance monitor (only in development)
const PerformanceMonitor = lazy(() =>
  import("./components/PerformanceMonitor")
);

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <App />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/productos",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <Productos />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/carrito",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <Carrito />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/servicios",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <Citas />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/contacto",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <Contacto />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginForm />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RegisterForm />
      </Suspense>
    ),
  },
  {
    path: "/ordenes",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <Ordenes />
        </Layout>
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {process.env.NODE_ENV === "development" && (
      <Suspense fallback={null}>
        <PerformanceMonitor />
      </Suspense>
    )}
    <RouterProvider router={router} />
  </StrictMode>
);
