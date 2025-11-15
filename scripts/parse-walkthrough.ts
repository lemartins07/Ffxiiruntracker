import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface TocEntry {
  id: string;
  title: string;
}

export interface GuideEntry {
  id: string;
  title: string;
  content: string;
}

export interface GuideDocument {
  toc: TocEntry[];
  entries: GuideEntry[];
}

const SECTION_DELIMITER = '=============================================================================';
const TABLE_ROW_PATTERN = /^\s*\|\s*([^|]*)\|\s*(.*?)\s*\|$/;

async function main(): Promise<void> {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const walkthroughPath = path.resolve(projectRoot, 'Walkthrough.txt');
  const outputPath = path.resolve(projectRoot, 'src', 'data', 'walkthrough.json');

  const walkthroughText = await fs.readFile(walkthroughPath, 'utf8');

  const toc = parseTableOfContents(walkthroughText);
  const entries = parseGuideEntries(walkthroughText, toc);

  reportCoverage(toc, entries);

  const document: GuideDocument = { toc, entries };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(document, null, 2) + '\n', 'utf8');

  console.log(`Generated ${entries.length} guide entries and ${toc.length} ToC entries.`);
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

  const tableEnd = text.indexOf('=============================================================================', firstRowStart);
  if (tableEnd === -1) {
    throw new Error('Could not determine the end of the Table of Contents section.');
  }

  const tocLines = text.slice(firstRowStart, tableEnd).split(/\r?\n/);

  const entries: TocEntry[] = [];
  let currentBaseCode = '';
  let currentEntry: TocEntry | null = null;

  for (const line of tocLines) {
    const match = line.match(TABLE_ROW_PATTERN);
    if (!match) {
      continue;
    }

    const rawCode = match[1]?.trim() ?? '';
    const rawTitle = collapseWhitespace(match[2]);

    if (!rawCode) {
      if (currentEntry && rawTitle) {
        currentEntry.title = `${currentEntry.title} ${rawTitle}`.trim();
      }
      continue;
    }

    let entryId: string | null = null;

    if (/^wt\d{2}[a-z]$/i.test(rawCode)) {
      currentBaseCode = rawCode.slice(0, -1).toLowerCase();
      entryId = rawCode.toLowerCase();
    } else if (/^[a-z]$/i.test(rawCode)) {
      if (!currentBaseCode) {
        throw new Error(`Encountered sub-entry code "${rawCode}" before any base code.`);
      }
      entryId = `${currentBaseCode}${rawCode.toLowerCase()}`;
    } else {
      // Unrecognized code format; skip the line but retain the existing base code.
      continue;
    }

    const entry: TocEntry = {
      id: entryId,
      title: rawTitle,
    };

    entries.push(entry);
    currentEntry = entry;
  }

  return entries;
}

function parseGuideEntries(text: string, toc: TocEntry[]): GuideEntry[] {
  const tocStart = text.indexOf('Table of Contents');
  const firstRowStart = tocStart === -1 ? -1 : text.indexOf('\n|', tocStart);
  const sectionsStart = firstRowStart === -1 ? 0 : text.indexOf('=============================================================================', firstRowStart);
  const content = sectionsStart === -1 ? text : text.slice(sectionsStart);

  const lines = content.split(/\r?\n/);
  const entries: GuideEntry[] = [];
  let currentEntry: GuideEntry | null = null;
  let skipDivider = false;
  let bodyLines: string[] = [];
  const tocTitles = new Map<string, string>(toc.map((entry) => [entry.id, entry.title]));

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line === SECTION_DELIMITER) {
      if (currentEntry) {
        currentEntry.content = finalizeContent(bodyLines);
        entries.push(currentEntry);
        currentEntry = null;
        bodyLines = [];
      }
      skipDivider = false;
      continue;
    }

    const header = parseHeaderLine(line);
    if (header) {
      if (currentEntry) {
        currentEntry.content = finalizeContent(bodyLines);
        entries.push(currentEntry);
      }

      const entryId = header.id;
      const inlineTitle = header.title ? collapseWhitespace(header.title) : '';

      currentEntry = {
        id: entryId,
        title: inlineTitle || tocTitles.get(entryId) || '',
        content: '',
      };
      bodyLines = [];
      skipDivider = true;
      continue;
    }

    if (skipDivider && /^-{5,}$/.test(line)) {
      skipDivider = false;
      continue;
    }

    if (currentEntry) {
      bodyLines.push(rawLine);
    }
  }

  if (currentEntry) {
    currentEntry.content = finalizeContent(bodyLines);
    entries.push(currentEntry);
  }

  return entries;
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function finalizeContent(lines: string[]): string {
  let start = 0;
  let end = lines.length;

  while (start < end && lines[start].trim() === '') {
    start += 1;
  }

  while (end > start && lines[end - 1].trim() === '') {
    end -= 1;
  }

  return lines.slice(start, end).join('\n');
}

function parseHeaderLine(line: string): { id: string; title: string } | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) {
    return null;
  }

  let rest = trimmed.slice(1).trim();
  const idMatch = rest.match(/^(wt\d{2}[a-z])/i);
  if (!idMatch) {
    return null;
  }

  const id = idMatch[1].toLowerCase();
  rest = rest.slice(idMatch[0].length).trim();
  let title = '';

  if (rest.startsWith('|')) {
    rest = rest.slice(1).trim();
    if (rest.endsWith('|')) {
      rest = rest.slice(0, -1).trim();
    }
    title = rest;
  }

  return { id, title };
}

function reportCoverage(toc: TocEntry[], entries: GuideEntry[]): void {
  const entryIds = new Set(entries.map((entry) => entry.id));
  const tocIds = new Set(toc.map((entry) => entry.id));

  const missingSections = toc.filter((entry) => !entryIds.has(entry.id));
  const missingTocEntries = entries.filter((entry) => !tocIds.has(entry.id));

  if (missingSections.length > 0) {
    console.warn(
      `Warning: ${missingSections.length} Table of Contents entries are missing guide sections:`,
      missingSections.map((entry) => entry.id).join(', ')
    );
  }

  if (missingTocEntries.length > 0) {
    console.warn(
      `Warning: ${missingTocEntries.length} guide entries do not appear in the Table of Contents:`,
      missingTocEntries.map((entry) => entry.id).join(', ')
    );
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
