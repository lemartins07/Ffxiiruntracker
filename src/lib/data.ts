import { GuideChapter, GuideSection, Item, Achievement, GuideImage } from './store';
import { pdfGuideChapter } from './pdfGuideData';

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
        description: 'Reks infiltra o palácio, apresenta os cristais de salvamento e conduz Vaan até Migelo em Rabanastre.',
        area: 'Royal Palace Interior',
        tags: ['tutorial', 'story', 'combat'],
        items: [
          {
            id: 'wt01a_reks_tutorial',
            sectionId: 'wt01a',
            label: 'Controle Reks, fale com Basch e avance até o portão norte',
            category: 'story',
            isMissable: false,
            notes: 'Use o analógico direito para mover a câmera enquanto segue o marcador no mini-mapa.',
          },
          {
            id: 'wt01a_remora',
            sectionId: 'wt01a',
            label: 'Derrote o Air Cutter Remora usando ataques ou Thunder',
            category: 'story',
            isMissable: false,
            notes: 'A luta ensina como mirar e alternar entre magias e ataques básicos.',
          },
          {
            id: 'wt01a_crystal',
            sectionId: 'wt01a',
            label: 'Ative o save crystal depois da escadaria central',
            category: 'story',
            isMissable: false,
            notes: 'Os cristais restauram HP/MP e permitem teleportes posteriormente.',
          },
          {
            id: 'wt01a_tomaj',
            sectionId: 'wt01a',
            label: 'Com Vaan, fale com Migelo e entre na Sandsea para conversar com Tomaj',
            category: 'story',
            isMissable: false,
            notes: 'Tomaj entrega o Clan Primer, libera o License Board e oferece o contrato do Rogue Tomato.',
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'A introdução coloca você no controle de Reks. Ajuste a câmera com o analógico direito, avance até Basch e atravesse o portão norte para enfrentar o Air Cutter Remora. O guia original recomenda usar Thunder ou ataques simples para encerrar o tutorial rapidamente.',
          },
          {
            type: 'tip',
            title: 'Use o R2 para fugir',
            text: 'Enquanto atravessa os corredores do palácio, mantenha R2 pressionado para escapar de grupos numerosos como sugerido no walkthrough, evitando gastar itens logo no início.',
          },
          {
            type: 'paragraph',
            text: 'Após salvar no cristal, derrote os três Imperial Swordsmen, atravesse a porta ao sul e siga para o noroeste conforme indicado no mapa. Quando o controle passa para Vaan, o guia destaca que Migelo aguarda na praça principal; encontre-o para liberar as lojas de armas, armaduras e itens.',
          },
          {
            type: 'list',
            title: 'Inventário inicial das lojas',
            items: [
              'Arsenal: Broadsword (390 gil), Kotetsu (500 gil), Javelin (500 gil), Oaken Pole (450 gil), Shortbow (450 gil), Altair (400 gil), Handaxe (420 gil), Dagger (390 gil).',
              'Loja de armaduras: Headgear e Chromed Leathers (200 gil), Leather Helm (250 gil), Leather Armor e Shield (300 gil), além de Cotton Hat/Shirt por 100 gil.',
              'Loja de itens: Onion Arrows e Onion Shot (100 gil cada), Eye Drops (50 gil) e Potions (60 gil).',
              'Loja de magias e técnicas: Blindna e Cure (200 gil), Fire (180 gil), Slow (200 gil) e Libra (400 gil).',
            ],
          },
          {
            type: 'paragraph',
            text: 'Siga para a casa com um X vermelho no mapa — a Sandsea. Tomaj entrega o Clan Primer, adiciona Licenses ao menu e dá acesso ao primeiro contrato de Mark, exatamente como descrito no walkthrough original.',
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
        description: 'Tomaj apresenta o License Board e o guia detalha os doze jobs disponíveis no patch International Zodiac.',
        area: 'Rabanastre - Sandsea',
        tags: ['jobs', 'clan', 'preparação'],
        items: [
          {
            id: 'wt02a_jobs',
            sectionId: 'wt02a',
            label: 'Revise as descrições dos 12 jobs antes de escolher',
            category: 'story',
            isMissable: false,
            notes: 'Cada personagem fica preso ao job escolhido; o guia recomenda avaliar armas e armaduras exclusivas.',
          },
          {
            id: 'wt02a_montblanc',
            sectionId: 'wt02a',
            label: 'Visite o Clan Hall e registre-se com Montblanc',
            category: 'story',
            isMissable: false,
            notes: 'A inscrição libera recompensas futuras e acesso à loja do clã.',
          },
          {
            id: 'wt02a_clanshop',
            sectionId: 'wt02a',
            label: 'Verifique a loja do clã no Muthru Bazaar',
            category: 'shop',
            isMissable: false,
            reward: 'Spell: Decoy (2.000 gil)',
            notes: 'O estoque cresce com o rank do clã; inicialmente apenas Decoy está disponível.',
          },
          {
            id: 'wt02a_gate',
            sectionId: 'wt02a',
            label: 'Salve no crystal do portão leste antes de sair da cidade',
            category: 'story',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'Ao conversar com Tomaj na Sandsea você recebe o Clan Primer, o acessório Orrachea Armlet e acesso ao License Board. O walkthrough ressalta que a escolha de job é definitiva, como no Final Fantasy I, portanto leia as descrições antes de confirmar.',
          },
          {
            type: 'list',
            title: 'Destaques dos jobs iniciais',
            items: [
              'White Mage — foco total em magias de cura e suporte, usa bastões e armadura mística.',
              'Uhlan — dragoon especializado em lanças, com muitos boosts de HP e magias negras nível 2.',
              'Machinist — usuário de armas de fogo com acesso tardio a Hastega e outras magias temporais.',
              'Knight — tanque clássico com espadas de uma e duas mãos, desbloqueia magias brancas avançadas mais tarde.',
              'Red Mage — mistura de magia branca, negra, verde e arcana com bons atributos físicos.',
            ],
          },
          {
            type: 'paragraph',
            text: 'O guia também lista habilidades fixas: Vaan começa com Steal e equipamentos de Daggers/Light Armor 1; Penelo conhece Cure e Blindna; Balthier tem Steal e First Aid; Fran acessa Cure, Blindna, Fire e Thunder; Basch traz Libra e proficiência em espadas e escudos; Ashe carrega Cure, Blindna e uma Bangle.',
          },
          {
            type: 'tip',
            title: 'Planeje as compras',
            text: 'Após deixar a Sandsea, o walkthrough recomenda visitar as lojas de magia e técnicas recém-abertas. Priorize adquirir Cure para que Penelo ou Fran mantenham o grupo saudável independentemente do job escolhido.',
          },
          {
            type: 'paragraph',
            text: 'No quadrante oeste da cidade fale com o bangaa que guarda a escadaria para acessar o Clan Hall e se registrar com Montblanc. Em seguida, desça até o Muthru Bazaar para ver a loja exclusiva do clã antes de seguir ao portão leste.',
          },
        ],
      },
      {
        id: 'wt03a',
        searchCode: 'wt03a',
        chapterId: 'ch01_prologue',
        title: 'Dalmasca Estersand',
        type: 'main',
        order: 3,
        description: 'Primeira zona de campo aberta. O walkthrough lista potes úteis no The Stepping e o acessório Firefly no Outpost.',
        area: 'Dalmasca Estersand',
        tags: ['exploração', 'loot', 'field'],
        items: [
          {
            id: 'wt03a_map',
            sectionId: 'wt03a',
            label: 'Compre o mapa de Dalmasca Estersand com o moogle cartógrafo (30 gil)',
            category: 'shop',
            isMissable: false,
            notes: 'O guia sugere comprar os mapas de Estersand, Westersand (500 gil) e Giza Plains (30 gil) antes de sair de Rabanastre.',
          },
          {
            id: 'wt03a_potions',
            sectionId: 'wt03a',
            label: 'Farm Potions no The Stepping indo e voltando entre telas',
            category: 'loot',
            isMissable: false,
            notes: 'Sete dos dez potes podem conter Potions; um pote no canto oeste pode gerar Phoenix Down.',
          },
          {
            id: 'wt03a_firefly',
            sectionId: 'wt03a',
            label: 'Pegue o acessório Firefly no Outpost',
            category: 'loot',
            isMissable: true,
            reward: 'Firefly (vale 800 gil)',
            notes: 'Não reaparece após abrir; o guia cita como alternativa para levantar fundos cedo.',
          },
          {
            id: 'wt03a_outpost',
            sectionId: 'wt03a',
            label: 'Visite o Outpost ao norte e saqueie gil/itens',
            category: 'misc',
            isMissable: false,
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'O trecho wt03a do walkthrough descreve Dalmasca Estersand com um tele crystal logo na entrada. Potes podem conter as magias Silence e Poison, além de itens valiosos. Vá um mapa adiante até o Outpost para renovar os recipientes mais rapidamente na versão International.',
          },
          {
            type: 'list',
            title: 'Potes destacados no guia',
            items: [
              'The Stepping — sete potes com chance alta de Potion; um pote no extremo oeste pode render Phoenix Down.',
              'Outpost — pote na parede norte pode trazer Hi-Potion; Firefly fica na parede leste e não reaparece.',
            ],
          },
          {
            type: 'tip',
            title: 'Use Firefly com propósito',
            text: 'Equipar o Firefly impede ganho de experiência, recurso útil para runes de baixo nível segundo o walkthrough. Se não for usar, venda por 800 gil para comprar magias e equipamentos.',
          },
          {
            type: 'warning',
            title: 'Wild Saurian à espreita',
            text: 'O guia alerta para evitar o grande dinossauro verde com barra HP verde; ele pode dizimar o grupo caso provocado nesse ponto da história.',
          },
        ],
      },
      {
        id: 'mark01',
        searchCode: 'wt03b',
        chapterId: 'ch01_prologue',
        title: 'Mark: Rogue Tomato',
        type: 'mark',
        order: 4,
        description: 'Primeiro contrato oficial. O guia explica como localizar o tomate no Estersand e detalha a recompensa.',
        area: 'Dalmasca Estersand - The Stepping',
        tags: ['hunt', 'boss'],
        items: [
          {
            id: 'mark01_accept',
            sectionId: 'mark01',
            label: 'Aceite o contrato com Tomaj na Sandsea',
            category: 'hunt',
            isMissable: false,
            notes: 'O pedido aparece no quadro de avisos logo após liberar o Clan Primer.',
          },
          {
            id: 'mark01_prep',
            sectionId: 'mark01',
            label: 'Colete itens no Stepping e evite o Wild Saurian',
            category: 'loot',
            isMissable: false,
            notes: 'O walkthrough sugere farmar Potions e Phoenix Downs nos potes antes da luta.',
          },
          {
            id: 'mark01_hunt',
            sectionId: 'mark01',
            label: 'Derrote o Rogue Tomato mantendo o HP acima de 30%',
            category: 'hunt',
            isMissable: false,
            reward: '300 gil, Potion x2, Teleport Stone',
          },
          {
            id: 'mark01_report',
            sectionId: 'mark01',
            label: 'Reporte a vitória para Tomaj e receba as Galbana Lilies',
            category: 'hunt',
            isMissable: false,
            notes: 'Entregue o troféu a Kytes no portão antes de seguir para Lowtown.',
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'Ao entrar no Dalmasca Estersand, o walkthrough aponta o local The Stepping como o ponto onde sete dos dez potes podem conter Potions. O pote no canto oeste perto da saída para o Outpost tem chance alta de Phoenix Down — ótimo para estocar antes da caçada.',
          },
          {
            type: 'warning',
            title: 'Evite o Wild Saurian',
            text: 'O guia enfatiza que o dinossauro verde com barra de vida verde deve ser ignorado nessa fase, pois derrota o grupo em segundos.',
          },
          {
            type: 'tip',
            title: 'Controle a fuga do mark',
            text: 'Depois de reduzir o HP do Rogue Tomato ele foge para uma borda elevada. Persiga-o imediatamente e finalize o combate mantendo o HP acima de 30~40%, como recomendado.',
          },
          {
            type: 'paragraph',
            text: 'A vitória rende as Galbana Lilies. Ao retornar para Rabanastre, fale com Kytes no portão para liberar Lowtown e depois com Tomaj para receber 300 gil, duas Potions e uma Teleport Stone, exatamente como descrito no walkthrough.',
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
        id: 'wt05a',
        searchCode: 'wt05a',
        chapterId: 'ch02_desert',
        title: 'Giza Plains (Estação Seca)',
        type: 'main',
        order: 1,
        description: 'Nomad Village acolhe Penelo, o guia detalha as lojas locais, os rock formations e a coleta do Sunstone.',
        area: 'Giza Plains',
        tags: ['exploração', 'story', 'loot'],
        items: [
          {
            id: 'wt05a_masyua',
            sectionId: 'wt05a',
            label: 'Fale com Masyua no acampamento para receber Penelo',
            category: 'story',
            isMissable: false,
            notes: 'Penelo entrega 3 Potions e 2 Phoenix Downs após deixar o acampamento.',
          },
          {
            id: 'wt05a_shop',
            sectionId: 'wt05a',
            label: 'Atualize equipamentos e magias na loja da Nomad Village',
            category: 'shop',
            isMissable: false,
            notes: 'O moogle local também vende o mapa de Giza Plains por 30 gil.',
          },
          {
            id: 'wt05a_shadestone',
            sectionId: 'wt05a',
            label: 'Carregue o Shadestone nas 4 rock formations brilhantes',
            category: 'quest',
            isMissable: false,
            notes: 'As formações aparecem como "!" no mapa; basta interagir para preencher a barra.',
          },
          {
            id: 'wt05a_reward',
            sectionId: 'wt05a',
            label: 'Entregue o Sunstone para Masyua e colete a recompensa',
            category: 'story',
            isMissable: false,
            reward: '50 gil, Potion x2, Teleport Stone x2',
          },
        ],
        content: [
          {
            type: 'paragraph',
            text: 'O walkthrough orienta explorar a primeira tela e depois seguir ao acampamento com save crystal. Fale com Masyua para recrutar Penelo e definir o job dela. Aproveite para comprar armas, armaduras e magias na tenda e adquirir o mapa por 30 gil.',
          },
          {
            type: 'list',
            title: 'Inventário inicial da loja do acampamento',
            items: [
              'Armas: Broadsword (390 gil), Kotetsu (500 gil), Javelin (500 gil), Oaken Pole (450 gil), Short Bow (450 gil), Altair (400 gil).',
              'Armaduras: Leather Cap/Clothing (100 gil), Headgear/Chromed Leathers (200 gil), Leather Helm (250 gil), Leather Armor (300 gil).',
              'Itens e magias: Eye Drops e Potions (50/60 gil), além de novas opções como Echo Herbs e Antidote após a quest do Sunstone.',
            ],
          },
          {
            type: 'warning',
            title: 'Cuidado com os Werewolves',
            text: 'O guia enfatiza que os lobisomens no Starfall Field podem eliminar o grupo instantaneamente. Só se aproxime se pretende usar Steal e fugir com Penelo como líder.',
          },
          {
            type: 'tip',
            title: 'Carregando o Shadestone',
            text: 'As rochas brilhantes ficam marcadas com "!"; interaja até preencher 100%. Ao concluir, você volta automaticamente ao acampamento e recebe 50 gil, 2 Potions e 2 Teleport Stones, além de novos itens à venda.',
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
  pdfGuideChapter,
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
    relatedSectionId: 'wt05a',
    tags: ['plains', 'outdoor', 'dry'],
  },
  {
    id: 'img_wt03a_2',
    url: 'https://images.unsplash.com/photo-1627936581689-51d511e520fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBwbGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYzMDkwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Giza Plains Map',
    description: 'Mapa da região de Giza Plains',
    relatedSectionId: 'wt05a',
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