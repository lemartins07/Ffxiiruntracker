import { useState } from 'react';
import { useGameStore } from '../lib/store';
import { items, getItemTypeIcon } from '../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Check, X } from 'lucide-react';

export function InventoryView() {
  const { currentPlaythroughId, inventory, toggleInventoryItem } = useGameStore();
  const [activeTab, setActiveTab] = useState('esper');

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

  const itemTypes = [
    { value: 'esper', label: 'Espers', icon: '👹' },
    { value: 'weapon', label: 'Armas', icon: '⚔️' },
    { value: 'armor', label: 'Armaduras', icon: '🛡️' },
    { value: 'accessory', label: 'Acessórios', icon: '💍' },
    { value: 'magic', label: 'Magias', icon: '✨' },
    { value: 'technick', label: 'Técnicas', icon: '🎯' },
    { value: 'key_item', label: 'Itens-Chave', icon: '🔑' },
  ];

  const getItemsByType = (type: string) => {
    return items.filter(item => item.type === type);
  };

  const getTypeProgress = (type: string) => {
    const typeItems = getItemsByType(type);
    const total = typeItems.length;
    const obtained = typeItems.filter(item => currentInventory[item.id]?.obtained).length;
    return { obtained, total, percentage: total > 0 ? Math.round((obtained / total) * 100) : 0 };
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {itemTypes.map(type => {
          const progress = getTypeProgress(type.value);
          return (
            <Card key={type.value} className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm text-slate-400 mb-2">{type.label}</div>
                  <div className="text-lg text-amber-400">
                    {progress.obtained}/{progress.total}
                  </div>
                  <Progress value={progress.percentage} className="h-1.5 mt-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inventory Tabs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-400">Inventário</CardTitle>
          <CardDescription className="text-slate-400">
            Marque os itens que você já obteve na sua playthrough
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 bg-slate-900">
              {itemTypes.map(type => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className="data-[state=active]:bg-amber-600"
                >
                  <span className="mr-1">{type.icon}</span>
                  <span className="hidden lg:inline">{type.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {itemTypes.map(type => {
              const typeItems = getItemsByType(type.value);
              const progress = getTypeProgress(type.value);

              return (
                <TabsContent key={type.value} value={type.value} className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-amber-400">{type.label}</h3>
                      <p className="text-sm text-slate-400">
                        {progress.obtained} de {progress.total} obtidos ({progress.percentage}%)
                      </p>
                    </div>
                    <Progress value={progress.percentage} className="w-48 h-2" />
                  </div>

                  <ScrollArea className="h-[500px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {typeItems.map(item => {
                        const isObtained = currentInventory[item.id]?.obtained || false;

                        return (
                          <Card
                            key={item.id}
                            className={`${
                              isObtained
                                ? 'bg-slate-700 border-amber-600'
                                : 'bg-slate-900 border-slate-700'
                            } transition-all`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="text-3xl mt-1">{getItemTypeIcon(item.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`mb-2 ${isObtained ? 'text-amber-400' : 'text-slate-300'}`}>
                                    {item.name}
                                  </h4>
                                  <p className="text-sm text-slate-400 mb-3">{item.sourceInfo}</p>
                                  {item.isMissable && (
                                    <Badge variant="destructive" className="mb-3">
                                      Missável!
                                    </Badge>
                                  )}
                                  <Button
                                    onClick={() => toggleInventoryItem(item.id)}
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
                                        Obtido
                                      </>
                                    ) : (
                                      <>
                                        <X className="size-4 mr-1" />
                                        Não Obtido
                                      </>
                                    )}
                                  </Button>
                                  {isObtained && currentInventory[item.id]?.obtainedAt && (
                                    <p className="text-xs text-slate-500 mt-2">
                                      Obtido em {new Date(currentInventory[item.id].obtainedAt!).toLocaleDateString('pt-BR')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
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
