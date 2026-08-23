import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Task, Priority } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenQuickAdd: () => void;
}

type TabFilter = 'Hoy' | 'Mañana' | 'Esta semana' | 'Próximamente' | 'Atrasadas' | 'Todas';

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenQuickAdd,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('Hoy');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const tabs: TabFilter[] = ['Hoy', 'Mañana', 'Esta semana', 'Próximamente', 'Atrasadas', 'Todas'];

  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    // Tab filters
    if (activeTab === 'Hoy') {
      return true; // demo view
    }
    if (activeTab === 'Atrasadas') {
      return !task.completed && task.priority === 'Alta';
    }
    return true;
  });

  const pendingCount = filteredTasks.filter(t => !t.completed).length;
  const completedCount = filteredTasks.filter(t => t.completed).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Gestión de Tareas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            <span className="font-bold text-indigo-400">{pendingCount}</span> tareas activas • <span className="font-bold text-emerald-400">{completedCount}</span> completadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de tarea..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-500"
          >
            <option value="all">Todas las prioridades</option>
            <option value="Alta">Prioridad Alta</option>
            <option value="Media">Prioridad Media</option>
            <option value="Baja">Prioridad Baja</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              task.completed
                ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                : 'bg-slate-900 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className="text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                )}
              </button>

              <div className="min-w-0">
                <p className={`text-xs sm:text-sm font-bold truncate ${
                  task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                }`}>
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                  {task.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {task.time}
                    </span>
                  )}
                  {task.project && (
                    <span className="font-semibold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400">
                      {task.project}
                    </span>
                  )}
                  {task.category && (
                    <span className="text-[10px] text-slate-500">
                      #{task.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                task.priority === 'Alta'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : task.priority === 'Media'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {task.priority}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
                className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                title="Eliminar tarea"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="p-10 text-center bg-slate-900 rounded-3xl border border-dashed border-slate-800">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-white">No hay tareas en este filtro</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Disfruta tu día o agrega una nueva tarea.</p>
          </div>
        )}
      </div>
    </div>
  );
};
