
/*==================
    Importaciones
==================*/

import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";

import { loggerUrl } from "./src/api/middlewares/middlewares.js";

import {
    authRoutes,
    productRoutes,
    userRoutes,
    viewRoutes,
    saleRoutes
} from "./src/api/routes/index.js";

import { __dirname, join } from "./src/api/utils/index.js";

import session from "express-session";


/*==================
    Configuración
==================*/

const app = express();

const { port, session_key } = environments;
const PORT = port;

// Configuramos EJS
app.set("view engine", "ejs");

// Indicamos dónde están las vistas
app.set("views", join(__dirname, "src/views"));


/*==================
    Middlewares
==================*/

// Archivos estáticos: CSS, JavaScript e imágenes
app.use(express.static(join(__dirname, "src/public")));

// Habilitamos CORS
app.use(cors());

// Permitimos recibir datos JSON
app.use(express.json());

// Permitimos recibir datos de formularios
app.use(express.urlencoded({ extended: true }));

// Registramos las solicitudes
app.use(loggerUrl);

// Configuramos las sesiones
app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: false
}));


/*==================
    Vistas del cliente
==================*/

// Pantalla de bienvenida
app.get("/", (req, res) => {

    res.render("autoservicio");

});


// Pantalla de productos
app.get("/productos", (req, res) => {

    res.render("productos");

});


// Pantalla del carrito
app.get("/carrito", (req, res) => {

    res.render("carrito");

});


// Pantalla del ticket
app.get("/ticket", (req, res) => {

    res.render("ticket");

});


/*==================
    Rutas de la API
==================*/

// API de productos
app.use("/api/products", productRoutes);

// API de usuarios
app.use("/api/users", userRoutes);

// API de ventas
app.use("/api/sales", saleRoutes);


/*==================
    Panel administrador
==================*/

// Rutas del dashboard
app.use("/dashboard", viewRoutes);

// Rutas de autenticación
app.use("/", authRoutes);


/*==================
    Iniciar servidor
==================*/

app.listen(PORT, () => {

    console.log(
        `Servidor corriendo en http://localhost:${PORT}`
    );

});
