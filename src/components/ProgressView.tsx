import { useGameStore } from '../lib/store';
import { achievements } from '../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Star, TrendingUp, Award, Zap } from 'lucide-react';

export function ProgressView() {
  const { userStats, currentPlaythroughId } = useGameStore();
  const state = useGameStore();

  const unlockedAchievements = achievements.filter(a =>
    userStats.achievementsUnlocked.includes(a.id)
  );

  const lockedAchievements = achievements.filter(a =>
    !userStats.achievementsUnlocked.includes(a.id)
  );

  const totalXpEarned = userStats.achievementsUnlocked.reduce((sum, id) => {
    const achievement = achievements.find(a => a.id === id);
    return sum + (achievement?.xpReward || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* User Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-600 to-amber-700 border-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl text-white mb-1">{userStats.level}</div>
                <div className="text-sm text-amber-100">Level</div>
              </div>
              <Star className="size-12 text-amber-200" />
            </div>
            <div className="mt-4">
              <Progress
                value={(userStats.currentXp / userStats.xpToNextLevel) * 100}
                className="h-2 bg-amber-800"
              />
              <div className="text-xs text-amber-100 mt-1">
                {userStats.currentXp} / {userStats.xpToNextLevel} XP
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl text-amber-400 mb-1">{userStats.totalTasksCompleted}</div>
                <div className="text-sm text-slate-400">Tarefas Completas</div>
              </div>
              <TrendingUp className="size-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl text-amber-400 mb-1">{unlockedAchievements.length}</div>
                <div className="text-sm text-slate-400">Achievements</div>
              </div>
              <Trophy className="size-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl text-amber-400 mb-1">{totalXpEarned}</div>
                <div className="text-sm text-slate-400">XP de Achievements</div>
              </div>
              <Zap className="size-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-amber-400">
            <Award className="size-6" />
            Achievements
          </CardTitle>
          <CardDescription className="text-slate-400">
            Desbloqueie achievements completando tarefas e objetivos especiais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked">
            <TabsList className="grid grid-cols-2 bg-slate-900 mb-6">
              <TabsTrigger value="unlocked" className="data-[state=active]:bg-amber-600">
                Desbloqueados ({unlockedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="locked" className="data-[state=active]:bg-slate-700">
                Bloqueados ({lockedAchievements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlocked" className="space-y-4">
              {unlockedAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unlockedAchievements.map(achievement => (
                    <Card key={achievement.id} className="bg-gradient-to-br from-amber-900 to-slate-800 border-amber-600">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-5xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg text-amber-400 mb-1">{achievement.name}</h3>
                            <p className="text-sm text-slate-300 mb-3">{achievement.description}</p>
                            <Badge className="bg-amber-600">
                              <Zap className="size-3 mr-1" />
                              +{achievement.xpReward} XP
                            </Badge>
                          </div>
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600">
                            <Trophy className="size-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Trophy className="size-16 mx-auto mb-4 opacity-30" />
                  <p>Você ainda não desbloqueou nenhum achievement.</p>
                  <p className="text-sm mt-2">Complete tarefas para ganhar XP e achievements!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="locked" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lockedAchievements.map(achievement => (
                  <Card key={achievement.id} className="bg-slate-900 border-slate-700 opacity-60">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg text-slate-400 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-slate-500 mb-3">{achievement.description}</p>
                          <Badge variant="outline" className="border-slate-600 text-slate-500">
                            <Zap className="size-3 mr-1" />
                            +{achievement.xpReward} XP
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700">
                          <Trophy className="size-5 text-slate-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Level System Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-400">Sistema de Níveis</CardTitle>
          <CardDescription className="text-slate-400">
            Ganhe XP completando tarefas e desbloqueando achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-700 rounded-lg">
                <div className="text-2xl text-amber-400 mb-1">+5 XP</div>
                <div className="text-sm text-slate-400">Por tarefa concluída</div>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg">
                <div className="text-2xl text-amber-400 mb-1">+10 XP</div>
                <div className="text-sm text-slate-400">Por item obtido</div>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg">
                <div className="text-2xl text-amber-400 mb-1">Variável</div>
                <div className="text-sm text-slate-400">Por achievement</div>
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h4 className="text-sm text-amber-400 mb-2">Próximo Level</h4>
              <Progress
                value={(userStats.currentXp / userStats.xpToNextLevel) * 100}
                className="h-3"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>Level {userStats.level}</span>
                <span>{userStats.currentXp} / {userStats.xpToNextLevel} XP</span>
                <span>Level {userStats.level + 1}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
