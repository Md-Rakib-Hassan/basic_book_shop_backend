import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookRoutes } from "../modules/book/book.route";
import { orderRoute } from "../modules/order/order.route";
import { UserRoutes } from "../modules/user/user.route";
import { AuthorRoutes } from "../modules/author/author.route";
import { reviewRoute } from "../modules/review/review.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { PickupPointRoutes } from "../modules/pickup/pickup.route";
import { RequestRoutes } from "../modules/request/request.route";
import { SecretPinRoutes } from "../modules/secretpin/secretpin.route";
import { userReviewRoute } from "../modules/userReview/userReview.route";
import { ContactRoutes } from "../modules/contact/contact.route";


const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route:AuthRoutes,
    },
    {
        path: '/user',
        route:UserRoutes,
    },
    {
        path: '/book',
        route:BookRoutes,
    },
    {
        path: '/request',
        route:RequestRoutes,
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
    },
    {
        path: '/contact',
        route:ContactRoutes,
    },
    {
        path: '/payment',
        route:PaymentRoutes,
    },
    {
        path: '/pickup',
        route:PickupPointRoutes,
    },
    {
        path: '/pin',
        route:SecretPinRoutes,
    },
    {
        path: '/user-review',
        route:userReviewRoute,
    }
    
    
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;