import mongoose, { Schema } from 'mongoose';
import { IDictionary } from './dictionary.interface';

const dictionarySchema = new Schema(
  {
    word: {
      type: String,
      required: [true, 'Please Provide a word.'],
      unique: true,
      lowercase: true,
    },
    definition: String,
    definitions: [
      {
        partOfSpeech: String,
        definition: String,
        examples: [String],
      },
    ],
    pronunciation: {
      type: String,
    },
    updateAt: Number,
    createAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(new Date().getTime() / 1000) },
  }
);

const DictionaryModel = mongoose.model<IDictionary>(
  'Dictionary',
  dictionarySchema
);

export default DictionaryModel;
