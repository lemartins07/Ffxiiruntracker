'use client';

import Link from 'next/link';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { guideToc, getGuideSectionFull } from '@/lib/guide-domain';
import { useHydrated } from '@/lib/hooks/use-hydrated';

interface Props {
  activeCode: string;
}

export function GuideSectionSidebar({ activeCode }: Props) {
  const hydrated = useHydrated();
  const getSectionProgress = useChecklistStore((state) => state.getSectionProgress);

  return (
    <aside className="h-full overflow-y-auto rounded-2xl border border-border-subtle bg-bg-surface-muted/70 p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Seções do guia
      </h2>
      <div className="space-y-2">
        {guideToc.map((entry) => {
          const full = getGuideSectionFull(entry.code);
          if (!full) return null;
          const progress = hydrated ? getSectionProgress(entry.code, full.checklist) : 0;
          const isActive = entry.code === activeCode;
          return (
            <Link
              key={entry.code}
              href={`/guide/${entry.code}`}
              className={`block rounded-xl border px-3 py-2 text-sm transition ${
                isActive
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-transparent text-text-muted hover:bg-bg-surface'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">{entry.label.en || entry.label.raw}</span>
                <span className="text-xs text-text-muted">{progress}%</span>
              </div>
              <div className="text-xs text-text-muted">{entry.code}</div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
