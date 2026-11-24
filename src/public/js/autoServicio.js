
// ==============================
// ELEMENTOS DEL HTML
// ==============================

const formBienvenida = document.getElementById("formBienvenida");
const bienvenida = document.getElementById("bienvenida");
const catalogo = document.getElementById("catalogo");

const productosComida = document.getElementById("productosComida");
const productosBebida = document.getElementById("productosBebida");

// Elementos del carrito
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");

// Elementos del ticket
const seccionTicket = document.getElementById("seccionTicket");
const ticketNumero = document.getElementById("ticketNumero");
const ticketCliente = document.getElementById("ticketCliente");
const ticketFecha = document.getElementById("ticketFecha");
const ticketProductos = document.getElementById("ticketProductos");
const ticketTotal = document.getElementById("ticketTotal");

const btnDescargarTicket = document.getElementById("btnDescargarTicket");
const btnNuevaCompra = document.getElementById("btnNuevaCompra");

// Datos del cliente y carrito
let nombreCliente = "";
let carrito = [];

// Evitamos enviar la misma compra varias veces
let procesandoCompra = false;


// ==============================
// AGREGAR PRODUCTOS AL CARRITO
// ==============================

function agregarAlCarrito(producto) {

    // Buscamos si el producto ya está agregado
    const productoExistente = carrito.find(
        item => item.id === producto.id
    );

    if (productoExistente) {

        // Si existe, aumentamos la cantidad
        productoExistente.cantidad += 1;

    } else {

        // Si no existe, lo agregamos
        carrito.push({
            id: producto.id,
            nombre: producto.name,
            precio: Number(producto.price),
            cantidad: 1
        });
    }

    mostrarCarrito();
}


// ==============================
// MODIFICAR CANTIDAD
// ==============================

function cambiarCantidad(id, cambio) {

    // Buscamos el producto
    const producto = carrito.find(item => item.id === id);

    if (!producto) return;

    // Modificamos la cantidad
    producto.cantidad += cambio;

    // Si llega a cero, lo eliminamos
    if (producto.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    mostrarCarrito();
}


// ==============================
// ELIMINAR PRODUCTO
// ==============================

function eliminarDelCarrito(id) {

    // Quitamos el producto del carrito
    carrito = carrito.filter(item => item.id !== id);

    mostrarCarrito();
}


// ==============================
// MOSTRAR CARRITO
// ==============================

function mostrarCarrito() {

    // Limpiamos el contenido anterior
    listaCarrito.replaceChildren();

    if (carrito.length === 0) {

        const mensaje = document.createElement("p");
        mensaje.textContent = "Tu carrito está vacío.";

        listaCarrito.appendChild(mensaje);

        totalCarrito.textContent = "0";
        btnConfirmarCompra.disabled = true;

        return;
    }

    let total = 0;

    // Recorremos los productos
    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const fila = document.createElement("div");
        fila.className = "item-carrito";

        // Nombre y subtotal
        const descripcion = document.createElement("p");

        descripcion.textContent =
            `${producto.nombre} - $${subtotal.toLocaleString("es-AR")}`;

        // Botón disminuir
        const btnMenos = document.createElement("button");
        btnMenos.type = "button";
        btnMenos.textContent = "−";

        btnMenos.addEventListener("click", () => {
            cambiarCantidad(producto.id, -1);
        });

        // Cantidad
        const cantidad = document.createElement("span");
        cantidad.textContent = ` ${producto.cantidad} `;

        // Botón aumentar
        const btnMas = document.createElement("button");
        btnMas.type = "button";
        btnMas.textContent = "+";

        btnMas.addEventListener("click", () => {
            cambiarCantidad(producto.id, 1);
        });

        // Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        });

        fila.append(
            descripcion,
            btnMenos,
            cantidad,
            btnMas,
            btnEliminar
        );

        listaCarrito.appendChild(fila);
    });

    // Mostramos el total
    totalCarrito.textContent = total.toLocaleString("es-AR");

    // Habilitamos la compra si no está procesándose
    btnConfirmarCompra.disabled = procesandoCompra;
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
// CARGAR PRODUCTOS DESDE MYSQL
// ==============================

async function cargarProductos() {

    try {

        // Consultamos los productos activos
        const respuesta = await fetch("/api/products/active");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        const datos = await respuesta.json();

        // La API puede devolver un array o un payload
        const productos = Array.isArray(datos)
            ? datos
            : datos.payload;

        if (!Array.isArray(productos)) {
            throw new Error("Formato de productos inválido");
        }

        productosComida.replaceChildren();
        productosBebida.replaceChildren();

        // Creamos las tarjetas
        productos.forEach(producto => {

            const tarjeta = crearTarjetaProducto(producto);

            if (producto.category === "food") {
                productosComida.appendChild(tarjeta);
            }

            if (producto.category === "drink") {
                productosBebida.appendChild(tarjeta);
            }
        });

    } catch (error) {

        console.error("Error al cargar productos:", error);

        alert("No se pudieron cargar los productos.");
    }
}


// ==============================
// PANTALLA DE BIENVENIDA
// ==============================

formBienvenida.addEventListener("submit", async (event) => {

    // Evitamos recargar la página
    event.preventDefault();

    // Obtenemos el nombre del cliente
    nombreCliente = document.getElementById("nombreCliente").value.trim();

    if (nombreCliente.length === 0) {
        alert("Por favor, ingresá tu nombre");
        return;
    }

    // Ocultamos bienvenida y mostramos catálogo
    bienvenida.hidden = true;
    catalogo.hidden = false;

    // Saludo personalizado
    catalogo.querySelector("h2").textContent =
        `¡Hola ${nombreCliente}! Seleccioná tus productos`;

    // Cargamos los productos
    await cargarProductos();
});


// ==============================
// MOSTRAR TICKET DE COMPRA
// ==============================

function mostrarTicket(ventaRegistrada) {

    // Número de venta
    ticketNumero.textContent = ventaRegistrada.saleId;

    // Nombre del cliente
    ticketCliente.textContent = nombreCliente;

    // Fecha y hora
    ticketFecha.textContent = new Date().toLocaleString("es-AR");

    // Limpiamos el detalle anterior
    ticketProductos.replaceChildren();

    // Agregamos los productos comprados
    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        const detalle = document.createElement("p");

        detalle.textContent =
            `${producto.nombre} x ${producto.cantidad} - ` +
            `$${subtotal.toLocaleString("es-AR")}`;

        ticketProductos.appendChild(detalle);
    });

    // Total confirmado por el backend
    ticketTotal.textContent =
        Number(ventaRegistrada.totalPrice).toLocaleString("es-AR");

    // Ocultamos el catálogo y mostramos el ticket
    catalogo.hidden = true;
    seccionTicket.hidden = false;
}


// ==============================
// CONFIRMAR COMPRA
// ==============================

btnConfirmarCompra.addEventListener("click", async () => {

    // Evitamos compras duplicadas
    if (procesandoCompra) return;

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // Confirmación del cliente
    const confirmar = confirm(
        `${nombreCliente}, ¿querés confirmar tu compra?`
    );

    if (!confirmar) return;

    // Preparamos la venta para nuestra API
    const venta = {

        user_name: nombreCliente,

        products: carrito.map(producto => ({
            product_id: Number(producto.id),
            quantity: producto.cantidad
        }))
    };

    procesandoCompra = true;
    btnConfirmarCompra.disabled = true;

    try {

        // Enviamos la venta al backend
        const respuesta = await fetch("/api/sales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(venta)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.message || "Error al registrar la venta"
            );
        }

        // Datos que devuelve el backend
        const ventaRegistrada = datos.payload;

        if (
            !ventaRegistrada ||
            ventaRegistrada.saleId == null ||
            !Number.isFinite(Number(ventaRegistrada.totalPrice))
        ) {
            alert(
                "La venta fue registrada, pero no se pudo mostrar " +
                "el comprobante. Revisá la respuesta del servidor."
            );

            return;
        }

        // Mostramos el ticket antes de vaciar el carrito
        mostrarTicket(ventaRegistrada);

        // Vaciamos el carrito
        carrito = [];

        // Actualizamos la pantalla
        mostrarCarrito();

    } catch (error) {

        console.error("Error al confirmar la compra:", error);
        alert(error.message);

    } finally {

        procesandoCompra = false;
        btnConfirmarCompra.disabled = carrito.length === 0;
    }
});


// ==============================
// DESCARGAR TICKET EN PDF
// ==============================

btnDescargarTicket.addEventListener("click", () => {

    // Verificamos que jsPDF esté cargado
    if (!window.jspdf) {
        alert("No se pudo cargar la librería para generar el PDF");
        return;
    }

    // Creamos el documento PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Obtenemos los datos del ticket
    const numero = ticketNumero.textContent;
    const cliente = ticketCliente.textContent;
    const fecha = ticketFecha.textContent;
    const total = ticketTotal.textContent;

    // Título
    pdf.setFontSize(18);
    pdf.text("TICKET DE COMPRA", 20, 20);

    // Datos de la venta
    pdf.setFontSize(12);

    pdf.text(`Venta N.: ${numero}`, 20, 35);
    pdf.text(`Cliente: ${cliente}`, 20, 45);
    pdf.text(`Fecha: ${fecha}`, 20, 55);

    // Línea separadora
    pdf.line(20, 65, 190, 65);

    // Detalle de productos
    pdf.text("Productos:", 20, 75);

    let posicionY = 85;

    ticketProductos.querySelectorAll("p").forEach(producto => {

        // Dividimos textos largos en varias líneas
        const lineas = pdf.splitTextToSize(
            producto.textContent,
            165
        );

        // Agregamos otra página si es necesario
        if (posicionY + lineas.length * 7 > 270) {
            pdf.addPage();
            posicionY = 20;
        }

        pdf.text(lineas, 20, posicionY);

        posicionY += lineas.length * 7 + 5;
    });

    // Total de la compra
    if (posicionY > 265) {
        pdf.addPage();
        posicionY = 20;
    }

    pdf.line(20, posicionY, 190, posicionY);

    posicionY += 12;

    pdf.setFontSize(15);
    pdf.text(`TOTAL: $${total}`, 20, posicionY);

    // Descargamos el PDF
    pdf.save(`ticket_venta_${numero}.pdf`);
});


// ==============================
// NUEVA COMPRA
// ==============================

btnNuevaCompra.addEventListener("click", () => {

    // Limpiamos el carrito
    carrito = [];

    // Limpiamos el nombre
    nombreCliente = "";

    // Reiniciamos el formulario
    formBienvenida.reset();

    // Actualizamos el carrito
    mostrarCarrito();

    // Ocultamos el ticket y el catálogo
    seccionTicket.hidden = true;
    catalogo.hidden = true;

    // Volvemos a pedir el nombre del cliente
    bienvenida.hidden = false;
});


