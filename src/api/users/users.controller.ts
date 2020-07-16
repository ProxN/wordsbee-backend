import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as usersService from './users.service';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await usersService.getAllUsers();
    res.status(200).json({
      status: 'success',
      data: users,
    });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await usersService.getUser(req.currentUser._id);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  }
);
