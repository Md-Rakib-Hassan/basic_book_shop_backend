import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

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
    })
});

const getABookReviews = catchAsync(async (req, res) => {
    const { BookId } = req.params;
    const result = await ReviewServices.getReviewsFromDB(BookId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
    })
})

export const ReviewController = {
    postAReview,
    getABookReviews
}





