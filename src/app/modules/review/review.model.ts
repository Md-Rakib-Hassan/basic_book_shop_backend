import { Schema, model,  } from 'mongoose';
import { IReview } from './review.interface';



const ReviewSchema = new Schema<IReview>({
    UserId: { type: String, required: [true, 'UserId is required'], ref:'User' },
    BookId: { type: String, required: [true, 'BookId is required'] },
    ReviewData: {
        Rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
        ReviewText: { type: String, required: [true, 'ReviewText is required'] },
        ReviewDate: { type: Date, required: [true, 'ReviewDate is required'] }
    }
});

const Review = model<IReview>('Review', ReviewSchema);

export default Review;