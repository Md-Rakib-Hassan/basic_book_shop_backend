import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    Name: { type: String, required: true },
    ProfileImage: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    UserType: {
      type: String,
      default: 'user',
    },
    Address: { type: String,required: true },
    Phone: { type: String, required: true,unique: true},
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
