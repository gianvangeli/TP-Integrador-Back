
// ==============================
// ELEMENTOS DEL HTML
// ==============================

const productosComida = document.getElementById("productosComida");
const productosBebida = document.getElementById("productosBebida");
const saludoCliente = document.getElementById("saludoCliente");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const infoPagina = document.getElementById("infoPagina");


// ==============================
// DATOS DEL CLIENTE
// ==============================

// Recuperamos el nombre guardado
const nombreCliente = sessionStorage.getItem("nombreCliente");

if (!nombreCliente) {

    // Si no hay cliente, volvemos al inicio
    window.location.replace("/");

} else {

    saludoCliente.textContent =
        `¡Hola ${nombreCliente}! Seleccioná tus productos`;

}


// ==============================
// CARRITO
// ==============================

// Recuperamos el carrito guardado
let carrito = JSON.parse(
    sessionStorage.getItem("carrito") || "[]"
);


// ==============================
// PAGINACIÓN
// ==============================

// Guardamos los productos obtenidos desde MySQL
let todosLosProductos = [];

// Comenzamos en la primera página
let paginaActual = 1;

// Cantidad de productos por página
const productosPorPagina = 6;


// ==============================
// GUARDAR CARRITO
// ==============================

function guardarCarrito() {

    sessionStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// ==============================
// AGREGAR PRODUCTO AL CARRITO
// ==============================

function agregarAlCarrito(producto) {

    // Buscamos si ya existe en el carrito
    const productoExistente = carrito.find(
        item => item.id === producto.id
    );

    if (productoExistente) {

        productoExistente.cantidad += 1;

    } else {

        carrito.push({
            id: producto.id,
            nombre: producto.name,
            precio: Number(producto.price),
            cantidad: 1
        });

    }

    guardarCarrito();

    alert(`${producto.name} agregado al carrito`);

}


// ==============================
// CREAR TARJETA DE PRODUCTO
// ==============================

function crearTarjetaProducto(producto) {

    const tarjeta = document.createElement("article");
    tarjeta.className = "card-producto";

    // Imagen
    const imagen = document.createElement("img");
    imagen.className = "card-img";
    imagen.src = producto.image;
    imagen.alt = producto.name;

    // Nombre
    const nombre = document.createElement("h4");
    nombre.textContent = producto.name;

    // Precio
    const precio = document.createElement("p");
    precio.textContent =
        `$${Number(producto.price).toLocaleString("es-AR")}`;

    // Botón agregar
    const acciones = document.createElement("div");
    acciones.className = "acciones-producto";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Agregar al carrito";

    boton.addEventListener("click", () => {
        agregarAlCarrito(producto);
    });

    acciones.appendChild(boton);

    tarjeta.append(imagen, nombre, precio, acciones);

    return tarjeta;

}


// ==============================
// MOSTRAR PRODUCTOS POR PÁGINA
// ==============================

function mostrarPagina() {

    // Limpiamos las tarjetas anteriores
    productosComida.replaceChildren();
    productosBebida.replaceChildren();

    // Calculamos qué productos mostrar
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;

    // Obtenemos solamente los productos de esta página
    const productosPagina = todosLosProductos.slice(inicio, fin);

    // Separamos las categorías
    productosPagina.forEach(producto => {

        const tarjeta = crearTarjetaProducto(producto);

        if (producto.category === "food") {
            productosComida.appendChild(tarjeta);
        }

        if (producto.category === "drink") {
            productosBebida.appendChild(tarjeta);
        }

    });

    // Calculamos cuántas páginas existen
    const totalPaginas = Math.max(
        1,
        Math.ceil(todosLosProductos.length / productosPorPagina)
    );

    // Mostramos la página actual
    infoPagina.textContent =
        `Página ${paginaActual} de ${totalPaginas}`;

    // Deshabilitamos botones cuando corresponde
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;

}


// ==============================
// BOTÓN ANTERIOR
// ==============================

btnAnterior.addEventListener("click", () => {

    if (paginaActual > 1) {

        paginaActual -= 1;
        mostrarPagina();

    }

});


// ==============================
// BOTÓN SIGUIENTE
// ==============================

btnSiguiente.addEventListener("click", () => {

    const totalPaginas = Math.max(
        1,
        Math.ceil(todosLosProductos.length / productosPorPagina)
    );

    if (paginaActual < totalPaginas) {

        paginaActual += 1;
        mostrarPagina();

    }

});


// ==============================
// CARGAR PRODUCTOS DESDE MYSQL
// ==============================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/api/products/active");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        const datos = await respuesta.json();

        const productos = Array.isArray(datos)
            ? datos
            : datos.payload;

        if (!Array.isArray(productos)) {
            throw new Error("Formato de productos inválido");
        }

        // Guardamos solamente las categorías del autoservicio
        todosLosProductos = productos.filter(producto =>
            producto.category === "food" ||
            producto.category === "drink"
        );

        // Comenzamos desde la primera página
        paginaActual = 1;

        // Mostramos los primeros 6 productos
        mostrarPagina();

    } catch (error) {

        console.error("Error al cargar productos:", error);
        alert("No se pudieron cargar los productos.");

    }

}


// ==============================
// INICIAR PANTALLA
// ==============================

if (nombreCliente) {
    cargarProductos();
}
