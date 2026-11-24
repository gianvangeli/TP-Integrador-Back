/*======================
    Middlewares
======================*/

// Middleware logger para analizar por consola todas las solicitudes
const loggerUrl = (req, res, next) => {
    const fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // Damos paso al siguiente middleware o a procesar la response
};


// Middleware de ruta para filtrar ids no validos
const validateId = (req, res, next) => {
    const id = Number(req.params.id); // Convierto a numero el valor pasado en el parametro

    // Si el numero no es un entero o es  <= 0
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "El id debe ser un numero entero positivo"
        });
    }

    req.id = id;
    next(); // Damos paso al siguiente middleware o a la respuesta
}


const validateProduct = (req, res, next) => {

    const categoriasValidas = ["food", "drink"];
    const errores = [];

    // Obtenemos los datos del formulario
    const { name, image, price, category } = req.body;

    // Validamos el nombre
    if (typeof name !== "string" || name.trim().length < 2) {
        errores.push("El nombre debe tener al menos dos caracteres");
    }

    // Aceptamos una imagen subida o una URL
    if (!req.file && (typeof image !== "string" || !image.trim())) {
        errores.push("Debes subir una imagen o ingresar una URL");
    }

    // Convertimos el precio a número
    const precioNumerico = Number(price);

    // Validamos el precio
    if (
        price === "" ||
        price === null ||
        price === undefined ||
        !Number.isFinite(precioNumerico) ||
        precioNumerico <= 0
    ) {
        errores.push("El precio debe ser un número mayor a 0");
    }

    // Validamos la categoría
    if (!categoriasValidas.includes(category)) {
        errores.push("Categoria invalida");
    }

    // Si hay errores, respondemos con HTTP 400
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    // Continuamos con el controlador
    next();
};

// Protegemos las rutas que necesitan una sesión
const requireLogin = (req, res, next) => {

    // Verificamos si el usuario inició sesión
    if (!req.session?.user) {

        // Para la API devolvemos un error JSON
        if (req.originalUrl.startsWith("/api/")) {
            return res.status(401).json({
                message: "Debes iniciar sesión como administrador"
            });
        }

        // Para las vistas redirigimos al login
        return res.redirect("/login");
    }

    // Si está autenticado, permitimos continuar
    next();
};

// Middleware para validar los datos de una venta
const validateSale = (req, res, next) => {

    // Obtenemos el nombre del cliente y los productos
    const { user_name, products } = req.body;

    // Validamos el nombre del cliente
    if (typeof user_name !== "string" || !user_name.trim()) {
        return res.status(400).json({
            message: "El nombre del cliente es obligatorio"
        });
    }

    // Validamos que la venta tenga productos
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            message: "La venta debe tener al menos un producto"
        });
    }

    // Recorremos los productos para validar ID y cantidad
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

    // Si todo es correcto, continuamos al controlador
    next();
};



// Exportamos nuestros middlewares para llevarlos a otros modulos
export {
    loggerUrl,
    validateId,
    validateProduct,
    requireLogin,
    validateSale
}