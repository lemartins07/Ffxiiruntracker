'use client';

import { useMemo, useState } from 'react';
import { buildInventoryIndex } from '@/lib/guide-domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlaythroughStore } from '@/lib/stores/playthrough-store';
import { useUIStore } from '@/lib/stores/ui-store';

const inventoryIndex = buildInventoryIndex();
const types = Array.from(new Set(inventoryIndex.map((item) => item.type)));

export function InventoryClient() {
  const [filter, setFilter] = useState<string>('all');
  const showJP = useUIStore((state) => state.showJapaneseNames);
  const toggleInventoryItem = usePlaythroughStore((state) => state.toggleInventoryItem);
  const inventory = usePlaythroughStore((state) =>
    state.currentPlaythroughId ? state.inventory[state.currentPlaythroughId] : undefined
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return inventoryIndex;
    return inventoryIndex.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'all' ? 'default' : 'secondary'} onClick={() => setFilter('all')}>
          Todos
        </Button>
        {types.map((type) => (
          <Button key={type} variant={filter === type ? 'default' : 'secondary'} onClick={() => setFilter(type)}>
            {type}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const obtained = inventory?.[item.itemId]?.obtained;
          const nextShop = item.shops[0];
          return (
            <Card key={item.itemId} className="bg-bg-surface">
              <CardHeader>
                <CardTitle className="text-lg">
                  {item.nameEn || item.nameRaw}
                  {showJP && item.nameJp && <span className="ml-2 font-japanese text-sm text-text-muted">{item.nameJp}</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.type}</Badge>
                  {item.price && <span>{item.price} gil</span>}
                </div>
                {nextShop && (
                  <p>
                    Disponível em {nextShop.shopName} — seção {nextShop.sectionCode}
                  </p>
                )}
                <Button
                  variant={obtained ? 'secondary' : 'outline'}
                  onClick={() => toggleInventoryItem(item.itemId)}
                >
                  {obtained ? 'Obtido' : 'Marcar como obtido'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
