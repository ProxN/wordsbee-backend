import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as authService from './auth.service';
import { sendToken } from '../../utils/token';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = await authService.signup(req.body);

    sendToken({
      data,
      statusCode: 200,
      req,

      res,
    });
  }
);

export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = await authService.signin(req.body);

    sendToken({
      data,
      statusCode: 200,
      req,
      res,
    });
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = await authService.updatePassword({
      userId: req.currentUser._id,
      oldPass: req.body.oldPass,
      newPass: req.body.newPass,
    });

    sendToken({
      data,
      statusCode: 201,
      req,

      res,
    });
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookiesOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: false,
    };
    if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
    res.cookie('jwtToken', 'logedout', cookiesOptions);

    res.status(200).json({
      status: 'success',
    });
  }
);
