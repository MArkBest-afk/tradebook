"use client";

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize with initialValue to prevent hydration mismatch.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This effect runs on the client-side after initial render.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log("Error reading from localStorage:", error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(currentStoredValue => {
        const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.log("Error writing to localStorage:", error);
    }
  }, [key]);

  return [storedValue, setValue];
}
