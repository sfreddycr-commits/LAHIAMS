import React from 'react';
import {
  LayoutDashboard,
  Sun,
  CheckSquare,
  Calendar as CalendarIcon,
  FolderKanban,
  Wallet,
  FileText,
  Inbox,
  Sparkles,
  Settings,
  Plus,
  Compass
} from 'lucide-react';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenQuickAdd: (type?: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox') => void;
  inboxCount: number;
  pendingTasksCount: number;
  isDrawer?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenQuickAdd,
  inboxCount,
  pendingTasksCount,
  isDrawer = false
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null as number | null },
    { id: 'my-day', label: 'Mi Día', icon: Sun, badge: null },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon, badge: null },
    { id: 'projects', label: 'Proyectos', icon: FolderKanban, badge: null },
    { id: 'money', label: 'Money', icon: Wallet, badge: null },
  ];

  const orgNav = [
    { id: 'notes', label: 'Notas', icon: FileText, badge: null as number | null },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: inboxCount },
  ];

  const aiNav = [
    { id: 'ai-assistant', label: 'Asistente IA', icon: Sparkles, badge: null as number | null },
    { id: 'settings', label: 'Ajustes', icon: Settings, badge: null },
  ];

  const renderNavItem = (item: { id: ScreenType; label: string; icon: React.ElementType; badge: number | null }) => {
    const Icon = item.icon;
    const isActive = currentScreen === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelectScreen(item.id)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-300'
          }`}>
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <aside
      className={`${
        isDrawer ? 'w-full bg-transparent border-0' : 'w-64 bg-white/[0.03] backdrop-blur-2xl border-r border-white/10 shrink-0 sticky top-0'
      } flex flex-col h-screen select-none ${isDrawer ? '' : 'hidden md:flex'} text-slate-300`}
    >
      {/* Brand */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <span className="text-white font-black text-lg tracking-tighter">L</span>
        </div>
        <div>
          <h1 className="text-lg font-black text-white tracking-tight leading-none">LAHIAM'S</h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">Santuario Personal</p>
        </div>
      </div>

      {/* Quick Add CTA */}
      <div className="px-4 mb-5">
        <button
          onClick={() => onOpenQuickAdd('task')}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white text-sm font-bold py-3 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-none">
        <div className="space-y-1">{mainNav.map(renderNavItem)}</div>

        <div>
          <p className="px-3.5 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Organización</p>
          <div className="space-y-1">{orgNav.map(renderNavItem)}</div>
        </div>

        <div>
          <p className="px-3.5 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Inteligencia</p>
          <div className="space-y-1">{aiNav.map(renderNavItem)}</div>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 m-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md">
          F
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">Freddy Mercer</p>
          <p className="text-[10px] text-slate-500 truncate">Plan Premium</p>
        </div>
        <Compass className="w-4 h-4 text-slate-500 ml-auto" />
      </div>
    </aside>
  );
};
