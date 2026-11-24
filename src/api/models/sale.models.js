
/*===========================
    Modelo de ventas
===========================*/

import connection from "../database/db.js";

// Obtener todas las ventas con sus productos
export const selectAllSales = () => {

    const sql = `
        SELECT
            s.id AS sale_id,
            s.date,
            s.user_name,
            s.total_price,
            p.id AS product_id,
            p.name AS product_name,
            ps.quantity
        FROM sales AS s
        INNER JOIN product_sales AS ps
            ON s.id = ps.sale_id
        INNER JOIN products AS p
            ON ps.product_id = p.id
        ORDER BY s.id DESC
    `;

    // Ejecutamos la consulta en MySQL
    return connection.query(sql);
};



// Registrar una nueva venta con sus productos
export const insertNewSale = async (userName, products) => {

    // Obtenemos una conexión del pool
    const db = await connection.getConnection();

    try {

        // Iniciamos una transacción
        await db.beginTransaction();

        let totalPrice = 0;

        // Recorremos los productos para calcular el total
        for (const product of products) {

            // Buscamos el precio real del producto en MySQL
            const [rows] = await db.query(
                "SELECT price FROM products WHERE id = ? AND active = 1",
                [product.product_id]
            );

            // Verificamos que exista y esté activo
            if (rows.length === 0) {
                throw new Error("Producto inexistente o inactivo");
            }

            // Sumamos precio por cantidad
            totalPrice += Number(rows[0].price) * product.quantity;
        }

        // Guardamos la venta
        const [result] = await db.query(
            "INSERT INTO sales (user_name, total_price) VALUES (?, ?)",
            [userName, totalPrice]
        );

        // Obtenemos el ID de la venta creada
        const saleId = result.insertId;

        // Guardamos los productos asociados a la venta
        for (const product of products) {

            await db.query(
                "INSERT INTO product_sales (sale_id, product_id, quantity) VALUES (?, ?, ?)",
                [saleId, product.product_id, product.quantity]
            );
        }

        // Confirmamos todos los cambios
        await db.commit();

        return {
            saleId,
            totalPrice
        };

    } catch (error) {

        // Si ocurre un error, deshacemos la operación
        await db.rollback();
        throw error;

    } finally {

        // Liberamos la conexión para poder reutilizarla
        db.release();
    }
};
