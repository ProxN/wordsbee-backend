import mongoose, { Schema } from 'mongoose';
import { IUserWords } from './userwords.interface';

const userWordsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    word: {
      type: Schema.Types.ObjectId,
      ref: 'Dictionary',
    },
    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: { currentTime: () => Math.floor(new Date().getTime() / 1000) } }
);

const UserWordsModel = mongoose.model<IUserWords>('Userwords', userWordsSchema);

export default UserWordsModel;
