import axios from 'axios';
import getDefinition from './scraper';
// import AppError from './appError';

const BASE_URL = 'https://owlbot.info/api/v4/dictionary/';

interface IOwlBotResponse {
  definitions: [
    {
      type: string;
      definition: string;
      example: string;
      image_url?: string | null;
      emoji?: string | null;
    }
  ];
  definition: string;
  word: string;
  pronunciation: string;
}

interface IDefinitions {
  partOfSpeech: string;
  definition: string;
  examples: string[];
}

interface IData {
  definition: string;
  pronunciation: string;
  definitions: IDefinitions[];
}

const fetchWord = async (word: string): Promise<void | IData> => {
  try {
    const res = await axios.get<IOwlBotResponse>(`${BASE_URL}${word}`, {
      headers: {
        Authorization: `token ${process.env.OWLBOT_API_KEY}`,
      },
    });

    const definitions = res.data.definitions.map((el) => ({
      partOfSpeech: el.type,
      definition: el.definition,
      examples: el.example ? [el.example] : [],
    }));

    const definition = await getDefinition(word);

    return {
      definition,
      pronunciation: res.data.pronunciation,
      definitions,
    };
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error('Ivalid OWLBOT token.');
    } else {
      throw new Error(`There is no word with the name /${word}/`);
    }
  }
};

export default fetchWord;
