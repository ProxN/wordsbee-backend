import AppError from '../utils/appError';
import { Request, Response, NextFunction } from 'express';

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleDublicateErrorDB = (err: AppError) => {
  if (err.message.includes('email')) {
    return new AppError('Email already in use.', 400);
  }

  const value = err.message.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value ${
    value && value[0]
  }. Please use another value!`;
  return new AppError(message, 400);
};

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
    console.log('PRoduction');
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJwtExpiredError();
    if (err.code === 11000) error = handleDublicateErrorDB(error);
    snedErrorProd(error, res);
  }
};

export default errorHandler;
