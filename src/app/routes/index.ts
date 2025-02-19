import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookRoutes } from "../modules/book/book.route";
import { orderRoute } from "../modules/order/order.route";


const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route:AuthRoutes,
    },
    {
        path: '/books',
        route:BookRoutes,
    },
    {
        path: '/orders',
        route:orderRoute,
    },
    
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;