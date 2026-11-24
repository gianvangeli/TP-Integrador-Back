
// ==============================
// ELEMENTOS DEL HTML
// ==============================

const saludoCliente = document.getElementById("saludoCliente");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");


// ==============================
// DATOS GUARDADOS
// ==============================

// Recuperamos el nombre del cliente
const nombreCliente = sessionStorage.getItem("nombreCliente");

// Recuperamos los productos agregados
let carrito = JSON.parse(
    sessionStorage.getItem("carrito") || "[]"
);

// Evitamos registrar una compra dos veces
let procesandoCompra = false;


// ==============================
// VERIFICAR CLIENTE
// ==============================

if (!nombreCliente) {

    // Si no ingresó su nombre, vuelve a bienvenida
    window.location.replace("/");

} else {

    saludoCliente.textContent = `Cliente: ${nombreCliente}`;

}


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
// CALCULAR TOTAL
// ==============================

function calcularTotal() {

    return carrito.reduce((total, producto) => {

        return total + producto.precio * producto.cantidad;

    }, 0);

}


// ==============================
// CAMBIAR CANTIDAD
// ==============================

function cambiarCantidad(id, cambio) {

    const producto = carrito.find(item => item.id === id);

    if (!producto) return;

    producto.cantidad += cambio;

    // Si llega a cero, eliminamos el producto
    if (producto.cantidad <= 0) {

        carrito = carrito.filter(item => item.id !== id);

    }

    guardarCarrito();
    mostrarCarrito();

}


// ==============================
// ELIMINAR PRODUCTO
// ==============================

function eliminarProducto(id) {

    carrito = carrito.filter(item => item.id !== id);

    guardarCarrito();
    mostrarCarrito();

}


// ==============================
// MOSTRAR CARRITO
// ==============================

function mostrarCarrito() {

    listaCarrito.replaceChildren();

    // Si no hay productos, mostramos un mensaje
    if (carrito.length === 0) {

        const mensaje = document.createElement("p");
        mensaje.textContent = "Tu carrito está vacío.";

        listaCarrito.appendChild(mensaje);

        totalCarrito.textContent = "0";
        btnConfirmarCompra.disabled = true;

        return;
    }

    // Mostramos cada producto
    carrito.forEach(producto => {

        const tarjeta = document.createElement("article");

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent =
            `Precio: $${producto.precio.toLocaleString("es-AR")}`;

        const cantidad = document.createElement("p");
        cantidad.textContent = `Cantidad: ${producto.cantidad}`;

        const subtotal = document.createElement("p");
        subtotal.textContent =
            `Subtotal: $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}`;

        // Botón para disminuir cantidad
        const btnMenos = document.createElement("button");
        btnMenos.textContent = "-";

        btnMenos.addEventListener("click", () => {
            cambiarCantidad(producto.id, -1);
        });

        // Botón para aumentar cantidad
        const btnMas = document.createElement("button");
        btnMas.textContent = "+";

        btnMas.addEventListener("click", () => {
            cambiarCantidad(producto.id, 1);
        });

        // Botón para eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", () => {
            eliminarProducto(producto.id);
        });

        tarjeta.append(
            nombre,
            precio,
            cantidad,
            subtotal,
            btnMenos,
            btnMas,
            btnEliminar
        );

        listaCarrito.appendChild(tarjeta);

    });

    // Actualizamos el total
    totalCarrito.textContent =
        calcularTotal().toLocaleString("es-AR");

    btnConfirmarCompra.disabled = procesandoCompra;

}


// ==============================
// CONFIRMAR COMPRA
// ==============================

btnConfirmarCompra.addEventListener("click", async () => {

    // Verificamos que haya productos
    if (carrito.length === 0 || procesandoCompra) {
        return;
    }

    // Pedimos confirmación
    const confirmar = confirm(
        `${nombreCliente}, ¿querés confirmar tu compra?`
    );

    if (!confirmar) return;

    procesandoCompra = true;
    btnConfirmarCompra.disabled = true;

    try {

        // Preparamos los productos para nuestra API
        const productosVenta = carrito.map(producto => ({
            product_id: producto.id,
            quantity: producto.cantidad
        }));

        // Registramos la venta en MySQL
        const respuesta = await fetch("/api/sales", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_name: nombreCliente,
                products: productosVenta
            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.message || "No se pudo registrar la compra"
            );
        }

        // Guardamos la información del ticket
        sessionStorage.setItem("ticket", JSON.stringify({

            numero: datos.payload.saleId,
            cliente: nombreCliente,
            fecha: new Date().toLocaleString("es-AR"),
            productos: carrito,
            total: datos.payload.totalPrice

        }));

        // Vaciamos el carrito después de registrar la venta
        carrito = [];
        guardarCarrito();

        // Vamos a la pantalla del ticket
        window.location.href = "/ticket";

    } catch (error) {

        console.error("Error al confirmar compra:", error);

        alert(error.message);

        procesandoCompra = false;
        mostrarCarrito();

    }

});


// ==============================
// INICIAR CARRITO
// ==============================

if (nombreCliente) {
    mostrarCarrito();
}
