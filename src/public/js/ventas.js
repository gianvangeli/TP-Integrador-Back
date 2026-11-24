
// ==============================
// HISTORIAL DE VENTAS
// ==============================

// Obtenemos el contenedor del HTML
const contenedorVentas = document.getElementById("contenedorVentas");


// ==============================
// CONSULTAR VENTAS
// ==============================

async function cargarVentas() {

    try {

        // Consultamos las ventas desde nuestra API
        const respuesta = await fetch("/api/sales");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las ventas");
        }

        const datos = await respuesta.json();

        // Las ventas vienen dentro de payload
        const ventas = datos.payload;

        if (!Array.isArray(ventas)) {
            throw new Error("Formato de ventas inválido");
        }

        // Limpiamos el contenedor
        contenedorVentas.replaceChildren();

        // Si todavía no hay ventas
        if (ventas.length === 0) {

            const mensaje = document.createElement("p");
            mensaje.textContent = "Todavía no hay ventas registradas.";

            contenedorVentas.appendChild(mensaje);
            return;
        }

        // Agrupamos los productos por número de venta
        const ventasAgrupadas = new Map();

        ventas.forEach(venta => {

            if (!ventasAgrupadas.has(venta.sale_id)) {

                ventasAgrupadas.set(venta.sale_id, {
                    id: venta.sale_id,
                    cliente: venta.user_name,
                    fecha: venta.date,
                    total: Number(venta.total_price),
                    productos: []
                });
            }

            // Agregamos cada producto a su venta
            ventasAgrupadas.get(venta.sale_id).productos.push({
                nombre: venta.product_name,
                cantidad: venta.quantity
            });
        });

        // Mostramos las ventas agrupadas
        ventasAgrupadas.forEach(venta => {

            const tarjeta = document.createElement("article");

            const titulo = document.createElement("h3");
            titulo.textContent = `Venta N.º ${venta.id}`;

            const cliente = document.createElement("p");
            cliente.textContent = `Cliente: ${venta.cliente}`;

            const fecha = document.createElement("p");
            fecha.textContent =
                `Fecha: ${new Date(venta.fecha).toLocaleString("es-AR")}`;

            const total = document.createElement("p");
            total.textContent =
                `Total: $${venta.total.toLocaleString("es-AR")}`;

            // Lista de productos
            const subtitulo = document.createElement("h4");
            subtitulo.textContent = "Productos comprados:";

            const lista = document.createElement("ul");

            venta.productos.forEach(producto => {

                const item = document.createElement("li");

                item.textContent =
                    `${producto.nombre} x ${producto.cantidad}`;

                lista.appendChild(item);
            });

            tarjeta.append(
                titulo,
                cliente,
                fecha,
                subtitulo,
                lista,
                total
            );

            contenedorVentas.appendChild(tarjeta);
        });

    } catch (error) {

        console.error("Error al cargar ventas:", error);

        contenedorVentas.textContent =
            "Ocurrió un error al consultar las ventas.";
    }
}


// ==============================
// EJECUTAR AL CARGAR LA PÁGINA
// ==============================

cargarVentas();
