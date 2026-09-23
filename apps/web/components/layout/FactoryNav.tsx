'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTwinStore } from '@/lib/store/twinStore';
import {
  LayoutDashboard,
  Cpu,
  Boxes,
  ShieldCheck,
  Package,
  Zap,
  Truck,
  SlidersHorizontal,
  Leaf,
  Bell,
  Network,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Intelligence Hub', href: null, icon: Network, isStudio: true },
  { label: 'Machines', href: null, icon: Cpu },
  { label: 'Production', href: null, icon: Boxes },
  { label: 'Quality', href: null, icon: ShieldCheck },
  { label: 'Inventory', href: null, icon: Package },
  { label: 'Energy', href: null, icon: Zap },
  { label: 'Supply', href: null, icon: Truck },
  { label: 'Scenarios', href: '/scenarios', icon: SlidersHorizontal },
  { label: 'Sustainability', href: '/sustainability', icon: Leaf },
  { label: 'Alerts', href: null, icon: Bell, badge: '2' },
];

export const FactoryNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const activeNavTab = useTwinStore((s) => s.activeNavTab);
  const setActiveNavTab = useTwinStore((s) => s.setActiveNavTab);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);

  const handleNavClick = (item: (typeof NAV_ITEMS)[0]) => {
    if ((item as any).isStudio) {
      if (pathname !== '/') router.push('/');
      setActiveNavTab(item.label);
      useTwinStore.getState().setPrimaryView('network_studio');
      return;
    }
    if (item.href) {
      if (item.href === '/') {
        setActiveNavTab('Overview');
        setFocusedTarget(null);
        useTwinStore.getState().setPrimaryView('3d_twin');
      }
      router.push(item.href);
    } else {
      // If currently on another route (like /scenarios or /sustainability), go to / first
      if (pathname !== '/') {
        router.push('/');
      }
      setActiveNavTab(item.label);
    }
  };

  return (
    <aside className="flex h-full w-52 flex-col rounded-xl border border-twin-panelBorder bg-twin-panel/95 p-3 shadow-2xl backdrop-blur-xl shrink-0">
      <div className="mb-4 flex items-center space-x-2 px-2 py-1">
        <div className="h-2.5 w-2.5 rounded-full bg-twin-accent shadow-[0_0_10px_#00d2ff]" />
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-200">
          Factory Navigation
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isRouteActive = item.href ? pathname === item.href : false;
          const isTabActive = activeNavTab === item.label && pathname === '/';
          const isActive = isRouteActive || isTabActive;

          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-sans transition-all duration-200 ${
                isActive
                  ? 'border border-twin-accent/60 bg-cyan-950/60 text-cyan-200 font-semibold shadow-[0_0_12px_rgba(0,210,255,0.2)]'
                  : 'text-slate-300 font-normal hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-twin-accent' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-twin-red text-[10px] font-bold text-white shadow-[0_0_8px_#ff2a5f]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-twin-panelBorder/70 pt-3 px-2">
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400">OPERATING TWIN</div>
        <div className="text-xs font-mono font-bold text-twin-green tracking-wide">ONLINE • 99.8%</div>
      </div>
    </aside>
  );
};
