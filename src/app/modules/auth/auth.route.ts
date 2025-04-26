import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserValidation } from '../user/user.validation';
import { UserController } from '../user/user.controller';

const router = express.Router();

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthController.loginUser);
router.post('/register', validateRequest(UserValidation.userValidationSchema), UserController.createUser);

export const AuthRoutes = router;