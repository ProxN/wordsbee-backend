import { Document } from 'mongoose';

export interface IUserSchema extends Document {
  fullname: string;
  email: string;
  password?: string;
  passwordChangedAt?: number;
  role?: 'admin' | 'user';
  createdAt?: number;
  updateAt?: number;
}

export interface IUser extends IUserSchema {
  correctPassword(password: string, hashPassword: string): boolean;
  changedPasswordAfter(jwtTimestamp: number): boolean;
}
