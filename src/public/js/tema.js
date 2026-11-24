
// ==============================
// MODO CLARO Y OSCURO
// ==============================

// Recuperamos el tema guardado.
// Si no hay ninguno, usamos el claro.
const temaGuardado = localStorage.getItem("tema") || "claro";


// ==============================
// APLICAR TEMA
// ==============================

function aplicarTema(tema) {

    // Cambiamos el atributo del HTML
    document.documentElement.setAttribute("data-tema", tema);

    // Le indicamos a Simple.css qué tema utilizar
    document.documentElement.style.colorScheme =
        tema === "oscuro" ? "dark" : "light";

    // Actualizamos el texto del botón
    const boton = document.getElementById("btnCambiarTema");

    if (boton) {
        boton.textContent =
            tema === "oscuro" ? "☀️ Modo claro" : "🌙 Modo oscuro";
    }

}


// Aplicamos el tema al abrir la página
aplicarTema(temaGuardado);


// ==============================
// CAMBIAR TEMA
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("btnCambiarTema");

    if (!boton) return;

    // Mostramos el texto correcto al iniciar
    aplicarTema(localStorage.getItem("tema") || "claro");

    boton.addEventListener("click", () => {

        // Consultamos el tema actual
        const temaActual =
            document.documentElement.getAttribute("data-tema");

        // Elegimos el contrario
        const nuevoTema =
            temaActual === "oscuro" ? "claro" : "oscuro";

        // Guardamos la preferencia
        localStorage.setItem("tema", nuevoTema);

        // Aplicamos el cambio
        aplicarTema(nuevoTema);

    });

});
