import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const postAReview = catchAsync(async (req, res) => {
  const reviewData = req.body;
  reviewData.UserId = req.user?._id;
  reviewData.BookId = req.params.BookId;

  const result = await ReviewServices.postReviewInDB(reviewData);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review posted successfully',
    data: result,
  });
});

const getABookReviews = catchAsync(async (req, res) => {
  const { BookId } = req.params;
  const { page, limit, sortBy, rating } = req.query as any;

  const result = await ReviewServices.getReviewsFromDB(BookId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as any,
    rating: rating ? Number(rating) : undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const getABookReviewSummary = catchAsync(async (req, res) => {
  const { BookId } = req.params;
  const result = await ReviewServices.getReviewSummaryFromDB(BookId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

const getMyReviewForBook = catchAsync(async (req, res) => {
  const { BookId } = req.params;
  const userId = req.user?._id;
  const result = await ReviewServices.getMyReviewForBookFromDB(userId, BookId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My review retrieved successfully',
    data: result,
  });
});

const updateAReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const role = req.user?.role;

  const result = await ReviewServices.updateReviewInDB(id, userId, role, req.body?.ReviewData || req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteAReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const role = req.user?.role;

  const result = await ReviewServices.deleteReviewFromDB(id, userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const getUserReviews = catchAsync(async (req, res) => {
  const { UserId } = req.params;
  const { page, limit } = req.query as any;

  const result = await ReviewServices.getUserReviewsFromDB(
    UserId,
    { id: req.user?._id, role: req.user?.role },
    { page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = {
  postAReview,
  getABookReviews,
  getABookReviewSummary,
  getMyReviewForBook,
  updateAReview,
  deleteAReview,
  getUserReviews,
};
