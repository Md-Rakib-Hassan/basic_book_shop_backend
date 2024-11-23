import express from "express";
import { BookController } from "./book.controller";

const router = express.Router();
router.get('/:productId', BookController.getSpecificBook);
router.put('/:productId', BookController.updateSpecificBook);
router.delete('/:productId', BookController.deleteSpecificBook);
router.post('/', BookController.createBook);
router.get('/', BookController.getAllBooks);


export const BookRoutes = router;