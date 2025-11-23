import express from 'express';
import { PickupPointController } from './pickup.controller';

const router = express.Router();

// CRUD routes
router.post('/', PickupPointController.createPickupPoint);
router.get('/user/:userId', PickupPointController.getAllPickupPointsByUser);
router.get('/:id', PickupPointController.getPickupPointById);
router.patch('/:id', PickupPointController.updatePickupPoint);
router.delete('/:id', PickupPointController.deletePickupPoint);

export const PickupPointRoutes = router;
