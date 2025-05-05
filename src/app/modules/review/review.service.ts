import AppError from "../../errors/AppError";
import { IReview } from "./review.interface";
import { Order } from "../order/order.model";
import Review from "./review.model";

const postReviewInDB = async (reviewData:IReview) => {
 
        // Validate ObjectId format
       

        // Check if the user has an order with the book and OrderStatus is "Delivered"
        const order = await Order.findOne({
            UserId: reviewData.UserId,
            "BookDetails.BookId": reviewData.BookId,
            OrderStatus: "Delivered",
        });

        if (!order) {
            throw new AppError(403, 'You can only review books you have purchased and received.');
        }

        const result = await Review.create(reviewData);
        return result;

};

const getReviewsFromDB = async (BookId: string) => {
    const result = await Review.find({ BookId }).populate('UserId');
    let averageRating = 0;
    let totalReviews = 0;
    if (result.length > 0) { 
        totalReviews = result.length;
        averageRating = result.reduce((acc, review) => acc + review?.ReviewData?.Rating, 0) / totalReviews;
    }
    const finalResult = {
        Reviews: result,
        AverageRating: averageRating,
        TotalReviews: totalReviews,
    }
    return finalResult;
};

export const ReviewServices = {
    postReviewInDB,
    getReviewsFromDB
};