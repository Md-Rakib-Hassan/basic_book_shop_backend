import express from 'express';
import { BookController, getBookDetails } from './book.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookValidation } from './book.validation';
import auth from '../../middlewares/auth';
import optionalAuth from '../../middlewares/optionalAuth';

const router = express.Router();

//defined all routes
router.get('/',optionalAuth(), BookController.getAllBooks);
router.get('/me', auth('user', 'admin'), BookController.getMyBooks);
router.patch('/approval/:bookId', auth('admin'), BookController.updateBookApproval);
router.get('/:bookId', BookController.getSpecificBook);
router.patch('/:bookId', auth('admin', 'user'), validateRequest(BookValidation.UpdateBookValidationSchema), BookController.updateSpecificBook);
router.patch('/rating/:bookId',auth('admin','user'),BookController.updateBookRating);
router.delete('/:bookId',auth('admin','user') ,BookController.deleteSpecificBook);
router.post('/',auth('admin','user'),BookController.createBook);
router.post("/details", BookController.getBookDetails);
router.get('/academic/filters', BookController.getAcademicFilters);



export const BookRoutes = router;
