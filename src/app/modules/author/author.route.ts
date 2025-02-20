
import express from 'express';
import authorController from './author.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthorValidation } from './author.validation';
const router = express.Router();

router.get('/:authorId', authorController.getSpecificAuthor);
router.patch('/:authorId',validateRequest(AuthorValidation.UpdateAuthorValidationSchema), authorController.updateSpecificAuthor);
router.delete('/:authorId', authorController.deleteSpecificAuthor);
router.get('/', authorController.getAllAuthors);
router.post('/',validateRequest(AuthorValidation.CreateAuthorValidationSchema) ,authorController.createAuthor);

export const AuthorRoutes = router;