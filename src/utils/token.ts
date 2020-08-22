import jwt from 'jsonwebtoken';
import { IUser } from '../api/users/interfaces';
import { Response, Request } from 'express';

interface IObj {
  data: { user: IUser; token: string };
  res: Response;
  req: Request;
  statusCode: number;
}
export const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });
  return token;
};

export const sendToken = (obj: IObj): void => {
  const { data, res, statusCode, req } = obj;
  const { user, token } = data;
  let cookiesExpires = 10;

  if (process.env.JWT_COOKIE_EXPIRES_IN) {
    cookiesExpires = +process.env.JWT_COOKIE_EXPIRES_IN;
  }

  res.cookie('jwtToken', token, {
    expires: new Date(Date.now() + cookiesExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};
