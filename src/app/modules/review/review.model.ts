import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const ReviewSchema = new Schema<IReview>(
  {
    UserId: { type: Schema.Types.ObjectId, required: [true, 'UserId is required'], ref: 'User' },
    BookId: { type: Schema.Types.ObjectId, required: [true, 'BookId is required'] },
    ReviewData: {
      Rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
      ReviewText: { type: String, required: [true, 'ReviewText is required'] },
      ReviewDate: { type: Date, default: Date.now, required: [true, 'ReviewDate is required'] },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Each user can review a given book only once
ReviewSchema.index({ UserId: 1, BookId: 1 }, { unique: true });

const Review = model<IReview>('Review', ReviewSchema);

export default Review;
