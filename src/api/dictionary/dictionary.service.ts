import DictionaryModel from './dictionary.model';
import owlBot from '../../utils/owlBot';
import { IDictionary } from './dictionary.interface';

export const addWord = async (
  word: string
): Promise<IDictionary | undefined> => {
  if (!word) {
    throw new Error('Missing required fields!');
  }

  const exists = await DictionaryModel.exists({ word });

  if (exists) {
    throw new Error(`The word ${word} already exists.`);
  }

  const fetchedWord = await owlBot(word);
  if (fetchedWord) {
    const { definition, definitions, pronunciation } = fetchedWord;
    const newWord = await DictionaryModel.create({
      word,
      definition,
      definitions,
      pronunciation,
    });
    return newWord;
  }
};
