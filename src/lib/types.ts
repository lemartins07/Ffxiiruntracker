export type LocaleText = {
  jp: string | null;
  en: string | null;
};

export type GuideEntryType = 'section' | 'mark' | 'loot-alert';

export interface HuntReward {
  label: string;
  type: 'gil' | 'item' | 'other';
  amount?: number;
}

export interface GuideEntry {
  id: string;
  chapterId: string;
  chapterOrder: number;
  type: GuideEntryType;
  name: LocaleText;
  area: LocaleText | null;
  content: string;
  tokens: string[];
  globalIndex: number;
  huntRewards: HuntReward[];
}

export interface GuideChapter {
  id: string;
  order: number;
  title: LocaleText;
  sections: GuideEntry[];
  marks: GuideEntry[];
  lootAlerts: GuideEntry[];
  entries: GuideEntry[];
  areas: string[];
}
