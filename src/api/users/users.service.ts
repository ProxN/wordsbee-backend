import UserModel from './users.model';
import { IUser } from './interfaces';
import userModel from './users.model';

export const getAllUsers = async (): Promise<IUser[]> => {
  const users = await UserModel.find();
  return users;
};

export const getUser = async (userId: string): Promise<IUser | null> => {
  const user = await userModel.findById(userId);
  return user;
};
