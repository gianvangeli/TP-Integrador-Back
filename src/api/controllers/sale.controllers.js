
/*===========================
    Controladores de ventas
===========================*/

// Importamos la función del modelo
import { selectAllSales, insertNewSale } from "../models/sale.models.js";



// Controlador para consultar todas las ventas
export const getAllSales = async (req, res) => {

    try {

        // Llamamos al modelo para consultar las ventas en MySQL
        const [rows] = await selectAllSales();

        // Devolvemos las ventas en formato JSON
        res.status(200).json({
            message: "Ventas obtenidas correctamente",
            total: rows.length,
            payload: rows
        });

    } catch (error) {

        // Mostramos el error en la consola
        console.log("Error al consultar ventas:", error);

        // Respondemos con un error del servidor
        res.status(500).json({
            message: "Error interno al consultar ventas"
        });

    }
};


// Controlador para registrar una nueva venta
export const createNewSale = async (req, res) => {

    try {

        // Obtenemos el nombre del cliente y los productos
        const { user_name, products } = req.body;

        // Validamos que el nombre sea un texto no vacío
        if (typeof user_name !== "string" || !user_name.trim()) {
            return res.status(400).json({
                message: "El nombre del cliente es obligatorio"
            });
        }

        // Validamos que haya al menos un producto
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "La venta debe tener al menos un producto"
            });
        }

        // Validamos los IDs y las cantidades
        for (const product of products) {

            if (
                !product ||
                !Number.isInteger(product.product_id) ||
                product.product_id <= 0 ||
                !Number.isInteger(product.quantity) ||
                product.quantity <= 0
            ) {
                return res.status(400).json({
                    message: "Los productos deben tener un ID y una cantidad válidos"
                });
            }
        }

        // Llamamos al modelo para guardar la venta
        const result = await insertNewSale(user_name.trim(), products);

        // Respondemos con los datos de la venta creada
        res.status(201).json({
            message: "Venta registrada correctamente",
            payload: result
        });

    } catch (error) {

        console.log("Error al registrar venta:", error);

        res.status(500).json({
            message: "No se pudo registrar la venta"
        });
    }
};

