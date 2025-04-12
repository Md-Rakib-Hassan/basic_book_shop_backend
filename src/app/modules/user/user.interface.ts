import { USER_ROLE } from './user.constants';

export interface IUser {
  Name: string;
  ProfileImage: string;
  Email: string;
  Password: string;
  Address: string;
  Phone: string;
  UserType: 'admin' | 'user';
  isBlocked: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
