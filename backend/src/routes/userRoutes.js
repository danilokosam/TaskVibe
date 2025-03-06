import express from "express";
import { assignAdminRole } from "../controllers/userController.js";

const router = express.Router();

// Ruta para asignar rol de admin a un usuario
router.put("/assign-admin-role/:userId", assignAdminRole);

export default router;
