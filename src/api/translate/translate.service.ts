import axios from 'axios';
import AppError from '../../utils/appError';

const BASE_URL = 'https://api.mymemory.translated.net/';
const key = process.env.TRANSLATE_KEY;

interface IResponse {
  responseData: {
    translatedText: string;
  };
  responderId: string;
}

export default async (word: string, to: string): Promise<string> => {
  const res = await axios.get<IResponse>(
    `${BASE_URL}get?q=${word}&langpair=en|${to}&key=${key}`
  );

  if (!res.data.responderId) {
    throw new AppError('Error', 400);
  }
  return res.data.responseData.translatedText;
};
