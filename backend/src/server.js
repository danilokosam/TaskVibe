import express from "express";
import cors from "cors";
import routes from "./routes/tasks.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
import helmet from "helmet";
import axios from "axios";
import qs from "querystring";
import { userMiddleware } from "./middlewares/userMiddleware.js";
import jwksRsa from "jwks-rsa"; // Importar la librería jwks-rsa
import jwt from "jsonwebtoken"; // Importar la librería jsonwebtoken

dotenv.config();

const app = express();

// Configuración de jwks-rsa para obtener la clave pública de Auth0
const client = jwksRsa({
  jwksUri: `https://dev-mr1efu4j3fgy6iej.us.auth0.com/.well-known/jwks.json`,
});

// Función para obtener la clave pública de Auth0
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.log("Error al obtener la clave pública de Auth0:", err); // Debugging
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    console.log("Clave pública obtenida:", signingKey); // Debugging
    callback(null, signingKey);
  });
}

// Middleware personalizado para validar JWT con RS256
const checkJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado Authorization

  if (!token) {
    console.log("Authorization Header🔧🔧:", req.headers.authorization); // Debugging
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  console.log("Authorization Header🔑🔑:", req.headers.authorization); // Debugging

  // Verificar el JWT usando jsonwebtoken y la clave pública de Auth0
  jwt.verify(
    token,
    getKey,
    {
      audience: "https://my-tasks-api/",
      issuer: "https://dev-mr1efu4j3fgy6iej.us.auth0.com/",
    },
    (err, decoded) => {
      if (err) {
        console.log("Token inválido:", err.message); // Debugging
        return res
          .status(401)
          .json({ error: "Token inválido", details: err.message });
      }
      console.log("Token válido, decoded user:", decoded); // Debugging
      req.user = decoded; // Guardar la información del usuario en la solicitud
      next(); // Continuar con la siguiente ruta o middleware
    }
  );
};

// Configuración de middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Agregar esto justo después de los middlewares básicos
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  next();
});

// Rutas protegidas
app.use("/tasks", checkJwt, userMiddleware, routes);

// Ruta de perfil para ver la información del usuario
app.get("/profile", checkJwt, (req, res) => {
  res.send(req.user); // Mostrar la información del usuario desde el payload del JWT
});

// Ruta principal
app.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user); // Mostrar la información del usuario si está autenticado
  } else {
    res.send("Not logged in");
  }
});

// Modifica tu ruta de login para obtener el tipo correcto de token
app.post("/login", async (req, res) => {
  try {
    const response = await axios.post(
      `https://dev-mr1efu4j3fgy6iej.us.auth0.com/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: "https://my-tasks-api/",
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error obtaining access token" });
  }
});
// Ruta de callback (maneja la respuesta de Auth0 con el código de autorización)
app.get("/callback", async (req, res) => {
  const { code } = req.query; // Obtener el código de autorización de la URL

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
    // Intercambiar el código de autorización por tokens de acceso
    const tokenResponse = await axios.post(
      "https://dev-mr1efu4j3fgy6iej.us.auth0.com/oauth/token",
      qs.stringify({
        client_id: "FPQZJsdfhAJl4kGvhsVdYUB2TMFl4Hp8",
        client_secret: process.env.AUTH0_CLIENT_SECRET, // Usa tu client_secret aquí
        code,
        redirect_uri: "https://literate-fun-insect.ngrok-free.app/callback",
        grant_type: "authorization_code",
      })
    );

    const { access_token, id_token } = tokenResponse.data;
    console.log("Tokens obtenidos:", access_token, id_token);
    res.json({ access_token, id_token }); // Aquí puedes almacenar el token en sesión o en una cookie
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving tokens" });
  }
});

// Ruta de logout (redirige al usuario para cerrar sesión)
app.get("/logout", (req, res) => {
  const logoutUrl =
    `https://dev-mr1efu4j3fgy6iej.us.auth0.com/v2/logout?` +
    `client_id=FPQZJsdfhAJl4kGvhsVdYUB2TMFl4Hp8&` +
    `returnTo=https://literate-fun-insect.ngrok-free.app/`;
  res.redirect(logoutUrl); // Redirigir al usuario para cerrar sesión
});

// Manejador de errores de autenticación
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Invalid token or no token provided",
      details: err.message,
    });
  }
  next(err);
});

// Middleware de errores generales
app.use(notFound);
app.use(errorHandler);

export default app;
