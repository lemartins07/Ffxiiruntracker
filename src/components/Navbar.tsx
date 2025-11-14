import { useGameStore } from '../lib/store';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const { activeView, setActiveView, sidebarOpen, setSidebarOpen, userStats } = useGameStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'guide', label: 'Guia' },
    { id: 'inventory', label: 'Inventário' },
    { id: 'progress', label: 'Progresso' },
  ] as const;

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-amber-400"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="text-2xl">⚔️</div>
              <h1 className="text-xl text-amber-400">FFXII Run Tracker</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'default' : 'ghost'}
                onClick={() => setActiveView(item.id as any)}
                className={activeView === item.id ? 'bg-amber-600 hover:bg-amber-700' : 'text-slate-300 hover:text-amber-400'}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Level {userStats.level}</div>
              <div className="text-sm text-amber-400">{userStats.currentXp} / {userStats.xpToNextLevel} XP</div>
            </div>
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all"
                style={{ width: `${(userStats.currentXp / userStats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
