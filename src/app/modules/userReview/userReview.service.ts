import AppError from "../../errors/AppError";
import { Request } from "../request/request.model";
import { IUserReview } from "./userReview.interface";
import UserReview from "./userReview.model";


const postUserReviewInDB = async (reviewData: IUserReview) => {
  if (reviewData.ReviewerId === reviewData.ReviewedUserId) {
    throw new AppError(400, "You cannot review yourself.");
  }
  const requestInfo = await Request.findById(reviewData.RequestId);
  // console.log('request Info. requestr',requestInfo?.requester);
  // console.log('reviewData. ReviewId ', reviewData.ReviewerId);
  // console.log('compare', requestInfo?.requester == reviewData.ReviewerId);
  if ((requestInfo?.requester)?.toString() == (reviewData.ReviewerId)?.toString()) {
    await Request.findByIdAndUpdate(reviewData.RequestId, { requesterReviewed: true }, { new: true });
  }
  if ((requestInfo?.BookOwner)?.toString() == (reviewData.ReviewerId)?.toString()) {
    await Request.findByIdAndUpdate(reviewData.RequestId, { ownerReviewed: true }, { new: true });
  }


  const result = await UserReview.create(reviewData);
  return result;
};

const getUserReviewsFromDB = async (ReviewedUserId: string) => {
  const reviews = await UserReview.find({ ReviewedUserId }).populate("ReviewerId");

  let avgRating = 0;
  let total = reviews.length;

  if (total > 0) {
    avgRating = reviews.reduce((acc, r) => acc + r.ReviewData.Rating, 0) / total;
  }

  return {
    Reviews: reviews,
    AverageRating: avgRating,
    TotalReviews: total,
  };
};

export const UserReviewServices = {
  postUserReviewInDB,
  getUserReviewsFromDB,
};
