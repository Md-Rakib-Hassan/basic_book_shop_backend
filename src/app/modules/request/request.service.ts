import mongoose from 'mongoose';
import { UserService } from '../user/user.service';
import { IRequest } from './request.interface';
import { Request } from './request.model';
import UserModel from '../user/user.model';
import { Payment } from '../payment/payment.model';
import { PaymentService } from '../payment/payment.service';
import crypto from 'crypto';

// Create a new request
const createRequestInDB = async (payload: IRequest): Promise<IRequest> => {
  const result = await Request.create(payload);
  return result;
};

// Get all requests for a specific book owner (use populate later)
const getRequestsByBookId = async (bookId: string): Promise<IRequest[]> => {
  return await Request.find({ book: bookId })
    .populate('requester')
    .populate('book')
    .populate({
      path: 'book',
      populate: [
        { path: 'BookOwner' }, // populate book owner
        { path: 'PickupPoint' }, // populate pickup point
      ],
    });
};

const getMyRequestsFromDB = async (userId: string): Promise<IRequest[]> => {
  const result = await Request.find({ requester: userId })
    .populate('requester')
    .populate('book')
    .populate({
      path: 'book',
      populate: [
        { path: 'BookOwner' }, // populate book owner
        { path: 'PickupPoint' }, // populate pickup point
      ],
    })
    .sort({ createdAt: -1 });

  return result;
};

const getIncomingRequestFromDB = async (
  userId: string,
): Promise<IRequest[]> => {
  const result = await Request.find({ BookOwner: userId })
    .populate('requester')
    .populate('book')
    .populate({
      path: 'book',
      populate: [
        { path: 'BookOwner' }, // populate book owner
        { path: 'PickupPoint' }, // populate pickup point
      ],
    })
    .sort({ createdAt: -1 });

  return result;
};

// Update request status (accept/reject)
const updateRequestStatus = async (
  requestId: string,
  status: 'accepted' | 'rejected',
): Promise<IRequest | null> => {
  return await Request.findByIdAndUpdate(requestId, { status }, { new: true });
};

const findRequestByUserAndBook = async (userId: string, bookId: string) => {
  const request = await Request.findOne({
    requester: userId,
    book: bookId,
  }).sort({ updatedAt: -1 });
  // console.log('findRequestByUserAndBook:', request);
  return request; // returns null if no request found
};

const deleteRequest = async (id: string) => {
const tran_id = crypto.randomBytes(8).toString('hex').toUpperCase().slice(0,8);
  const requestInfo = await Request.findById(id)
    console.log('requestInfo', requestInfo);
    if (!requestInfo) {
      throw new Error("Request not found");
    }

  if (requestInfo.paymentStatus == "On Hold") {
   await PaymentService.makePayment(requestInfo?.requester, requestInfo?.requester, requestInfo?.book, requestInfo?.securityDepositAmount, tran_id,'Refunded');
  }

  const deletedRequest = await Request.findByIdAndDelete(id);
  

  return deletedRequest;
};

const updatePaymentInDB = async (requestId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requestdetails = await Request.findById(requestId)
      .populate("book")
      .populate("requester")
      .session(session);
    console.log('requestdetails', requestdetails);
    if (!requestdetails) {
      throw new Error("Request not found");
    }
    console.log('requester id', requestdetails.requester._id.toString());
      console.log('user id', userId.toString());
    if (requestdetails.requester._id.toString() !== userId.toString()) {
      throw new Error("Unauthorized: You can only update your own requests");
    }

    const payload: any = {};

    if (requestdetails.paymentStatus === "Pending") {
      payload["paymentStatus"] = "On Hold";
      payload["bookPrice"] = parseFloat(requestdetails.book.Price) || 0;
      payload["securityDepositStatus"] = "Hold";
    }

    if (requestdetails.book.Availability === "Lend" && requestdetails.book.RequireDeposit) {
      payload["securityDepositAmount"] = parseFloat(requestdetails.book.ActualPrice) || 0;
    } else {
      payload["securityDepositAmount"] = parseFloat(requestdetails?.bookPrice) || 0;
    }

    if (
      requestdetails.requester.CurrentBalance <
        (payload["bookPrice"] || 0) ||
      requestdetails.requester.CurrentBalance <
        (payload["securityDepositAmount"] || 0)
    ) {
      throw new Error("Insufficient balance to complete the payment");
    }


    // ✅ Update balance inside transaction
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.CurrentBalance -= payload["securityDepositAmount"];
    
    await user.save({ session });

    if (requestdetails.book.ActualPrice) {
      
      await PaymentService.makeHoldPayment({user:requestdetails.BookOwner,from:requestdetails.requester._id,book:requestdetails.book._id,amount:requestdetails.book.ActualPrice})
    }
    else {
      await PaymentService.makeHoldPayment({user:requestdetails.BookOwner,from:requestdetails.requester._id,book:requestdetails.book._id,amount:requestdetails.book.Price})
    }

    // ✅ Update request inside transaction
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      payload,
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedRequest;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const claimDeposit = async (requestId: string, userId: string) => {
  // Fetch the request
  const requestInfo = await Request.findById(requestId);
  if (!requestInfo) {
    throw new AppError(404, "Request not found");
  }

  const today = new Date();
  const returnDate = new Date(requestInfo.returnDate);

  // Check if returnDate has passed
  if (returnDate < today) {
    // Update the request to mark deposit as claimed
    requestInfo.claimed = true;
    const sec = requestInfo.securityDepositAmount||0;
    // add this field in your schema if not present
    requestInfo.securityDepositAmount = 0;
    requestInfo.status = "Completed";
    requestInfo.securityDepositStatus="Released To Owner"
    await requestInfo.save();
    UserService.currentBalanceUpdateFromDB((requestInfo.BookOwner).toString(), sec);
    const tran_id = crypto
    .randomBytes(8)
    .toString('hex')
    .toUpperCase()
    .slice(0, 8);
    const res = await PaymentService.makePayment(
          (requestInfo?.requester).toString(),
          (requestInfo?.BookOwner.toString()),
          (requestInfo?.book).toString(),
          sec,
          tran_id,
          'Completed',
        );
  }

  // Return updated request info
  return requestInfo;
};

export const RequestServices = {
  createRequestInDB,
  getRequestsByBookId,
  updateRequestStatus,
  findRequestByUserAndBook,
  getMyRequestsFromDB,
  getIncomingRequestFromDB,
  deleteRequest,
  updatePaymentInDB,
  claimDeposit
};
