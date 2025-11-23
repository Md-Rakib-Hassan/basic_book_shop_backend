/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongoose';
import IBook, { BookQueryParams } from './book.interface';
import { Book } from './book.model';
import AppError from '../../errors/AppError';
import { ReviewServices } from '../review/review.service';
import UserModel from '../user/user.model';


// Service to create a book in the database
const createBookInDB = async (bookData: IBook): Promise<IBook> => {
  const result = (await Book.create(bookData));
  return result;
};

// Service to fetch all books with optional query parameters

const getAllBooksFromDB = async ({ searchTerm, category, sort, condition,availability,price,currentUser}: BookQueryParams) => {
  const query: any = {};
  // Search by term
  // console.log("crrrrrrr",currentUser);
  if (currentUser && currentUser?.Role!='admin') {
    query.BookOwner = { $ne: currentUser._id };
    // To exclude books whose owners are blocked, you need to filter after population or use aggregation.
    query.AdminApproved = { $ne: false };
  }
  if (!currentUser) {
    query.AdminApproved = { $ne: false };
  }
  if (searchTerm) {
    query.$or = [
      { Title: { $regex: searchTerm, $options: 'i' } },
      { ISBN: { $regex: searchTerm, $options: 'i' } },
      { Author: { $regex: searchTerm, $options: 'i' } },
      { Subject: { $regex: searchTerm, $options: 'i' } },
      { Institution: { $regex: searchTerm, $options: 'i' } },

    ];
  }

  // Category filter
  if (category?.toLowerCase() === 'academic') {
    query.Category = { $regex: '^Academic$', $options: 'i' }; // Only Academic

  } else {
    if (price != '0') {
      if( category != 'sp') query.Category = { $not: /Academic/i };
    } // Exclude Academic by default
  }

  if (availability) {
    query.Availability={ $regex: availability, $options: 'i' };
  }

  if (condition) {
    query.Condition={ $regex: condition, $options: 'i' };
  }

  if (price == '0') {
    query.Price = 0;
  }

  // Sorting logic
  const sortCondition: any = (() => {
    switch (sort) {
      case 'priceLowHigh': return { Price: 1 };
      case 'priceHighLow': return { Price: -1 };
      case 'rating': return { Rating: -1 };
      case 'latest': return { createdAt: -1 };
      default: return {};
    }
  })();
  console.log(query);
  const result = await Book.find(query)
    .sort(sortCondition)
    .populate('PickupPoint')
    .populate('BookOwner');

  const filtered = result.filter(book => !book.BookOwner?.isBlocked);

return filtered;
};



// Service to fetch a specific book by ID
const getSpecificBookFromDB = async (bookId: string): Promise<IBook | null> => {
  const result = await Book.findById(bookId).populate('PickupPoint').populate('BookOwner');
  const bookReviews = await ReviewServices.getReviewsFromDB(bookId);
  if (result && bookReviews) {
    const resultObject = result.toObject(); // Convert Mongoose document to plain object
    resultObject.Reviews = bookReviews; // Add the Reviews property
    // console.log(resultObject);
    return resultObject; // Return the modified object
  }
  // console.log(result);
  return result;
};

// Service to update a specific book by ID
const updateSpecificBookInDB = async (
  bookId: string,
  payload: Partial<IBook>,
): Promise<IBook | null> => {
  const filter = { _id: bookId };
  // console.log(payload);
  const result = await Book.findOneAndUpdate(filter, payload, { new: true });
  return result;
};

const updateRatingInDB = async (bookId: string,updateData: {Rating:number}) => {
    const book = await Book.findOneAndUpdate(
        { _id: bookId }, // Only update if review belongs to the user
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!book) {
        throw new AppError(404, "Book not found or you don't have permission to update it");
    }

    return book;
};


const updateBookQuantityInDB = async (
  bookId: ObjectId,
  qty: number,
  session?: any,
): Promise<IBook | null> => {
  const book = await getSpecificBookFromDB(bookId);
  if (!book) {
    throw new AppError(404, 'Book not found');
  }
  const previousQty = book.StockQuantity;
  if(previousQty < qty){
    throw new AppError(400, 'Not enough stock');
  }
  const newQty = previousQty - qty;
  const result = await Book.findByIdAndUpdate(bookId, { StockQuantity: newQty }, { new: true, session });
  return result;
};

// Service to delete a specific book by ID
const deleteSpecificBookFromDB = async (
  bookId: string,
): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(bookId);
  return result;
};

const getMyBooksFromDB = async (userId: string)=> {
  const result = await Book.find({ BookOwner: userId }).sort({ createdAt: -1 });
    // console.log('zzz' + result);
    return result;
};


const getAcademicFiltersFromDB = async () => {
  const subjects = await Book.distinct("Subject", { Category: { $regex: '^Academic$', $options: 'i' } });
  const institutions = await Book.distinct("Institution", { Category: { $regex: '^Academic$', $options: 'i' } });
  const categories = await Book.distinct("Category");
  const bookCount = await Book.countDocuments();
  const userCount = await UserModel.countDocuments();

  return { subjects, institutions,categories,bookCount,userCount };
};

const updateBookApprovalInDB = async (
  bookId: string,
  approved: boolean
) => {
  const result = await Book.findByIdAndUpdate(
    bookId,
    { AdminApproved: approved },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new AppError(404, 'Book not found');
  }

  return result;
};


// Exporting all book services
export const BookServices = {
  createBookInDB,
  getAllBooksFromDB,
  getSpecificBookFromDB,
  updateSpecificBookInDB,
  updateBookQuantityInDB,
  deleteSpecificBookFromDB,
  updateRatingInDB,
  getMyBooksFromDB,
  getAcademicFiltersFromDB,
  updateBookApprovalInDB
};
