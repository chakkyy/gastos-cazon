import type { MonthlyExpense } from '../types';

const CACHE_KEY = 'expense-data-cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheData {
  data: MonthlyExpense[];
  timestamp: number;
}

/**
 * Retrieves cached expense data from localStorage if valid
 * @returns Cached data or null if cache is invalid/missing
 */
export function getCachedData(): MonthlyExpense[] | null {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired (older than 1 hour)
    if (now - timestamp > CACHE_DURATION) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Cache expired, clearing...');
      }
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Using cached data');
    }
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to read cache:', error);
    }
    return null;
  }
}

/**
 * Stores expense data in localStorage with current timestamp
 * @param data - Array of monthly expenses to cache
 */
export function setCachedData(data: MonthlyExpense[]): void {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    if (process.env.NODE_ENV === 'development') {
      console.log('Data cached successfully');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to cache data:', error);
    }
  }
}

/**
 * Clears the expense data cache from localStorage
 */
export function clearCache(): void {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
    if (process.env.NODE_ENV === 'development') {
      console.log('Cache cleared');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to clear cache:', error);
    }
  }
}

/**
 * Checks if cached data exists and is still valid
 * @returns true if cache is valid, false otherwise
 */
export function isCacheValid(): boolean {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return false;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const { timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();

    return now - timestamp <= CACHE_DURATION;
  } catch {
    return false;
  }
}
