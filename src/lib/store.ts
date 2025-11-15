import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GuideEntryType } from './types';

export interface GuideImage {
  id: string;
  url: string;
  title: string;
  description: string;
  relatedEntryId: string;
  tags: string[];
}

export interface Playthrough {
  id: string;
  title: string;
  version: 'IZJS' | 'Zodiac Age';
  goals: string[];
  currentEntryId: string;
  createdAt: Date;
}

export interface PlaythroughProgress {
  [checklistItemId: string]: {
    done: boolean;
    doneAt?: Date;
  };
}

export interface InventoryEntry {
  [itemId: string]: {
    obtained: boolean;
    obtainedAt?: Date;
    notes?: string;
  };
}

export interface UserStats {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  achievementsUnlocked: string[];
  totalTasksCompleted: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (state: GameState) => boolean;
}

interface GameState {
  // Current playthrough
  currentPlaythroughId: string | null;
  playthroughs: { [id: string]: Playthrough };
  
  // Progress tracking
  progress: { [playthroughId: string]: PlaythroughProgress };
  inventory: { [playthroughId: string]: InventoryEntry };
  
  // User stats
  userStats: UserStats;
  
  // UI state
  sidebarOpen: boolean;
  activeView: 'dashboard' | 'guide' | 'inventory' | 'progress';
  filters: {
    showOnlyIncomplete: boolean;
    entryTypes: GuideEntryType[];
    area: string | null;
  };

  // Actions
  createPlaythrough: (playthrough: Omit<Playthrough, 'id' | 'createdAt'>) => void;
  setCurrentPlaythrough: (id: string) => void;
  toggleChecklistItem: (itemId: string) => void;
  toggleInventoryItem: (itemId: string) => void;
  updateCurrentEntry: (entryId: string) => void;
  addXp: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: 'dashboard' | 'guide' | 'inventory' | 'progress') => void;
  setFilters: (filters: Partial<GameState['filters']>) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentPlaythroughId: null,
      playthroughs: {},
      progress: {},
      inventory: {},
      userStats: {
        level: 1,
        currentXp: 0,
        xpToNextLevel: 100,
        achievementsUnlocked: [],
        totalTasksCompleted: 0,
      },
      sidebarOpen: true,
      activeView: 'dashboard',
      filters: {
        showOnlyIncomplete: false,
        entryTypes: [],
        area: null,
      },

      createPlaythrough: (playthroughData) => {
        const id = `pt_${Date.now()}`;
        const newPlaythrough: Playthrough = {
          ...playthroughData,
          id,
          createdAt: new Date(),
        };
        
        set((state) => ({
          playthroughs: {
            ...state.playthroughs,
            [id]: newPlaythrough,
          },
          currentPlaythroughId: id,
          progress: {
            ...state.progress,
            [id]: {},
          },
          inventory: {
            ...state.inventory,
            [id]: {},
          },
        }));
      },

      setCurrentPlaythrough: (id) => {
        set({ currentPlaythroughId: id });
      },

      toggleChecklistItem: (itemId) => {
        const state = get();
        const playthroughId = state.currentPlaythroughId;
        if (!playthroughId) return;

        const currentProgress = state.progress[playthroughId] || {};
        const isDone = currentProgress[itemId]?.done || false;
        const newDone = !isDone;

        set((state) => ({
          progress: {
            ...state.progress,
            [playthroughId]: {
              ...currentProgress,
              [itemId]: {
                done: newDone,
                doneAt: newDone ? new Date() : undefined,
              },
            },
          },
          userStats: {
            ...state.userStats,
            totalTasksCompleted: state.userStats.totalTasksCompleted + (newDone ? 1 : -1),
          },
        }));

        if (newDone) {
          get().addXp(5);
        }
      },

      toggleInventoryItem: (itemId) => {
        const state = get();
        const playthroughId = state.currentPlaythroughId;
        if (!playthroughId) return;

        const currentInventory = state.inventory[playthroughId] || {};
        const isObtained = currentInventory[itemId]?.obtained || false;

        set((state) => ({
          inventory: {
            ...state.inventory,
            [playthroughId]: {
              ...currentInventory,
              [itemId]: {
                obtained: !isObtained,
                obtainedAt: !isObtained ? new Date() : undefined,
              },
            },
          },
        }));

        if (!isObtained) {
          get().addXp(10);
        }
      },

      updateCurrentEntry: (entryId) => {
        const state = get();
        const playthroughId = state.currentPlaythroughId;
        if (!playthroughId) return;

        const playthrough = state.playthroughs[playthroughId];
        if (!playthrough) return;

        set((state) => ({
          playthroughs: {
            ...state.playthroughs,
            [playthroughId]: {
              ...playthrough,
              currentEntryId: entryId,
            },
          },
        }));
      },

      addXp: (amount) => {
        set((state) => {
          let newXp = state.userStats.currentXp + amount;
          let newLevel = state.userStats.level;
          let xpToNext = state.userStats.xpToNextLevel;

          while (newXp >= xpToNext) {
            newXp -= xpToNext;
            newLevel++;
            xpToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
          }

          return {
            userStats: {
              ...state.userStats,
              level: newLevel,
              currentXp: newXp,
              xpToNextLevel: xpToNext,
            },
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.userStats.achievementsUnlocked.includes(achievementId)) {
            return state;
          }

          return {
            userStats: {
              ...state.userStats,
              achievementsUnlocked: [...state.userStats.achievementsUnlocked, achievementId],
            },
          };
        });
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveView: (view) => set({ activeView: view }),
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
    }),
    {
      name: 'ffxii-tracker-storage',
    }
  )
);