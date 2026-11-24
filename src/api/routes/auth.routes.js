
/*===========================
    Rutas de autenticación
===========================*/

import { Router } from "express";
import connection from "../database/db.js";
import bcrypt from "bcrypt";

const router = Router();


// ============================
// Vista del login
// ============================
router.get("/login", (req, res) => {

    res.render("login", {
        title: "Login usuario",
        about: "Login de usuario admin"
    });

});


// ============================
// Iniciar sesión
// ============================
router.post("/login", async (req, res) => {

    try {

        // Obtenemos el email y la contraseña del formulario
        const { email, password } = req.body;

        // Verificamos que los campos no estén vacíos
        if (!email || !password) {
            return res.render("login", {
                title: "Login usuario",
                about: "Login de usuario admin",
                error: "Todos los campos son requeridos"
            });
        }

        // Buscamos al usuario por su email
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await connection.query(sql, [email]);

        // Verificamos si el usuario existe
        if (rows.length === 0) {
            return res.render("login", {
                title: "Login usuario",
                about: "Login de usuario admin",
                error: "Credenciales incorrectas"
            });
        }

        // Obtenemos los datos del usuario encontrado
        const user = rows[0];

        // Comparamos la contraseña ingresada con la cifrada
        const passwordCorrecta = await bcrypt.compare(
            password,
            user.password
        );

        // Si la contraseña es incorrecta, mostramos un error
        if (!passwordCorrecta) {
            return res.render("login", {
                title: "Login usuario",
                about: "Login de usuario admin",
                error: "Credenciales incorrectas"
            });
        }

        // Guardamos los datos del usuario en la sesión
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        // Si el login es correcto, vamos al dashboard
        res.redirect("/dashboard/principal");

    } catch (error) {

        // Mostramos el error en la consola
        console.log("Error en el login:", error);

        res.status(500).json({
            message: "Error interno del servidor"
        });

    }

});


// ============================
// Cerrar sesión
// ============================
router.post("/logout", (req, res) => {

    // Destruimos la sesión del usuario
    req.session.destroy((err) => {

        // Verificamos si ocurrió algún error
        if (err) {
            console.log("Error al destruir la sesión:", err);

            return res.status(500).json({
                message: "Error al cerrar la sesión"
            });
        }

        // Redirigimos al login
        res.redirect("/login");

    });

});


// Exportamos las rutas
export default router;
