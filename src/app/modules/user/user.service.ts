import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import UserModel from './user.model';

const createUserIntoDB = async (userData: IUser) => {
        const isUserExist = await getSingleUserFromDB(userData.email);
        if (isUserExist) {
            throw new AppError(400, 'User already exists');
        }
        const createdUser = await UserModel.create(userData);
        const result = {
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
        };
        return result;
    
};

const getSingleUserFromDB = async (email: string) => {
  const result = await UserModel.findOne({ email });
  return result;
};

const getSingleUserFromDBById = async (id: string) => {
  const result = await UserModel.findById(id);
  return result;
};


export const UserService = {
  createUserIntoDB,
  getSingleUserFromDB,
  getSingleUserFromDBById
};
