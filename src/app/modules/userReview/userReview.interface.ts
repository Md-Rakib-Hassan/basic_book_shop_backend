import { Types } from "mongoose";

export interface IUserReview {
  ReviewerId: Types.ObjectId; // User who gives the review
    ReviewedUserId: Types.ObjectId; // User who is being reviewed
    RequestId: Types.ObjectId;
  ReviewData: {
    Rating: number; 
    Review: string;
    ReviewDate: Date;
  };
}
