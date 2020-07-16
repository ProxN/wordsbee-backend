import UserWordsModel from './userwords.model';
import * as DictionaryService from '../dictionary/dictionary.service';
import DictionaryModel from '../dictionary/dictionary.model';
import AppError from '../../utils/appError';
import { IDictionary } from '../dictionary/dictionary.interface';
import { IUserWords } from './userwords.interface';

export const addWord = async (
  name: string,
  userId: string
): Promise<IUserWords> => {
  let word = await DictionaryModel.findOne({ word: name });

  if (!word) {
    word = (await DictionaryService.addWord(name)) as IDictionary;
  }

  const existsInUserWords = await UserWordsModel.exists({ word: word._id });

  if (existsInUserWords) {
    throw new AppError('Word already added to your list.', 400);
  }

  const newUserWord = await UserWordsModel.create({
    user: userId,
    word: word._id,
  });

  return await newUserWord.populate('word').execPopulate();
};

export const getUserWords = async (userId: string): Promise<IUserWords[]> => {
  const words = await UserWordsModel.find({ user: userId })
    .select('-user')
    .populate('word');

  return words;
};

export const getUserWord = async (
  wordId: string,
  userId: string
): Promise<IUserWords> => {
  const userWord = await UserWordsModel.findOne({ _id: wordId, user: userId });
  if (!userWord) {
    throw new AppError('Not Found.', 404);
  }

  return await userWord.populate('word').execPopulate();
};

export const deleteUserWord = async (
  id: string,
  userId: string
): Promise<void> => {
  await UserWordsModel.findOneAndDelete({ _id: id, user: userId });
};
