import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import UserModel from './user.model';

const createUserIntoDB = async (userData: IUser) => {
        const isUserExist = await getSingleUserFromDBByEmail(userData.Email);
        if (isUserExist) {
            throw new AppError(400, 'User already exists');
        }
        const createdUser = await UserModel.create(userData);
        const result = {
            _id: createdUser._id,
            Name: createdUser.Name,
            Email: createdUser.Email,
        };
        return result;
    
};

const getSingleUserFromDBByEmail = async (Email: string) => {
  const result = await UserModel.findOne({ Email });
  return result;
};

const getSingleUserFromDBByID = async (id: string) => {
  const result = await UserModel.findById(id);
  return result;
};

const getSingleUserFromDBById = async (id: string) => {
  const result = await UserModel.findById(id);
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllUsersFromDB = async (search: any) => {
  const searchCriteria = search
    ? {
        $and: [
          { Name: search.Name },
          { Email: search.Email },
          { Phone: search.Phone },
          { UserType: search.UserType },
        ].filter((criteria) => Object.values(criteria)[0] !== undefined),
      }
    : {};
  const result = await UserModel.find(searchCriteria);
  return result;
};

const blockUserFromDB = async (id: string) => { 
  const result = await UserModel.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  return result;
}

const unblockUserFromDB = async (id: string) => { 
  const result = await UserModel.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  return result;
}

const currentBalanceUpdateFromDB = async (
  id: string,
  amount: number,
  session?: any
) => {
  const user = await UserModel.findById(id).session(session);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Update balance
  user.CurrentBalance += amount;

  // Ensure balance doesn’t go negative
  if (user.CurrentBalance < 0) {
    throw new AppError(400, "Insufficient balance");
  }

  await user.save({ session });
  return user;
};



export const UserService = {
  createUserIntoDB,
  getSingleUserFromDBByEmail,
  getSingleUserFromDBById,
  getAllUsersFromDB,
  blockUserFromDB,
  unblockUserFromDB,
  currentBalanceUpdateFromDB,
  getSingleUserFromDBByID,
};
