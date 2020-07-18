import NodeCache from 'node-cache';
import { IUserWords } from '../api/userwords/userwords.interface';

class Cache {
  cache: NodeCache;
  constructor(TTL: number) {
    this.cache = new NodeCache({
      stdTTL: TTL,
      checkperiod: TTL * 0.2,
      useClones: false,
    });
  }

  get = async (key: string, storeFunction: () => Promise<any>) => {
    const value = this.cache.get(key);
    if (value) {
      return value;
    }

    const results = await storeFunction();
    this.cache.set(key, results);
    return results;
  };

  del = (keys: string[] | string) => {
    this.cache.del(keys);
  };

  delStartWith = (str: string) => {
    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(str) === 0) {
        this.del(key);
      }
    }
  };
  flush = () => {
    this.cache.flushAll();
  };
}

export default Cache;
