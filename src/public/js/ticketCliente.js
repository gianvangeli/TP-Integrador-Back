
// ==============================
// ELEMENTOS DEL HTML
// ==============================

const ticketNumero = document.getElementById("ticketNumero");
const ticketCliente = document.getElementById("ticketCliente");
const ticketFecha = document.getElementById("ticketFecha");
const ticketProductos = document.getElementById("ticketProductos");
const ticketTotal = document.getElementById("ticketTotal");

const btnDescargarTicket = document.getElementById("btnDescargarTicket");
const btnNuevaCompra = document.getElementById("btnNuevaCompra");


// ==============================
// RECUPERAR TICKET
// ==============================

// Recuperamos los datos de la compra guardados en el navegador
const ticketGuardado = sessionStorage.getItem("ticket");

let ticket = null;

if (!ticketGuardado) {

    // Si no hay una compra confirmada, volvemos al inicio
    window.location.replace("/");

} else {

    try {
        ticket = JSON.parse(ticketGuardado);
    } catch (error) {
        console.error("Ticket inválido:", error);
        window.location.replace("/");
    }

}


// ==============================
// FORMATEAR PRECIOS
// ==============================

function formatearPrecio(precio) {

    return Number(precio).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


// ==============================
// MOSTRAR TICKET
// ==============================

function mostrarTicket() {

    if (!ticket) return;

    ticketNumero.textContent = ticket.numero;
    ticketCliente.textContent = ticket.cliente;
    ticketFecha.textContent = ticket.fecha;

    ticketTotal.textContent = formatearPrecio(ticket.total);

    // Limpiamos el detalle
    ticketProductos.replaceChildren();

    // Mostramos los productos comprados
    ticket.productos.forEach(producto => {

        const detalle = document.createElement("p");

        const subtotal = producto.precio * producto.cantidad;

        detalle.textContent =
            `${producto.nombre} x${producto.cantidad} - $${formatearPrecio(subtotal)}`;

        ticketProductos.appendChild(detalle);

    });

}


// ==============================
// DESCARGAR TICKET PDF
// ==============================

btnDescargarTicket.addEventListener("click", () => {

    // Verificamos que exista la librería
    if (!window.jspdf) {
        alert("No se pudo cargar la librería para generar el PDF.");
        return;
    }

    if (!ticket) return;

    // Creamos el documento PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(18);
    pdf.text("AUTOSERVICIO", 20, y);

    y += 12;

    pdf.setFontSize(12);
    pdf.text("Ticket de compra", 20, y);

    y += 12;

    pdf.text(`Venta N.: ${ticket.numero}`, 20, y);
    y += 8;

    pdf.text(`Cliente: ${ticket.cliente}`, 20, y);
    y += 8;

    pdf.text(`Fecha: ${ticket.fecha}`, 20, y);
    y += 12;

    pdf.text("DETALLE DE PRODUCTOS", 20, y);
    y += 10;

    // Agregamos los productos al PDF
    ticket.productos.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        const descripcion =
            `${producto.nombre} x${producto.cantidad} - $${formatearPrecio(subtotal)}`;

        // Si llegamos al final de la página, agregamos otra
        if (y > 270) {
            pdf.addPage();
            y = 20;
        }

        // Dividimos textos largos para que entren en el PDF
        const lineas = pdf.splitTextToSize(descripcion, 170);

        pdf.text(lineas, 20, y);

        y += lineas.length * 7;

    });

    if (y > 265) {
        pdf.addPage();
        y = 20;
    }

    y += 10;

    pdf.setFontSize(14);
    pdf.text(
        `TOTAL: $${formatearPrecio(ticket.total)}`,
        20,
        y
    );

    y += 15;

    pdf.setFontSize(11);
    pdf.text("Gracias por tu compra.", 20, y);

    // Descargamos el archivo PDF
    pdf.save(`ticket-venta-${ticket.numero}.pdf`);

});


// ==============================
// NUEVA COMPRA
// ==============================

btnNuevaCompra.addEventListener("click", () => {

    // Eliminamos los datos de la compra anterior
    sessionStorage.removeItem("ticket");
    sessionStorage.removeItem("carrito");
    sessionStorage.removeItem("nombreCliente");

    // Volvemos a la bienvenida
    window.location.href = "/";

});


// ==============================
// INICIAR PANTALLA
// ==============================

if (ticket) {
    mostrarTicket();
}
