import React from 'react';
import {
  Calendar,
  CheckSquare,
  FolderKanban,
  Wallet,
  ArrowRight,
  Plus,
  Sparkles,
  Flame,
  ListChecks,
  Sun,
  TrendingUp
} from 'lucide-react';
import { Task, Project } from '../../types';
import { ScreenType } from '../../types';

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenQuickAdd: (type?: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  onToggleTask,
  onNavigate,
  onOpenQuickAdd
}) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const highPriorityPending = pendingTasks.filter(t => t.priority === 'Alta');
  const todayEvents = 3;

  const priorityPill = (p: string) => {
    const base = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full border';
    if (p === 'Alta') return `${base} bg-rose-500/10 text-rose-300 border-rose-500/20`;
    if (p === 'Media') return `${base} bg-amber-500/10 text-amber-300 border-amber-500/20`;
    return `${base} bg-emerald-500/10 text-emerald-300 border-emerald-500/20`;
  };

  const stats = [
    { label: 'Tareas', value: tasks.length, sub: `${completedTasks} hechas`, icon: CheckSquare, color: 'from-indigo-500 to-violet-500', onClick: () => onNavigate('tasks') },
    { label: 'Proyectos', value: projects.length, sub: 'activos', icon: FolderKanban, color: 'from-cyan-400 to-blue-500', onClick: () => onNavigate('projects') },
    { label: 'Eventos Hoy', value: todayEvents, sub: 'agendados', icon: Calendar, color: 'from-violet-500 to-fuchsia-500', onClick: () => onNavigate('calendar') },
    { label: 'Prioridad Alta', value: highPriorityPending.length, sub: 'urgentes', icon: Flame, color: 'from-rose-500 to-orange-400', onClick: () => onNavigate('tasks') },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> Buenos días, Freddy
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Tu centro de mando
          </h1>
        </div>
        <button
          onClick={() => onOpenQuickAdd('task')}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white text-xs font-bold px-5 py-2.5 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={s.onClick}
              className="group relative text-left p-5 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-15 blur-xl group-hover:opacity-30 transition-all`} />
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
              <p className="text-xs font-bold text-slate-300">{s.label}</p>
              <p className="text-[10px] text-slate-500">{s.sub}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending tasks */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] accent-top">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Tareas Pendientes</h2>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
                onClick={() => onToggleTask(task.id)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  task.completed ? 'bg-gradient-to-br from-indigo-500 to-cyan-400 border-transparent' : 'border-white/30 group-hover:border-indigo-400'
                }`}>
                  {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{task.project} · {task.time || 'Sin hora'}</p>
                </div>
                <span className={priorityPill(task.priority)}>{task.priority}</span>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-center py-10">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold text-white">¡Todo al día!</p>
                <p className="text-[11px] text-slate-500">No tienes tareas pendientes.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI + mini panels */}
        <div className="space-y-6">
          <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-cyan-400/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-500/30 blur-2xl" />
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-black text-white">Asistente LAHIAM'S</h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Te ayudo a priorizar tu día y optimizar bloques de enfoque.
              </p>
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Preguntar a la IA
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Progreso</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-black text-white tracking-tight">{tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0}%</span>
              <span className="text-[11px] text-slate-400">completado</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${tasks.length ? (completedTasks / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
