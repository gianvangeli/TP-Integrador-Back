
/*===========================
    Configuración de Multer
===========================*/

import multer from "multer";
import path from "path";

// Configuramos dónde se guardan las imágenes
const storage = multer.diskStorage({

    // Carpeta de destino
    destination: (req, file, cb) => {
        cb(null, "src/public/uploads");
    },

    // Nombre que tendrá la imagen guardada
    filename: (req, file, cb) => {

        // Creamos un nombre único para evitar archivos repetidos
        const nombreUnico = Date.now() + "-" +
            Math.round(Math.random() * 100000);

        // Conservamos la extensión original
        const extension = path.extname(file.originalname);

        cb(null, nombreUnico + extension);
    }
});

// Permitimos solamente imágenes JPG, PNG y WEBP
const fileFilter = (req, file, cb) => {

    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (formatosPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes JPG, PNG y WEBP"));
    }
};

// Creamos el middleware de subida
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Máximo 5 MB
    }
});

export default upload;
