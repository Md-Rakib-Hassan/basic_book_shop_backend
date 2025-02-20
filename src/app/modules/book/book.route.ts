import express from 'express';
import { BookController } from './book.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookValidation } from './book.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

//defined all routes
router.get('/:bookId', BookController.getSpecificBook);
router.patch('/:bookId',auth('admin'),validateRequest(BookValidation.UpdateBookValidationSchema) , BookController.updateSpecificBook);
router.delete('/:bookId',auth('admin') ,BookController.deleteSpecificBook);
router.post('/',auth('admin'), validateRequest(BookValidation.CreateBookValidationSchema),BookController.createBook);
router.get('/', BookController.getAllBooks);

export const BookRoutes = router;
