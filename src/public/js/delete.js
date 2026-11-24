const urlBase = "http://localhost:3001";
const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProductForm");


function mostrarMensaje(tipo, mensaje) {
    contenedorProductos.innerHTML = `
                <p class="mensaje ${tipo}">${mensaje}</p>
            `;
}

// Al hacer click en Consultar, hacemos un callback asincrono para pegarle a http://localhost:3000/api/products/x
getProductForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    // console.log(event.target);

    // Extraemos el valor del campo con id idProd
    const idProd = event.target.idProd.value.trim();
    console.log(idProd); // Vemos por consola el valor de id extraido del <form> para parsarselo a la url en el fetch

    if (!idProd) {
        return mostrarError("Ingresa un id valido");
    }

    try {
        const response = await fetch(`${urlBase}/api/products/${idProd}`);
        console.log(response);

        // Accemos al JSON dentro del cuerpo de la respuesta y lo convertimos a objeto JS
        const data = await response.json();

        // Procesamos respuestas 400 o 500
        if (!response.ok) {
            console.error(data.message);
            return mostrarMensaje("error", data.message);
        }

        const producto = data.payload[0]; // Traigo el primer objeto de mi array (de 1 solo objeto)

        renderizarProducto(producto);

    } catch (error) {
        // Estos errores son errores REALES de red, no capturan 404, 500, etc
        console.error("Error al obtener productos: ", error);
        return mostrarMensaje("error", "Error de conexion con el servidor");
    }
});


// Mostramos el producto y su estado actual
function renderizarProducto(producto) {

    // Comprobamos si el producto está activo
    const estaActivo = producto.active === 1;

    // Elegimos el texto del botón según su estado
    const textoBoton = estaActivo ? "Desactivar" : "Reactivar";

    // Mostramos los datos del producto
    contenedorProductos.innerHTML = `
        <ul class="listados-container">
            <li class="li-listados">
                <img src="${producto.image}" alt="${producto.name}" class="img-listados">
            </li>

            <li class="li-listados">
                ID: ${producto.id} /
                Nombre: ${producto.name} /
                Precio: $${producto.price}
            </li>

            <li class="li-listados">
                Estado: ${estaActivo ? "Activo" : "Inactivo"}
            </li>

            <li class="li-listados">
                <button id="btn-eliminar">${textoBoton}</button>
            </li>
        </ul>
    `;

    // Obtenemos el botón
    const btnEliminar = document.getElementById("btn-eliminar");

    // Ejecutamos la acción al presionar el botón
    btnEliminar.addEventListener("click", () => {

        const confirmacion = confirm(
            `¿Querés ${textoBoton.toLowerCase()} este producto?`
        );

        // Si el usuario cancela, no hacemos nada
        if (!confirmacion) return;

        // Si está activo, lo desactivamos
        if (estaActivo) {
            eliminarProducto(producto.id);
        } else {
            // Si está inactivo, lo reactivamos
            reactivarProducto(producto.id);
        }
    });
}




async function eliminarProducto(id) {
    try {
        const response = await fetch(`${urlBase}/api/products/${id}`, {
            method: "DELETE"
        });

        console.log(response); // Respuesta cruda del servidor

        const data = await response.json(); // Ahora podemos acceder al valor de message

        if (!response.ok) {
            console.error(data.message);
            return mostrarMensaje("error", data.message);
        }

        console.log(data.message);
        return mostrarMensaje("exito", data.message);


    } catch (error) {
        console.error("Erro al eliminar un producto: ", error);
    }
}


// Reactivar un producto desactivado
async function reactivarProducto(id) {

    try {
        // Enviamos una petición PATCH al servidor
        const response = await fetch(
            `${urlBase}/api/products/${id}/activate`,
            {
                method: "PATCH"
            }
        );

        // Convertimos la respuesta a un objeto JavaScript
        const data = await response.json();

        // Verificamos si ocurrió algún error
        if (!response.ok) {
            return mostrarMensaje("error", data.message);
        }

        // Mostramos el mensaje de éxito
        mostrarMensaje("exito", data.message);

    } catch (error) {
        // Mostramos el error si falla la conexión
        console.error("Error al reactivar producto:", error);
        mostrarMensaje("error", "Error de conexión con el servidor");
    }
}
