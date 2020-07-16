import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser } from './interfaces';

const usersSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Please provide a fullname.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a email.'],
      validate: [validator.isEmail, 'Please provide a valid email.'],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minLength: [8, 'password length must be of 8-15 and alphanumeric.'],
      select: false,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user'],
    },
    passwordChangedAt: Number,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(new Date().getTime() / 1000) },
  }
);

usersSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

usersSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Math.floor((Date.now() - 1000) / 1000);
  next();
});

usersSchema.methods.correctPassword = async function (
  password: string,
  hashPassword: string
) {
  return await bcrypt.compare(password, hashPassword);
};

usersSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    return JWTTimestamp < this.passwordChangedAt;
  }
  return false;
};

const userModel = mongoose.model<IUser>('User', usersSchema);

export default userModel;
