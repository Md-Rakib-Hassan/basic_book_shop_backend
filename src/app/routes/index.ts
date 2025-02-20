import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookRoutes } from "../modules/book/book.route";
import { orderRoute } from "../modules/order/order.route";
import { UserRoutes } from "../modules/user/user.route";
import { AuthorRoutes } from "../modules/author/author.route";


const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route:AuthRoutes,
    },
    {
        path: '/auth',
        route:UserRoutes,
    },
    {
        path: '/book',
        route:BookRoutes,
    },
    {
        path: '/orders',
        route:orderRoute,
    },
    {
        path: '/author',
        route:AuthorRoutes,
    }
    
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;