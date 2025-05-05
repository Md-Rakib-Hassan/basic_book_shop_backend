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


export const UserService = {
  createUserIntoDB,
  getSingleUserFromDBByEmail,
  getSingleUserFromDBById,
  getAllUsersFromDB,
  blockUserFromDB
};
