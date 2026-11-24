# Autoservicio - TP Integrador

**Programación III - UTN | División 334 | Segundo cuatrimestre 2026**

## Descripción

Aplicación web de autoservicio que permite a los clientes seleccionar productos, agregarlos a un carrito, realizar compras y obtener un ticket en PDF.

También cuenta con un panel de administración para gestionar productos, usuarios y consultar el historial de ventas.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MySQL
- EJS
- Bcrypt
- Multer
- jsPDF
- Express Session
- Git y GitHub

## Funcionalidades del cliente

- Ingreso del nombre del cliente.
- Catálogo de comidas y bebidas.
- Paginación de productos.
- Carrito de compras.
- Modificación de cantidades.
- Confirmación de compra.
- Generación y descarga del ticket en PDF.
- Modo claro y oscuro.
- Diseño responsive.

## Funcionalidades del administrador

- Inicio y cierre de sesión.
- Creación de usuarios.
- Consulta de productos.
- Alta y modificación de productos.
- Desactivación y reactivación de productos.
- Carga de imágenes.
- Historial de ventas.
- Protección de rutas mediante sesiones.

## Arquitectura

El proyecto utiliza el patrón MVC (Modelo, Vista y Controlador), separando las responsabilidades del código para facilitar su mantenimiento.

- **Models:** consultas a la base de datos.
- **Views:** interfaces desarrolladas con EJS.
- **Controllers:** procesamiento de solicitudes y respuestas.
- **Routes:** definición de rutas y endpoints.
- **Middlewares:** validación de datos y autenticación.
- **Public:** archivos CSS, JavaScript e imágenes.

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias ejecutando `npm install`.
3. Iniciar MySQL desde XAMPP.
4. Importar la base de datos desde la carpeta BBDD.
5. Crear un archivo `.env` con las variables de entorno correspondientes.
6. Ejecutar `node index.js`.

## Acceso a la aplicación

- Autoservicio: http://localhost:3001
- Administrador: http://localhost:3001/login

## Seguridad

Las contraseñas de los nuevos usuarios se almacenan mediante hash utilizando Bcrypt. Las operaciones administrativas requieren una sesión iniciada y los datos recibidos se validan mediante middlewares.

Las credenciales de conexión se almacenan en variables de entorno y se excluyen del repositorio mediante `.gitignore`.

## Autor

Gianlukas Vangeli

Trabajo Práctico Integrador - Programación III - UTN 2026