import { Data } from './data';

export interface CacheEntry {
  data: Data;
  expiration: number;
}
