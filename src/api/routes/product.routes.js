
/*======================
    Rutas producto
======================*/

// Importamos Router para crear las rutas de productos
import { Router } from "express";

// Importamos las validaciones y la protección del administrador
import {
    validateId,
    validateProduct,
    requireLogin
} from "../middlewares/middlewares.js";

// Importamos Multer para recibir imágenes
import upload from "../middlewares/upload.js";

// Importamos las funciones de los controladores
import {
    createProduct,
    getActiveProducts,
    getAllProducts,
    getProductById,
    modifyProduct,
    removeProduct,
    activateProduct // Importamos la función para reactivar productos
} from "../controllers/product.controllers.js";

// Creamos el router donde definimos los endpoints
const router = Router();


// GET: Obtener todos los productos
router.get("/", getAllProducts);


// GET: Obtener solamente los productos activos
router.get("/active", getActiveProducts);


// GET: Buscar un producto por su ID
// Primero validamos el ID y después buscamos el producto
router.get("/:id", validateId, getProductById);


// POST: Crear un producto nuevo
router.post(
    "/",
    requireLogin,
    (req, res, next) => {

        // Multer recibe la imagen
        upload.single("imageFile")(req, res, (error) => {

            // Si el archivo supera los 5 MB
            if (error?.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "La imagen no puede superar los 5 MB"
                });
            }

            // Si Multer detecta otro error
            if (error) {
                return res.status(400).json({
                    message: error.message
                });
            }

            // Si todo está bien, continuamos
            next();
        });
    },

    

    // Validamos los datos del producto
    validateProduct,

    // Guardamos el producto en MySQL
    createProduct

);


// PUT: Modificar un producto existente
router.put(
    "/",
    requireLogin,

    // Recibimos una imagen si el usuario seleccionó un archivo
    (req, res, next) => {

        upload.single("imageFile")(req, res, (error) => {

            // Verificamos el tamaño máximo permitido
            if (error?.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "La imagen no puede superar los 5 MB"
                });
            }

            // Verificamos otros errores de Multer
            if (error) {
                return res.status(400).json({
                    message: error.message
                });
            }

            next();
        });
    },

    // Validamos los datos recibidos
    validateProduct,

    // Modificamos el producto en MySQL
    modifyProduct
);

// DELETE: Eliminar un producto por su ID
// Primero validamos el ID y después eliminamos el producto
router.delete("/:id", requireLogin, validateId, removeProduct);


// PATCH: Reactivar un producto por su ID
router.patch("/:id/activate", requireLogin,validateId, activateProduct);



// Exportamos el router para utilizarlo en la aplicación
export default router;
