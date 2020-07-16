import translateService from './translate.service';
import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';

const translate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await translateService(
      req.query.word as string,
      req.query.to as string
    );
    res.status(200).json({
      status: 'success',
      data: data,
    });
  }
);
export default translate;
