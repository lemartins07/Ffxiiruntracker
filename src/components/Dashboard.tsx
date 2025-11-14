import { useGameStore } from '../lib/store';
import { achievements } from '../lib/data';
import { useGuideData } from '../lib/useGuideData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Trophy, Target, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { currentPlaythroughId, playthroughs, progress, userStats, setActiveView } = useGameStore();
  const { allEntries, entryMap, getEntryAreaName, getEntryDisplayName, getEntryTypeIcon } = useGuideData();

  const currentPlaythrough = currentPlaythroughId ? playthroughs[currentPlaythroughId] : null;

  if (!currentPlaythrough) {
    return <NoPlaythroughView />;
  }

  const currentProgress = progress[currentPlaythroughId] || {};
  const totalEntries = allEntries.length;
  const completedEntries = allEntries.filter(entry => currentProgress[entry.id]?.done).length;
  const completionPercentage = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;

  const huntEntries = allEntries.filter(entry => entry.type === 'mark');
  const completedHunts = huntEntries.filter(entry => currentProgress[entry.id]?.done).length;

  const sectionEntries = allEntries.filter(entry => entry.type === 'section');
  const completedSections = sectionEntries.filter(entry => currentProgress[entry.id]?.done).length;

  const lootEntries = allEntries.filter(entry => entry.type === 'loot-alert');
  const completedLoot = lootEntries.filter(entry => currentProgress[entry.id]?.done).length;

  const currentEntry = currentPlaythrough.currentEntryId
    ? entryMap.get(currentPlaythrough.currentEntryId) || allEntries[0]
    : allEntries[0];

  const nextTasks = allEntries
    .filter(entry => !currentProgress[entry.id]?.done)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Playthrough Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-amber-400">{currentPlaythrough.title}</CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                Versão: {currentPlaythrough.version} • Criado em {new Date(currentPlaythrough.createdAt).toLocaleDateString('pt-BR')}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentPlaythrough.goals.map(goal => (
                  <Badge key={goal} variant="outline" className="border-amber-600 text-amber-400">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl text-amber-400">{completionPercentage}%</div>
              <div className="text-sm text-slate-400">Completo</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <div className="text-sm text-slate-400 mt-2">
            {completedEntries} de {totalEntries} entradas concluídas
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-amber-400">{completedHunts}/{huntEntries.length}</div>
                <div className="text-sm text-slate-400">Hunts</div>
              </div>
              <Target className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-amber-400">{completedSections}/{sectionEntries.length}</div>
                <div className="text-sm text-slate-400">Seções</div>
              </div>
              <Sparkles className="size-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-amber-400">{completedLoot}/{lootEntries.length}</div>
                <div className="text-sm text-slate-400">Loot Alerts</div>
              </div>
              <Trophy className="size-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-amber-400">{userStats.achievementsUnlocked.length}</div>
                <div className="text-sm text-slate-400">Achievements</div>
              </div>
              <Trophy className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Entry */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <MapPin className="size-5" />
              Entrada Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentEntry ? (
              <div className="space-y-4">
                <div>
                  <div className="text-lg flex items-center gap-2">
                    <span>{getEntryTypeIcon(currentEntry.type)}</span>
                    <span>{getEntryDisplayName(currentEntry)}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {getEntryAreaName(currentEntry)}
                  </div>
                </div>
                <Button
                  onClick={() => setActiveView('guide')}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  Ir para o Guia
                </Button>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-4">
                Nenhuma entrada selecionada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Tasks */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="size-5" />
              Próximas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {nextTasks.length > 0 ? (
                nextTasks.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 p-2 rounded bg-slate-700/50">
                    <div className="text-lg mt-0.5">{getEntryTypeIcon(entry.type)}</div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-200">{getEntryDisplayName(entry)}</div>
                      <div className="text-xs text-slate-400">{getEntryAreaName(entry)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-center py-4">
                  Todas as tarefas concluídas! 🎉
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NoPlaythroughView() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="bg-slate-800 border-slate-700 max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-400 text-center">Bem-vindo ao FFXII Run Tracker!</CardTitle>
          <CardDescription className="text-center text-slate-400 mt-2">
            Comece criando sua primeira playthrough para rastrear seu progresso em Ivalice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePlaythroughDialog />
        </CardContent>
      </Card>
    </div>
  );
}

function CreatePlaythroughDialog() {
  const createPlaythrough = useGameStore(state => state.createPlaythrough);
  const { allEntries } = useGuideData();
  const [title, setTitle] = React.useState('');
  const [version, setVersion] = React.useState<'IZJS' | 'Zodiac Age'>('Zodiac Age');
  const [goals, setGoals] = React.useState<string[]>(['100%']);

  const handleCreate = () => {
    if (!title.trim()) return;

    const defaultEntryId = allEntries[0]?.id || '';

    createPlaythrough({
      title: title.trim(),
      version,
      goals,
      currentEntryId: defaultEntryId,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-slate-400 mb-2 block">Nome da Playthrough</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Primeira Run - 100%"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-2 block">Versão do Jogo</label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value as any)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
        >
          <option value="Zodiac Age">The Zodiac Age</option>
          <option value="IZJS">International Zodiac Job System</option>
        </select>
      </div>

      <Button onClick={handleCreate} className="w-full bg-amber-600 hover:bg-amber-700">
        Criar Playthrough
      </Button>
    </div>
  );
}

import React from 'react';
