// Configuración centralizada de seguridad
import process from "process";

export const securityConfig = {
  // Headers de seguridad
  headers: {
    // Content Security Policy
    csp: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://js.stripe.com",
      ],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:", "http://localhost:8000"],
      "font-src": ["'self'", "data:"],
      "connect-src": [
        "'self'",
        "https://api.stripe.com",
        "https://generativelanguage.googleapis.com",
        "http://localhost:8000",
      ],
      "frame-src": ["https://js.stripe.com", "https://www.google.com"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
    },

    // Otros headers de seguridad
    xFrameOptions: "DENY",
    xContentTypeOptions: "nosniff",
    xXSSProtection: "1; mode=block",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=()",
  },

  // Configuración TLS/SSL
  tls: {
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.3",
    ciphers: [
      "ECDHE-RSA-AES128-GCM-SHA256",
      "ECDHE-RSA-AES256-GCM-SHA384",
      "ECDHE-RSA-AES128-SHA256",
      "ECDHE-RSA-AES256-SHA384",
    ].join(":"),
    honorCipherOrder: true,
  },

  // Configuración HSTS
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true,
  },

  // Configuración de puertos
  ports: {
    http: process.env.HTTP_PORT || 3000,
    https: process.env.HTTPS_PORT || 3001,
  },

  // Configuración de certificados
  ssl: {
    keyPath: "./ssl/key.pem",
    certPath: "./ssl/cert.pem",
  },

  // Configuración de API
  api: {
    timeout: 10000,
    maxRedirects: 5,
    baseURL: {
      development: "http://localhost:8000/comercio/",
      production: "https://localhost:8000/comercio/",
    },
  },

  // Configuración de cache
  cache: {
    staticAssets: "public, max-age=31536000",
    htmlFiles: "no-cache",
  },

  // Configuración de compresión
  compression: {
    level: 6,
    threshold: 1024,
  },
};

// Función para construir CSP string
export const buildCSP = () => {
  const csp = securityConfig.headers.csp;
  return Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
};

// Función para construir HSTS string
export const buildHSTS = () => {
  const hsts = securityConfig.headers.hsts;
  return `max-age=${hsts.maxAge}; includeSubDomains; preload`;
};

// Función para obtener URL base de API según entorno
export const getApiBaseURL = () => {
  const env = process.env.NODE_ENV || "development";
  return securityConfig.api.baseURL[env];
};
