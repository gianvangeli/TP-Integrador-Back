const response = await fetch(`${urlBase}/api/products`, {

const contenedorProductos = document.getElementById("contenedor-productos");
const createProductForm = document.getElementById("createProductForm");


// Validamos los datos antes de enviarlos al servidor
function validarFormulario(data) {

    const errores = [];

    // Validamos el nombre
    if (typeof data.name !== "string" || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Validamos el precio
    if (
        data.price === "" ||
        !Number.isFinite(Number(data.price)) ||
        Number(data.price) <= 0
    ) {
        errores.push("El precio debe ser mayor a 0");
    }

    // Validamos la categoría
    if (!["food", "drink"].includes(data.category)) {
        errores.push("Categoría inválida");
    }

    // Debe existir una URL o un archivo seleccionado
    const tieneURL = typeof data.image === "string" && data.image.trim() !== "";

    const tieneArchivo = data.imageFile instanceof File &&
        data.imageFile.size > 0;

    if (!tieneURL && !tieneArchivo) {
        errores.push("Debés ingresar una URL o seleccionar una imagen");
    }

    return errores;
}


// Mostramos un mensaje de éxito o error
function mostrarMensaje(tipo, mensaje) {

    contenedorProductos.textContent = "";

    const parrafo = document.createElement("p");
    parrafo.className = `mensaje ${tipo}`;
    parrafo.textContent = mensaje;

    contenedorProductos.appendChild(parrafo);
}


// Mostramos los errores de validación
function mostrarListaErrores(errores) {

    contenedorProductos.textContent = "";

    errores.forEach(error => {

        const parrafo = document.createElement("p");
        parrafo.className = "mensaje error";
        parrafo.textContent = error;

        contenedorProductos.appendChild(parrafo);
    });
}


// Escuchamos cuando el usuario envía el formulario
createProductForm.addEventListener("submit", async (event) => {

    // Evitamos que la página se recargue
    event.preventDefault();

    // Obtenemos los datos del formulario, incluyendo la imagen
    const formData = new FormData(createProductForm);

    // Convertimos los datos a un objeto para validarlos
    const formObj = Object.fromEntries(formData.entries());

    // Limpiamos los espacios del nombre
    formObj.name = formObj.name.trim();
    formData.set("name", formObj.name);

    // Validamos antes de enviar
    const errores = validarFormulario(formObj);

    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    // Si no seleccionamos archivo, quitamos ese campo
    if (!formObj.imageFile || formObj.imageFile.size === 0) {
        formData.delete("imageFile");
    }

    try {

        // Enviamos los datos y la imagen al backend
        const response = await fetch(`${urlBase}/api/products`, {
            method: "POST",
            body: formData
        });

        // Convertimos la respuesta del servidor a JSON
        const data = await response.json();

        // Verificamos si hubo errores
        if (!response.ok) {

            if (data.listaErrores) {
                return mostrarListaErrores(data.listaErrores);
            }

            return mostrarMensaje("error", data.message);
        }

        // Mostramos el mensaje de éxito
        mostrarMensaje(
            "exito",
            `${data.message} con id ${data.productId}`
        );

        // Limpiamos el formulario
        // Limpiamos el formulario
        createProductForm.reset();

        // Volvemos al dashboard después de 1 segundo
        setTimeout(() => {
            window.location.href = "/dashboard/principal";
        }, 1000);
        

    } catch (error) {

        console.error("Error al crear producto:", error);

        mostrarMensaje(
            "error",
            "Error de conexión con el servidor"
        );
    }
});
