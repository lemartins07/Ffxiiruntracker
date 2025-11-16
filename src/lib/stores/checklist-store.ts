'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChecklistItem } from '@/lib/guide-domain';
import { usePlaythroughStore } from './playthrough-store';

interface ChecklistProgress {
  [itemId: string]: { completed: boolean; completedAt?: string };
}

interface ChecklistState {
  completion: Record<string, ChecklistProgress>;
  toggleItem: (item: ChecklistItem) => void;
  getSectionProgress: (sectionCode: string, checklist: ChecklistItem[]) => number;
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

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      completion: {},
      toggleItem: (item) => {
        const playthroughId = usePlaythroughStore.getState().currentPlaythroughId;
        if (!playthroughId) return;
        const current = get().completion[playthroughId] || {};
        const isDone = current[item.id]?.completed;
        const updated = {
          ...current,
          [item.id]: { completed: !isDone, completedAt: !isDone ? new Date().toISOString() : undefined },
        };
        set((state) => ({
          completion: {
            ...state.completion,
            [playthroughId]: updated,
          },
        }));
        const xpAmount = item.category === 'story' ? 15 : 8;
        if (!isDone) {
          usePlaythroughStore.getState().addXp(xpAmount);
        }
      },
      getSectionProgress: (sectionCode, checklist) => {
        const playthroughId = usePlaythroughStore.getState().currentPlaythroughId;
        if (!playthroughId) return 0;
        const current = get().completion[playthroughId] || {};
        if (checklist.length === 0) return 0;
        const completed = checklist.filter((item) => current[item.id]?.completed).length;
        return Math.round((completed / checklist.length) * 100);
      },
    }),
    {
      name: 'ffxii-checklist-state',
      storage: createJSONStorage(createStorage),
      skipHydration: true,
    }
  )
);
