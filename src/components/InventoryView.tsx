import { useState } from 'react';
import { useGameStore } from '../lib/store';
import { useGuideData } from '../lib/useGuideData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Check, X, MapPin, Layers } from 'lucide-react';

export function InventoryView() {
  const { currentPlaythroughId, inventory, toggleInventoryItem } = useGameStore();
  const { entries, areas, getEntryAreaName, getEntryDisplayName } = useGuideData({ entryTypes: ['loot-alert'] });
  const lootEntries = entries;
  const [activeArea, setActiveArea] = useState('all');

  const currentInventory = currentPlaythroughId ? inventory[currentPlaythroughId] || {} : {};

  if (!currentPlaythroughId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-slate-800 border-slate-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-amber-400">Nenhuma Playthrough Ativa</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Crie uma playthrough no Dashboard para usar o inventário.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalLoot = lootEntries.length;
  const obtainedLoot = lootEntries.filter(entry => currentInventory[entry.id]?.obtained).length;
  const overallProgress = {
    total: totalLoot,
    obtained: obtainedLoot,
    percentage: totalLoot > 0 ? Math.round((obtainedLoot / totalLoot) * 100) : 0,
  };

  const uniqueAreas = areas.length > 0 ? areas : ['Sem área definida'];
  const areaTabs = ['all', ...uniqueAreas];

  const chaptersWithLoot = new Set(lootEntries.map(entry => entry.chapterId)).size;

  const getAreaProgress = (areaName: string) => {
    const areaEntries = lootEntries.filter(entry => getEntryAreaName(entry) === areaName);
    const total = areaEntries.length;
    const obtained = areaEntries.filter(entry => currentInventory[entry.id]?.obtained).length;
    return {
      total,
      obtained,
      percentage: total > 0 ? Math.round((obtained / total) * 100) : 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl text-amber-400 mb-2">{overallProgress.obtained}/{overallProgress.total}</div>
              <div className="text-sm text-slate-400">Loot Alerts concluídos</div>
              <Progress value={overallProgress.percentage} className="h-1.5 mt-3" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-amber-400 text-3xl mb-2">
                <MapPin className="size-6" />
                {uniqueAreas.length}
              </div>
              <div className="text-sm text-slate-400">Áreas com loot registrado</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-amber-400 text-3xl mb-2">
                <Layers className="size-6" />
                {chaptersWithLoot}
              </div>
              <div className="text-sm text-slate-400">Capítulos com alertas de loot</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Tabs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-400">Loot Alerts</CardTitle>
          <CardDescription className="text-slate-400">
            Marque os alertas de loot que você já coletou durante a playthrough
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeArea} onValueChange={setActiveArea}>
            <TabsList className="flex flex-wrap gap-2 bg-slate-900 p-1">
              {areaTabs.map(area => (
                <TabsTrigger
                  key={area}
                  value={area}
                  className="data-[state=active]:bg-amber-600"
                >
                  {area === 'all' ? 'Todas as áreas' : area}
                </TabsTrigger>
              ))}
            </TabsList>

            {areaTabs.map(area => {
              const areaProgress = area === 'all' ? overallProgress : getAreaProgress(area);
              const areaEntries = area === 'all'
                ? lootEntries
                : lootEntries.filter(entry => getEntryAreaName(entry) === area);

              return (
                <TabsContent key={area} value={area} className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-amber-400">
                        {area === 'all' ? 'Todas as áreas' : area}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {areaProgress.obtained} de {areaProgress.total} obtidos ({areaProgress.percentage}%)
                      </p>
                    </div>
                    <Progress value={areaProgress.percentage} className="w-48 h-2" />
                  </div>

                  <ScrollArea className="h-[500px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {areaEntries.map(entry => {
                        const isObtained = currentInventory[entry.id]?.obtained || false;
                        const snippet = entry.content.split('\n').slice(0, 6).join('\n');

                        return (
                          <Card
                            key={entry.id}
                            className={`${
                              isObtained
                                ? 'bg-slate-700 border-amber-600'
                                : 'bg-slate-900 border-slate-700'
                            } transition-all`}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h4 className={`text-lg ${isObtained ? 'text-amber-400' : 'text-slate-300'}`}>
                                      {getEntryDisplayName(entry)}
                                    </h4>
                                    <p className="text-xs text-slate-400">{getEntryAreaName(entry)}</p>
                                  </div>
                                  <Badge variant="outline" className="border-amber-600 text-amber-300">
                                    Loot Alert
                                  </Badge>
                                </div>

                                <div className="text-sm text-slate-300 bg-slate-800/60 rounded p-3 whitespace-pre-wrap">
                                  {snippet}
                                  {entry.content.length > snippet.length && '...'}
                                </div>

                                <Button
                                  onClick={() => toggleInventoryItem(entry.id)}
                                  size="sm"
                                  className={
                                    isObtained
                                      ? 'bg-green-600 hover:bg-green-700'
                                      : 'bg-slate-600 hover:bg-slate-500'
                                  }
                                >
                                  {isObtained ? (
                                    <>
                                      <Check className="size-4 mr-1" />
                                      Coletado
                                    </>
                                  ) : (
                                    <>
                                      <X className="size-4 mr-1" />
                                      Não coletado
                                    </>
                                  )}
                                </Button>

                                {isObtained && currentInventory[entry.id]?.obtainedAt && (
                                  <p className="text-xs text-slate-500">
                                    Coletado em {new Date(currentInventory[entry.id]!.obtainedAt!).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {areaEntries.length === 0 && (
                        <div className="col-span-full text-center text-slate-400 py-8 bg-slate-900/40 rounded-lg">
                          Nenhum loot alert registrado para esta área.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
