import express from "express";
import compression from "compression";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import process from "process";
import https from "https";
import http from "http";
import { securityConfig, buildCSP, buildHSTS } from "./security-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const HTTP_PORT = securityConfig.ports.http;
const HTTPS_PORT = securityConfig.ports.https;
const NODE_ENV = process.env.NODE_ENV;

// Security Headers Middleware
const securityHeaders = (req, res, next) => {
  // Content Security Policy
  res.setHeader("Content-Security-Policy", buildCSP());

  // X-Frame-Options
  res.setHeader("X-Frame-Options", securityConfig.headers.xFrameOptions);

  // X-Content-Type-Options
  res.setHeader(
    "X-Content-Type-Options",
    securityConfig.headers.xContentTypeOptions
  );

  // X-XSS-Protection
  res.setHeader("X-XSS-Protection", securityConfig.headers.xXSSProtection);

  // Referrer Policy
  res.setHeader("Referrer-Policy", securityConfig.headers.referrerPolicy);

  // Permissions Policy
  res.setHeader("Permissions-Policy", securityConfig.headers.permissionsPolicy);

  next();
};

// Apply security headers to all routes
app.use(securityHeaders);

// Enable compression for all responses
app.use(
  compression({
    level: securityConfig.compression.level,
    threshold: securityConfig.compression.threshold,
  })
);

// Serve static files from the dist directory
app.use(
  express.static(join(__dirname, "dist"), {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Set appropriate cache headers for different file types
      if (path.endsWith(".js") || path.endsWith(".css")) {
        res.setHeader("Cache-Control", securityConfig.cache.staticAssets);
      } else if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", securityConfig.cache.htmlFiles);
      }
    },
  })
);

// Handle client-side routing - serve index.html for all routes
app.get("*", (req, res) => {
  const indexPath = join(__dirname, "dist", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found");
  }
});

// Solo configurar HTTPS en producción
if (NODE_ENV === "production") {
  // Verificar si existen los certificados SSL
  const sslKeyPath = securityConfig.ssl.keyPath;
  const sslCertPath = securityConfig.ssl.certPath;

  if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    // HSTS Middleware (solo para HTTPS en producción)
    app.use((req, res, next) => {
      res.setHeader("Strict-Transport-Security", buildHSTS());
      next();
    });

    // Forzar HTTPS redirigiendo HTTP a HTTPS
    const redirectToHTTPS = (req, res) => {
      res.writeHead(301, {
        Location:
          "https://" +
          req.headers.host.replace(`:${HTTP_PORT}`, `:${HTTPS_PORT}`) +
          req.url,
      });
      res.end();
    };

    // HTTPS server with enhanced security
    const sslOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
      // Additional security options
      minVersion: securityConfig.tls.minVersion,
      maxVersion: securityConfig.tls.maxVersion,
      ciphers: securityConfig.tls.ciphers,
      honorCipherOrder: securityConfig.tls.honorCipherOrder,
    };

    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`✅ Servidor HTTPS seguro en puerto ${HTTPS_PORT}`);
      console.log(
        `🔒 TLS ${securityConfig.tls.minVersion}+ habilitado con cifrado fuerte`
      );
      console.log(`🛡️  Headers de seguridad aplicados`);
      console.log(
        `📊 Compresión habilitada (nivel ${securityConfig.compression.level})`
      );
    });

    // HTTP server solo para redirigir a HTTPS
    http.createServer(redirectToHTTPS).listen(HTTP_PORT, () => {
      console.log(`🔄 Redireccionando HTTP a HTTPS desde puerto ${HTTP_PORT}`);
    });
  } else {
    console.warn(
      "⚠️  Certificados SSL no encontrados. Ejecutando solo servidor HTTP."
    );
    console.warn("   Para HTTPS, crea los certificados en el directorio ssl/");
    console.warn("   Comando para generar certificados de prueba:");
    console.warn("   yarn generate-ssl");
    app.listen(HTTP_PORT, () => {
      console.log(`⚠️  Servidor HTTP NO SEGURO en puerto ${HTTP_PORT}`);
    });
  }
} else {
  // En desarrollo, solo usar HTTP
  console.log("🚀 Ejecutando en modo desarrollo (HTTP)");
  app.listen(HTTP_PORT, () => {
    console.log(`Servidor de desarrollo en http://localhost:${HTTP_PORT}`);
  });
}
