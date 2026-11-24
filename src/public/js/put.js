
/* ==============================
   MODIFICAR PRODUCTOS
============================== */

// Obtenemos los elementos del HTML
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorForm = document.getElementById("contenedor-form");
const getProductForm = document.getElementById("getProductForm");


// ==============================
// MOSTRAR MENSAJES
// ==============================

function mostrarMensaje(tipo, mensaje) {

    const parrafo = document.createElement("p");

    parrafo.className = `mensaje ${tipo}`;
    parrafo.textContent = mensaje;

    contenedorProductos.replaceChildren(parrafo);
}


// ==============================
// MOSTRAR ERRORES
// ==============================

function mostrarListaErrores(errores) {

    contenedorProductos.replaceChildren();

    errores.forEach(error => {

        const parrafo = document.createElement("p");

        parrafo.className = "mensaje error";
        parrafo.textContent = error;

        contenedorProductos.appendChild(parrafo);
    });
}


// ==============================
// VALIDAR FORMULARIO
// ==============================

function validarFormulario(datos, archivo) {

    const errores = [];

    // Validamos el nombre
    if (!datos.name || datos.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Validamos el precio
    if (!Number.isFinite(datos.price) || datos.price <= 0) {
        errores.push("El precio debe ser mayor a 0");
    }

    // Validamos la categoría
    if (!["food", "drink"].includes(datos.category)) {
        errores.push("Seleccioná una categoría válida");
    }

    // Debe existir una URL o una imagen subida
    if (!datos.image.trim() && !archivo) {
        errores.push("Ingresá una URL o seleccioná una imagen");
    }

    // Validamos el tamaño de la imagen
    if (archivo && archivo.size > 5 * 1024 * 1024) {
        errores.push("La imagen no puede superar los 5 MB");
    }

    // Validamos el tipo de archivo
    if (
        archivo &&
        !["image/jpeg", "image/png", "image/webp"].includes(archivo.type)
    ) {
        errores.push("La imagen debe ser JPG, PNG o WEBP");
    }

    return errores;
}


// ==============================
// CONSULTAR PRODUCTO POR ID
// ==============================

getProductForm.addEventListener("submit", async (event) => {

    // Evitamos que el formulario recargue la página
    event.preventDefault();

    const idProd = document.getElementById("idProd").value.trim();

    // Verificamos que el ID sea válido
    if (!Number.isInteger(Number(idProd)) || Number(idProd) <= 0) {
        mostrarMensaje("error", "Ingresá un ID válido");
        return;
    }

    // Limpiamos el formulario anterior
    contenedorForm.replaceChildren();

    try {

        // Consultamos el producto en nuestra API
        const respuesta = await fetch(`/api/products/${idProd}`);

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje("error", datos.message || "Producto no encontrado");
            return;
        }

        // Obtenemos el producto encontrado
        const producto = datos.payload[0];

        // Mostramos sus datos
        renderizarProducto(producto);

    } catch (error) {

        console.error("Error al consultar producto:", error);

        mostrarMensaje("error", "Error de conexión con el servidor");
    }
});


// ==============================
// MOSTRAR PRODUCTO
// ==============================

function renderizarProducto(producto) {

    // Creamos la lista donde mostramos los datos
    const lista = document.createElement("ul");
    lista.className = "listados-container";

    // Imagen del producto
    const elementoImagen = document.createElement("li");

    const imagen = document.createElement("img");
    imagen.src = producto.image;
    imagen.alt = producto.name;
    imagen.className = "img-listados";

    elementoImagen.appendChild(imagen);

    // Información del producto
    const elementoDatos = document.createElement("li");

    elementoDatos.textContent =
        `ID: ${producto.id} | Nombre: ${producto.name} | Precio: $${Number(producto.price).toLocaleString("es-AR")}`;

    // Botón para modificar
    const elementoBoton = document.createElement("li");

    const botonModificar = document.createElement("button");
    botonModificar.type = "button";
    botonModificar.textContent = "Modificar";

    botonModificar.addEventListener("click", () => {

        const confirmar = confirm("¿Querés modificar este producto?");

        if (confirmar) {
            renderizarFormularioPut(producto);
        }
    });

    elementoBoton.appendChild(botonModificar);

    lista.append(elementoImagen, elementoDatos, elementoBoton);

    contenedorProductos.replaceChildren(lista);
}


// ==============================
// FORMULARIO PARA MODIFICAR
// ==============================

function renderizarFormularioPut(producto) {

    // Creamos el formulario
    const formulario = document.createElement("form");
    formulario.id = "modifyProductForm";

    formulario.innerHTML = `
        <h3>Modificar producto</h3>

        <!-- ID del producto -->
        <input
            type="hidden"
            name="id"
            value="${Number(producto.id)}"
        >

        <!-- Categoría -->
        <label for="categoryProd">Categoría</label>

        <select name="category" id="categoryProd" required>
            <option value="food">Comida</option>
            <option value="drink">Bebida</option>
        </select>

        <!-- Imagen actual -->
        <label for="imageProd">URL de la imagen actual</label>

        <input
            type="text"
            name="image"
            id="imageProd"
        >

        <!-- Subir una nueva imagen -->
        <label for="imageFile">Subir nueva imagen (opcional)</label>

        <input
            type="file"
            name="imageFile"
            id="imageFile"
            accept=".jpg,.jpeg,.png,.webp"
        >

        <!-- Nombre -->
        <label for="nameProd">Nombre</label>

        <input
            type="text"
            name="name"
            id="nameProd"
            minlength="2"
            required
        >

        <!-- Precio -->
        <label for="priceProd">Precio</label>

        <input
            type="number"
            name="price"
            id="priceProd"
            min="0.01"
            step="0.01"
            required
        >

        <!-- Estado -->
        <label for="activeProd">Estado</label>

        <select name="active" id="activeProd" required>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
        </select>

        <!-- Guardar cambios -->
        <button type="submit">
            Guardar modificaciones
        </button>
    `;

    // Cargamos los valores actuales del producto
    formulario.elements.category.value = producto.category;
    formulario.elements.image.value = producto.image || "";
    formulario.elements.name.value = producto.name;
    formulario.elements.price.value = producto.price;
    formulario.elements.active.value = String(Number(producto.active));

    // Mostramos el formulario
    contenedorForm.replaceChildren(formulario);

    // Escuchamos el envío del formulario
    formulario.addEventListener("submit", modificarProducto);
}


// ==============================
// ENVIAR MODIFICACIÓN A LA API
// ==============================

async function modificarProducto(event) {

    event.preventDefault();

    const formulario = event.currentTarget;
    const botonGuardar = formulario.querySelector('button[type="submit"]');

    // Obtenemos los datos del formulario
    const formData = new FormData(formulario);

    // Obtenemos la imagen seleccionada
    const archivo = formulario.elements.imageFile.files[0];

    // Preparamos los datos para validar
    const datos = {
        name: String(formData.get("name") || "").trim(),
        image: String(formData.get("image") || "").trim(),
        category: String(formData.get("category") || ""),
        price: Number(formData.get("price"))
    };

    // Validamos antes de enviar
    const errores = validarFormulario(datos, archivo);

    if (errores.length > 0) {
        mostrarListaErrores(errores);
        return;
    }

    // Actualizamos los datos limpios
    formData.set("name", datos.name);
    formData.set("image", datos.image);

    // Si no se seleccionó archivo, quitamos el campo vacío
    if (!archivo) {
        formData.delete("imageFile");
    }

    // Evitamos enviar dos veces la modificación
    botonGuardar.disabled = true;

    try {

        // Enviamos los datos y la imagen al servidor
        const respuesta = await fetch("/api/products", {

            method: "PUT",

            // FormData permite enviar archivos.
            // No agregamos Content-Type manualmente.
            body: formData

        });

        const resultado = await respuesta.json();

        // Verificamos si ocurrió un error
        if (!respuesta.ok) {

            const mensaje = resultado.listaErrores?.join(". ")
                || resultado.message
                || "No se pudo modificar el producto";

            throw new Error(mensaje);
        }

        // Limpiamos el formulario
        contenedorForm.replaceChildren();

        // Informamos que el producto se modificó correctamente
        alert(resultado.message);

        // Volvemos al dashboard
        window.location.href = "/dashboard/principal";

    } catch (error) {

        console.error("Error al modificar producto:", error);

        mostrarMensaje("error", error.message);

    } finally {

        // Habilitamos nuevamente el botón si sigue en pantalla
        botonGuardar.disabled = false;
    }
}
