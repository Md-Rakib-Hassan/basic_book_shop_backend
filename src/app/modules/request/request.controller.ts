import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RequestServices } from './request.service';
import { BookServices } from '../book/book.service';

// Create a book request
const createBookRequest = catchAsync(async (req: Request, res: Response) => {
  const { bookId, note, BookOwner } = req.body;
  const requesterId = req?.user?._id;
  const bookInfo = await BookServices.getSpecificBookFromDB(bookId);

  console.log('xx',bookInfo);

  const result = await RequestServices.createRequestInDB({
    book: bookId,
      requester: requesterId,
    BookOwner,
    note,
    status: 'Pending',
    securityDepositAmount: bookInfo?.ActualPrice,
    bookPrice: bookInfo?.Price,
    bookFor:bookInfo?.Availability,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Book request created successfully',
    data: result,
  });
});

// Get requests for a specific book
const getBookRequests = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const result = await RequestServices.getRequestsByBookId(bookId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Book requests fetched successfully',
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?._id;
  const result = await RequestServices.getMyRequestsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Book requests fetched successfully',
    data: result,
  });
});

const getIncomingRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?._id;
   
  const result = await RequestServices.getIncomingRequestFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Book requests fetched successfully',
    data: result,
  });
});

 const getRequestByUserAndBook = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?._id;
  const { bookId } = req.params;

  const result = await RequestServices.findRequestByUserAndBook(userId, bookId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request fetched successfully',
    data: result,
  });
});

// Update request status
const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { status } = req.body; // accepted | rejected

  const result = await RequestServices.updateRequestStatus(requestId, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Request ${status} successfully`,
    data: result,
  });
});


const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await RequestServices.deleteRequest(id);

  res.status(200).json({
    success: true,
    message: "Request deleted successfully",
    statusCode: 200,
    data: result,
  });
});

// Update payment fields
const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const userId = req?.user?._id;

  const result = await RequestServices.updatePaymentInDB(requestId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment details updated successfully",
    data: result,
  });
});

const claimDeposit = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const userId = req?.user?._id;
  console.log(req.params);
  const result = await RequestServices.claimDeposit(requestId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment details updated successfully",
    data: result,
  });
})



export const RequestControllers = {
  createBookRequest,
  getBookRequests,
    updateRequestStatus,
getRequestByUserAndBook,
    getMyRequests,
    getIncomingRequest,
  deleteRequest,
  updatePaymentStatus,
  claimDeposit
};
