import guideRaw from '@/data/walkthrough.json';
import type { GuideDocument, GuideEntry, TocEntry } from '@/types/guide';

export type SectionKind = TocEntry['kind'];

export interface ChecklistItem {
  id: string;
  sectionCode: string;
  label: string;
  category: 'story' | 'mark' | 'loot' | 'item' | 'magick' | 'technick' | 'key_item' | 'other';
  isMissable?: boolean;
  notes?: string;
  tags?: string[];
  relatedItemId?: string;
}

export interface GuideSectionFull {
  toc: TocEntry;
  entry?: GuideEntry;
  children: TocEntry[];
  checklist: ChecklistItem[];
}

export interface InventoryItemSummary {
  itemId: string;
  nameEn?: string;
  nameJp?: string;
  nameRaw?: string;
  price?: number;
  type: string;
  firstSectionCode?: string;
  shops: { sectionCode: string; shopName: string }[];
}

export interface GuideStats {
  totalSections: number;
  totalStory: number;
  totalHunts: number;
  totalLootAlerts: number;
}

const documentTyped = guideRaw as GuideDocument;
export const guideMeta = documentTyped.meta;
const tocEntries = [...documentTyped.toc].sort((a, b) => a.order - b.order);
const entries = documentTyped.entries;
const itemsIndex = documentTyped.items;

const childrenMap = tocEntries.reduce<Record<string, TocEntry[]>>((acc, entry) => {
  if (entry.parentCode) {
    acc[entry.parentCode] = acc[entry.parentCode] || [];
    acc[entry.parentCode].push(entry);
  }
  return acc;
}, {});

const kindToCategory = (kind: SectionKind): ChecklistItem['category'] => {
  switch (kind) {
    case 'story':
      return 'story';
    case 'mark':
      return 'mark';
    case 'loot':
      return 'loot';
    default:
      return 'other';
  }
};

const itemCategoryToChecklist = (category?: string): ChecklistItem['category'] => {
  switch (category) {
    case 'weapon':
    case 'armor':
    case 'accessory':
    case 'item':
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

const buildChecklist = (entry?: GuideEntry): ChecklistItem[] => {
  if (!entry) return [];
  const checklist: ChecklistItem[] = [];
  checklist.push({
    id: `${entry.code}-section`,
    sectionCode: entry.code,
    label: entry.titles.primary.en || entry.titles.primary.raw || entry.code,
    category: kindToCategory(entry.kind),
    tags: [entry.kind],
  });
  if (entry.lootAlerts) {
    entry.lootAlerts.forEach((alert, index) => {
      checklist.push({
        id: `${entry.code}-loot-${index}`,
        sectionCode: entry.code,
        label: alert.emphasis || alert.description,
        category: 'loot',
        isMissable: true,
        notes: alert.description,
        tags: ['loot'],
      });
    });
  }
  if (entry.itemsReferenced) {
    entry.itemsReferenced.forEach((itemId) => {
      const item = itemsIndex[itemId];
      checklist.push({
        id: `${entry.code}-item-${itemId}`,
        sectionCode: entry.code,
        label: item?.name.en || item?.name.raw || itemId,
        category: itemCategoryToChecklist(item?.category),
        relatedItemId: itemId,
      });
    });
  }
  return checklist;
};

export const guideToc = tocEntries;

export const getGuideSectionFull = (code: string): GuideSectionFull | undefined => {
  const toc = tocEntries.find((entry) => entry.code === code);
  if (!toc) return undefined;
  const entry = entries[code];
  return {
    toc,
    entry,
    children: childrenMap[code] || [],
    checklist: buildChecklist(entry),
  };
};

export const getGuideEntry = (code: string) => entries[code];

export const getGuideStats = (): GuideStats => ({
  totalSections: tocEntries.length,
  totalStory: tocEntries.filter((entry) => entry.kind === 'story').length,
  totalHunts: tocEntries.filter((entry) => entry.kind === 'mark').length,
  totalLootAlerts: tocEntries.filter((entry) => entry.kind === 'loot').length,
});

const deduceTypeFromShop = (shopName: string): InventoryItemSummary['type'] => {
  const normalized = shopName.toLowerCase();
  if (normalized.includes('weapon')) return 'weapon';
  if (normalized.includes('armor')) return 'armor';
  if (normalized.includes('magic') || normalized.includes('magick')) return 'magick';
  if (normalized.includes('technick')) return 'technick';
  if (normalized.includes('item')) return 'item';
  return 'other';
};

export const buildInventoryIndex = (): InventoryItemSummary[] => {
  const map = new Map<string, InventoryItemSummary>();
  Object.values(entries).forEach((entry) => {
    entry.shops?.forEach((shop) => {
      shop.items.forEach((item) => {
        const current = map.get(item.itemId);
        const summary: InventoryItemSummary = current || {
          itemId: item.itemId,
          nameEn: item.nameEn || itemsIndex[item.itemId]?.name.en,
          nameJp: item.nameJp || itemsIndex[item.itemId]?.name.jp,
          nameRaw: item.nameRaw || itemsIndex[item.itemId]?.name.raw,
          price: item.price,
          type: deduceTypeFromShop(shop.name),
          firstSectionCode: entry.code,
          shops: [],
        };
        summary.price = summary.price ?? item.price;
        summary.shops.push({ sectionCode: entry.code, shopName: shop.name });
        map.set(item.itemId, summary);
      });
    });
  });
  return Array.from(map.values()).sort((a, b) => (a.nameEn || a.nameRaw || '').localeCompare(b.nameEn || b.nameRaw || ''));
};

export type InventoryIndex = ReturnType<typeof buildInventoryIndex>;
