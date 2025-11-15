import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type LowercaseLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

type SearchCode = `wt${number}${LowercaseLetter}`;

type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; style: 'bullet' | 'number'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'note'; text: string; severity?: 'info' | 'warning' };

type LootAlertBlock = {
  emphasis: string;
  description: string;
};

type MediaLink = {
  url: string;
  caption?: string;
  type?: 'image' | 'video';
};

type ItemCategory =
  | 'weapon'
  | 'armor'
  | 'magick'
  | 'technick'
  | 'item'
  | 'accessory'
  | 'ammunition'
  | 'key'
  | 'other';

type ItemSourceKind = 'shop' | 'loot-alert' | 'narrative';

type ItemOccurrence = {
  code: SearchCode;
  kind: ItemSourceKind;
  detail: string;
};

type ItemRecord = {
  id: string;
  name: { jp?: string; en?: string; raw: string };
  category: ItemCategory;
  occurrences: ItemOccurrence[];
};

type ShopItem = {
  itemId: string;
  nameRaw: string;
  nameJp?: string;
  nameEn?: string;
  price?: number;
  notes?: string;
};

type ShopSection = {
  name: string;
  items: ShopItem[];
};

type AbilityEntry = {
  nameJp?: string;
  nameEn?: string;
  location: string;
  notes?: string;
};

type AbilitySection = {
  category: string;
  entries: AbilityEntry[];
};

type MarkMetadata = {
  petitioner?: string;
  target?: string;
  recommendedLevel?: string;
  strategyNotes?: ContentBlock[];
};

type GuideEntry = {
  code: SearchCode;
  kind: TocEntry['kind'];
  titles: {
    primary: { jp?: string; en?: string; raw: string };
    subtitle?: string;
  };
  location?: string;
  crystals?: { teleport: boolean; save: boolean };
  shops?: ShopSection[];
  abilities?: AbilitySection[];
  lootAlerts?: LootAlertBlock[];
  marks?: MarkMetadata;
  media?: MediaLink[];
  narrative: ContentBlock[];
  relatedCodes: SearchCode[];
  itemsReferenced?: string[];
};

type TocEntry = {
  code: SearchCode;
  order: number;
  parentCode?: SearchCode;
  kind: 'story' | 'mark' | 'loot' | 'other';
  label: { jp?: string; en?: string; raw: string };
};

type GuideDocument = {
  meta: {
    title: string;
    subtitle: string;
    version: string;
    author: string;
    changelog: { version: string; date: string; notes: string[] }[];
  };
  toc: TocEntry[];
  entries: Record<SearchCode, GuideEntry>;
  items: Record<string, ItemRecord>;
};

type RawGuideEntry = {
  code: SearchCode;
  headerTitle: string;
  lines: string[];
};

type ParsedEntryBody = {
  crystals?: { teleport: boolean; save: boolean };
  shops: ShopSection[];
  abilities: AbilitySection[];
  lootAlerts: LootAlertBlock[];
  narrative: ContentBlock[];
  media: MediaLink[];
  referencedItemIds: string[];
};

class ItemRegistry {
  private items = new Map<string, ItemRecord>();
  private aliases = new Map<string, string>();
  private counter = 0;

  register(
    name: { jp?: string; en?: string; raw: string },
    category: ItemCategory,
    occurrence: ItemOccurrence
  ): string {
    const keyCandidates = this.buildAliasCandidates(name);
    let id: string | undefined;

    for (const candidate of keyCandidates) {
      const found = this.aliases.get(candidate);
      if (found) {
        id = found;
        break;
      }
    }

    if (!id) {
      id = this.createItemId(name);
      const record: ItemRecord = {
        id,
        name: { ...name },
        category,
        occurrences: [],
      };
      this.items.set(id, record);
      for (const candidate of keyCandidates) {
        this.aliases.set(candidate, id);
      }
    }

    const record = this.items.get(id);
    if (!record) {
      throw new Error(`Failed to resolve item record for id ${id}`);
    }

    record.name = this.mergeNames(record.name, name);
    if (record.category === 'other' && category !== 'other') {
      record.category = category;
    }
    record.occurrences.push(occurrence);

    return id;
  }

  toRecord(): Record<string, ItemRecord> {
    const entries = Array.from(this.items.entries()).sort(([leftId], [rightId]) =>
      leftId < rightId ? -1 : leftId > rightId ? 1 : 0
    );
    return Object.fromEntries(entries);
  }

  private mergeNames(
    existing: ItemRecord['name'],
    incoming: ItemRecord['name']
  ): ItemRecord['name'] {
    return {
      raw: existing.raw || incoming.raw,
      jp: existing.jp ?? incoming.jp,
      en: existing.en ?? incoming.en,
    };
  }

  private createItemId(name: { jp?: string; en?: string; raw: string }): string {
    const baseValue = name.en ?? name.jp ?? name.raw;
    const baseSlug = this.slugify(baseValue);
    let candidate = baseSlug;
    let suffix = 2;
    while (this.items.has(candidate)) {
      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  private slugify(value: string): string {
    const normalized = value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const trimmed = normalized.replace(/^-+|-+$/g, '');
    if (trimmed) {
      return trimmed;
    }
    this.counter += 1;
    return `item-${this.counter}`;
  }

  private buildAliasCandidates(name: { jp?: string; en?: string; raw: string }): string[] {
    const candidates = new Set<string>();
    if (name.en) {
      candidates.add(this.normalizeAlias(name.en));
    }
    if (name.jp) {
      candidates.add(this.normalizeAlias(name.jp));
    }
    if (name.raw) {
      candidates.add(this.normalizeAlias(name.raw));
    }
    return Array.from(candidates).filter(Boolean);
  }

  private normalizeAlias(value: string): string {
    return value
      .toLowerCase()
      .replace(/[\u3000\s]+/g, ' ')
      .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff ]+/g, '')
      .trim();
  }
}

const itemRegistry = new ItemRegistry();

const JAPANESE_CHAR_PATTERN = /[\u3040-\u30ff\u3400-\u9fff]/;

const SECTION_DELIMITER = '=============================================================================';
const TABLE_ROW_PATTERN = /^\s*\|\s*([^|]*)\|\s*(.*?)\s*\|\s*$/;
const SHOP_HEADING_PATTERN = /Shop:$/i;
const DASH_LINE_PATTERN = /^[-=]{3,}$/;
const LOOT_ALERT_PATTERN = /-LOOT ALERT-/i;
const CRYSTAL_PATTERN = /Teleport Crystal:\s*(Yes|No)\s*\/\s*Save Crystal:\s*(Yes|No)/i;
const URL_PATTERN = /https?:\/\//i;

async function main(): Promise<void> {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const walkthroughPath = path.resolve(projectRoot, 'Walkthrough.txt');
  const outputPath = path.resolve(projectRoot, 'src', 'data', 'walkthrough.json');

  const walkthroughText = await fs.readFile(walkthroughPath, 'utf8');

  const meta = parseMeta(walkthroughText);
  const toc = parseTableOfContents(walkthroughText);
  const entries = parseGuideEntries(walkthroughText, toc);

  reportCoverage(toc, entries);

  const document: GuideDocument = { meta, toc, entries, items: itemRegistry.toRecord() };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(document, null, 2) + '\n', 'utf8');

  console.log(`Generated ${Object.keys(entries).length} guide entries and ${toc.length} ToC entries.`);
}

function parseMeta(text: string): GuideDocument['meta'] {
  const lines = text.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => /Final Fantasy XII/i.test(line));
  const subtitleIndex = titleIndex >= 0 ? titleIndex + 1 : -1;
  const walkthroughIndex = titleIndex >= 0 ? titleIndex + 2 : -1;
  const title = titleIndex >= 0 ? collapseWhitespace(lines[titleIndex]) : 'Final Fantasy XII International';
  const subtitleParts: string[] = [];
  if (subtitleIndex >= 0 && lines[subtitleIndex].trim()) {
    subtitleParts.push(collapseWhitespace(lines[subtitleIndex]));
  }
  if (walkthroughIndex >= 0 && /Walkthrough/i.test(lines[walkthroughIndex])) {
    subtitleParts.push(collapseWhitespace(lines[walkthroughIndex]));
  }
  const versionLine = lines.find((line) => /Version\s+/i.test(line));
  const version = versionLine ? collapseWhitespace(versionLine).replace(/Version\s*/i, '') : '1.00';
  const authorLine = lines.find((line) => /^\s*by\s+/i.test(line));
  const author = authorLine ? collapseWhitespace(authorLine).replace(/^by\s+/i, '') : 'Red Scarlet';

  const changelog: { version: string; date: string; notes: string[] }[] = [];
  const historyIndex = lines.findIndex((line) => line.trim() === 'Version History');
  if (historyIndex >= 0) {
    let started = false;
    for (let i = historyIndex + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) {
        if (started) {
          break;
        }
        continue;
      }
      started = true;
      const entryMatch = line.match(/^(\d+\.\d+)\s+(\d{2}\/\d{2}\/\d{2})-(.*)$/);
      if (entryMatch) {
        const [, versionValue, date, rest] = entryMatch;
        const note = collapseWhitespace(rest);
        changelog.push({ version: versionValue, date, notes: [note] });
        continue;
      }
      if (changelog.length > 0) {
        changelog[changelog.length - 1].notes.push(collapseWhitespace(line));
      }
    }
  }

  return {
    title,
    subtitle: subtitleParts.join(' '),
    version,
    author,
    changelog,
  };
}

function parseTableOfContents(text: string): TocEntry[] {
  const tocStart = text.indexOf('Table of Contents');
  if (tocStart === -1) {
    throw new Error('Could not locate Table of Contents heading.');
  }

  const firstRowStart = text.indexOf('\n|', tocStart);
  if (firstRowStart === -1) {
    throw new Error('Could not locate the first Table of Contents row.');
  }

  const tableEnd = text.indexOf(SECTION_DELIMITER, firstRowStart);
  if (tableEnd === -1) {
    throw new Error('Could not determine the end of the Table of Contents section.');
  }

  const tocLines = text.slice(firstRowStart, tableEnd).split(/\r?\n/);

  const entries: TocEntry[] = [];
  const baseToPrimary = new Map<string, SearchCode>();
  let currentBase = '';
  let currentEntry: TocEntry | null = null;
  let order = 0;

  for (const line of tocLines) {
    const match = line.match(TABLE_ROW_PATTERN);
    if (!match) {
      continue;
    }

    const rawCode = match[1]?.trim() ?? '';
    const rawTitle = collapseWhitespace(match[2]);

    if (!rawCode) {
      if (currentEntry && rawTitle) {
        const combinedRaw = collapseWhitespace(`${currentEntry.label.raw} ${rawTitle}`);
        currentEntry.label = {
          ...currentEntry.label,
          raw: combinedRaw,
        };
      }
      continue;
    }

    let code: SearchCode | null = null;
    const lowerRawCode = rawCode.toLowerCase();
    const fullMatch = lowerRawCode.match(/^(wt\d{2,}[a-z])$/);
    const suffixMatch = lowerRawCode.match(/^([a-z])$/);

    if (fullMatch) {
      code = fullMatch[1] as SearchCode;
      const base = code.slice(0, -1);
      currentBase = base;
      if (!baseToPrimary.has(base)) {
        baseToPrimary.set(base, code);
      }
    } else if (suffixMatch) {
      if (!currentBase) {
        throw new Error(`Encountered sub-entry code "${rawCode}" before any base code.`);
      }
      code = `${currentBase}${suffixMatch[1]}` as SearchCode;
      if (!baseToPrimary.has(currentBase)) {
        baseToPrimary.set(currentBase, code);
      }
    } else {
      continue;
    }

    const label = parseLabel(rawTitle);
    const kind = inferKind(rawTitle);

    const entry: TocEntry = {
      code,
      order,
      kind,
      label,
    };

    const base = code.slice(0, -1);
    const primary = baseToPrimary.get(base);
    if (primary && primary !== code) {
      entry.parentCode = primary;
    }

    entries.push(entry);
    currentEntry = entry;
    order += 1;
  }

  return entries;
}

function parseGuideEntries(text: string, toc: TocEntry[]): Record<SearchCode, GuideEntry> {
  const tocMap = new Map<SearchCode, TocEntry>();
  const baseGroups = new Map<string, SearchCode[]>();
  for (const entry of toc) {
    tocMap.set(entry.code, entry);
    const base = entry.code.slice(0, -1);
    const group = baseGroups.get(base) ?? [];
    group.push(entry.code);
    baseGroups.set(base, group);
  }

  const tocStart = text.indexOf('Table of Contents');
  const firstRowStart = tocStart === -1 ? -1 : text.indexOf('\n|', tocStart);
  const sectionsStart = firstRowStart === -1 ? 0 : text.indexOf(SECTION_DELIMITER, firstRowStart);
  const content = sectionsStart === -1 ? text : text.slice(sectionsStart);
  const lines = content.split(/\r?\n/);

  const rawEntries: RawGuideEntry[] = [];
  let current: RawGuideEntry | null = null;

  for (const rawLine of lines) {
    const trimmed = rawLine.trimEnd();

    if (trimmed === SECTION_DELIMITER) {
      continue;
    }

    const header = parseHeaderLine(trimmed);
    if (header) {
      if (current) {
        rawEntries.push(current);
      }
      current = { code: header.id as SearchCode, headerTitle: header.title, lines: [] };
      continue;
    }

    if (!current) {
      continue;
    }

    current.lines.push(rawLine);
  }

  if (current) {
    rawEntries.push(current);
  }

  const entries: Record<SearchCode, GuideEntry> = {} as Record<SearchCode, GuideEntry>;

  for (const raw of rawEntries) {
    const tocEntry = tocMap.get(raw.code);
    const kind = tocEntry?.kind ?? 'other';
    const primaryLabel = parseLabel(raw.headerTitle || tocEntry?.label.raw || raw.code);
    const parsedBody = parseEntryBody(raw.lines, tocEntry, raw.code);

    const entry: GuideEntry = {
      code: raw.code,
      kind,
      titles: {
        primary: primaryLabel,
      },
      crystals: parsedBody.crystals,
      shops: parsedBody.shops.length > 0 ? parsedBody.shops : undefined,
      abilities: parsedBody.abilities.length > 0 ? parsedBody.abilities : undefined,
      lootAlerts: parsedBody.lootAlerts.length > 0 ? parsedBody.lootAlerts : undefined,
      media: parsedBody.media.length > 0 ? parsedBody.media : undefined,
      narrative: parsedBody.narrative,
      relatedCodes: [],
      itemsReferenced: parsedBody.referencedItemIds.length > 0 ? parsedBody.referencedItemIds : undefined,
    };

    entries[raw.code] = entry;
  }

  for (const [base, codes] of baseGroups.entries()) {
    const sorted = codes.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (const code of sorted) {
      const entry = entries[code];
      if (!entry) {
        continue;
      }
      entry.relatedCodes = sorted.filter((other) => other !== code);
    }
  }

  return entries;
}

function parseEntryBody(
  lines: string[],
  tocEntry: TocEntry | undefined,
  code: SearchCode
): ParsedEntryBody {
  const shops: ShopSection[] = [];
  const abilities: AbilitySection[] = [];
  const lootAlerts: LootAlertBlock[] = [];
  const narrative: ContentBlock[] = [];
  const media: MediaLink[] = [];
  let crystals: { teleport: boolean; save: boolean } | undefined;
  let paragraphBuffer: string[] = [];
  const referencedItemIds = new Set<string>();

  const recordMentions = (
    text: string,
    source: ItemSourceKind,
    categoryHint?: ItemCategory
  ) => {
    if (!text) {
      return;
    }
    for (const itemId of registerItemMentions(text, code, source, categoryHint)) {
      referencedItemIds.add(itemId);
    }
  };

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }
    const text = collapseWhitespace(paragraphBuffer.join(' '));
    if (text) {
      narrative.push({ kind: 'paragraph', text });
    }
    paragraphBuffer = [];
  };

  const addList = (style: 'bullet' | 'number', items: string[]) => {
    if (items.length > 0) {
      narrative.push({ kind: 'list', style, items: items.map((item) => collapseWhitespace(item)) });
    }
  };

  for (let index = 0; index < lines.length; ) {
    const rawLine = lines[index];
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      flushParagraph();
      index += 1;
      continue;
    }

    if (/^\|\s*wt\d{2,}[a-z]\s*\|$/i.test(trimmedLine)) {
      index += 1;
      continue;
    }

    if (DASH_LINE_PATTERN.test(trimmedLine)) {
      flushParagraph();
      index += 1;
      continue;
    }

    const crystalMatch = trimmedLine.match(CRYSTAL_PATTERN);
    if (crystalMatch) {
      flushParagraph();
      crystals = {
        teleport: crystalMatch[1].toLowerCase() === 'yes',
        save: crystalMatch[2].toLowerCase() === 'yes',
      };
      index += 1;
      continue;
    }

    if (SHOP_HEADING_PATTERN.test(trimmedLine)) {
      flushParagraph();
      const { section, nextIndex, itemIds } = parseShopSection(lines, index, code);
      if (section.items.length > 0) {
        shops.push(section);
      }
      for (const itemId of itemIds) {
        referencedItemIds.add(itemId);
      }
      index = nextIndex;
      continue;
    }

    if (LOOT_ALERT_PATTERN.test(trimmedLine)) {
      flushParagraph();
      const { block, nextIndex, itemIds } = parseLootAlert(lines, index, tocEntry, code);
      if (block) {
        lootAlerts.push(block);
      }
      for (const itemId of itemIds) {
        referencedItemIds.add(itemId);
      }
      index = nextIndex;
      continue;
    }

    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length) {
        const candidate = lines[cursor].trim();
        const match = candidate.match(/^[-*•]\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(match[1]);
        recordMentions(match[1], 'narrative');
        cursor += 1;
      }
      addList('bullet', items);
      index = cursor;
      continue;
    }

    const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      flushParagraph();
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length) {
        const candidate = lines[cursor].trim();
        const match = candidate.match(/^(\d+)\.\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(match[2]);
        recordMentions(match[2], 'narrative');
        cursor += 1;
      }
      addList('number', items);
      index = cursor;
      continue;
    }

    if (URL_PATTERN.test(trimmedLine)) {
      flushParagraph();
      const normalizedUrl = trimmedLine.replace(/^Pic:\s*/i, '');
      media.push({ url: normalizedUrl, type: inferMediaType(normalizedUrl) });
      index += 1;
      continue;
    }

    recordMentions(trimmedLine, 'narrative');
    paragraphBuffer.push(trimmedLine);
    index += 1;
  }

  flushParagraph();

  return {
    crystals,
    shops,
    abilities,
    lootAlerts,
    narrative,
    media,
    referencedItemIds: Array.from(referencedItemIds),
  };
}

function parseShopSection(
  lines: string[],
  startIndex: number,
  code: SearchCode
): { section: ShopSection; nextIndex: number; itemIds: string[] } {
  const headingLine = collapseWhitespace(lines[startIndex]);
  const name = headingLine.replace(/:$/, '');
  const items: ShopItem[] = [];
  const itemIds: string[] = [];

  const category = inferItemCategoryFromShopName(name);

  let index = startIndex + 1;
  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  for (; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();
    if (!trimmed) {
      continue;
    }
    if (DASH_LINE_PATTERN.test(trimmed) || SHOP_HEADING_PATTERN.test(trimmed) || LOOT_ALERT_PATTERN.test(trimmed)) {
      break;
    }
    const header = parseHeaderLine(trimmed);
    if (header) {
      break;
    }
    const parsedItem = parseShopItem(trimmed);
    if (parsedItem) {
      const itemId = itemRegistry.register(
        { jp: parsedItem.nameJp, en: parsedItem.nameEn, raw: parsedItem.nameRaw },
        category,
        {
          code,
          kind: 'shop',
          detail: `${name}: ${parsedItem.nameRaw}`,
        }
      );
      items.push({
        itemId,
        nameRaw: parsedItem.nameRaw,
        nameJp: parsedItem.nameJp,
        nameEn: parsedItem.nameEn,
        price: parsedItem.price,
      });
      itemIds.push(itemId);
    } else {
      // treat as notes and attach to previous item if possible
      if (items.length > 0) {
        items[items.length - 1].notes = collapseWhitespace(
          `${items[items.length - 1].notes ?? ''} ${trimmed}`.trim()
        );
      }
    }
  }

  return {
    section: {
      name,
      items,
    },
    nextIndex: index,
    itemIds,
  };
}

function parseLootAlert(
  lines: string[],
  startIndex: number,
  tocEntry: TocEntry | undefined,
  code: SearchCode
): { block: LootAlertBlock | null; nextIndex: number; itemIds: string[] } {
  let index = startIndex;
  while (index < lines.length && !LOOT_ALERT_PATTERN.test(lines[index])) {
    index += 1;
  }
  if (index >= lines.length) {
    return { block: null, nextIndex: index, itemIds: [] };
  }

  // skip opening marker
  index += 1;
  const descriptionLines: string[] = [];
  while (index < lines.length && !LOOT_ALERT_PATTERN.test(lines[index])) {
    const trimmed = lines[index].trim();
    if (trimmed) {
      descriptionLines.push(trimmed);
    }
    index += 1;
  }

  if (index < lines.length) {
    index += 1; // skip closing marker
  }

  const emphasis = tocEntry ? stripCategoryPrefix(tocEntry.label.raw, 'LOOT ALERT:') : 'Loot Alert';
  const description = collapseWhitespace(descriptionLines.join(' '));
  const itemIds = registerItemMentions(description, code, 'loot-alert');

  return {
    block: {
      emphasis,
      description,
    },
    nextIndex: index,
    itemIds,
  };
}

type ParsedShopItem = {
  nameRaw: string;
  nameJp?: string;
  nameEn?: string;
  price?: number;
};

function parseShopItem(line: string): ParsedShopItem | null {
  const priceMatch = line.match(/(\d[\d,]*)\s*gil$/i);
  let working = line;
  let price: number | undefined;
  if (priceMatch && priceMatch.index !== undefined) {
    price = Number.parseInt(priceMatch[1].replace(/,/g, ''), 10);
    working = line.slice(0, priceMatch.index).trim();
  }

  const bilingual = parseLabel(working);
  if (!bilingual.jp && !bilingual.en) {
    return null;
  }

  return {
    nameRaw: bilingual.raw,
    nameJp: bilingual.jp,
    nameEn: bilingual.en,
    price,
  };
}

function registerItemMentions(
  text: string,
  code: SearchCode,
  source: ItemSourceKind,
  categoryHint?: ItemCategory
): string[] {
  const mentions = extractItemMentions(text, categoryHint);
  const detail = collapseWhitespace(text);
  const truncatedDetail = detail.length > 240 ? `${detail.slice(0, 237)}...` : detail;
  const ids: string[] = [];
  for (const mention of mentions) {
    const id = itemRegistry.register(mention.label, mention.category, {
      code,
      kind: source,
      detail: truncatedDetail,
    });
    ids.push(id);
  }
  return ids;
}

type ItemMention = {
  label: { jp?: string; en?: string; raw: string };
  category: ItemCategory;
};

function extractItemMentions(text: string, categoryHint?: ItemCategory): ItemMention[] {
  const mentions: ItemMention[] = [];
  const normalized = text.toLowerCase();
  const contextPattern =
    /weapon|armor|armour|magick|spell|tech|technick|item|loot|drop|treasure|reward|shop|buy|sell|bazaar|monograph|accessor|accessory|bow|sword|rod|staff|dagger|gun|shield|helm|helmet|hat|robe|mail|spear|pole|gauntlet|belt|ring|potion|elixir|remedy|phoenix|bomb|shot|arrow|bullet|ammunition|key item|license/;
  const pattern = /([^()]*?)\(([^)]+)\)/g;
  const seen = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const left = isolatePrimaryLabel(match[1]);
    const right = collapseWhitespace(match[2]);
    if (!left && !right) {
      continue;
    }
    if (!JAPANESE_CHAR_PATTERN.test(left) && !JAPANESE_CHAR_PATTERN.test(right)) {
      continue;
    }
    const combined = `${left} (${right})`.trim();
    const label = parseLabel(combined);
    if (!label.jp && !label.en) {
      continue;
    }
    const normalizedRaw = label.raw.toLowerCase();
    if (seen.has(normalizedRaw)) {
      continue;
    }
    seen.add(normalizedRaw);
    const category = inferItemCategoryFromContext(text, categoryHint);
    if (!contextPattern.test(normalized) && (!categoryHint || categoryHint === 'other') && category === 'other') {
      continue;
    }
    mentions.push({ label, category });
  }

  return mentions;
}

function isolatePrimaryLabel(value: string): string {
  const cleaned = collapseWhitespace(value);
  if (!cleaned) {
    return cleaned;
  }
  if (JAPANESE_CHAR_PATTERN.test(cleaned)) {
    const matches = cleaned.match(/[\u3040-\u30ff\u3400-\u9fff][\u3040-\u30ff\u3400-\u9fff\s・ー'’]*/g);
    if (matches && matches.length > 0) {
      return collapseWhitespace(matches[matches.length - 1]);
    }
  }
  const segments = cleaned
    .split(/[,;:]/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length > 1) {
    return segments[segments.length - 1];
  }
  const words = cleaned.split(' ');
  if (words.length > 3) {
    return words.slice(-3).join(' ');
  }
  return cleaned;
}

function inferItemCategoryFromShopName(name: string): ItemCategory {
  const normalized = name.toLowerCase();
  if (normalized.includes('weapon')) {
    return 'weapon';
  }
  if (normalized.includes('armor') || normalized.includes('armour')) {
    return 'armor';
  }
  if (normalized.includes('magick') || normalized.includes('magic')) {
    return 'magick';
  }
  if (normalized.includes('tech')) {
    return 'technick';
  }
  if (normalized.includes('accessory')) {
    return 'accessory';
  }
  if (normalized.includes('ammo') || normalized.includes('ammunition')) {
    return 'ammunition';
  }
  if (normalized.includes('item') || normalized.includes('bazaar')) {
    return 'item';
  }
  if (normalized.includes('license')) {
    return 'key';
  }
  return 'other';
}

function inferItemCategoryFromContext(
  text: string,
  hint: ItemCategory | undefined
): ItemCategory {
  if (hint && hint !== 'other') {
    return hint;
  }
  const normalized = text.toLowerCase();
  if (/magick|spell/.test(normalized)) {
    return 'magick';
  }
  if (/tech|technick/.test(normalized)) {
    return 'technick';
  }
  if (/weapon|sword|blade|gun|bow|axe|spear|pole|rod|staff|knife|dagger|bomb|hammer/.test(normalized)) {
    return 'weapon';
  }
  if (/armor|armour|helm|helmet|hat|shield|robe|mail|vest|suit|gauntlet/.test(normalized)) {
    return 'armor';
  }
  if (/accessor|accessory|ring|belt|bracelet|amulet|earring/.test(normalized)) {
    return 'accessory';
  }
  if (/shot|arrow|bullet|ammunition|ammo|bolt/.test(normalized)) {
    return 'ammunition';
  }
  if (/key item|license|monograph/.test(normalized)) {
    return 'key';
  }
  if (/potion|elixir|remedy|ether|loot|item|consumable|phoenix down|grenade/.test(normalized)) {
    return 'item';
  }
  return hint ?? 'other';
}

function parseHeaderLine(line: string): { id: string; title: string } | null {
  if (!line.startsWith('|')) {
    return null;
  }

  const headerMatch = line.match(/\|\s*(wt\d{2,}[a-z])\s*\|(?:\s*(.*?)\s*\|)?/i);
  if (!headerMatch) {
    return null;
  }

  const [, id, title] = headerMatch;
  const rawTitle = typeof title === 'string' ? title : '';
  return { id: id.toLowerCase(), title: rawTitle ? collapseWhitespace(rawTitle) : '' };
}

function parseLabel(raw: string): { jp?: string; en?: string; raw: string } {
  const cleaned = collapseWhitespace(raw);
  const noMark = stripCategoryPrefix(stripCategoryPrefix(cleaned, 'Mark:'), 'LOOT ALERT:');
  const parenthesisCount = (noMark.match(/\(/g) ?? []).length;
  if (parenthesisCount > 1) {
    return { raw: cleaned };
  }
  const parenMatch = noMark.match(/^(.*?)(?:\(([^)]*)\))?$/);
  let jp: string | undefined;
  let en: string | undefined;
  if (parenMatch) {
    const left = parenMatch[1]?.trim();
    const right = parenMatch[2]?.trim();
    if (left) {
      if (/[\u3040-\u30ff\u3400-\u9fff]/.test(left)) {
        jp = left;
      } else {
        en = left;
      }
    }
    if (right) {
      en = right;
    }
  }

  return { jp, en, raw: cleaned };
}

function stripCategoryPrefix(value: string, prefix: string): string {
  const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, (char) => `\\${char}`);
  const pattern = new RegExp(`^${escaped}\\s*`, 'i');
  return value.replace(pattern, '').trim();
}

function inferKind(rawTitle: string): TocEntry['kind'] {
  const normalized = rawTitle.toLowerCase();
  if (normalized.includes('loot alert')) {
    return 'loot';
  }
  if (normalized.startsWith('mark:')) {
    return 'mark';
  }
  return 'story';
}

function inferMediaType(url: string): MediaLink['type'] {
  if (/\.(png|jpe?g|gif|webp)$/i.test(url)) {
    return 'image';
  }
  if (/\.(mp4|webm|mov)$/i.test(url)) {
    return 'video';
  }
  return undefined;
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function reportCoverage(toc: TocEntry[], entries: Record<SearchCode, GuideEntry>): void {
  const entryIds = new Set(Object.keys(entries));
  const tocIds = new Set(toc.map((entry) => entry.code));

  const missingSections = toc.filter((entry) => !entryIds.has(entry.code));
  const missingTocEntries = Array.from(entryIds).filter((id) => !tocIds.has(id as SearchCode));

  if (missingSections.length > 0) {
    console.warn(
      `Warning: ${missingSections.length} Table of Contents entries are missing guide sections:`,
      missingSections.map((entry) => entry.code).join(', ')
    );
  }

  if (missingTocEntries.length > 0) {
    console.warn(
      `Warning: ${missingTocEntries.length} guide entries do not appear in the Table of Contents:`,
      missingTocEntries.join(', ')
    );
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
