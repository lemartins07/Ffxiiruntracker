'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PlaythroughVersion = 'IZJS' | 'Zodiac Age';

export interface PlaythroughSummary {
  id: string;
  title: string;
  version: PlaythroughVersion;
  startedAt: string;
  currentSectionCode?: string;
}

export interface XpSnapshot {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
}

export interface InventoryState {
  [itemId: string]: { obtained: boolean; obtainedAt?: string };
}

interface PlaythroughState {
  playthroughs: Record<string, PlaythroughSummary>;
  currentPlaythroughId?: string;
  xp: Record<string, XpSnapshot>;
  inventory: Record<string, InventoryState>;
  createPlaythrough: (payload: { title: string; version: PlaythroughVersion }) => void;
  setCurrentPlaythrough: (id: string) => void;
  updateCurrentSection: (code: string) => void;
  addXp: (amount: number) => void;
  toggleInventoryItem: (itemId: string) => void;
}

const defaultXp: XpSnapshot = {
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
};

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

export const usePlaythroughStore = create<PlaythroughState>()(
  persist(
    (set, get) => ({
      playthroughs: {},
      currentPlaythroughId: undefined,
      xp: {},
      inventory: {},
      createPlaythrough: ({ title, version }) => {
        const id = `pt-${Date.now()}`;
        const summary: PlaythroughSummary = {
          id,
          title,
          version,
          startedAt: new Date().toISOString(),
        };
        set((state) => ({
          playthroughs: { ...state.playthroughs, [id]: summary },
          currentPlaythroughId: id,
          xp: { ...state.xp, [id]: { ...defaultXp } },
          inventory: { ...state.inventory, [id]: {} },
        }));
      },
      setCurrentPlaythrough: (id) => {
        if (!get().playthroughs[id]) return;
        set({ currentPlaythroughId: id });
      },
      updateCurrentSection: (code) => {
        const { currentPlaythroughId } = get();
        if (!currentPlaythroughId) return;
        set((state) => ({
          playthroughs: {
            ...state.playthroughs,
            [currentPlaythroughId]: {
              ...state.playthroughs[currentPlaythroughId],
              currentSectionCode: code,
            },
          },
        }));
      },
      addXp: (amount) => {
        const { currentPlaythroughId } = get();
        if (!currentPlaythroughId) return;
        const snapshot = get().xp[currentPlaythroughId] || { ...defaultXp };
        let currentXp = snapshot.currentXp + amount;
        let level = snapshot.level;
        let xpToNextLevel = snapshot.xpToNextLevel;
        while (currentXp >= xpToNextLevel) {
          currentXp -= xpToNextLevel;
          level += 1;
          xpToNextLevel = Math.floor(100 * Math.pow(1.35, level - 1));
        }
        set((state) => ({
          xp: {
            ...state.xp,
            [currentPlaythroughId]: {
              level,
              currentXp,
              xpToNextLevel,
            },
          },
        }));
      },
      toggleInventoryItem: (itemId) => {
        const { currentPlaythroughId } = get();
        if (!currentPlaythroughId) return;
        const currentInventory = get().inventory[currentPlaythroughId] || {};
        const isObtained = currentInventory[itemId]?.obtained;
        set((state) => ({
          inventory: {
            ...state.inventory,
            [currentPlaythroughId]: {
              ...currentInventory,
              [itemId]: { obtained: !isObtained, obtainedAt: !isObtained ? new Date().toISOString() : undefined },
            },
          },
        }));
        if (!isObtained) {
          get().addXp(10);
        }
      },
    }),
    {
      name: 'ffxii-playthrough-state',
      storage: createJSONStorage(createStorage),
      skipHydration: true,
    }
  )
);
