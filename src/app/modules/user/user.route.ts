import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();


router.get('/single/:email',UserController.getSingleUserByEmail);

export const UserRoutes = router;