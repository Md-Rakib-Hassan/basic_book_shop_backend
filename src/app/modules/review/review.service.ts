import AppError from '../../errors/AppError';
import { IReview, TReviewRole } from './review.interface';
import { Order } from '../order/order.model';
import Review from './review.model';
import mongoose from 'mongoose';
import { Request } from '../request/request.model';

const ensureCanReview = async (userId: string, bookId: string) => {
  const request = await Request.findOne({
    requester: userId,
    book: bookId,
    status: 'Completed',
  }).lean();

  if (!request) {
    throw new AppError(403, 'You can only review books you have purchased and received.');
    }
    
    await Request.findByIdAndUpdate(request._id, { isReviewedBook: true }, { new: true });
};

const postReviewInDB = async (reviewData: IReview) => {
  await ensureCanReview(reviewData.UserId, reviewData.BookId);

  try {
    const created = await Review.create(reviewData);
    return created;
  } catch (err: any) {
    if (err?.code === 11000) {
      throw new AppError(409, 'You already reviewed this book.');
    }
    throw err;
  }
};

const getReviewsFromDB = async (
  BookId: string,
  opts?: {
    page?: number;
    limit?: number;
    sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
    rating?: number;
  }
) => {
  const page = Math.max(Number(opts?.page) || 1, 1);
  const limit = Math.min(Math.max(Number(opts?.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const sortMap: Record<string, any> = {
    newest: { 'ReviewData.ReviewDate': -1, createdAt: -1 },
    oldest: { 'ReviewData.ReviewDate': 1, createdAt: 1 },
    highest: { 'ReviewData.Rating': -1, createdAt: -1 },
    lowest: { 'ReviewData.Rating': 1, createdAt: 1 },
  };
  const sort = sortMap[opts?.sortBy || 'newest'];

  const filter: any = { BookId };
  if (opts?.rating && [1, 2, 3, 4, 5].includes(opts.rating)) {
    filter['ReviewData.Rating'] = opts.rating;
  }

  const [items, total] = await Promise.all([
    Review.find(filter).populate('UserId').sort(sort).skip(skip).limit(limit).lean(),
    Review.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  const averageRating =
    total > 0
      ? (await Review.aggregate([
          { $match: { BookId, ...(opts?.rating ? { 'ReviewData.Rating': opts.rating } : {}) } },
          { $group: { _id: null, avg: { $avg: '$ReviewData.Rating' } } },
        ]))[0]?.avg ?? 0
      : 0;

  return {
    Reviews: items,
    AverageRating: averageRating,
    TotalReviews: total,
    Pagination: { page, limit, totalPages },
  };
};

const getReviewSummaryFromDB = async (BookId: string) => {
  const summary = await Review.aggregate([
    { $match: { BookId } },
    {
      $group: {
        _id: '$ReviewData.Rating',
        count: { $sum: 1 },
      },
    },
  ]);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let weighted = 0;
  for (const row of summary) {
    const r = Number(row._id);
    const c = Number(row.count);
    if (distribution[r] !== undefined) {
      distribution[r] = c;
      total += c;
      weighted += r * c;
    }
  }
  const average = total ? weighted / total : 0;
  return {
    AverageRating: average,
    TotalReviews: total,
    Distribution: distribution,
  };
};

const getMyReviewForBookFromDB = async (userId: string, bookId: string) => {
  const review = await Review.findOne({ UserId: userId, BookId: bookId }).populate('UserId').lean();
  return review;
};

const ensureOwnerOrAdmin = (review: { UserId: string }, userId: string, role: TReviewRole) => {
  const isOwner = String(review.UserId) === String(userId);
  const isAdmin = role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new AppError(403, 'You are not allowed to modify this review.');
  }
};

const updateReviewInDB = async (
  id: string,
  userId: string,
  role: TReviewRole,
  payload: Partial<IReview['ReviewData']>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, 'Invalid review id');

  const existing = await Review.findById(id).lean();
  if (!existing) throw new AppError(404, 'Review not found');

  ensureOwnerOrAdmin(existing as any, userId, role);

  const toSet: any = {};
  if (typeof (payload as any)?.Rating === 'number') {
    if ((payload as any).Rating < 1 || (payload as any).Rating > 5) throw new AppError(400, 'Rating must be 1-5');
    toSet['ReviewData.Rating'] = (payload as any).Rating;
  }
  if (typeof (payload as any)?.ReviewText === 'string') {
    toSet['ReviewData.ReviewText'] = (payload as any).ReviewText;
  }
  toSet['ReviewData.ReviewDate'] = new Date();

  const updated = await Review.findByIdAndUpdate(id, { $set: toSet }, { new: true }).populate('UserId');
  return updated;
};

const deleteReviewFromDB = async (id: string, userId: string, role: TReviewRole) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, 'Invalid review id');

  const existing = await Review.findById(id).lean();
  if (!existing) throw new AppError(404, 'Review not found');

  ensureOwnerOrAdmin(existing as any, userId, role);

  await Review.findByIdAndDelete(id);
  return { deleted: true };
};

const getUserReviewsFromDB = async (
  targetUserId: string,
  requester: { id: string; role: TReviewRole },
  opts?: { page?: number; limit?: number }
) => {
  const isSelf = String(targetUserId) === String(requester.id);
  const isAdmin = requester.role === 'admin';
  if (!isSelf && !isAdmin) {
    throw new AppError(403, 'You cannot view another user’s reviews.');
  }

  const page = Math.max(Number(opts?.page) || 1, 1);
  const limit = Math.min(Math.max(Number(opts?.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Review.find({ UserId: targetUserId }).populate('UserId').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments({ UserId: targetUserId }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return { Reviews: items, Pagination: { page, limit, totalPages }, TotalReviews: total };
};

export const ReviewServices = {
  postReviewInDB,
  getReviewsFromDB,
  getReviewSummaryFromDB,
  getMyReviewForBookFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
  getUserReviewsFromDB,
};
