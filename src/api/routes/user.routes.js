/*======================
    Rutas usuario
======================*/

// Importamos Router de Express
import { Router } from "express";

// Importamos el controlador de usuarios
import { createNewUser } from "../controllers/user.controllers.js";

// Importamos el middleware de autenticación
import { requireLogin } from "../middlewares/middlewares.js";

// Creamos el router
const router = Router();

// POST: Crear un usuario nuevo
// Solamente pueden hacerlo usuarios con sesión iniciada
router.post("/", requireLogin, createNewUser);

// Exportamos las rutas
export default router;