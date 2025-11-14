import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useGameStore } from '../lib/store';
import { getImagesByEntries } from '../lib/data';
import { useGuideData } from '../lib/useGuideData';
import { GuideChapter, GuideEntryType } from '../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ChevronRight, Filter, Images } from 'lucide-react';
import { ImageGallery } from './ImageGallery';

const ENTRY_TYPE_LABELS: Record<GuideEntryType, string> = {
  section: 'Seções',
  mark: 'Hunts',
  'loot-alert': 'Loot Alerts',
};

export function GuideView() {
  const {
    currentPlaythroughId,
    progress,
    filters,
    setFilters,
    toggleChecklistItem,
    updateCurrentEntry,
  } = useGameStore();

  const {
    chapters,
    allChapters,
    areas,
    getEntryAreaName,
    getEntryDisplayName,
    getEntryTypeIcon,
  } = useGuideData({ entryTypes: filters.entryTypes, area: filters.area });

  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(
    chapters[0]?.id ?? allChapters[0]?.id
  );

  useEffect(() => {
    if (!chapters.length) {
      setSelectedChapterId(undefined);
      return;
    }

    if (!selectedChapterId || !chapters.some(chapter => chapter.id === selectedChapterId)) {
      setSelectedChapterId(chapters[0]?.id ?? allChapters[0]?.id);
    }
  }, [chapters, allChapters, selectedChapterId]);

  const currentProgress = currentPlaythroughId ? progress[currentPlaythroughId] || {} : {};
  const selectedChapter = useMemo(
    () => chapters.find(chapter => chapter.id === selectedChapterId) ?? chapters[0],
    [chapters, selectedChapterId]
  );

  if (!currentPlaythroughId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-slate-800 border-slate-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-amber-400">Nenhuma Playthrough Ativa</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Crie uma playthrough no Dashboard para começar a usar o guia.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const visibleEntries = selectedChapter
    ? filters.showOnlyIncomplete
      ? selectedChapter.entries.filter(entry => !currentProgress[entry.id]?.done)
      : selectedChapter.entries
    : [];

  const chapterProgress = selectedChapter ? getChapterProgress(selectedChapter, currentProgress) : 0;
  const chapterTitle = selectedChapter
    ? getEntryDisplayName(selectedChapter.sections[0] ?? selectedChapter.entries[0])
    : 'Selecione um capítulo';
  const chapterImages = selectedChapter
    ? getImagesByEntries(selectedChapter.entries.map(entry => entry.id))
    : [];

  const toggleEntryTypeFilter = (type: GuideEntryType) => {
    const hasType = filters.entryTypes.includes(type);
    const nextTypes = hasType
      ? filters.entryTypes.filter(item => item !== type)
      : [...filters.entryTypes, type];
    setFilters({ entryTypes: nextTypes });
  };

  const handleAreaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilters({ area: value === 'all' ? null : value });
  };

  const handleChapterClick = (chapter: GuideChapter) => {
    setSelectedChapterId(chapter.id);
    const firstEntry = chapter.entries[0];
    if (firstEntry) {
      updateCurrentEntry(firstEntry.id);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar - Chapters List */}
      <div className="col-span-3">
        <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-amber-400">Capítulos do Guia</CardTitle>
            <CardDescription className="text-slate-400">
              {chapters.length} capítulos visíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {chapters.map(chapter => {
                  const progressPercentage = getChapterProgress(chapter, currentProgress);
                  const isActive = chapter.id === selectedChapter?.id;
                  const displayName = getEntryDisplayName(
                    chapter.sections[0] ?? chapter.entries[0]
                  );

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterClick(chapter)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-70">{chapter.id}</span>
                          <span>{getEntryTypeIcon(chapter.entries[0]?.type ?? 'section')}</span>
                        </div>
                        <ChevronRight className={`size-4 ${isActive ? '' : 'opacity-50'}`} />
                      </div>
                      <div className="text-sm mb-2 truncate" title={displayName}>
                        {displayName}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs opacity-70">{progressPercentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="col-span-9 space-y-4 overflow-y-auto">
        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <Filter className="size-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id="incomplete"
                  checked={filters.showOnlyIncomplete}
                  onCheckedChange={(checked) => setFilters({ showOnlyIncomplete: checked })}
                />
                <Label htmlFor="incomplete" className="text-slate-300">
                  Mostrar só incompletas
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-slate-300">Tipos:</Label>
                <div className="flex gap-2">
                  {(Object.keys(ENTRY_TYPE_LABELS) as GuideEntryType[]).map((type) => {
                    const active = filters.entryTypes.includes(type);
                    return (
                      <Button
                        key={type}
                        type="button"
                        variant={active ? 'default' : 'outline'}
                        onClick={() => toggleEntryTypeFilter(type)}
                        className={active ? 'bg-amber-600 hover:bg-amber-700' : 'text-slate-300'}
                      >
                        <span className="mr-1">{getEntryTypeIcon(type)}</span>
                        {ENTRY_TYPE_LABELS[type]}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="area-filter" className="text-slate-300">
                  Área:
                </Label>
                <select
                  id="area-filter"
                  value={filters.area ?? 'all'}
                  onChange={handleAreaChange}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
                >
                  <option value="all">Todas as áreas</option>
                  {areas.map(area => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter Content */}
        {selectedChapter && (
          <>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl text-amber-400">{chapterTitle}</CardTitle>
                      <Badge variant="outline" className="border-amber-600 text-amber-400">
                        {selectedChapter.id}
                      </Badge>
                    </div>
                    {selectedChapter.areas.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedChapter.areas.map(area => (
                          <Badge key={area} variant="secondary" className="bg-slate-700 text-slate-200">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-amber-400">{chapterProgress}%</div>
                    <div className="text-sm text-slate-400">Completo</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Checklist */}
                  <div className="space-y-3">
                    <h3 className="text-lg text-amber-400 mb-4">Entradas do capítulo</h3>
                    {visibleEntries.map((entry, index) => {
                      const isDone = currentProgress[entry.id]?.done || false;

                      return (
                        <div key={entry.id}>
                          {index > 0 && <Separator className="my-3 bg-slate-700" />}
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                            <Checkbox
                              id={entry.id}
                              checked={isDone}
                              onCheckedChange={() => toggleChecklistItem(entry.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <label htmlFor={entry.id} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-amber-600 text-sm">
                                    {getEntryTypeIcon(entry.type)} {ENTRY_TYPE_LABELS[entry.type]}
                                  </Badge>
                                  <span className={`font-medium ${isDone ? 'text-amber-300' : 'text-slate-200'}`}>
                                    {getEntryDisplayName(entry)}
                                  </span>
                                </div>
                              </label>
                              <div className="text-xs text-slate-400 mt-1">
                                {getEntryAreaName(entry)}
                              </div>
                              {entry.huntRewards.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {entry.huntRewards.map(reward => (
                                    <Badge
                                      key={`${entry.id}-${reward.label}`}
                                      variant="outline"
                                      className="border-amber-600 text-amber-300"
                                    >
                                      {reward.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="mt-3 text-sm text-slate-300 bg-slate-900/50 p-3 rounded whitespace-pre-wrap">
                                {entry.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {visibleEntries.length === 0 && (
                      <div className="text-center text-slate-400 py-6 bg-slate-900/40 rounded-lg">
                        Nenhuma entrada corresponde aos filtros selecionados.
                      </div>
                    )}
                  </div>

                  {/* Gallery */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Images className="size-5 text-amber-400" />
                      <h3 className="text-lg text-amber-400">Galeria de Imagens</h3>
                    </div>
                    <ImageGallery images={chapterImages} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function getChapterProgress(chapter: GuideChapter, progress: Record<string, { done: boolean } | undefined>) {
  const total = chapter.entries.length;
  const completed = chapter.entries.filter(entry => progress[entry.id]?.done).length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
