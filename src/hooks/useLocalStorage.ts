"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const stored = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key),
    () => null,
  );

  const value = stored === null ? initialValue : (JSON.parse(stored) as T);

  const setValue = (next: T) => {
    window.localStorage.setItem(key, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  };

  return [value, setValue] as const;
}
