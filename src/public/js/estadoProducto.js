
// Función para activar o desactivar un producto
async function cambiarEstadoProducto(id, activar) {

    // Definimos la acción que queremos realizar
    const accion = activar ? "activar" : "desactivar";

    // Pedimos confirmación antes de modificar el producto
    const confirmar = confirm(
        `¿Estás seguro de que querés ${accion} el producto ${id}?`
    );

    // Si el usuario cancela, no hacemos nada
    if (!confirmar) {
        return;
    }

    try {

        // Elegimos el endpoint y el método según la acción
        const url = activar
            ? `/api/products/${id}/activate`
            : `/api/products/${id}`;

        const metodo = activar ? "PATCH" : "DELETE";

        // Enviamos la petición al backend
        const respuesta = await fetch(url, {
            method: metodo
        });

        // Leemos la respuesta del servidor
        const datos = await respuesta.json();

        // Verificamos si ocurrió algún error
        if (!respuesta.ok) {
            alert(datos.message || "No se pudo modificar el producto");
            return;
        }

        // Informamos que la operación fue exitosa
        alert(datos.message || "Estado actualizado correctamente");

        // Recargamos la página para mostrar el nuevo estado
        window.location.reload();

    } catch (error) {

        console.log("Error al cambiar el estado:", error);
        alert("Error de conexión con el servidor");

    }
}
