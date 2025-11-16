'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui-store';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const themeMode = useUIStore((state) => state.themeMode);
  const setThemeMode = useUIStore((state) => state.setThemeMode);

  useEffect(() => {
    if (!resolvedTheme) return;
    setThemeMode(resolvedTheme as 'dark' | 'light');
  }, [resolvedTheme, setThemeMode]);

  const handleToggle = () => {
    const target = themeMode === 'dark' ? 'light' : 'dark';
    setTheme(target);
    setThemeMode(target);
  };

  return (
    <Button variant="ghost" size="icon" aria-label="Alternar tema" onClick={handleToggle} className="text-text-muted">
      {themeMode === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
