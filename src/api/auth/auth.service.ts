import UserModel from '../users/users.model';
import { IsignUpBody, ISign, IUpdatePassBody } from './auth.interface';
import { IUser } from '../users/interfaces';
import { generateToken } from '../../utils/token';
import AppError from '../../utils/appError';

interface IReturn {
  user: IUser;
  token: string;
}

export const signup = async (body: IsignUpBody): Promise<IReturn> => {
  const { email, fullname, password } = body;

  if (!email || !fullname || !password) {
    throw new Error('Missing required fields!');
  }
  const user = await UserModel.create({
    email,
    fullname,
    password,
  });

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

export const signin = async (body: ISign): Promise<IReturn> => {
  const { password, email } = body;

  if (!password || !email) {
    throw new Error('Please provide email and password!');
  }

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password || ''))) {
    throw new Error('Email or Password is incorrect!');
  }

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

export const updatePassword = async (
  data: IUpdatePassBody
): Promise<IReturn> => {
  const { newPass, oldPass, userId } = data;

  const user = await UserModel.findById(userId).select('+password');

  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (!(await user.correctPassword(oldPass, user.password || ''))) {
    throw new AppError('Your current password is worng.', 401);
  }

  user.password = newPass;
  await user.save();

  const token = generateToken(user._id);
  return {
    user,
    token,
  };
};
