
// Importamos las rutas de cada módulo
import productRoutes from "./product.routes.js";
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

// Importamos las rutas de ventas
import saleRoutes from "./sale.routes.js";

// Exportamos todas las rutas para utilizarlas en el servidor
export {
    productRoutes,
    viewRoutes,
    authRoutes,
    userRoutes,
    saleRoutes
};
