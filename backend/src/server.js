import express from "express";
import cors from "cors";
import routes from "./routes/tasks";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/tasks", routes);

// Not found handler
app.use(notFound);
// Error handler
app.use(errorHandler);

export default app;
