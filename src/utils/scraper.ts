import axios from 'axios';
import cheerio from 'cheerio';

interface word {
  definition: string;
}

const fetchDefinition = async (word: string) => {
  const page = await axios.get(`https://www.vocabulary.com/dictionary/${word}`);
  return cheerio.load(page.data);
};

const getDefinition = async (word: string): Promise<string> => {
  const scrape = await fetchDefinition(word);
  return scrape('.short').text();
};
export default getDefinition;
