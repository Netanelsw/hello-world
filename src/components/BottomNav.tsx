'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, PlusCircle, Search, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/add', label: 'Add', icon: PlusCircle },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          const isAdd = href === '/add';

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
                isAdd && 'relative'
              )}
            >
              {isAdd ? (
                <div className="bg-primary text-white rounded-full p-2 -mt-4 shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className={cn('text-[10px] font-medium', isAdd && 'mt-0.5')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
