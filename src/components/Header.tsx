import React from 'react';
import { Menu, Search, Bell, Smartphone, Sparkles, X } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenQuickAdd: (type?: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox') => void;
  isMobileMockup: boolean;
  onToggleMobileMockup: () => void;
  inboxCount: number;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenQuickAdd,
  isMobileMockup,
  onToggleMobileMockup,
  inboxCount,
  onOpenMobileMenu
}) => {
  const getScreenTitle = (screen: ScreenType): string => {
    switch (screen) {
      case 'dashboard': return 'Dashboard';
      case 'my-day': return 'Mi Día';
      case 'tasks': return 'Tareas';
      case 'calendar': return 'Calendario';
      case 'projects': return 'Proyectos';
      case 'money': return 'Money';
      case 'notes': return 'Notas & Documentos';
      case 'inbox': return 'Inbox / Descarga Mental';
      case 'ai-assistant': return 'Asistente Personal IA';
      case 'settings': return 'Configuración';
      default: return 'LAHIAM\'S';
    }
  };

  const navItems = [
    { id: 'dashboard' as ScreenType, label: 'Dashboard' },
    { id: 'my-day' as ScreenType, label: 'Mi Día' },
    { id: 'tasks' as ScreenType, label: 'Tareas' },
    { id: 'projects' as ScreenType, label: 'Proyectos' },
    { id: 'money' as ScreenType, label: 'Money' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/10 px-5 sm:px-8 lg:px-10 py-4">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
            {getScreenTitle(currentScreen)}
          </h1>
        </div>

        {/* Desktop quick nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {navItems.map((item) => {
            const active = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  active
                    ? 'bg-white/10 text-white shadow-[0_0_18px_rgba(99,102,241,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden sm:block w-52">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-4 h-4" />
          {inboxCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 ring-2 ring-[#0a0a0f]" />
          )}
        </button>

        {/* Quick add (desktop) */}
        <button
          onClick={() => onOpenQuickAdd('task')}
          className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white text-xs font-bold px-4 py-2.5 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Quick Add</span>
        </button>

        {/* Mobile mockup toggle */}
        <button
          onClick={onToggleMobileMockup}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          title="Vista móvil"
        >
          {isMobileMockup ? <X className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
