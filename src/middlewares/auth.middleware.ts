import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import UserModel from '../api/users/users.model';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';

interface IDecodeToken {
  id: string;
  iat: number;
  exp: number;
}

const checkToken = (auth: string): string => {
  let token = '';
  if (auth && auth.startsWith('Bearer')) {
    token = auth.split(' ')[1];
  } else {
    token = auth;
  }
  if (!token) {
    throw new AppError(
      'You are not logged in. Please log in to get access.',
      401
    );
  }
  return token;
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies ? req.cookies.jwtToken : undefined;
    const token = req.headers.authorization
      ? checkToken(req.headers.authorization)
      : checkToken(cookie);

    const decodeToken = (await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET as string
    )) as IDecodeToken;

    const user = await UserModel.findById(decodeToken.id);
    if (!user) {
      return next(
        new AppError(
          'The user belonging to this token  does no longer exists.',
          401
        )
      );
    }

    if (user.changedPasswordAfter(decodeToken.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    req.currentUser = user;
    next();
  }
);
