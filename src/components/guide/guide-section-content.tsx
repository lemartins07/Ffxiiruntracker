'use client';

import { useMemo, useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { GuideSectionFull } from '@/lib/guide-domain';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { usePlaythroughStore } from '@/lib/stores/playthrough-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useHydrated } from '@/lib/hooks/use-hydrated';

interface Props {
  section: GuideSectionFull;
}

export function GuideSectionContent({ section }: Props) {
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [showMissable, setShowMissable] = useState(false);
  const hydrated = useHydrated();
  const toggleItem = useChecklistStore((state) => state.toggleItem);
  const getSectionProgress = useChecklistStore((state) => state.getSectionProgress);
  const playthroughId = usePlaythroughStore((state) => state.currentPlaythroughId);
  const checklistState = useChecklistStore((state) =>
    playthroughId ? state.completion[playthroughId] ?? {} : {}
  );
  const updateCurrentSection = usePlaythroughStore((state) => state.updateCurrentSection);
  const showJP = useUIStore((state) => state.showJapaneseNames);
  const progress = hydrated ? getSectionProgress(section.toc.code, section.checklist) : 0;

  useEffect(() => {
    if (playthroughId) {
      updateCurrentSection(section.toc.code);
    }
  }, [section.toc.code, playthroughId, updateCurrentSection]);

  const filteredItems = useMemo(() => {
    return section.checklist.filter((item) => {
      if (showIncomplete && checklistState[item.id]?.completed) {
        return false;
      }
      if (showMissable && !item.isMissable) {
        return false;
      }
      return true;
    });
  }, [section.checklist, showIncomplete, showMissable, checklistState]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredItems>();
    filteredItems.forEach((item) => {
      const bucket = map.get(item.category) || [];
      bucket.push(item);
      map.set(item.category, bucket);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  return (
    <div className="space-y-4">
      <Card className="bg-bg-surface">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="font-heading text-3xl">
                {section.entry?.titles.primary.en || section.toc.label.en || section.toc.label.raw}
              </CardTitle>
              {showJP && section.entry?.titles.primary.jp && (
                <p className="font-japanese text-sm text-text-muted">{section.entry.titles.primary.jp}</p>
              )}
            </div>
            <div className="text-right text-sm text-text-muted">
              <div className="font-mono text-accent">{section.toc.code}</div>
              <div>{section.toc.kind}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">{section.toc.kind}</Badge>
            {section.children.length > 0 && <Badge variant="secondary">{section.children.length} subtarefas</Badge>}
            <Badge variant="secondary">{progress}% completo</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Card className="bg-bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-text-muted">
            <Filter className="size-4" />
            Filtros do checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6 text-sm">
          <FilterToggle label="Só incompletas" checked={showIncomplete} onCheckedChange={setShowIncomplete} />
          <FilterToggle label="Só missáveis" checked={showMissable} onCheckedChange={setShowMissable} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {grouped.map(([category, items]) => (
          <div key={category} className="rounded-2xl border border-border-subtle bg-bg-surface/60 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold uppercase tracking-wide text-xs text-text-muted">{category}</h3>
              <span className="text-xs text-text-muted">{items.length} objetivos</span>
            </div>
            <div className="space-y-3">
              {items.map((item) => {
                const completed = checklistState[item.id]?.completed;
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 rounded-xl border border-transparent p-3 transition hover:border-accent/30 ${
                      completed ? 'opacity-60' : ''
                    }`}
                  >
                    <Checkbox checked={completed} onCheckedChange={() => toggleItem(item)} />
                    <div>
                      <div className="font-medium text-sm text-text-primary">{item.label}</div>
                      {item.notes && <p className="text-xs text-text-muted">{item.notes}</p>}
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-text-muted">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.isMissable && <Badge variant="destructive">Missável</Badge>}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        {grouped.length === 0 && <p className="text-center text-sm text-text-muted">Nenhum item com os filtros selecionados.</p>}
      </div>
    </div>
  );
}

interface FilterToggleProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function FilterToggle({ label, checked, onCheckedChange }: FilterToggleProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onCheckedChange} id={id} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
