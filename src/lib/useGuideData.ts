import { useMemo } from 'react';
import {
  filterChaptersByArea,
  filterChaptersByEntryTypes,
  filterEntries,
  getEntryAreaName,
  getEntryDisplayName,
  getEntryTypeIcon,
  getGuideAreas,
  getGuideChapters,
  getGuideEntries,
  getGuideEntryMap,
} from './guideData';
import { GuideEntryType } from './types';

interface GuideDataOptions {
  entryTypes?: GuideEntryType[];
  area?: string | null;
}

export function useGuideData(options?: GuideDataOptions) {
  const entryTypes = options?.entryTypes ?? [];
  const area = options?.area ?? null;

  const chapters = useMemo(() => getGuideChapters(), []);
  const entries = useMemo(() => getGuideEntries(), []);
  const entryMap = useMemo(() => getGuideEntryMap(), []);
  const areas = useMemo(() => getGuideAreas(), []);

  const filteredChapters = useMemo(() => {
    const filteredByType = filterChaptersByEntryTypes(chapters, entryTypes);
    return filterChaptersByArea(filteredByType, area);
  }, [chapters, area, JSON.stringify(entryTypes)]);

  const filteredEntries = useMemo(() => {
    return filterEntries(entries, { types: entryTypes, area });
  }, [entries, area, JSON.stringify(entryTypes)]);

  return {
    chapters: filteredChapters,
    entries: filteredEntries,
    allChapters: chapters,
    allEntries: entries,
    entryMap,
    areas,
    getEntryAreaName,
    getEntryDisplayName,
    getEntryTypeIcon,
  };
}
