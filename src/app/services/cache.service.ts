import { Injectable } from '@angular/core';
import { Data } from '../interfaces/data';
import { CacheEntry } from '../interfaces/cache';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor() {}

  private cache = new Map<string, CacheEntry>();
  private cacheDuration = 5 * 60 * 1000;

  // retrieve cached data if it exists and is not expired
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiration) {
      return entry.data;
    }
    return null;
  }
  // store data in the cahe with an expiration timestamp
  set(key: string, data: any): void {
    const expiration = Date.now() + this.cacheDuration;
    this.cache.set(key, { data, expiration });
  }

  // clear all cache
  clear() {
    this.cache.clear();
  }
}
