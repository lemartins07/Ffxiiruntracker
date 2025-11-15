'use client';

import { Target, Swords, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { usePlaythroughStore } from '@/lib/stores/playthrough-store';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { guideToc, getGuideSectionFull, getGuideStats } from '@/lib/guide-domain';
import { useHydrated } from '@/lib/hooks/use-hydrated';

export function DashboardClient() {
  const hydrated = useHydrated();
  const playthrough = usePlaythroughStore((state) =>
    state.currentPlaythroughId ? state.playthroughs[state.currentPlaythroughId] : undefined
  );
  const xpSnapshot = usePlaythroughStore((state) =>
    state.currentPlaythroughId ? state.xp[state.currentPlaythroughId] : undefined
  );
  const completion = useChecklistStore((state) =>
    state.currentPlaythroughId ? state.completion[state.currentPlaythroughId] : undefined
  );
  const createPlaythrough = usePlaythroughStore((state) => state.createPlaythrough);
  const allSections = guideToc.map((toc) => getGuideSectionFull(toc.code)!);
  const totalTasks = allSections.reduce((total, section) => total + section.checklist.length, 0);
  const completedTasks = completion ? Object.values(completion).filter((item) => item.completed).length : 0;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const stats = getGuideStats();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 text-text-muted">Carregando progresso...</div>
    );
  }

  if (!playthrough) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <Card className="bg-bg-surface">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Nenhuma playthrough ativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-text-muted">
            <p>Crie uma nova playthrough para começar a rastrear o guia.</p>
            <Button
              onClick={() => createPlaythrough({ title: 'New Game+', version: 'Zodiac Age' })}
              className="w-full"
            >
              Criar Playthrough Rápida
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <div>
        <h1 className="font-heading text-3xl">Bem-vindo de volta, caçador de Ivalice!</h1>
        <p className="mt-2 text-sm text-text-muted">
          Trackeie cada loot, hunt e capítulo com o nosso diário dinâmico.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Progresso Geral" value={`${progressPercent}%`} icon={<Progress className="h-2" value={progressPercent} />} />
        <StatCard title="Hunts" value={`${stats.totalHunts}`} subtitle="Disponíveis" icon={<Swords className="size-5" />} />
        <StatCard title="Loot Alerts" value={`${stats.totalLootAlerts}`} icon={<Target className="size-5" />} />
        <StatCard
          title={`Nível ${xpSnapshot?.level ?? 1}`}
          value={`${xpSnapshot?.currentXp ?? 0}/${xpSnapshot?.xpToNextLevel ?? 100} XP`}
          icon={<Sparkles className="size-5" />}
        />
      </div>

      <Card className="bg-bg-surface">
        <CardHeader>
          <CardTitle className="text-accent">Playthrough atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-semibold">{playthrough.title}</div>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <span>Versão: {playthrough.version}</span>
            <span>Início: {new Date(playthrough.startedAt).toLocaleDateString()}</span>
            {playthrough.currentSectionCode && <span>Seção: {playthrough.currentSectionCode}</span>}
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-text-muted">Progresso da playthrough</div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <Card className="bg-bg-surface text-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm text-text-muted">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
