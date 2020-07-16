import * as userWordsService from './userwords.service';
import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';

export const addUserWord = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userword = await userWordsService.addWord(
      req.body.word,
      req.currentUser._id
    );
    res.status(201).json({
      status: 'success',
      data: userword,
    });
  }
);

export const getUserWords = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const words = await userWordsService.getUserWords(req.currentUser._id);
    res.status(200).json({
      status: 'success',
      results: words.length,
      data: words,
    });
  }
);

export const getUserWord = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const word = await userWordsService.getUserWord(
      req.params.wordId,
      req.currentUser._id
    );
    res.status(200).json({
      status: 'success',
      data: word,
    });
  }
);

export const deleteUserWord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await userWordsService.deleteUserWord(
      req.params.wordId,
      req.currentUser._id
    );

    res.status(204).json({
      message: 'success',
      data: null,
    });
  }
);
