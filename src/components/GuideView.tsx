import { useState } from 'react';
import { useGameStore } from '../lib/store';
import {
  guideSections,
  getCategoryIcon,
  getImagesBySection,
  getGuideEntry,
  getGuideItem,
} from '../lib/data';
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

export function GuideView() {
  const { currentPlaythroughId, progress, filters, setFilters, toggleChecklistItem, updateCurrentSection } = useGameStore();
  const [selectedSectionId, setSelectedSectionId] = useState(guideSections[0]?.id);

  const currentProgress = currentPlaythroughId ? progress[currentPlaythroughId] || {} : {};

  const selectedSection = guideSections.find(s => s.id === selectedSectionId);
  const guideEntry = selectedSection ? getGuideEntry(selectedSection.id) : undefined;

  const handleSectionClick = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    if (currentPlaythroughId) {
      updateCurrentSection(sectionId);
    }
  };

  const getFilteredItems = (section: typeof guideSections[0]) => {
    let items = section.items;

    if (filters.showOnlyIncomplete) {
      items = items.filter(item => !currentProgress[item.id]?.done);
    }

    if (filters.showOnlyMissable) {
      items = items.filter(item => item.isMissable);
    }

    if (filters.categoryFilter.length > 0) {
      items = items.filter(item => filters.categoryFilter.includes(item.category));
    }

    return items;
  };

  const getSectionProgress = (section: typeof guideSections[0]) => {
    const total = section.items.length;
    const completed = section.items.filter(item => currentProgress[item.id]?.done).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

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

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar - Sections List */}
      <div className="col-span-3">
        <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-amber-400">Seções do Guia</CardTitle>
            <CardDescription className="text-slate-400">
              {guideSections.length} seções disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {guideSections.map(section => {
                  const progressPercentage = getSectionProgress(section);
                  const isActive = section.id === selectedSectionId;

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-70">{section.id}</span>
                          {section.type === 'mark' && <span>⚔️</span>}
                          {section.type === 'loot_alert' && <span>💎</span>}
                        </div>
                        <ChevronRight className={`size-4 ${isActive ? '' : 'opacity-50'}`} />
                      </div>
                      <div className="text-sm mb-2">{section.title}</div>
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
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="incomplete"
                  checked={filters.showOnlyIncomplete}
                  onCheckedChange={(checked) => setFilters({ showOnlyIncomplete: checked })}
                />
                <Label htmlFor="incomplete" className="text-slate-300">Mostrar só incompletas</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="missable"
                  checked={filters.showOnlyMissable}
                  onCheckedChange={(checked) => setFilters({ showOnlyMissable: checked })}
                />
                <Label htmlFor="missable" className="text-slate-300">Mostrar só missáveis</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Content */}
        {selectedSection && (
          <>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl text-amber-400">{selectedSection.title}</CardTitle>
                    <Badge variant="outline" className="border-amber-600 text-amber-400">
                      {selectedSection.id}
                    </Badge>
                    {selectedSection.type === 'mark' && (
                      <Badge className="bg-red-600">Hunt</Badge>
                    )}
                  </div>
                  {selectedSection.label?.jp && (
                    <div className="text-sm text-slate-400">{selectedSection.label.jp}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl text-amber-400">{getSectionProgress(selectedSection)}%</div>
                  <div className="text-sm text-slate-400">Completo</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column: Checklist */}
                <div className="space-y-3">
                  <h3 className="text-lg text-amber-400 mb-4">Checklist de Objetivos</h3>
                  {getFilteredItems(selectedSection).map((item, index) => {
                    const isDone = currentProgress[item.id]?.done || false;
                    const relatedItem = item.relatedItemId ? getGuideItem(item.relatedItemId) : undefined;

                    return (
                      <div key={item.id}>
                        {index > 0 && <Separator className="my-3 bg-slate-700" />}
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                          <Checkbox
                            id={item.id}
                            checked={isDone}
                            onCheckedChange={() => toggleChecklistItem(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={item.id}
                              className={`block cursor-pointer ${
                                isDone ? 'line-through opacity-60' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">{getCategoryIcon(item.category)}</span>
                                <div className="flex-1">
                                  <div>{item.label}</div>
                                  {item.reward && (
                                    <div className="text-sm text-amber-400 mt-1">
                                      Recompensa: {item.reward}
                                    </div>
                                  )}
                                  {item.notes && (
                                    <div className="text-xs text-slate-400 mt-1">{item.notes}</div>
                                  )}
                                  {relatedItem && (
                                    <div className="text-xs text-slate-400 mt-2">
                                      Ocorrências: {relatedItem.occurrences?.length || 0}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {item.category}
                              </Badge>
                              {item.isMissable && (
                                <Badge variant="destructive" className="text-xs">
                                  Missável!
                                </Badge>
                              )}
                              {relatedItem && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-500">
                                  {relatedItem.name.en || relatedItem.name.raw}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {getFilteredItems(selectedSection).length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      Nenhum item encontrado com os filtros atuais.
                    </div>
                  )}
                </div>

                {/* Right Column: Guide Text */}
                <div className="bg-slate-900 rounded-lg p-6">
                  <h3 className="text-lg text-amber-400 mb-4">Detalhes da Seção</h3>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {guideEntry?.crystals && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Cristais</h4>
                          <div className="flex gap-2">
                            <Badge className={guideEntry.crystals.teleport ? 'bg-green-600' : 'bg-slate-700 text-slate-400'}>
                              Teleporte {guideEntry.crystals.teleport ? 'Disponível' : 'Indisponível'}
                            </Badge>
                            <Badge className={guideEntry.crystals.save ? 'bg-green-600' : 'bg-slate-700 text-slate-400'}>
                              Save {guideEntry.crystals.save ? 'Disponível' : 'Indisponível'}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {guideEntry?.lootAlerts && guideEntry.lootAlerts.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Loot Alerts</h4>
                          {guideEntry.lootAlerts.map((alert, index) => (
                            <div key={index} className="border border-amber-600/40 bg-amber-500/10 rounded-lg p-4">
                              <div className="text-amber-300 font-semibold">{alert.emphasis}</div>
                              <p className="text-sm text-slate-300 mt-1">{alert.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {guideEntry?.shops && guideEntry.shops.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Lojas</h4>
                          {guideEntry.shops.map((shop, index) => (
                            <div key={index} className="border border-slate-700 rounded-lg">
                              <div className="border-b border-slate-700 px-4 py-2 text-slate-200 font-semibold bg-slate-800/80">
                                {shop.name}
                              </div>
                              <div className="divide-y divide-slate-800">
                                {shop.items.map(item => {
                                  const referencedItem = getGuideItem(item.itemId);
                                  return (
                                    <div key={item.itemId} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <div className="text-slate-100">
                                          {item.nameEn || referencedItem?.name.en || referencedItem?.name.raw || item.itemId}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          {item.nameRaw || referencedItem?.name.raw}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-slate-300">
                                        {item.price && <span>{item.price} gil</span>}
                                        {referencedItem && (
                                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                                            {referencedItem.category}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {guideEntry?.itemsReferenced && guideEntry.itemsReferenced.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Itens em Destaque</h4>
                          <div className="flex flex-wrap gap-2">
                            {guideEntry.itemsReferenced.map(itemId => {
                              const referencedItem = getGuideItem(itemId);
                              return (
                                <Badge
                                  key={itemId}
                                  variant="outline"
                                  className="border-slate-600 text-slate-400"
                                >
                                  {referencedItem?.name.en || referencedItem?.name.raw || itemId}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {guideEntry?.relatedCodes && guideEntry.relatedCodes.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Relacionado</h4>
                          <div className="flex flex-wrap gap-2">
                            {guideEntry.relatedCodes.map(code => {
                              const relatedSection = guideSections.find(section => section.id === code);
                              return (
                                <Badge key={code} variant="outline" className="border-amber-600 text-amber-400">
                                  {relatedSection?.title || code}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {guideEntry?.narrative && guideEntry.narrative.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Narrativa</h4>
                          {guideEntry.narrative.map((block, index) => {
                            if (block.kind === 'paragraph') {
                              return (
                                <p key={index} className="text-slate-300 leading-relaxed">
                                  {block.text}
                                </p>
                              );
                            }
                            if (block.kind === 'list') {
                              const ListTag = block.style === 'number' ? 'ol' : 'ul';
                              return (
                                <ListTag
                                  key={index}
                                  className={`ml-6 text-slate-300 ${block.style === 'number' ? 'list-decimal' : 'list-disc'} space-y-1`}
                                >
                                  {block.items.map((itemText, itemIndex) => (
                                    <li key={itemIndex}>{itemText}</li>
                                  ))}
                                </ListTag>
                              );
                            }
                            if (block.kind === 'note') {
                              return (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border ${
                                    block.severity === 'warning'
                                      ? 'border-red-500/40 bg-red-500/10'
                                      : 'border-slate-600 bg-slate-800'
                                  }`}
                                >
                                  <p className="text-sm text-slate-200">{block.text}</p>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Images className="size-5" />
                Galeria de Imagens
              </CardTitle>
              <CardDescription className="text-slate-400">
                Imagens relevantes para esta seção do guia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGallery images={getImagesBySection(selectedSection.id)} />
            </CardContent>
          </Card>
          </>
        )}
      </div>
    </div>
  );
}