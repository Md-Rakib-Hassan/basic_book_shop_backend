import express from 'express';
import { RequestControllers } from './request.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create a request (user must be logged in)
router.patch('/claim/:requestId', auth('admin', 'user'), RequestControllers.claimDeposit);
router.get('/me', auth('admin', 'user'), RequestControllers.getMyRequests);
router.get('/incoming',auth('admin', 'user'), RequestControllers.getIncomingRequest);
router.post('/', auth('admin','user'), RequestControllers.createBookRequest);
router.delete("/:id", RequestControllers.deleteRequest);
// Get requests for a specific book
router.get('/:bookId', auth('admin','user'), RequestControllers.getBookRequests);

// Update request status (book owner decides)
router.patch('/status/:requestId', auth('admin', 'user'), RequestControllers.updateRequestStatus);
router.patch('/payment/:requestId',auth('admin', 'user'),RequestControllers.updatePaymentStatus);

router.get('/history/:bookId', auth('admin', 'user'), RequestControllers.getRequestByUserAndBook);







export const RequestRoutes = router;
