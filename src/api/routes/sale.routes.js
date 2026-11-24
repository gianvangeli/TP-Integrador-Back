
/*===========================
    Rutas de ventas
===========================*/

// Importamos Router de Express
import { Router } from "express";

// Importamos los middlewares
import {
    validateSale,
    requireLogin
} from "../middlewares/middlewares.js";

// Importamos los controladores de ventas
import {
    getAllSales,
    createNewSale
} from "../controllers/sale.controllers.js";

// Creamos el router
const router = Router();

// GET: Obtener todas las ventas
// Requiere iniciar sesión
router.get("/", requireLogin, getAllSales);

// POST: Registrar una nueva venta
// Es público, pero validamos los datos recibidos
router.post("/", validateSale, createNewSale);

// Exportamos las rutas
export default router;