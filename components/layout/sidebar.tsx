'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Mic,
  History,
  FileText,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { setUserAuthenticated } from '@/lib/store/user-store';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Start Interview', href: '/interview/setup', icon: Mic, highlight: true },
    { label: 'Interview History', href: '/history', icon: History },
    { label: 'Resume Hub', href: '/resume', icon: FileText },
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setUserAuthenticated(false);
    router.push('/login');
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-white/5 bg-[#070711] min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary/15 text-white border border-primary/30 shadow-lg shadow-primary/10'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5',
                  item.highlight && !isActive && 'text-primary font-semibold'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span>{item.label}</span>
                </div>
                {item.highlight ? (
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  isActive && <ChevronRight className="h-4 w-4 text-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Pro Coaching Box */}
        <div className="rounded-2xl bg-gradient-to-b from-primary/15 to-transparent border border-primary/20 p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Coach Active
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Real-time adaptive questions configured for your target role.
          </p>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
