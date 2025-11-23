import AppError from '../../errors/AppError';
import { Payment } from '../payment/payment.model';
import { PaymentService } from '../payment/payment.service';
import { PaymentStatus } from '../request/request.interface';
import { Request } from '../request/request.model';
import { ReviewServices } from '../review/review.service';
import { SecretPin } from './secretpin.model';
import crypto from 'crypto';

// Generate a new PIN for a request
const generatePin = async (requestId: string) => {
  const pin = Math.floor(1000 + Math.random() * 9000).toString();

  // Remove any old PIN for this request
  await SecretPin.deleteMany({ requestId });

  // Create new PIN record
  await SecretPin.create({ requestId, pin });
  return pin;
};

// Verify a PIN
const verifyPin = async (
  requestId: string,
  pin: string,
  returnDate?: string,
) => {
  const record = await SecretPin.findOne({ requestId, pin });
  if (!record) {
    throw new AppError(400, 'Invalid or expired PIN');
  }
  const tran_id = crypto
    .randomBytes(8)
    .toString('hex')
    .toUpperCase()
    .slice(0, 8);
  const requestInfo = await Request.findById(requestId);
  if (!requestInfo.isHandovered && requestInfo.bookFor == 'Lend') {
    await Request.findByIdAndUpdate(
      requestId,
      {
        isHandovered: true,
        securityDepositAmount:
          requestInfo?.securityDepositAmount - requestInfo?.bookPrice,
        paymentStatus: PaymentStatus.RELEASED_TO_OWNER,
        returnDate: new Date(returnDate),
      },
      { new: true },
    );

    const res = await PaymentService.makePayment(
      requestInfo?.requester,
      requestInfo?.BookOwner,
      requestInfo?.book,
      requestInfo?.bookPrice,
      tran_id,
    );
  }

  if (
    requestInfo.isHandovered &&
    !requestInfo?.isReturned &&
    requestInfo.bookFor == 'Lend'
  ) {

    const isReviewedBook = (await ReviewServices.getMyReviewForBookFromDB(requestInfo?.requester, requestInfo?.book)) ? true : false;
    

    await Request.findByIdAndUpdate(
      requestId,
      {
        isReturned: true,
        securityDepositAmount: 0,
        paymentStatus: PaymentStatus.REFUNDED,
        returnedAt: new Date(),
        securityDepositStatus: 'Refunded',
        status: 'Completed',
        isReviewedBook,
      },
      { new: true },
    );

    const res = await PaymentService.makePayment(
      requestInfo?.requester,
      requestInfo?.requester,
      requestInfo?.book,
      requestInfo?.securityDepositAmount,
      tran_id,
      'Refunded',
    );
  }

  if (requestInfo.bookFor == 'Sell') {

        const isReviewedBook = (await ReviewServices.getMyReviewForBookFromDB(requestInfo?.requester, requestInfo?.book)) ? true : false;
    

    await Request.findByIdAndUpdate(
      requestId,
      {
        isHandovered: true,
        securityDepositAmount: 0,
        paymentStatus: PaymentStatus.RELEASED_TO_OWNER,
        securityDepositStatus: 'None',
        status: 'Completed',
        isReviewedBook,
      },
      { new: true },
    );

    const res = await PaymentService.makePayment(
      requestInfo?.requester,
      requestInfo?.BookOwner,
      requestInfo?.book,
      requestInfo?.bookPrice,
      tran_id,
      'Completed',
    );
  }

  // Delete the PIN after successful verification
  await SecretPin.deleteOne({ _id: record._id });
  return true;
};

// Get the PIN for a request (for borrower viewing)
const getPin = async (requestId: string) => {
  const record = await SecretPin.findOne({ requestId });
  if (!record) {
    throw new AppError(404, 'No PIN found for this request');
  }
  return record.pin;
};

export const SecretPinService = {
  generatePin,
  verifyPin,
  getPin,
};
