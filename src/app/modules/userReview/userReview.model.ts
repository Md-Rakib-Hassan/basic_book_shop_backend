import { Schema, model } from 'mongoose';
import { IUserReview } from './userReview.interface';

const UserReviewSchema = new Schema<IUserReview>({
  ReviewerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  ReviewedUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  RequestId: { type: Schema.Types.ObjectId, required: true, ref: 'Request' },
  ReviewData: {
    Rating: { type: Number, required: true, min: 1, max: 5 },
    Review: { type: String, required: true },
    ReviewDate: { type: Date, required: true },
  },
});

const UserReview = model<IUserReview>('UserReview', UserReviewSchema);

export default UserReview;
