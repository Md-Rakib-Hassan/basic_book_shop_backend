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


export const UserService = {
  createUserIntoDB,
  getSingleUserFromDBByEmail,
  getSingleUserFromDBById
};
