'use client';

import Link from 'next/link';
import { guideToc, getGuideSectionFull } from '@/lib/guide-domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { useHydrated } from '@/lib/hooks/use-hydrated';

export function HuntsList() {
  const hunts = guideToc.filter((entry) => entry.kind === 'mark');
  const hydrated = useHydrated();
  const getSectionProgress = useChecklistStore((state) => state.getSectionProgress);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hunts.map((hunt) => {
        const section = getGuideSectionFull(hunt.code);
        if (!section) return null;
        const progress = hydrated ? getSectionProgress(hunt.code, section.checklist) : 0;
        return (
          <Card key={hunt.code} className="bg-bg-surface">
            <CardHeader>
              <CardTitle className="text-lg">
                {hunt.label.en || hunt.label.raw}
                <span className="ml-2 text-xs text-text-muted">{hunt.code}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-text-muted">
              <p>Objetivos específicos desta hunt estão disponíveis no checklist da seção.</p>
              <Progress value={progress} />
              <Link href={`/guide/${hunt.code}`} className="text-accent">
                Ir para a seção →
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
