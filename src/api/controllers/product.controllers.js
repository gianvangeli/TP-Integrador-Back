/*============================
    Controladores producto
============================*/

import ProductModels from "../models/product.models.js";


/////////////////////////////

// Obtener todos los productos con paginación
export const getAllProducts = async (req, res) => {

    // Manejo de errores con try...catch
    try {

        // Obtenemos la página y el límite desde la URL
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        // Validamos que sean números enteros positivos
        if (!Number.isInteger(page) || page <= 0 ||
            !Number.isInteger(limit) || limit <= 0 || limit > 100) {

            return res.status(400).json({
                message: "La página y el límite deben ser números válidos (límite máximo: 100)"
            });
        }

        // Calculamos cuántos productos debemos saltar
        const offset = (page - 1) * limit;

        // El controlador llama al modelo con los valores de paginación
        const [rows] = await ProductModels.selectAllProducts(limit, offset);

        // Si no encontramos productos, devolvemos 404
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        }

        // Devolvemos los productos y los datos de paginación
        res.status(200).json({
            payload: rows,
            total: rows.length,
            page: page,
            limit: limit
        });

    } catch (error) {

        console.log("Error obteniendo productos:", error);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
};



////////////////////////
// GET active products
export const getActiveProducts = async (req, res) => {
    try {

        // Hacemos el llamado al modelo para obtener productos activos
        const [rows] = await ProductModels.selectActiveProducts();

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos activos"
            });
        }

        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos activos: ", error);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}


/////////////////////////////
// Obtener producto por id
export const getProductById = async (req, res) => {
    // Optimizacion 2: Filtro ids no validos en el middleware validateId

    // Optimizacion 1: Manejo de errores con try ...catch
    try {

        const [rows] = await ProductModels.selectProductById(req.id);

        // Optimizacion 4: Devuelvo codigo 404 si no existe producto con ese id
        if (rows.length === 0) {
            return res.status(404).json({
                message: `No se encontro producto con id ${req.id}`
            });
        }

        // console.log(rows);
        res.status(200).json({
            payload: rows
        })

    } catch (error) {
        console.log("Error obteniendo productos: ", error);

        // 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}



/////////////////////////////
// Crear producto

// Controlador para crear un producto
export const createProduct = async (req, res) => {

    try {

        // Obtenemos los datos enviados desde el formulario
        const { category, name, price } = req.body;

        // Si se subió una imagen, usamos su ruta en el servidor.
        // Si no, utilizamos la URL recibida en el formulario.
        const image = req.file
            ? `/uploads/${req.file.filename}`
            : req.body.image;

        // Guardamos el producto en MySQL
        const [result] = await ProductModels.insertNewProduct(
            name,
            image,
            category,
            price
        );

        // Respondemos con el ID del producto creado
        res.status(201).json({
            message: "Producto creado exitosamente",
            productId: result.insertId
        });

    } catch (error) {

        console.log("Error al crear producto:", error);

        res.status(500).json({
            message: "Error interno al crear producto"
        });

    }
};




// ==============================
// MODIFICAR PRODUCTO
// ==============================

export const modifyProduct = async (req, res) => {

    try {

        // Obtenemos los datos enviados desde el formulario
        const { id, name, price, category, active } = req.body;

        // Convertimos el ID a número
        const productId = Number(id);

        // Validamos que el ID sea un entero positivo
        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                message: "El ID debe ser un número entero positivo"
            });
        }

        // Si se subió una imagen, usamos el archivo nuevo.
        // Si no, conservamos la URL enviada desde el formulario.
        const image = req.file
            ? `/uploads/${req.file.filename}`
            : req.body.image;

        // Actualizamos el producto en MySQL
        const [result] = await ProductModels.updateProduct(
            name,
            image,
            price,
            category,
            active,
            productId
        );

        // Verificamos si existe el producto
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        // Confirmamos que se modificó correctamente
        res.status(200).json({
            message: "Producto actualizado exitosamente"
        });

    } catch (error) {

        console.error("Error al modificar producto:", error);

        res.status(500).json({
            message: "Error interno al modificar productos"
        });

    }
};




/////////////////////////////
// Desactivar un producto
export const removeProduct = async (req, res) => {

    try {
        // Llamamos al modelo para desactivar el producto
        const [result] = await ProductModels.deleteProduct(req.id);

        // Si no existe el producto, devolvemos un error 404
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        // Confirmamos que el producto fue desactivado
        res.status(200).json({
            message: `Producto con id ${req.id} desactivado exitosamente`
        });

    } catch (error) {
        // Mostramos el error en la consola
        console.log("Error desactivando producto:", error);

        res.status(500).json({
            message: "Error interno al desactivar producto"
        });
    }
}



/////////////////////////////
// Reactivar producto
export const activateProduct = async (req, res) => {

    try {

        // Llamamos al modelo para activar el producto por su ID
        const [result] = await ProductModels.activateProduct(req.id);

        // Verificamos si el producto existe
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        // Respondemos que el producto fue activado
        res.status(200).json({
            message: `Producto con id ${req.id} activado exitosamente`
        });

    } catch (error) {

        // Mostramos el error en la consola
        console.log("Error activando producto:", error);

        // Respondemos con un error del servidor
        res.status(500).json({
            message: "Error interno al activar producto"
        });
    }
}
