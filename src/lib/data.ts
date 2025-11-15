import { Achievement, GuideImage } from './store';
import { getGuideEntries } from './guideData';

const allEntries = getGuideEntries();
const markEntries = allEntries.filter((entry) => entry.type === 'mark');
const lootEntries = allEntries.filter((entry) => entry.type === 'loot-alert');

export const guideImages: GuideImage[] = [
  {
    id: 'img_wt01a_1',
    url: 'https://images.unsplash.com/photo-1709715459023-84d696417eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwcGFsYWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDkwNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Royal Palace - Main Hall',
    description: 'Entrada principal do palácio de Rabanastre',
    relatedEntryId: 'wt01a',
    tags: ['palace', 'interior', 'story'],
  },
  {
    id: 'img_wt01a_2',
    url: 'https://images.unsplash.com/photo-1709715459023-84d696417eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwcGFsYWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDkwNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Palace Treasury',
    description: 'Sala do tesouro onde começa a aventura',
    relatedEntryId: 'wt01a',
    tags: ['palace', 'treasury', 'tutorial'],
  },
  {
    id: 'img_wt02a_1',
    url: 'https://images.unsplash.com/photo-1715962145715-52117e5dec19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHRvd24lMjBzdHJlZXR8ZW58MXx8fHwxNzYzMDU3MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Lowtown Streets',
    description: 'Ruas de Lowtown onde Vaan vive',
    relatedEntryId: 'wt02a',
    tags: ['town', 'street', 'lowtown'],
  },
  {
    id: 'img_wt03a_1',
    url: 'https://images.unsplash.com/photo-1627936581689-51d511e520fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBwbGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYzMDkwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Giza Plains (Dry Season)',
    description: 'Planícies durante a estação seca',
    relatedEntryId: 'wt03a',
    tags: ['plains', 'outdoor', 'dry'],
  },
  {
    id: 'img_wt03a_2',
    url: 'https://images.unsplash.com/photo-1627936581689-51d511e520fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBwbGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYzMDkwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Giza Plains Map',
    description: 'Mapa da região de Giza Plains',
    relatedEntryId: 'wt03a',
    tags: ['map', 'plains'],
  },
  {
    id: 'img_mark01_1',
    url: 'https://images.unsplash.com/photo-1761325684397-b91138faca5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbW9uc3RlciUyMGNyZWF0dXJlfGVufDF8fHx8MTc2MzA5MDc4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Rogue Tomato',
    description: 'Boss da primeira hunt',
    relatedEntryId: 'wt03b',
    tags: ['boss', 'hunt', 'monster'],
  },
];

export const achievements: Achievement[] = [
  {
    id: 'first_hunt',
    name: 'Primeira Hunt',
    description: 'Complete sua primeira Hunt da lista',
    icon: '🎯',
    xpReward: 50,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      return markEntries.some((entry) => progress[entry.id]?.done);
    },
  },
  {
    id: 'ivalice_explorer',
    name: 'Ivalice Explorer',
    description: 'Complete 50% de todas as entradas do guia',
    icon: '🗺️',
    xpReward: 100,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      const completed = allEntries.filter((entry) => progress[entry.id]?.done).length;
      return completed / allEntries.length >= 0.5;
    },
  },
  {
    id: 'hunt_master',
    name: 'Hunt Master',
    description: 'Complete todas as Hunts disponíveis no guia',
    icon: '⚔️',
    xpReward: 200,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      return markEntries.every((entry) => progress[entry.id]?.done);
    },
  },
  {
    id: 'loot_goblin',
    name: 'Loot Goblin',
    description: 'Complete 20 alertas de loot',
    icon: '💰',
    xpReward: 75,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      const completedLoot = lootEntries.filter((entry) => progress[entry.id]?.done).length;
      return completedLoot >= 20;
    },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete 100% de uma playthrough',
    icon: '👑',
    xpReward: 500,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      const completed = allEntries.filter((entry) => progress[entry.id]?.done).length;
      return completed === allEntries.length;
    },
  },
];

export const getImagesByEntry = (entryId: string): GuideImage[] => {
  return guideImages.filter((image) => image.relatedEntryId === entryId);
};

export const getImagesByEntries = (entryIds: string[]): GuideImage[] => {
  const idSet = new Set(entryIds);
  return guideImages.filter((image) => idSet.has(image.relatedEntryId));
};
