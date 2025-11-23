import express from "express";
import auth from "../../middlewares/auth";
import { UserReviewController } from "./userReview.controller";


const router = express.Router();

router.post("/:UserId", auth("admin", "user"), UserReviewController.postAUserReview);
router.get("/:UserId", UserReviewController.getUserReviews);

export const userReviewRoute = router;
