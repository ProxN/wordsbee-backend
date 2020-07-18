import { Error as MongooseError } from 'mongoose';
class AppError extends MongooseError {
  isOperational: boolean;
  status: string;
  statusCode: number;
  code: number | undefined;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
