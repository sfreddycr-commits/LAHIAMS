import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckSquare, 
  Sparkles,
  Bell
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import { INITIAL_CALENDAR_EVENTS } from '../../data';

interface CalendarViewProps {
  onOpenQuickAdd: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenQuickAdd }) => {
  const [currentMonth, setCurrentMonth] = useState('Octubre 2023');
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'Mes' | 'Semana' | 'Día'>('Mes');

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Calendar dates generation for October 2023 (starts on Sunday, offset for Monday)
  // Let's create a 35-day grid
  const days = [
    { day: 25, inMonth: false },
    { day: 26, inMonth: false },
    { day: 27, inMonth: false },
    { day: 28, inMonth: false },
    { day: 29, inMonth: false },
    { day: 30, inMonth: false },
    { day: 1, inMonth: true },
    { day: 2, inMonth: true },
    { day: 3, inMonth: true },
    { day: 4, inMonth: true },
    { day: 5, inMonth: true },
    { day: 6, inMonth: true },
    { day: 7, inMonth: true },
    { day: 8, inMonth: true },
    { day: 9, inMonth: true },
    { day: 10, inMonth: true, isToday: true },
    { day: 11, inMonth: true },
    { day: 12, inMonth: true },
    { day: 13, inMonth: true },
    { day: 14, inMonth: true },
    { day: 15, inMonth: true },
    { day: 16, inMonth: true },
    { day: 17, inMonth: true },
    { day: 18, inMonth: true },
    { day: 19, inMonth: true },
    { day: 20, inMonth: true },
    { day: 21, inMonth: true },
    { day: 22, inMonth: true },
    { day: 23, inMonth: true },
    { day: 24, inMonth: true },
    { day: 25, inMonth: true },
    { day: 26, inMonth: true },
    { day: 27, inMonth: true },
    { day: 28, inMonth: true },
    { day: 29, inMonth: true },
  ];

  const eventsForSelectedDay = INITIAL_CALENDAR_EVENTS.filter(e => e.day === selectedDay);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 sm:p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {}}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {}}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white">{currentMonth}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            {(['Mes', 'Semana', 'Día'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>

      {/* Grid & Right Agenda Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar 7x5 Grid (2 cols on lg) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl p-5 sm:p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-3 pb-3 border-b border-slate-800">
            {daysOfWeek.map((d) => (
              <span key={d} className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {d}
              </span>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((item, idx) => {
              const hasEvents = INITIAL_CALENDAR_EVENTS.filter(e => e.day === item.day && item.inMonth);
              const isSelected = selectedDay === item.day && item.inMonth;
              return (
                <div
                  key={idx}
                  onClick={() => item.inMonth && setSelectedDay(item.day)}
                  className={`min-h-[72px] sm:min-h-[88px] p-2 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                    !item.inMonth
                      ? 'bg-transparent border-transparent opacity-20 cursor-default'
                      : isSelected
                      ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      item.isToday
                        ? 'bg-indigo-500 text-white font-black shadow-sm shadow-indigo-500/50'
                        : item.inMonth
                        ? 'text-slate-200'
                        : 'text-slate-600'
                    }`}>
                      {item.day}
                    </span>
                    {hasEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </div>

                  {/* Event pills inside grid */}
                  <div className="space-y-1 mt-1">
                    {hasEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] font-bold truncate px-1.5 py-0.5 rounded leading-tight ${
                          ev.type === 'event'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : ev.type === 'payment'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : ev.type === 'milestone'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {hasEvents.length > 2 && (
                      <span className="text-[8px] text-slate-500 font-bold pl-0.5">
                        +{hasEvents.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Agenda Sidebar */}
        <div className="space-y-5">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                  Agenda del Día
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Martes, {selectedDay} de Octubre
                </h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
                {eventsForSelectedDay.length} items
              </span>
            </div>

            {/* Event List */}
            <div className="mt-4 space-y-3">
              {eventsForSelectedDay.length > 0 ? (
                eventsForSelectedDay.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ev.type === 'event'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : ev.type === 'payment'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {ev.type}
                      </span>
                      {ev.time && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {ev.time}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2">{ev.title}</h4>
                    {ev.attendees && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1.5">
                        <Users className="w-3 h-3 text-indigo-400" />
                        {ev.attendees} participantes
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No hay eventos registrados para este día.
                </div>
              )}
            </div>

            {/* Recordatorios */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Recordatorio</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 font-medium">
                🌱 Regar plantas oficina & sincronizar backups.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
