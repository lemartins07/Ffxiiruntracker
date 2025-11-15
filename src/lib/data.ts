import guideJson from '../data/walkthrough.json';
import type { GuideDocument, GuideEntry, GuideItem as GuideItemRecord, TocEntry } from '../types/guide';
import type { ChecklistItem } from './store';
import { GuideSection, Item, Achievement, GuideImage } from './store';

type SectionKind = TocEntry['kind'];

type ChecklistCategory = 'story' | 'hunt' | 'loot' | 'item' | 'magick' | 'technick' | 'key_item' | 'other';

const guideDocument = guideJson as GuideDocument;
const tocEntries = guideDocument.toc;
const entriesByCode = guideDocument.entries;
const itemsById = guideDocument.items;
const tocByCode = new Map<string, TocEntry>(tocEntries.map(entry => [entry.code, entry]));

const mapKindToSectionType = (kind: SectionKind): GuideSection['type'] => {
  switch (kind) {
    case 'story':
      return 'main';
    case 'mark':
      return 'mark';
    case 'loot':
      return 'loot_alert';
    default:
      return 'misc';
  }
};

const mapEntryKindToChecklistCategory = (kind: SectionKind): ChecklistCategory => {
  switch (kind) {
    case 'mark':
      return 'hunt';
    case 'loot':
      return 'loot';
    default:
      return 'story';
  }
};

const mapItemCategoryToChecklistCategory = (category?: string): ChecklistCategory => {
  switch (category) {
    case 'weapon':
    case 'armor':
    case 'accessory':
    case 'ammunition':
    case 'item':
    case 'other':
      return 'item';
    case 'magick':
      return 'magick';
    case 'technick':
      return 'technick';
    case 'key':
      return 'key_item';
    default:
      return 'other';
  }
};

const getPrimaryTitle = (entry: GuideEntry | undefined, toc: TocEntry | undefined): string => {
  return (
    entry?.titles.primary.en ||
    entry?.titles.primary.raw ||
    toc?.label.en ||
    toc?.label.raw ||
    entry?.code ||
    'Seção do guia'
  );
};

const getSectionSummary = (entry: GuideEntry | undefined): string => {
  if (!entry?.narrative) {
    return 'Sem descrição disponível para esta seção.';
  }

  const firstParagraph = entry.narrative.find(block => block.kind === 'paragraph');
  if (firstParagraph && 'text' in firstParagraph) {
    const text = firstParagraph.text.trim();
    return text.length > 280 ? `${text.slice(0, 277)}...` : text;
  }

  return 'Sem descrição disponível para esta seção.';
};

const buildChecklistForEntry = (entry: GuideEntry | undefined): ChecklistItem[] => {
  if (!entry) {
    return [];
  }

  const checklist: ChecklistItem[] = [];
  const baseCategory = mapEntryKindToChecklistCategory(entry.kind);

  checklist.push({
    id: `${entry.code}__section`,
    sectionId: entry.code,
    label: `Concluir seção: ${getPrimaryTitle(entry, tocByCode.get(entry.code))}`,
    category: baseCategory,
    isMissable: false,
  });

  if (entry.lootAlerts) {
    entry.lootAlerts.forEach((alert, index) => {
      checklist.push({
        id: `${entry.code}__loot_${index}`,
        sectionId: entry.code,
        label: alert.emphasis || alert.description,
        category: 'loot',
        isMissable: true,
        notes: alert.description,
      });
    });
  }

  if (entry.itemsReferenced) {
    entry.itemsReferenced.forEach(itemId => {
      const item = itemsById[itemId];
      checklist.push({
        id: `${entry.code}__item_${itemId}`,
        sectionId: entry.code,
        label: item?.name.en || item?.name.raw || itemId,
        category: mapItemCategoryToChecklistCategory(item?.category),
        relatedItemId: itemId,
      });
    });
  }

  return checklist;
};

const deriveGuideSections = (): GuideSection[] => {
  return tocEntries.map((tocEntry) => {
    const entry = entriesByCode[tocEntry.code];
    return {
      id: tocEntry.code,
      title: getPrimaryTitle(entry, tocEntry),
      type: mapKindToSectionType(tocEntry.kind),
      chapterOrder: tocEntry.order + 1,
      description: getSectionSummary(entry),
      parentCode: tocEntry.parentCode,
      label: tocEntry.label,
      items: buildChecklistForEntry(entry),
    } satisfies GuideSection;
  });
};

const mapItemCategoryToInventoryType = (category: string | undefined): string => {
  switch (category) {
    case 'weapon':
      return 'weapon';
    case 'armor':
      return 'armor';
    case 'accessory':
      return 'accessory';
    case 'magick':
      return 'magick';
    case 'technick':
      return 'technick';
    case 'key':
      return 'key_item';
    case 'ammunition':
      return 'ammunition';
    case 'item':
    case 'other':
    default:
      return 'item';
  }
};

const deriveItems = (): Item[] => {
  return Object.values(itemsById).map((item: GuideItemRecord) => {
    const occurrences = item.occurrences || [];
    const sourceInfo = occurrences[0]?.detail || 'Sem informação de obtenção disponível.';

    return {
      id: item.id,
      name: item.name.en || item.name.raw,
      type: mapItemCategoryToInventoryType(item.category),
      sourceInfo,
      relatedSectionIds: occurrences.map(occurrence => occurrence.code),
      occurrences,
    } satisfies Item;
  });
};

export const guideSections = deriveGuideSections();
export const guideEntries = entriesByCode;
export const guideItemsIndex = itemsById;
export const items: Item[] = deriveItems();

export const getChecklistForSection = (sectionId: string): ChecklistItem[] => {
  return buildChecklistForEntry(entriesByCode[sectionId]);
};

export const getGuideEntry = (sectionId: string): GuideEntry | undefined => entriesByCode[sectionId];

export const getGuideItem = (itemId: string): GuideItemRecord | undefined => itemsById[itemId];

export const getSectionLabel = (sectionId: string): string => {
  const toc = tocByCode.get(sectionId);
  return toc?.label.en || toc?.label.raw || sectionId;
};

export const getImagesBySection = (sectionId: string): GuideImage[] => {
  const entry = entriesByCode[sectionId];
  if (!entry?.media) {
    return [];
  }

  const toc = tocByCode.get(sectionId);
  return entry.media
    .filter(media => media.type === 'image')
    .map((media, index) => ({
      id: `${sectionId}-media-${index}`,
      url: media.url,
      title: `${getPrimaryTitle(entry, toc)} — Captura ${index + 1}`,
      description: media.caption,
      relatedSectionId: sectionId,
      tags: media.caption ? [media.caption] : undefined,
    }));
};

export const achievements: Achievement[] = [
  {
    id: 'first_hunt',
    name: 'Primeira Hunt',
    description: 'Conclua a checklist principal de qualquer Mark.',
    icon: '🎯',
    xpReward: 50,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      return guideSections.some(section =>
        section.type === 'mark' &&
        section.items.some(item => item.id.endsWith('__section') && progress[item.id]?.done)
      );
    },
  },
  {
    id: 'journal_devotee',
    name: 'Devoto do Diário',
    description: 'Complete 25 seções principais do guia.',
    icon: '📔',
    xpReward: 100,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const progress = state.progress[playthroughId] || {};
      const completedSections = guideSections.filter(section =>
        section.items.some(item => item.id.endsWith('__section') && progress[item.id]?.done)
      );
      return completedSections.length >= 25;
    },
  },
  {
    id: 'loot_goblin',
    name: 'Loot Goblin',
    description: 'Complete 20 tarefas marcadas como Loot Alert.',
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
    id: 'inventory_curator',
    name: 'Curador do Inventário',
    description: 'Marque 100 itens como obtidos no inventário.',
    icon: '📦',
    xpReward: 150,
    condition: (state) => {
      const playthroughId = state.currentPlaythroughId;
      if (!playthroughId) return false;
      const inventory = state.inventory[playthroughId] || {};
      const obtainedCount = Object.values(inventory).filter(entry => entry.obtained).length;
      return obtainedCount >= 100;
    },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete 100% de uma playthrough.',
    icon: '👑',
    xpReward: 500,
    condition: (state) => {
      return state.userStats.totalTasksCompleted >= 100;
    },
  },
];

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'hunt':
      return '⚔️';
    case 'loot':
      return '💎';
    case 'story':
      return '📖';
    case 'magick':
      return '✨';
    case 'technick':
      return '🎯';
    case 'key_item':
      return '🔑';
    case 'item':
      return '📦';
    default:
      return '📌';
  }
};

export const getItemTypeIcon = (type: string): string => {
  switch (type) {
    case 'weapon':
      return '⚔️';
    case 'armor':
      return '🛡️';
    case 'accessory':
      return '💍';
    case 'magick':
      return '✨';
    case 'technick':
      return '🎯';
    case 'key_item':
      return '🔑';
    case 'ammunition':
      return '🏹';
    case 'item':
      return '📦';
    default:
      return '📌';
  }
};
