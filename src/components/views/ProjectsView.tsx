import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MoreVertical,
  Layers
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  onOpenQuickAdd: () => void;
  onSelectProject?: (project: Project) => void;
}

type ProjectFilter = 'Todos los proyectos' | 'Activos' | 'Pausados' | 'Completados';

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenQuickAdd
}) => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('Todos los proyectos');

  const filters: ProjectFilter[] = ['Todos los proyectos', 'Activos', 'Pausados', 'Completados'];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'Activos') return p.status === 'En Progreso' || p.status === 'Idea';
    if (activeFilter === 'Pausados') return p.status === 'Pausado';
    if (activeFilter === 'Completados') return p.status === 'Completado';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Mis Proyectos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organiza tus metas a largo plazo, entregables y hitos de desarrollo.
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* AI Recommendation Banner Bento Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
              Próxima acción recomendada
            </span>
            <p className="text-xs sm:text-sm text-white font-bold mt-1 leading-snug">
              El proyecto <span className="text-indigo-400">"Rediseño Web Corp"</span> está al 65% y su fecha límite es el 15 Nov.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sugerencia: Revisar las 6 tareas pendientes de QA y aprobación de cliente antes del jueves.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
        {filters.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl hover:border-indigo-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full ${
                  proj.status === 'En Progreso'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : proj.status === 'Idea'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {proj.status}
                </span>

                <button className="text-slate-500 hover:text-slate-200 p-1 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mt-3">{proj.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">Progreso</span>
                <span className="font-black text-indigo-400">{proj.progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  {proj.tasksCompleted}/{proj.tasksTotal} tareas
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {proj.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Create Project Card */}
        <div
          onClick={onOpenQuickAdd}
          className="p-6 rounded-[2.5rem] border-2 border-dashed border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nuevo Proyecto</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
            Crea un contenedor para tus metas, sprints y entregables.
          </p>
        </div>
      </div>
    </div>
  );
};
