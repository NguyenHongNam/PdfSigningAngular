import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Save string:number pair to local storage
  saveKeyValuePair(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  }

  // Retrieve number value from local storage
  getNumberValue(key: string): number | null {
    const value = localStorage.getItem(key);
    return value ? parseInt(value, 10) : null;
  }

  // Remove key-value pair from local storage
  removeKeyValuePair(key: string): void {
    localStorage.removeItem(key);
  }

  setNumberValue(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  }

  // Clear all data from local storage
  clearLocalStorage(): void {
    localStorage.clear();
  }
}
