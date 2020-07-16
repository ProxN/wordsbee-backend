import AppError from '../utils/appError';
import { Request, Response, NextFunction } from 'express';

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, res: Response) => {
  const { statusCode, stack } = err;

  res.status(statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack,
  });
};

const snedErrorProd = (err: AppError, res: Response) => {
  const { statusCode, message, status } = err;
  if (err.isOperational) {
    res.status(statusCode).json({
      status,
      message,
    });
  } else {
    console.log('Error', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJwtExpiredError();
    snedErrorProd(error, res);
  }
};

export default errorHandler;
