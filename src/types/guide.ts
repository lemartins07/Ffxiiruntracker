export type SearchCode = string;

export interface GuideDocument {
  meta: GuideMeta;
  toc: TocEntry[];
  entries: Record<SearchCode, GuideEntry>;
  items: Record<string, GuideItem>;
}

export interface GuideMeta {
  title: string;
  subtitle?: string;
  version?: string;
  author?: string;
  changelog?: GuideChangelogEntry[];
}

export interface GuideChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export interface TocEntry {
  code: SearchCode;
  order: number;
  kind: 'story' | 'mark' | 'loot' | 'other';
  label: GuideLabel;
  parentCode?: SearchCode;
}

export interface GuideLabel {
  raw: string;
  en?: string;
  jp?: string;
}

export interface GuideEntry {
  code: SearchCode;
  kind: TocEntry['kind'];
  titles: {
    primary: GuideLabel;
    subtitle?: string;
  };
  location?: string;
  crystals?: {
    teleport: boolean;
    save: boolean;
  };
  shops?: ShopSection[];
  lootAlerts?: LootAlertBlock[];
  media?: GuideMedia[];
  narrative?: ContentBlock[];
  relatedCodes?: SearchCode[];
  itemsReferenced?: string[];
}

export interface ShopSection {
  name: string;
  items: ShopItem[];
}

export interface ShopItem {
  itemId: string;
  nameRaw?: string;
  nameEn?: string;
  nameJp?: string;
  price?: number;
  notes?: string;
}

export interface LootAlertBlock {
  emphasis: string;
  description: string;
}

export interface GuideMedia {
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

export type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; style: 'bullet' | 'number'; items: string[] }
  | { kind: 'note'; text: string; severity?: 'info' | 'warning' };

export interface GuideItem {
  id: string;
  name: GuideLabel;
  category: string;
  occurrences: GuideItemOccurrence[];
}

export interface GuideItemOccurrence {
  code: SearchCode;
  kind: string;
  detail: string;
}
