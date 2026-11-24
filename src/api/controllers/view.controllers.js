/*============================
    Controladores vistas
============================*/

import ProductModels from "../models/product.models.js";

// Vista principal con paginación
export const vistaPrincipal = async (req, res) => {

    try {

        // Obtenemos la página desde la URL. Si no viene, usamos la 1
        const page = Number(req.query.page ?? 1);

        // Mostramos 10 productos por página
        const limit = 10;

        // Validamos que la página sea un número entero positivo
        if (!Number.isInteger(page) || page <= 0) {
            return res.status(400).send("Número de página inválido");
        }

        // Calculamos cuántos productos debemos saltar
        const offset = (page - 1) * limit;

        // Consultamos los productos de la página seleccionada
        const [rows] = await ProductModels.selectAllProducts(limit + 1, offset);

        // Si recibimos más de 10 productos, existe otra página
        const haySiguiente = rows.length > limit;

        // Mostramos solamente los primeros 10 productos
        const productosPagina = rows.slice(0, limit);

        // Enviamos los productos y la página actual a index.ejs
        res.render("index", {
            title: "Principal",
            listaProductos: rows,
            paginaActual: page,
            haySiguiente: haySiguiente
        });

    } catch (error) {

        console.log("Error obteniendo productos:", error);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
};


// Vista consultar
export const vistaConsultar = (req, res) => {
    res.render("get", {
        title: "Consultar"
    });
}


// Vista crear
export const vistaCrear = (req, res) => {
    res.render("post", {
        title: "Crear",
        about: "Crear producto"
    });
}


// Vista crear usuario
export const vistaCrearUser = (req, res) => {
    res.render("createUser", {
        title: "Crear usuario",
        about: "Crear usuario admin"
    });
}



// Vista modificar
export const vistaModificar = (req, res) => {
    res.render("put", {
        title: "Modificar"
    });
}


// Vista eliminar
export const vistaEliminar = (req, res) => {
    res.render("delete", {
        title: "Eliminar"
    });
}


// ==============================
// VISTA HISTORIAL DE VENTAS
// ==============================

export const vistaVentas = (req, res) => {

    // Mostramos la página del historial de ventas
    res.render("ventas");

};
