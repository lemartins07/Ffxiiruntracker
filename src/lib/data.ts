import { GuideChapter, GuideSection, Item, Achievement, GuideImage } from './store';

export const guideChapters: GuideChapter[] = [
  {
    id: 'ch01_prologue',
    title: 'Capítulo 1 • Ecos de Rabanastre',
    order: 1,
    description: 'A capital de Dalmasca desperta enquanto Vaan aprende o básico do combate e descobre as primeiras hunts.',
    sections: [
      {
        id: 'wt01a',
        searchCode: 'wt01a',
        chapterId: 'ch01_prologue',
        title: 'Rabanastre - Royal Palace',
        type: 'main',
        order: 1,
        description: 'Início da jornada em Ivalice com o prólogo dentro do palácio real.',
        area: 'Royal Palace Interior',
        tags: ['tutorial', 'stealth', 'story'],
        items: [
          {
            id: 'wt01a_intro',
            sectionId: 'wt01a',
            label: 'Conclua o tutorial de combate com Reks',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt01a_soldiers',
            sectionId: 'wt01a',
            label: 'Derrote os guardas do palácio utilizando Quickenings',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt01a_escape',
            sectionId: 'wt01a',
            label: 'Escape pelo corredor lateral sem ser detectado',
            category: 'quest',
            isMissable: true,
            reward: 'Potion x2',
            notes: 'Permaneça atrás das colunas e espere os guardas virarem de costas.',
          },
          {
            id: 'wt01a_sandsea',
            sectionId: 'wt01a',
            label: 'Visite a Sandsea e converse com Tomaj',
            category: 'story',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'Após a sequência de abertura você controla Reks. Use o tutorial para se acostumar com a barra de ATB e com as licenças iniciais. Aproveite para roubar dos soldados e garantir Potions extras.',
          },
          {
            type: 'tip',
            title: 'Roube sempre que puder',
            text: 'Os Soldados Imperiais carregam Potions e Eye Drops. Use Steal antes de derrotá-los para facilitar o início do jogo.',
          },
          {
            type: 'paragraph',
            text: 'Quando o controle retorna para Vaan explore os becos de Rabanastre até encontrar Migelo. O mapa da cidade abre aos poucos, então preste atenção nas marcações azuis para não se perder.',
          },
          {
            type: 'list',
            title: 'Passos essenciais',
            items: [
              'Fale com Migelo na praça central para desbloquear as lojas.',
              'Visite o Arsenal e equipe o melhor equipamento disponível.',
              'Entre na Sandsea e aceite o primeiro Contrato de Hunt com Tomaj.',
            ],
          },
        ],
      },
      {
        id: 'wt02a',
        searchCode: 'wt02a',
        chapterId: 'ch01_prologue',
        title: 'They Took our Jawrbs',
        type: 'main',
        order: 2,
        description: 'Exploração de Lowtown e introdução ao License Board.',
        area: 'Lowtown',
        tags: ['lowtown', 'sidequests'],
        items: [
          {
            id: 'wt02a_penelo',
            sectionId: 'wt02a',
            label: 'Converse com Penelo para aprender sobre clãs',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt02a_rats',
            sectionId: 'wt02a',
            label: 'Complete a caça aos dire rats no depósito',
            category: 'quest',
            isMissable: false,
          },
          {
            id: 'wt02a_license',
            sectionId: 'wt02a',
            label: 'Desbloqueie a License Board e equipe a primeira licença',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt02a_migelo',
            sectionId: 'wt02a',
            label: 'Passe na loja de Migelo e compre itens de cura',
            category: 'shop',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'Lowtown funciona como um hub para sidequests. Explore cada corredor para encontrar NPCs com diálogos exclusivos e pequenos eventos. Após conversar com Penelo o acesso ao License Board é liberado.',
          },
          {
            type: 'list',
            title: 'Dicas de Lowtown',
            items: [
              'Aceite a pequena quest dos Dire Rats para ganhar gil rápido.',
              'Visite o Clã Centurio para registrar seu progresso com Montblanc.',
              'Procure pelos baús em cantos escuros — muitos se renovam após mudar de área.',
            ],
          },
          {
            type: 'warning',
            title: 'Atenção aos baús proibidos',
            text: 'Evite abrir o baú próximo ao save crystal da residência de Dalan caso queira obter a Zodiac Spear mais tarde.',
          },
        ],
      },
      {
        id: 'mark01',
        searchCode: 'mark01',
        chapterId: 'ch01_prologue',
        title: 'Hunt: Rogue Tomato',
        type: 'mark',
        order: 3,
        description: 'Primeiro contrato de hunt com dificuldade acessível.',
        area: 'The Dalmasca Estersand',
        tags: ['hunt', 'boss'],
        items: [
          {
            id: 'mark01_accept',
            sectionId: 'mark01',
            label: 'Aceite o contrato com Tomaj na Sandsea',
            category: 'hunt',
            isMissable: false,
          },
          {
            id: 'mark01_hunt',
            sectionId: 'mark01',
            label: 'Derrote Rogue Tomato no Estersand',
            category: 'hunt',
            isMissable: false,
            reward: 'Potion x2 + 200 gil',
          },
          {
            id: 'mark01_report',
            sectionId: 'mark01',
            label: 'Reporte a vitória para Tomaj e receba a recompensa',
            category: 'hunt',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'O Rogue Tomato aparece na borda sul do Estersand após aceitar o contrato. Prepare-se com algumas Potions e use Steal antes de finalizar a luta para conseguir um Teleport Stone.',
          },
          {
            type: 'tip',
            title: 'Use a geografia a seu favor',
            text: 'Combata próximo à saída para Rabanastre para fugir rapidamente caso a luta desande.',
          },
          {
            type: 'paragraph',
            text: 'Ao retornar para Tomaj você recebe acesso ao clã e libera novos contratos conforme avança na história.',
          },
        ],
      },
    ],
  },
  {
    id: 'ch02_desert',
    title: 'Capítulo 2 • Ventos de Giza',
    order: 2,
    description: 'Primeira região aberta e introdução ao sistema de clima dinâmico.',
    sections: [
      {
        id: 'wt03a',
        searchCode: 'wt03a',
        chapterId: 'ch02_desert',
        title: 'Giza Plains',
        type: 'main',
        order: 1,
        description: 'Planícies conectando Rabanastre a diversas caçadas iniciais.',
        area: 'Giza Plains',
        tags: ['exploration', 'loot'],
        items: [
          {
            id: 'wt03a_explore',
            sectionId: 'wt03a',
            label: 'Explore Giza Plains durante a estação seca',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt03a_loot',
            sectionId: 'wt03a',
            label: 'LOOT ALERT: Baú com Potion na entrada',
            category: 'loot',
            isMissable: true,
            reward: 'Potion x3',
            notes: 'Não abra se estiver perseguindo a Zodiac Spear.',
          },
          {
            id: 'wt03a_weather',
            sectionId: 'wt03a',
            label: 'Retorne durante a estação chuvosa para acessar novas áreas',
            category: 'story',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'As planícies de Giza alternam entre duas estações. Cada clima muda a localização de inimigos e baús. Converse com a anciã Nomad Village para rastrear quando ocorrerá a próxima chuva.',
          },
          {
            type: 'list',
            title: 'Inimigos chave',
            items: [
              'Hyena — fraca a gelo, boa fonte de Wolf Pelts.',
              'Zebra Eel — aparece apenas durante a chuva, dropa Storm Magicite.',
              'Werewolf — inimigo forte próximo à saída para Ozmone, evite no início.',
            ],
          },
          {
            type: 'tip',
            title: 'Colete magick shards',
            text: 'Derrotar Elementals durante tempestades concede motes raros; mantenha Shell ativo para sobreviver.',
          },
        ],
      },
    ],
  },
  {
    id: 'ch03_rebellion',
    title: 'Capítulo 3 • Ecos de Nalbina',
    order: 3,
    description: 'Seções ligadas à prisão de Nalbina e às primeiras grandes revelações da história.',
    sections: [
      {
        id: 'wt08a',
        searchCode: 'wt08a',
        chapterId: 'ch03_rebellion',
        title: 'Nalbina Town',
        type: 'main',
        order: 1,
        description: 'Exploração da prisão de Nalbina e preparação para a fuga.',
        area: 'Nalbina Fortress',
        tags: ['dungeon', 'story'],
        items: [
          {
            id: 'wt08a_prison',
            sectionId: 'wt08a',
            label: 'Explore os corredores da prisão de Nalbina',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt08a_loot',
            sectionId: 'wt08a',
            label: 'LOOT ALERT: Ether no corredor leste',
            category: 'loot',
            isMissable: true,
            reward: 'Ether',
          },
          {
            id: 'wt08a_basch',
            sectionId: 'wt08a',
            label: 'Resgate Basch e libere o Gambit Change',
            category: 'story',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'Nalbina introduz inimigos com defesa elevada. Utilize magias elementais e buffs como Protect para reduzir o dano físico recebido.',
          },
          {
            type: 'warning',
            title: 'Cuidado com os Imperials',
            text: 'Alguns grupos usam combos e podem derrubar o grupo rapidamente. Tenha Phoenix Downs prontos.',
          },
          {
            type: 'tip',
            title: 'Use o Gambit Change',
            text: 'Assim que Basch se junta ao grupo você ganha acesso a novos gambits. Configure cura automática com Potions para sobreviver às salas cheias.',
          },
        ],
      },
    ],
  },
  {
    id: 'ch04_dawnshard',
    title: 'Capítulo 4 • A Tumba de Raithwall',
    order: 4,
    description: 'Primeira dungeon longa com um Esper obrigatório e vários baús valiosos.',
    sections: [
      {
        id: 'wt24a',
        searchCode: 'wt24a',
        chapterId: 'ch04_dawnshard',
        title: 'Tomb of Raithwall',
        type: 'main',
        order: 1,
        description: 'Dungeon com múltiplos andares culminando na batalha contra Belias.',
        area: 'Tomb of Raithwall',
        tags: ['esper', 'dungeon', 'boss'],
        items: [
          {
            id: 'wt24a_navigation',
            sectionId: 'wt24a',
            label: 'Navegue pelo labirinto utilizando as Demon Walls como atalhos',
            category: 'story',
            isMissable: false,
          },
          {
            id: 'wt24a_loot',
            sectionId: 'wt24a',
            label: 'LOOT ALERT: Baú com Flame Staff antes do boss',
            category: 'loot',
            isMissable: true,
            reward: 'Flame Staff',
          },
          {
            id: 'wt24a_belias',
            sectionId: 'wt24a',
            label: 'Derrote Belias e obtenha o Esper',
            category: 'esper',
            isMissable: false,
            reward: 'Esper: Belias',
          },
          {
            id: 'wt24a_dawnsahrd',
            sectionId: 'wt24a',
            label: 'Recupere o Dawn Shard e saia da tumba',
            category: 'story',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'A Tumba de Raithwall é dividida em alas que exigem o uso das Demon Walls como obstáculos. Derrotar ao menos uma delas concede acesso a um save crystal e a atalhos que facilitam a exploração.',
          },
          {
            type: 'list',
            title: 'Preparação recomendada',
            items: [
              'Tenha armas elementais para explorar fraquezas dos mobs.',
              'Compre magias Cura e Esuna para lidar com debuffs frequentes.',
              'Leve muitos Antidotes para as áreas com Nidhogg.',
            ],
          },
          {
            type: 'warning',
            title: 'Belias usa Firaja',
            text: 'Mantenha Shell ativo e espalhe o grupo para minimizar o dano em área. Use Ice Magick para explorar a fraqueza do Esper.',
          },
          {
            type: 'tip',
            title: 'Não esqueça o Sunstone',
            text: 'Ao sair da tumba fale com o espírito do Dynast-King para receber diálogos extras e liberar uma cena opcional.',
          },
        ],
      },
    ],
  },
];

const chapterOrderMap = new Map(guideChapters.map(chapter => [chapter.id, chapter.order]));

export const guideSections: GuideSection[] = guideChapters
  .flatMap(chapter => chapter.sections)
  .sort((a, b) => {
    const chapterDiff = (chapterOrderMap.get(a.chapterId) || 0) - (chapterOrderMap.get(b.chapterId) || 0);
    if (chapterDiff !== 0) return chapterDiff;
    return a.order - b.order;
  });

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