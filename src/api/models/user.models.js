
/*============================
    Modelos de usuario
============================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

// Crear usuario
export const insertNewUser = async (name, email, password) => {

    // Ciframos la contraseña antes de guardarla
    const passwordHash = await bcrypt.hash(password, 10);

    // Preparamos la consulta SQL
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    // Guardamos el usuario con la contraseña cifrada
    return connection.query(sql, [name, email, passwordHash]);
}
