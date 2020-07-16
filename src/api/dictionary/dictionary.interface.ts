import { Document } from 'mongoose';

export interface IDictionary extends Document {
  word: string;
  definition: string;
  definitions: [
    {
      partOfSpeech: string;
      definition: string;
      examples: string[];
    }
  ];
  pronunciation: string;
  updateAt?: number;
  createAt?: number;
}
