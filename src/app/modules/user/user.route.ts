import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();


router.get('/single/:email', UserController.getSingleUserByEmail);
router.get('/', auth('admin'), UserController.getAllUsers);
router.patch('/block/:id',auth('admin'), UserController.blockUser);

export const UserRoutes = router;