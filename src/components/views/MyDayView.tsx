import React, { useState } from 'react';
import { Sun, Plus, Flame, Clock, CheckCircle2, Sparkles, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { DayEvent, Task } from '../../types';

interface MyDayViewProps {
  events: DayEvent[];
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenQuickAdd: (type?: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox') => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({ events, tasks, onToggleTask, onOpenQuickAdd }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [periodFilter, setPeriodFilter] = useState<'all' | 'Mañana' | 'Tarde'>('all');

  const daysStrip = [
    { day: 'Lun', date: 19, isToday: true },
    { day: 'Mar', date: 20, isToday: false },
    { day: 'Mié', date: 21, isToday: false },
    { day: 'Jue', date: 22, isToday: false },
    { day: 'Vie', date: 23, isToday: false },
    { day: 'Sáb', date: 24, isToday: false },
    { day: 'Dom', date: 25, isToday: false },
  ];

  const pendingTasks = tasks.filter(t => !t.completed);

  const priorityPill = (p: string) => {
    const base = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full border';
    if (p === 'Alta') return `${base} bg-rose-500/10 text-rose-300 border-rose-500/20`;
    if (p === 'Media') return `${base} bg-amber-500/10 text-amber-300 border-amber-500/20`;
    return `${base} bg-emerald-500/10 text-emerald-300 border-emerald-500/20`;
  };

  const eventPeriod = (e: DayEvent) => e.period || 'Mañana';

  const morningEvents = events.filter(e => eventPeriod(e) === 'Mañana' && (periodFilter === 'all' || periodFilter === 'Mañana'));
  const afternoonEvents = events.filter(e => eventPeriod(e) === 'Tarde' && (periodFilter === 'all' || periodFilter === 'Tarde'));

  const morningTasks = pendingTasks.filter(t => (periodFilter === 'all' || periodFilter === 'Mañana'));
  const afternoonTasks = pendingTasks.filter(t => (periodFilter === 'all' || periodFilter === 'Tarde'));

  const periodBtn = (key: 'all' | 'Mañana' | 'Tarde', label: string) => (
    <button
      onClick={() => setPeriodFilter(key)}
      className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
        periodFilter === key
          ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(99,102,241,0.5)]'
          : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> Plan para hoy
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">Mi Día</h1>
        </div>
        <button
          onClick={() => onOpenQuickAdd('event')}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white text-xs font-bold px-5 py-2.5 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Days strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {daysStrip.map((d, idx) => {
          const active = idx === selectedDay;
          return (
            <button
              key={d.date}
              onClick={() => setSelectedDay(idx)}
              className={`flex flex-col items-center gap-0.5 shrink-0 w-14 py-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                active
                  ? 'bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 border-indigo-500/40 text-white' + ' text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-[11px] font-bold uppercase">{d.day}</span>
              <span className={`text-lg font-black ${active ? 'text-white' : 'text-slate-200'}`}>{d.date}</span>
              {d.isToday && <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />}
            </button>
          );
        })}
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-2">
        {periodBtn('all', 'Todo el día')}
        {periodBtn('Mañana', 'Mañana')}
        {periodBtn('Tarde', 'Tarde')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Morning */}
        <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] accent-top">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Mañana</h2>
          </div>

          <div className="space-y-2.5">
            {morningEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all">
                <span className="text-xs font-bold text-indigo-300 w-14 shrink-0">{ev.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{ev.title}</p>
                  <p className="text-[11px] text-slate-500">{ev.tag}</p>
                </div>
                {ev.priority === 'Alta' && <Flame className="w-4 h-4 text-rose-400 shrink-0" />}
              </div>
            ))}
            {morningTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id)}
                className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 border-white/10 hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.completed ? 'bg-gradient-to-br from-indigo-500 to-cyan-400 border-transparent' : 'border-white/30 group-hover:border-indigo-400'}`}>
                  {t.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`flex-1 text-sm font-bold truncate ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>{t.title}</span>
                {priorityPill(t.priority)}
              </div>
            ))}
            {morningEvents.length === 0 && morningTasks.length === 0 && (
              <p className="text-center text-[11px] text-slate-500 py-6">Sin actividades por la mañana.</p>
            )}
          </div>
        </div>

        {/* Afternoon */}
        <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] accent-top">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Tarde</h2>
          </div>

          <div className="space-y-2.5">
            {afternoonEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all">
                <span className="text-xs font-bold text-indigo-300 w-14 shrink-0">{ev.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{ev.title}</p>
                  <p className="text-[11px] text-slate-500">{ev.tag}</p>
                </div>
                {ev.priority === 'Alta' && <Flame className="w-4 h-4 text-rose-400 shrink-0" />}
              </div>
            ))}
            {afternoonTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id)}
                className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.completed ? 'bg-gradient-to-br from-indigo-500 to-cyan-400 border-transparent' : 'border-white/30 group-hover:border-indigo-400'}`}>
                  {t.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`flex-1 text-sm font-bold truncate ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>{t.title}</span>
                {priorityPill(t.priority)}
              </div>
            ))}
            {afternoonEvents.length === 0 && afternoonTasks.length === 0 && (
              <p className="text-center text-[11px] text-slate-500 py-6">Sin actividades por la tarde.</p>
            )}
          </div>
        </div>
      </div>

      {/* AI suggestion footer */}
      <button
        onClick={() => onOpenQuickAdd('event')}
        className="w-full flex items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-cyan-400/15 border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_18px_rgba(99,102,241,0.5)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">¿Bloque de deep work?</p>
            <p className="text-[11px] text-slate-400">La IA sugiere 90 min de enfoque a las 11:00.</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
