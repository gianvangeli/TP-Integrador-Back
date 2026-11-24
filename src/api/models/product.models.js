/*============================
    Modelos de producto
============================*/

import connection from "../database/db.js";


// Obtener todos los productos con paginación
const selectAllProducts = (limit = 10, offset = 0) => {

    // Limitamos la cantidad de productos que devuelve MySQL
    const sql = "SELECT * FROM products LIMIT ? OFFSET ?";

    // Ejecutamos la consulta con los valores recibidos
    return connection.query(sql, [limit, offset]);
};


////////////////////////////
// Obtener productos activos
const selectActiveProducts = () => {
    const sql = "SELECT * FROM products WHERE products.active = ?";
    return connection.query(sql, [1]);
}


/////////////////////////////
// Obtener producto por id
const selectProductById = (id) => {
    // Optimizacion 3: Los placeholders "?" evitan ataques de inyeccion SQL, es una manera de hacer consultas SQL mas seguras
    const sql = `SELECT * FROM products WHERE products.id = ?`
    return connection.query(sql, [id]);
}


/////////////////////////////
// Crear producto
const insertNewProduct = (name, image, category, price) => {

    const sql = "INSERT INTO products (name, image, category, price) VALUES (?, ?, ?, ?)";

    return connection.query(sql, [name, image, category, price]);
}


/////////////////////////////
// Modificar producto
const updateProduct = (name, image, price, category, active, id) => {
    
    const sql = "UPDATE products SET name = ?, image = ?, price = ?, category = ?, active = ? WHERE id = ?";

    return connection.query(sql, [name, image, price, category, active, id]);
}


/////////////////////////////

// Desactivar un producto (baja lógica)
const deleteProduct = (id) => {

    // UPDATE modifica un producto sin eliminarlo de la base de datos.
    // active = 0 indica que el producto está desactivado.
    // El ? permite pasar el ID de forma segura.
    const sql = "UPDATE products SET active = 0 WHERE id = ?";

    // Ejecutamos la consulta enviando el ID del producto.
    return connection.query(sql, [id]);
}


// Reactivar un producto desactivado
const activateProduct = (id) => {

    // Cambiamos active a 1 para habilitar el producto.
    // El ? recibe el ID de forma segura.
    const sql = "UPDATE products SET active = 1 WHERE id = ?";

    // Ejecutamos la consulta en MySQL.
    return connection.query(sql, [id]);
}




export default {
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct,
    selectActiveProducts,
    activateProduct // Exportamos la función para reactivar productos
}