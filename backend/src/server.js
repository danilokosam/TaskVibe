import express from "express";
import cors from "cors";
import routes from "./routes/tasks.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
import helmet from "helmet";
import axios from "axios";
import qs from "querystring";
import { userMiddleware } from "./middlewares/userMiddleware.js";
import checkJwt from "./middlewares/checkJwt.js";
import rateLimit from "express-rate-limit";
import checkRole from "./middlewares/checkRole.js";
import { startCronJobs } from "./utils/cronJobs.js";

dotenv.config();

const app = express();

// Configuración de middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Limita cada IP a 100 solicitudes por ventana de tiempo
  message: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
});

app.use(limiter); // Aplicar el rate limiter a todas las rutas

// Agregar esto justo después de los middlewares básicos
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  next();
});

// Rutas protegidas
app.use("/tasks", checkJwt, userMiddleware, routes);

// Ruta de perfil para ver la información del usuario
app.get("/profile", checkJwt, checkRole("admin"), (req, res) => {
  res.send(req.user); // Mostrar la información del usuario desde el payload del JWT
});

// Rutas de usuario para asignar admin
app.use("/users", checkJwt, checkRole("admin"), userRoutes);

// Rutas de grupo
app.use("/groups", checkJwt, groupRoutes);

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
      process.env.AUTH0_TOKEN,
      {
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUDIENCE,
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
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
    // Intercambiar el código de autorización por tokens de acceso
    const tokenResponse = await axios.post(
      process.env.AUTH0_TOKEN,
      qs.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: process.env.AUTH0_CALLBACK_URL,
        grant_type: "authorization_code",
      })
    );

    const { access_token, id_token } = tokenResponse.data;
    console.log("Tokens obtenidos:", access_token, id_token);

    // Establecer cookies con los tokens
    res.cookie("id_token", id_token, { httpOnly: false, secure: true });
    res.cookie("access_token", access_token, { httpOnly: true, secure: true });

    res.redirect("/tasks");

    // res.json({ access_token, id_token });
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
  res.redirect(logoutUrl);
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

// Función para limpiar las invitaciones
startCronJobs();

// Middleware de errores generales
app.use(notFound);
app.use(errorHandler);

export default app;
