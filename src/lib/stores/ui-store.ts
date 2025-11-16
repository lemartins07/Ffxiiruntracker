'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

interface UIState {
  themeMode: ThemeMode;
  showJapaneseNames: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleJapaneseNames: () => void;
}

const createStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      key: () => null,
      length: 0,
      clear: () => {},
    } as Storage;
  }
  return window.localStorage;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      showJapaneseNames: true,
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleJapaneseNames: () => set((state) => ({ showJapaneseNames: !state.showJapaneseNames })),
    }),
    {
      name: 'ffxii-ui-state',
      storage: createJSONStorage(createStorage),
      skipHydration: true,
    }
  )
);
