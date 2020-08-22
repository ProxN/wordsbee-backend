import jwt from 'jsonwebtoken';
import { IUser } from '../api/users/interfaces';
import { Response } from 'express';

interface IObj {
  data: { user: IUser; token: string };
  res: Response;
  statusCode: number;
}
export const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });
  return token;
};

export const sendToken = (obj: IObj): void => {
  const { data, res, statusCode } = obj;
  const { user, token } = data;
  let cookiesExpires = 10;

  if (process.env.JWT_COOKIE_EXPIRES_IN) {
    cookiesExpires = +process.env.JWT_COOKIE_EXPIRES_IN;
  }
  const cookiesOptions = {
    expires: new Date(Date.now() + cookiesExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
  res.cookie('jwtToken', token, cookiesOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};
