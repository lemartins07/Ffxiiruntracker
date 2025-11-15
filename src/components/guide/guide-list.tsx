'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { guideToc, getGuideSectionFull } from '@/lib/guide-domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'História', value: 'story' },
  { label: 'Hunts', value: 'mark' },
  { label: 'Loots', value: 'loot' },
];

export function GuideList() {
  const [filter, setFilter] = useState('all');
  const sections = useMemo(() => {
    return guideToc
      .filter((entry) => (filter === 'all' ? true : entry.kind === filter))
      .map((entry) => getGuideSectionFull(entry.code))
      .filter((section): section is NonNullable<typeof section> => Boolean(section));
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'default' : 'secondary'}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.toc.code} className="bg-bg-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>{section.entry?.titles.primary.en || section.toc.label.en || section.toc.label.raw}</span>
                <Badge variant="outline">{section.toc.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-text-muted">
              <p>
                {section.entry?.narrative?.find((block) => block.kind === 'paragraph' && 'text' in block)?.text?.slice(0, 160) ||
                  'Sem descrição.'}
              </p>
              <Link href={`/guide/${section.toc.code}`} className="text-accent">
                Abrir seção →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
