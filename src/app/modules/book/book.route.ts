import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();

//defined all routes
router.get('/:bookId', BookController.getSpecificBook);
router.put('/:bookId', BookController.updateSpecificBook);
router.delete('/:bookId', BookController.deleteSpecificBook);
router.post('/', BookController.createBook);
router.get('/', BookController.getAllBooks);

export const BookRoutes = router;
