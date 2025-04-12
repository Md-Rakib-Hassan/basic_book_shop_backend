import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookRoutes } from "../modules/book/book.route";
import { orderRoute } from "../modules/order/order.route";
import { UserRoutes } from "../modules/user/user.route";
import { AuthorRoutes } from "../modules/author/author.route";
import { reviewRoute } from "../modules/review/review.routes";


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
        path: '/order',
        route:orderRoute,
    },
    {
        path: '/author',
        route:AuthorRoutes,
    },
    {
        path: '/review',
        route:reviewRoute,
    }
    
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;