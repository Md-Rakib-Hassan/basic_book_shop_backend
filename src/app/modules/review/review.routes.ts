import express from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

// Create (or reject if already exists)
router.post('/:BookId', auth('admin', 'user'), ReviewController.postAReview);

// List a book’s reviews (pagination, sort, rating filter)
router.get('/:BookId', ReviewController.getABookReviews);

// Summary (avg rating, total, distribution per star)
router.get('/:BookId/summary', ReviewController.getABookReviewSummary);

// The current user's review for a book
router.get('/:BookId/me', auth('admin', 'user'), ReviewController.getMyReviewForBook);

// Update a review (owner or admin)
router.patch('/:id', auth('admin', 'user'), ReviewController.updateAReview);

// Delete a review (owner or admin)
router.delete('/:id', auth('admin', 'user'), ReviewController.deleteAReview);

// List reviews by user (self or admin)
router.get('/user/:UserId', auth('admin', 'user'), ReviewController.getUserReviews);

export const reviewRoute = router;
