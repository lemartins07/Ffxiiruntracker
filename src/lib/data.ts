import { GuideSection, Item, Achievement, GuideImage } from './store';

// Mock data - Replace with actual guide content
export const guideSections: GuideSection[] = [
  {
    id: 'wt01a',
    title: 'Rabanastre - Royal Palace',
    type: 'main',
    chapterOrder: 1,
    description: 'Início da jornada em Ivalice. Tutorial básico e apresentação dos personagens.',
    items: [
      {
        id: 'wt01a_1',
        sectionId: 'wt01a',
        label: 'Complete o tutorial de combate',
        category: 'story',
        isMissable: false,
      },
      {
        id: 'wt01a_2',
        sectionId: 'wt01a',
        label: 'Derrote os soldados do palácio',
        category: 'story',
        isMissable: false,
      },
    ],
  },
  {
    id: 'wt02a',
    title: 'Lowtown - Início da Aventura',
    type: 'main',
    chapterOrder: 2,
    description: 'Vaan explora Lowtown e conhece Penelo.',
    items: [
      {
        id: 'wt02a_1',
        sectionId: 'wt02a',
        label: 'Fale com Penelo em Lowtown',
        category: 'story',
        isMissable: false,
      },
      {
        id: 'wt02a_2',
        sectionId: 'wt02a',
        label: 'Complete a quest "Rats in the Warehouse"',
        category: 'quest',
        isMissable: false,
      },
    ],
  },
  {
    id: 'wt03a',
    title: 'Giza Plains',
    type: 'main',
    chapterOrder: 3,
    description: 'Primeira área aberta. Clima muda entre seca e chuva.',
    items: [
      {
        id: 'wt03a_1',
        sectionId: 'wt03a',
        label: 'Explore Giza Plains (Dry)',
        category: 'story',
        isMissable: false,
      },
      {
        id: 'wt03a_2',
        sectionId: 'wt03a',
        label: 'LOOT ALERT: Pegue o baú com Potion na entrada',
        category: 'loot',
        isMissable: true,
        reward: 'Potion x3',
      },
    ],
  },
  {
    id: 'mark01',
    title: 'Mark: Rogue Tomato',
    type: 'mark',
    chapterOrder: 2,
    description: 'Primeira Hunt disponível. Boss relativamente fácil.',
    items: [
      {
        id: 'mark01_1',
        sectionId: 'mark01',
        label: 'Aceite a hunt com Tomaj',
        category: 'hunt',
        isMissable: false,
      },
      {
        id: 'mark01_2',
        sectionId: 'mark01',
        label: 'Derrote Rogue Tomato em Giza Plains',
        category: 'hunt',
        isMissable: false,
        reward: '500 gil + Potion x3',
      },
    ],
  },
  {
    id: 'wt08a',
    title: 'Nalbina Town',
    type: 'main',
    chapterOrder: 4,
    description: 'Cidade onde você encontra Basch e descobre mais sobre a trama.',
    items: [
      {
        id: 'wt08a_1',
        sectionId: 'wt08a',
        label: 'Explore a prisão de Nalbina',
        category: 'story',
        isMissable: false,
      },
      {
        id: 'wt08a_2',
        sectionId: 'wt08a',
        label: 'LOOT ALERT: Baú com Ether no corredor leste',
        category: 'loot',
        isMissable: true,
        reward: 'Ether',
      },
    ],
  },
  {
    id: 'wt24a',
    title: 'Tomb of Raithwall',
    type: 'main',
    chapterOrder: 10,
    description: 'Dungeon importante. Primeiro Esper disponível.',
    items: [
      {
        id: 'wt24a_1',
        sectionId: 'wt24a',
        label: 'Navegue pelo labirinto da tumba',
        category: 'story',
        isMissable: false,
      },
      {
        id: 'wt24a_2',
        sectionId: 'wt24a',
        label: 'Derrote Belias e obtenha o Esper',
        category: 'esper',
        isMissable: false,
        reward: 'Esper: Belias',
      },
      {
        id: 'wt24a_3',
        sectionId: 'wt24a',
        label: 'LOOT ALERT: Baú com Flame Staff antes do boss',
        category: 'loot',
        isMissable: true,
        reward: 'Flame Staff',
      },
    ],
  },
];

export const items: Item[] = [
  // Espers
  {
    id: 'esper_belias',
    name: 'Belias, the Gigas',
    type: 'esper',
    sourceInfo: 'Obtido após derrotar o boss em Tomb of Raithwall',
    relatedSectionIds: ['wt24a'],
    isMissable: false,
  },
  {
    id: 'esper_mateus',
    name: 'Mateus, the Corrupt',
    type: 'esper',
    sourceInfo: 'Obtido em Stilshrine of Miriam (optional)',
    relatedSectionIds: [],
    isMissable: true,
  },
  {
    id: 'esper_adrammelech',
    name: 'Adrammelech, the Wroth',
    type: 'esper',
    sourceInfo: 'Obtido em Zertinan Caverns',
    relatedSectionIds: [],
    isMissable: false,
  },
  
  // Weapons
  {
    id: 'weapon_zodiac_spear',
    name: 'Zodiac Spear',
    type: 'weapon',
    sourceInfo: 'MISSABLE! Não abra 4 baús específicos ao longo do jogo',
    relatedSectionIds: [],
    isMissable: true,
  },
  {
    id: 'weapon_flame_staff',
    name: 'Flame Staff',
    type: 'weapon',
    sourceInfo: 'Baú em Tomb of Raithwall',
    relatedSectionIds: ['wt24a'],
    isMissable: false,
  },
  
  // Magic
  {
    id: 'magic_fire',
    name: 'Fire',
    type: 'magic',
    sourceInfo: 'Comprar em Rabanastre',
    relatedSectionIds: [],
    isMissable: false,
  },
  {
    id: 'magic_cure',
    name: 'Cure',
    type: 'magic',
    sourceInfo: 'Comprar em Rabanastre',
    relatedSectionIds: [],
    isMissable: false,
  },
  {
    id: 'magic_scathe',
    name: 'Scathe',
    type: 'magic',
    sourceInfo: 'Comprar em Balfonheim (late game)',
    relatedSectionIds: [],
    isMissable: false,
  },
  
  // Technicks
  {
    id: 'tech_steal',
    name: 'Steal',
    type: 'technick',
    sourceInfo: 'Comprar em Rabanastre',
    relatedSectionIds: [],
    isMissable: false,
  },
  {
    id: 'tech_libra',
    name: 'Libra',
    type: 'technick',
    sourceInfo: 'Comprar em Rabanastre',
    relatedSectionIds: [],
    isMissable: false,
  },
];

export const achievements: Achievement[] = [
  {
    id: 'first_hunt',
    name: 'Primeira Hunt',
    description: 'Complete sua primeira Hunt',
    icon: '🎯',
    xpReward: 50,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      return Object.keys(progress).some(id => id.includes('mark') && progress[id].done);
    },
  },
  {
    id: 'ivalice_explorer',
    name: 'Ivalice Explorer',
    description: 'Complete 50% de todas as seções principais',
    icon: '🗺️',
    xpReward: 100,
    condition: (state) => {
      return state.userStats.totalTasksCompleted >= 50;
    },
  },
  {
    id: 'esper_master',
    name: 'Esper Master',
    description: 'Obtenha todos os Espers',
    icon: '✨',
    xpReward: 200,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const inventory = state.inventory[playthroughId] || {};
      const esperItems = items.filter(item => item.type === 'esper');
      return esperItems.every(item => inventory[item.id]?.obtained);
    },
  },
  {
    id: 'loot_goblin',
    name: 'Loot Goblin',
    description: 'Colete 20 LOOT ALERTS',
    icon: '💰',
    xpReward: 75,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      let lootCount = 0;
      guideSections.forEach(section => {
        section.items.forEach(item => {
          if (item.category === 'loot' && progress[item.id]?.done) {
            lootCount++;
          }
        });
      });
      return lootCount >= 20;
    },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete 100% de uma playthrough',
    icon: '👑',
    xpReward: 500,
    condition: (state) => {
      return state.userStats.totalTasksCompleted >= 100;
    },
  },
];

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'hunt': return '⚔️';
    case 'loot': return '💎';
    case 'story': return '📖';
    case 'esper': return '✨';
    case 'shop': return '🏪';
    case 'quest': return '📜';
    default: return '📌';
  }
};

export const getItemTypeIcon = (type: string): string => {
  switch (type) {
    case 'weapon': return '⚔️';
    case 'armor': return '🛡️';
    case 'accessory': return '💍';
    case 'magic': return '✨';
    case 'technick': return '🎯';
    case 'esper': return '👹';
    case 'key_item': return '🔑';
    default: return '📦';
  }
};

// Guide Images - Mock data with placeholder images
export const guideImages: GuideImage[] = [
  // Rabanastre - Royal Palace
  {
    id: 'img_wt01a_1',
    url: 'https://images.unsplash.com/photo-1709715459023-84d696417eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwcGFsYWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDkwNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Royal Palace - Main Hall',
    description: 'Entrada principal do palácio de Rabanastre',
    relatedSectionId: 'wt01a',
    tags: ['palace', 'interior', 'story'],
  },
  {
    id: 'img_wt01a_2',
    url: 'https://images.unsplash.com/photo-1709715459023-84d696417eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwcGFsYWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYzMDkwNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Palace Treasury',
    description: 'Sala do tesouro onde começa a aventura',
    relatedSectionId: 'wt01a',
    tags: ['palace', 'treasury', 'tutorial'],
  },
  
  // Lowtown
  {
    id: 'img_wt02a_1',
    url: 'https://images.unsplash.com/photo-1715962145715-52117e5dec19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHRvd24lMjBzdHJlZXR8ZW58MXx8fHwxNzYzMDU3MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Lowtown Streets',
    description: 'Ruas de Lowtown onde Vaan vive',
    relatedSectionId: 'wt02a',
    tags: ['town', 'street', 'lowtown'],
  },
  
  // Giza Plains
  {
    id: 'img_wt03a_1',
    url: 'https://images.unsplash.com/photo-1627936581689-51d511e520fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBwbGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYzMDkwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Giza Plains (Dry Season)',
    description: 'Planícies durante a estação seca',
    relatedSectionId: 'wt03a',
    tags: ['plains', 'outdoor', 'dry'],
  },
  {
    id: 'img_wt03a_2',
    url: 'https://images.unsplash.com/photo-1627936581689-51d511e520fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBwbGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYzMDkwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Giza Plains Map',
    description: 'Mapa da região de Giza Plains',
    relatedSectionId: 'wt03a',
    tags: ['map', 'plains'],
  },
  
  // Rogue Tomato Hunt
  {
    id: 'img_mark01_1',
    url: 'https://images.unsplash.com/photo-1761325684397-b91138faca5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbW9uc3RlciUyMGNyZWF0dXJlfGVufDF8fHx8MTc2MzA5MDc4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Rogue Tomato',
    description: 'Boss da primeira hunt',
    relatedSectionId: 'mark01',
    tags: ['boss', 'hunt', 'monster'],
  },
  
  // Nalbina
  {
    id: 'img_wt08a_1',
    url: 'https://images.unsplash.com/photo-1715962145715-52117e5dec19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHRvd24lMjBzdHJlZXR8ZW58MXx8fHwxNzYzMDU3MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Nalbina Dungeons',
    description: 'Calabouço de Nalbina',
    relatedSectionId: 'wt08a',
    tags: ['dungeon', 'prison', 'town'],
  },
  
  // Tomb of Raithwall
  {
    id: 'img_wt24a_1',
    url: 'https://images.unsplash.com/photo-1670772714650-6ec6d6a66494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdG9tYiUyMGR1bmdlb258ZW58MXx8fHwxNzYzMDkwNzgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Tomb of Raithwall - Entrance',
    description: 'Entrada da tumba',
    relatedSectionId: 'wt24a',
    tags: ['tomb', 'dungeon', 'ancient'],
  },
  {
    id: 'img_wt24a_2',
    url: 'https://images.unsplash.com/photo-1677295922463-147d7f2f718c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwbWFwJTIwZHVuZ2VvbnxlbnwxfHx8fDE3NjMwOTA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Tomb Map',
    description: 'Mapa completo da Tomb of Raithwall',
    relatedSectionId: 'wt24a',
    tags: ['map', 'tomb', 'dungeon'],
  },
  {
    id: 'img_wt24a_3',
    url: 'https://images.unsplash.com/photo-1761325684397-b91138faca5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbW9uc3RlciUyMGNyZWF0dXJlfGVufDF8fHx8MTc2MzA5MDc4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Belias Fight',
    description: 'Boss fight contra Belias',
    relatedSectionId: 'wt24a',
    tags: ['boss', 'esper', 'belias'],
  },
];

export const getImagesBySection = (sectionId: string): GuideImage[] => {
  return guideImages.filter(img => img.relatedSectionId === sectionId);
};