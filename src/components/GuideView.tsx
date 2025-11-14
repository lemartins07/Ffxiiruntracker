import { useState } from 'react';
import { useGameStore } from '../lib/store';
import { guideSections, getCategoryIcon, getImagesBySection } from '../lib/data';
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
                  <h3 className="text-lg text-amber-400 mb-4">Texto do Guia</h3>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="prose prose-invert prose-slate max-w-none">
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                        {selectedSection.description}
                      </p>
                      
                      {/* Placeholder for guide content */}
                      <div className="mt-6 p-4 bg-slate-800 rounded border border-slate-700">
                        <p className="text-sm text-slate-400 italic">
                          💡 Aqui seria exibido o texto completo do guia do GameFAQs para esta seção.
                          Você pode adicionar o conteúdo original do guia no campo apropriado dos dados.
                        </p>
                      </div>
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