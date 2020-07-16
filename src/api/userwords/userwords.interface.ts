import { Document } from 'mongoose';
import { IUser } from '../users/interfaces';
import { IDictionary } from '../dictionary/dictionary.interface';

export interface IUserWordsSchema extends Document {
  user: IUser['_id'];
  word: IDictionary['_id'];
  updateAt?: number;
  createAt?: number;
}

export interface IUserWords extends IUserWordsSchema {
  word: IDictionary;
}
