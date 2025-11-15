import guideBlocks, { GuideBlock } from '../data/guideBlocks';
import {
  GuideChapter,
  GuideEntry,
  GuideEntryType,
  HuntReward,
  LocaleText,
} from './types';

const ENTRY_TYPE_ICONS: Record<GuideEntryType, string> = {
  section: '📖',
  mark: '⚔️',
  'loot-alert': '💎',
};

const AREA_FALLBACK = 'Sem área definida';

const guideEntries: GuideEntry[] = guideBlocks.map((block, index) =>
  transformBlockToEntry(block, index)
);

const guideEntryMap = new Map<string, GuideEntry>(
  guideEntries.map((entry) => [entry.id, entry])
);

const guideChapters: GuideChapter[] = buildChapters(guideEntries);

const computedAreas = Array.from(
  new Set(guideEntries.map((entry) => getEntryAreaName(entry)))
);

const hasFallbackArea = computedAreas.includes(AREA_FALLBACK);

const guideAreas = computedAreas
  .filter((area) => area && area !== AREA_FALLBACK)
  .sort((a, b) => a.localeCompare(b));

if (hasFallbackArea) {
  guideAreas.push(AREA_FALLBACK);
}

type ChapterBuckets = {
  sections: GuideEntry[];
  marks: GuideEntry[];
  lootAlerts: GuideEntry[];
};

function transformBlockToEntry(block: GuideBlock, index: number): GuideEntry {
  const chapterId = extractChapterId(block.searchCode);
  const chapterOrder = extractChapterOrder(chapterId, index);

  return {
    id: block.searchCode,
    chapterId,
    chapterOrder,
    type: block.contentType,
    name: block.name,
    area: block.area,
    content: block.rawText.trim(),
    tokens: block.tokens,
    globalIndex: index,
    huntRewards:
      block.contentType === 'mark' ? extractHuntRewards(block.rawText) : [],
  };
}

function extractChapterId(searchCode: string): string {
  const match = searchCode.match(/^(wt\d+)/i);
  if (match) {
    return match[1];
  }
  return searchCode;
}

function extractChapterOrder(chapterId: string, fallbackIndex: number): number {
  const digits = chapterId.replace(/^wt/i, '');
  const numeric = Number.parseInt(digits, 10);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  return fallbackIndex + 1;
}

function extractHuntRewards(rawText: string): HuntReward[] {
  const rewards: HuntReward[] = [];
  const rewardRegex = /reward:?([^\n]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = rewardRegex.exec(rawText)) !== null) {
    const [, rawList] = match;
    const normalizedList = rawList
      .replace(/[\[\]\(\)]/g, ' ')
      .replace(/\band\b/gi, ',');

    normalizedList
      .split(',')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .forEach((segment) => rewards.push(parseRewardSegment(segment)));
  }

  const unique = new Map<string, HuntReward>();
  rewards.forEach((reward) => {
    if (!unique.has(reward.label)) {
      unique.set(reward.label, reward);
    }
  });

  return Array.from(unique.values());
}

function parseRewardSegment(segment: string): HuntReward {
  const cleaned = segment.replace(/\.+$/, '').trim();
  const gilMatch = cleaned.match(/(\d{1,3}(?:,\d{3})*)\s*gil/i);

  if (gilMatch) {
    const amount = Number.parseInt(gilMatch[1].replace(/,/g, ''), 10);
    return {
      label: cleaned,
      type: 'gil',
      amount: Number.isFinite(amount) ? amount : undefined,
    };
  }

  return {
    label: cleaned,
    type: /stone|potion|armlet|helmet|shield|spear|bow|rod|staff/i.test(cleaned)
      ? 'item'
      : 'other',
  };
}

function buildChapters(entries: GuideEntry[]): GuideChapter[] {
  const chapterEntries = new Map<string, GuideEntry[]>();

  entries.forEach((entry) => {
    const bucket = chapterEntries.get(entry.chapterId);
    if (bucket) {
      bucket.push(entry);
    } else {
      chapterEntries.set(entry.chapterId, [entry]);
    }
  });

  return Array.from(chapterEntries.entries())
    .map(([id, chapterEntries]) => {
      const sortedEntries = [...chapterEntries].sort(
        (a, b) => a.globalIndex - b.globalIndex
      );
      const buckets = bucketEntries(sortedEntries);
      const mainSection = buckets.sections[0] ?? sortedEntries[0];

      return {
        id,
        order: mainSection?.chapterOrder ?? sortedEntries[0]?.chapterOrder ?? 0,
        title: mainSection?.name ?? defaultLocaleText(id),
        sections: buckets.sections,
        marks: buckets.marks,
        lootAlerts: buckets.lootAlerts,
        entries: sortedEntries,
        areas: Array.from(
          new Set(sortedEntries.map((entry) => getEntryAreaName(entry)))
        ).filter((area) => area && area !== AREA_FALLBACK),
      } satisfies GuideChapter;
    })
    .sort((a, b) => a.order - b.order);
}

function bucketEntries(entries: GuideEntry[]): ChapterBuckets {
  return entries.reduce<ChapterBuckets>(
    (acc, entry) => {
      if (entry.type === 'section') {
        acc.sections.push(entry);
      } else if (entry.type === 'mark') {
        acc.marks.push(entry);
      } else if (entry.type === 'loot-alert') {
        acc.lootAlerts.push(entry);
      }
      return acc;
    },
    { sections: [], marks: [], lootAlerts: [] }
  );
}

function defaultLocaleText(fallback: string): LocaleText {
  return { en: fallback, jp: fallback };
}

export function getGuideEntries(): GuideEntry[] {
  return guideEntries;
}

export function getGuideEntryMap(): Map<string, GuideEntry> {
  return guideEntryMap;
}

export function getGuideChapters(): GuideChapter[] {
  return guideChapters;
}

export function getGuideAreas(): string[] {
  return guideAreas;
}

export function getEntryDisplayName(entry: GuideEntry): string {
  return entry.name.en || entry.name.jp || entry.id;
}

export function getEntryAreaName(entry: GuideEntry): string {
  return entry.area?.en || entry.area?.jp || AREA_FALLBACK;
}

export function getEntryTypeIcon(type: GuideEntryType): string {
  return ENTRY_TYPE_ICONS[type];
}

export function filterChaptersByEntryTypes(
  chapters: GuideChapter[],
  types: GuideEntryType[]
): GuideChapter[] {
  if (!types.length) {
    return chapters;
  }

  return chapters
    .map((chapter) => ({
      ...chapter,
      entries: chapter.entries.filter((entry) => types.includes(entry.type)),
      sections: chapter.sections.filter((entry) => types.includes(entry.type)),
      marks: chapter.marks.filter((entry) => types.includes(entry.type)),
      lootAlerts: chapter.lootAlerts.filter((entry) => types.includes(entry.type)),
    }))
    .filter((chapter) => chapter.entries.length > 0);
}

export function filterChaptersByArea(
  chapters: GuideChapter[],
  area: string | null
): GuideChapter[] {
  if (!area) {
    return chapters;
  }

  return chapters
    .map((chapter) => {
      const entries = chapter.entries.filter(
        (entry) => getEntryAreaName(entry) === area
      );

      return {
        ...chapter,
        entries,
        sections: entries.filter((entry) => entry.type === 'section'),
        marks: entries.filter((entry) => entry.type === 'mark'),
        lootAlerts: entries.filter((entry) => entry.type === 'loot-alert'),
      } satisfies GuideChapter;
    })
    .filter((chapter) => chapter.entries.length > 0);
}

export function filterEntries(
  entries: GuideEntry[],
  options: { types?: GuideEntryType[]; area?: string | null }
): GuideEntry[] {
  const { types = [], area = null } = options;

  return entries.filter((entry) => {
    if (types.length && !types.includes(entry.type)) {
      return false;
    }

    if (area && getEntryAreaName(entry) !== area) {
      return false;
    }

    return true;
  });
}
