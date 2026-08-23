import React from 'react';
import { LayoutDashboard, Sun, CheckSquare, Wallet, Sparkles, Plus } from 'lucide-react';
import { ScreenType } from '../types';

interface MobileNavProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenQuickAdd: (type?: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentScreen, onSelectScreen, onOpenQuickAdd }) => {
  const items = [
    { id: 'dashboard' as ScreenType, label: 'Inicio', icon: LayoutDashboard },
    { id: 'my-day' as ScreenType, label: 'Mi Día', icon: Sun },
    { id: 'tasks' as ScreenType, label: 'Tareas', icon: CheckSquare },
    { id: 'money' as ScreenType, label: 'Money', icon: Wallet },
    { id: 'ai-assistant' as ScreenType, label: 'IA', icon: Sparkles },
  ];

  return (
    <>
      {/* Floating Quick Add FAB */}
      <button
        onClick={() => onOpenQuickAdd('task')}
        className="md:hidden fixed z-40 right-5 bottom-24 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.6)] hover:scale-110 active:scale-95 transition-all"
        aria-label="Quick Add"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Glass bottom nav pill bar */}
      <nav className="md:hidden fixed z-40 left-1/2 -translate-x-1/2 bottom-4 px-2 py-2 w-[92%] max-w-md flex items-center justify-between gap-1 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
