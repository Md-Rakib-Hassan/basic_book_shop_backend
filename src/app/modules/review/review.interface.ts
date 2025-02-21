export interface IReview {
    UserId: string; // Foreign Key to User
    BookId: string; // Foreign Key to Book
    ReviewData: {
        Rating: number; // Rating between 1 to 5
        ReviewText: string; // Text of the review
        ReviewDate: Date; // Date of the review
    };
}