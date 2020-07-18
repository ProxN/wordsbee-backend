import UserWordsModel from './userwords.model';
import * as DictionaryService from '../dictionary/dictionary.service';
import DictionaryModel from '../dictionary/dictionary.model';
import AppError from '../../utils/appError';
import { IDictionary } from '../dictionary/dictionary.interface';
import { IUserWords } from './userwords.interface';
import Cache from '../../utils/cache';

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new Cache(ttl); // Create a new cache service instance

export const addWord = async (
  name: string,
  userId: string
): Promise<IUserWords> => {
  let word = await DictionaryModel.findOne({ word: name });

  if (!word) {
    word = (await DictionaryService.addWord(name)) as IDictionary;
  }

  const existsInUserWords = await UserWordsModel.exists({
    word: word._id,
    user: userId,
  });

  if (existsInUserWords) {
    throw new AppError('Word already exists in your list.', 400);
  }

  const newUserWord = await UserWordsModel.create({
    user: userId,
    word: word._id,
  });

  cache.del(`getUserWords_${userId}`);

  return await newUserWord.populate('word').execPopulate();
};

export const getUserWords = async (userId: string): Promise<IUserWords[]> => {
  const key = `getUserWords_${userId}`;
  const words = await cache.get(
    key,
    async () =>
      await UserWordsModel.find({ user: userId })
        .select('-user')
        .populate('word')
  );
  return words;
};

export const getUserWord = async (
  wordId: string,
  userId: string
): Promise<IUserWords> => {
  const key = `getUserWord_${wordId}`;
  const userWord = await cache.get(
    key,
    async () =>
      await UserWordsModel.findOne({ _id: wordId, user: userId }).populate(
        'word'
      )
  );

  if (!userWord) {
    throw new AppError('Not Found.', 404);
  }

  return await userWord;
};

export const deleteUserWord = async (
  id: string,
  userId: string
): Promise<void> => {
  await UserWordsModel.findOneAndDelete({ _id: id, user: userId });
  cache.del([`getUserWords_${userId}`, `getUserWord_${id}`]);
};
