'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JapaneseToggle } from './japanese-toggle';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/components/ui/utils';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/guide', label: 'Guia' },
  { href: '/inventory', label: 'Inventário' },
  { href: '/hunts', label: 'Hunts' },
  { href: '/about', label: 'Sobre' },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b border-border-subtle bg-bg-surface/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-xl text-accent">
            FFXII Tracker
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-3 py-1 text-text-muted transition-colors',
                  pathname === link.href && 'bg-accent/10 text-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <JapaneseToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
