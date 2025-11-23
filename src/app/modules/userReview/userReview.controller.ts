import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserReviewServices } from "./userReview.service";


const postAUserReview = catchAsync(async (req, res) => {
  const reviewData = req.body;
  reviewData.ReviewerId = req.user?._id;
  reviewData.ReviewedUserId = req.params.UserId;
  reviewData.ReviewData.ReviewDate = new Date();
    console.log('cccccccccc',reviewData);
  const result = await UserReviewServices.postUserReviewInDB(reviewData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User review posted successfully",
    data: result,
  });
});

const getUserReviews = catchAsync(async (req, res) => {
  const { UserId } = req.params;
  const result = await UserReviewServices.getUserReviewsFromDB(UserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User reviews retrieved successfully",
    data: result,
  });
});

export const UserReviewController = {
  postAUserReview,
  getUserReviews,
};
