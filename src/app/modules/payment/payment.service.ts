import mongoose from 'mongoose';
import UserModel from '../user/user.model';
import { UserService } from '../user/user.service';
import { PaymentStatus, IPayment } from './payment.interface';
import { Payment } from './payment.model';
import crypto from 'crypto';

const addMoneyToWallet = async (
  userId: string,
  amount: number,
  transactionId: string,
): Promise<IPayment> => {
  const payment = new Payment({
    user: userId,
    amount,
    transactionId,
    status: PaymentStatus.PENDING,
  });
  await payment.save();
  return payment;
};


const withdraw = async (
  userId: string,
  amount: number,
) => {
  const transactionId = crypto
    .randomBytes(8)
    .toString('hex')
    .toUpperCase()
    .slice(0, 8);
  const payment = new Payment({
    user: userId,
    amount,
    transactionId,
    status: PaymentStatus.WITHDRAW,
  });
  await payment.save();
  await UserService.currentBalanceUpdateFromDB(userId, -amount,)

  return payment;
};

const getPaymentByTransactionId = async (
  transactionId: string,
): Promise<IPayment | null> => {
  return Payment.findOne({ transactionId });
};

const updatePaymentStatus = async (
  transactionId: string,
  status: PaymentStatus,
): Promise<IPayment | null> => {
  return Payment.findOneAndUpdate({ transactionId }, { status }, { new: true });
};

const getPaymentsByUser = async (userId: string): Promise<IPayment[]> => {
  return Payment.find({
    $or: [{ user: userId }, { from: userId }],
  })
    .populate('user')
    .populate('book')
    .populate('from')
    .sort({ createdAt: -1 });
};

const makeHoldPayment = async ({ from, user, book, amount }) => {
  const transactionId = crypto
    .randomBytes(8)
    .toString('hex')
    .toUpperCase()
    .slice(0, 8);
  const res = await Payment.create({
    user,
    amount,
    status: PaymentStatus.HOLD,
    book,
    from,
    transactionId,
  });
  return res;
};

const makePayment = async (
  from: string,
  user: string,
  book: string,
  amount: number,
  transactionId: string,
  status = PaymentStatus.COMPLETED,
  bothTransaction?: boolean,
): Promise<IPayment> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Deduct balance from borrower
    if (bothTransaction)
      await UserService.currentBalanceUpdateFromDB(from, -amount, session);

    // Step 2: Add balance to owner
    const userTrans = await UserModel.findById(user).session(session);
    if (!userTrans) {
      throw new Error('User not found');
    }

    if (typeof userTrans.CurrentBalance === 'number') {
      userTrans.CurrentBalance += amount;
    } else {
      userTrans.CurrentBalance = amount;
    }
    await userTrans.save({ session });

    // Step 3: Save payment record
    const payment = new Payment({
      user,
      from,
      book,
      amount,
      transactionId,
      status,
    });

    await payment.save({ session });

    // Commit if all succeed
    await session.commitTransaction();
    session.endSession();

    return payment;
  } catch (error) {
    // Rollback everything if any step fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllTransactionsFromDB = async ({
  page,
  limit,
  search,
  status,
  dateFrom,
  dateTo,
  sortBy = "createdAt",
  order = 1,
}) => {
  const skip = (page - 1) * limit;

  const match: any = {};

  if (status) {
    match.status = status;
  }

  if (dateFrom || dateTo) {
    match.createdAt = {};
    if (dateFrom) match.createdAt.$gte = new Date(dateFrom);
    if (dateTo) match.createdAt.$lte = new Date(dateTo);
  }

  const pipeline: any[] = [
    { $match: match },
    {
      $lookup: {
        from: "users", 
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "from",
      },
    },
    { $unwind: { path: "$from", preserveNullAndEmptyArrays: true } },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { transactionId: { $regex: search, $options: "i" } },
          { "user.Name": { $regex: search, $options: "i" } },
          { "from.Name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push({ $sort: { [sortBy]: order } });
  pipeline.push({ $skip: skip });
  // pipeline.push({ $limit: limit });

  const transactions = await Payment.aggregate(pipeline);

  const totalPipeline = [...pipeline];
  totalPipeline.pop(); // remove limit
  totalPipeline.pop(); // remove skip
  totalPipeline.push({ $count: "total" });

  const totalResult = await Payment.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  return {
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};


export const PaymentService = {
  addMoneyToWallet,
  getPaymentByTransactionId,
  updatePaymentStatus,
  getPaymentsByUser,
  makePayment,
  makeHoldPayment,
  getAllTransactionsFromDB,
  withdraw
};
