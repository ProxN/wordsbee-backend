import axios from 'axios';
import AppError from '../../utils/appError';
import Cache from '../../utils/cache';

const BASE_URL = 'https://api.mymemory.translated.net/';

const key = process.env.TRANSLATE_KEY;
const ttl = 120 * 60 * 1; // cache for 2 Hour
const cache = new Cache(ttl); // Create a new cache service instance

interface IResponse {
  responseData: {
    translatedText: string;
  };
  responderId: string;
}

export default async (word: string, to: string): Promise<string> => {
  const cachKey = `transalte_${word}_${to}`;
  const res: any = await cache.get(
    cachKey,
    async () =>
      await axios.get<IResponse>(
        `${BASE_URL}get?q=${word}&langpair=en|${to}&key=${key}`
      )
  );

  if (res.data && !res.data.responderId) {
    throw new AppError('Error', 400);
  }
  return res.data && res.data.responseData.translatedText;
};
