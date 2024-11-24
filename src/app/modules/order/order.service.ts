import { BookServices } from "../book/book.service";
import IOrder from "./order.interface";
import { Order } from "./order.model";

// Function to create a book order in the database
const createBookOrderIntoDB = async (orderedDetails: IOrder) => {
  // Fetch the book details from the database
  const orderedBook = await BookServices.getSpecificBookFromDB(orderedDetails.product);

  // Throw an error if the book is not found
  if (!orderedBook) throw new NotFoundError();

  // Check if there is sufficient stock available; throw an error if not
  if (orderedBook.quantity < orderedDetails.quantity) {
    throw new CustomError(500, "Don't have the enough quantity");
  }

  // Update the book's quantity in the database
  const bookUpdate = await BookServices.updateSpecificBookIntoDB(orderedDetails.product, {
    quantity: orderedBook.quantity - orderedDetails.quantity,
  });

  // If the book's quantity becomes zero, mark it as out of stock
  if (bookUpdate?.quantity == 0) {
    await BookServices.updateSpecificBookIntoDB(orderedDetails.product, { inStock: false });
  }

  // Create the order in the database
  const result = await Order.create(orderedDetails);
  return result;
};

// Function to calculate total revenue from orders
const createRevenueFromOrdersDB = async () => {
  // Using MongoDB aggregation to calculate the sum of totalPrice across all orders
  const result = await Order.aggregate([
    {
      $group: {
        _id: null, // Group all documents together
        totalRevenue: { $sum: "$totalPrice" }, // Calculate the total revenue
      },
    },
    { $project: { _id: 0 } }, // Exclude the _id field in the result
  ]);
  return result[0]||{totalRevenue:0}; // Return the first result containing the total revenue
};

export const OrderServices = {
  createBookOrderIntoDB,
  createRevenueFromOrdersDB,
};

// Custom error for handling "Not Found" scenarios
class NotFoundError extends Error {
  statusCode: number;
  constructor() {
    super();
    this.name = "Not Found Error";
    this.message = "Book not found"; // Default message for Not Found errors
    this.statusCode = 404; // HTTP status code for Not Found
  }
}

// Custom error class for handling other specific errors
class CustomError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.message = message; // Custom error message
    this.statusCode = statusCode; // HTTP status code for the error
  }
}
