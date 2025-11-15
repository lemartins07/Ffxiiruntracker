'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePlaythroughStore } from '@/lib/stores/playthrough-store';
import { useUIStore } from '@/lib/stores/ui-store';
import type { GuideSectionFull } from '@/lib/guide-domain';

interface Props {
  section: GuideSectionFull;
}

export function GuideRightPanel({ section }: Props) {
  const toggleInventoryItem = usePlaythroughStore((state) => state.toggleInventoryItem);
  const inventory = usePlaythroughStore((state) =>
    state.currentPlaythroughId ? state.inventory[state.currentPlaythroughId] : undefined
  );
  const showJP = useUIStore((state) => state.showJapaneseNames);

  return (
    <Card className="bg-bg-surface-muted/70">
      <CardContent className="p-0">
        <Tabs defaultValue="shops">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="shops">Lojas</TabsTrigger>
            <TabsTrigger value="loot">Loot Alerts</TabsTrigger>
            <TabsTrigger value="story">Narrativa</TabsTrigger>
          </TabsList>
          <TabsContent value="shops" className="p-4">
            <ScrollArea className="h-[520px] pr-2">
              {section.entry?.shops?.length ? (
                section.entry.shops.map((shop) => (
                  <div key={shop.name} className="mb-4 rounded-xl border border-border-subtle p-3">
                    <div className="text-sm font-semibold text-text-primary">{shop.name}</div>
                    <div className="mt-3 space-y-2 text-sm">
                    {shop.items.map((item) => {
                      const obtained = inventory?.[item.itemId]?.obtained;
                      return (
                        <div key={item.itemId} className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium text-text-primary">{item.nameEn || item.nameRaw || item.itemId}</div>
                            {showJP && item.nameJp && (
                              <div className="font-japanese text-xs text-text-muted">{item.nameJp}</div>
                            )}
                            {item.price && <div className="text-xs text-text-muted">{item.price} gil</div>}
                          </div>
                          <Button
                            size="sm"
                            variant={obtained ? 'secondary' : 'outline'}
                            onClick={() => toggleInventoryItem(item.itemId)}
                          >
                            {obtained ? 'Obtido' : 'Marcar'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                ))
              ) : (
                <p className="text-sm text-text-muted">Nenhuma loja aqui.</p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="loot" className="p-4">
            <ScrollArea className="h-[520px] space-y-3 pr-2">
              {section.entry?.lootAlerts?.length ? (
                section.entry.lootAlerts.map((alert, index) => (
                  <div key={index} className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
                    <div className="font-semibold text-accent">{alert.emphasis}</div>
                    <p className="text-text-primary/80">{alert.description}</p>
                </div>
                ))
              ) : (
                <p className="text-sm text-text-muted">Sem alertas de loot.</p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="story" className="p-4">
            <ScrollArea className="h-[520px] space-y-4 pr-2 text-sm text-text-muted">
              {section.entry?.narrative?.length ? (
                section.entry.narrative.map((block, index) => {
                  if (block.kind === 'paragraph') {
                    return (
                      <p key={index} className="text-text-muted">
                      {block.text}
                    </p>
                  );
                }
                if (block.kind === 'list') {
                  const List = block.style === 'number' ? 'ol' : 'ul';
                  return (
                    <List key={index} className="ml-5 list-disc space-y-1">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </List>
                  );
                }
                if (block.kind === 'note') {
                  return (
                    <div key={index} className="rounded-lg border border-border-subtle bg-bg-surface p-3">
                      {block.text}
                    </div>
                  );
                }
                return null;
              })
              ) : (
                <p>Sem narrativa registrada.</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
