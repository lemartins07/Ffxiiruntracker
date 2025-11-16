'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function JapaneseToggle() {
  const show = useUIStore((state) => state.showJapaneseNames);
  const toggle = useUIStore((state) => state.toggleJapaneseNames);

  return (
    <div className="flex items-center gap-2">
      <Switch id="toggle-jp" checked={show} onCheckedChange={toggle} />
      <Label htmlFor="toggle-jp" className="text-sm text-text-muted">
        Mostrar nomes JP
      </Label>
    </div>
  );
}
