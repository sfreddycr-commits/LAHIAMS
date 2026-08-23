import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Calendar as CalendarIcon,
  FolderKanban,
  FileText,
  Wallet,
  Inbox as InboxIcon,
  Plus,
  Flag,
  Tag,
  Clock
} from 'lucide-react';
import { Task, Project, Note, Transaction, InboxItem } from '../types';

type AddType = 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onAddProject: (project: Project) => void;
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onAddTransaction: (transaction: Transaction) => void;
  onAddInbox: (item: InboxItem) => void;
  initialType?: AddType;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddProject,
  onAddNote,
  onAddTransaction,
  onAddInbox,
  initialType = 'task'
}) => {
  const [type, setType] = useState<AddType>(initialType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [time, setTime] = useState('');
  const [project, setProject] = useState('Personal');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'Ingreso' | 'Gasto'>('Gasto');
  const [tag, setTag] = useState('General');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setTitle('');
      setDescription('');
      setPriority('Media');
      setTime('');
      setProject('Personal');
      setAmount('');
      setTransactionType('Gasto');
      setTag('General');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (type === 'task') {
      if (!title.trim()) return;
      onAddTask({ title: title.trim(), completed: false, priority, time, project });
    } else if (type === 'event') {
      if (!title.trim()) return;
      onAddTask({ title: title.trim(), completed: false, priority, time: time || 'Por definir', project: 'Evento' });
    } else if (type === 'project') {
      if (!title.trim()) return;
      onAddProject({
        id: `pr${Date.now()}`,
        name: title.trim(),
        progress: 0,
        color: 'from-indigo-500 to-cyan-400',
        taskCount: 0,
        status: 'Idea',
        dueDate: 'Por definir'
      });
    } else if (type === 'note') {
      if (!title.trim()) return;
      onAddNote({
        title: title.trim(),
        content: description,
        type: 'Nota',
        pinned: false,
        favorite: false,
        folder: tag
      });
    } else if (type === 'money') {
      if (!title.trim() || !amount) return;
      onAddTransaction({
        id: `tx${Date.now()}`,
        name: title.trim(),
        amount: parseFloat(amount) || 0,
        type: transactionType,
        category: tag,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        icon: transactionType === 'Ingreso' ? '↗' : '↘'
      });
    } else if (type === 'inbox') {
      if (!title.trim()) return;
      onAddInbox({ id: `i${Date.now()}`, text: title.trim(), createdAt: 'Just now' });
    }
    onClose();
  };

  const types = [
    { id: 'task' as AddType, label: 'Tarea', icon: CheckSquare },
    { id: 'event' as AddType, label: 'Evento', icon: CalendarIcon },
    { id: 'project' as AddType, label: 'Proyecto', icon: FolderKanban },
    { id: 'note' as AddType, label: 'Nota', icon: FileText },
    { id: 'money' as AddType, label: 'Money', icon: Wallet },
    { id: 'inbox' as AddType, label: 'Inbox', icon: InboxIcon },
  ];

  const priorityColor = (p: string) =>
    p === 'Alta' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
    : p === 'Media' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

  const inputCls = "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-t-[2rem] sm:rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-white tracking-tight">Quick Add</h2>
            <p className="text-[11px] text-slate-400">Captura en segundos.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-5 py-4 scrollbar-none">
          {types.map((t) => {
            const Icon = t.icon;
            const active = type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(99,102,241,0.5)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="px-5 pb-2 space-y-3 max-h-[55vh] overflow-y-auto scrollbar-none">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === 'money' ? 'Concepto (ej: Suscripción Netflix)' :
              type === 'inbox' ? '¿Qué tienes en mente?' :
              'Título'
            }
            className={inputCls}
          />

          {(type === 'note' || type === 'inbox' || type === 'event') && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          )}

          {(type === 'task' || type === 'event') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                  <Clock className="w-3.5 h-3.5" /> Hora
                </label>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="09:00"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                  <Flag className="w-3.5 h-3.5" /> Prioridad
                </label>
                <div className="flex gap-1.5">
                  {(['Alta', 'Media', 'Baja'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 px-2 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        priority === p ? priorityColor(p) : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === 'task' && (
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                <Tag className="w-3.5 h-3.5" /> Proyecto
              </label>
              <input
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Personal"
                className={inputCls}
              />
            </div>
          )}

          {type === 'note' && (
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                <Tag className="w-3.5 h-3.5" /> Carpeta
              </label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="General"
                className={inputCls}
              />
            </div>
          )}

          {type === 'money' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1.5 block">Monto</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1.5 block">Tipo</label>
                <div className="flex gap-1.5">
                  {(['Gasto', 'Ingreso'] as const).map((tt) => (
                    <button
                      key={tt}
                      onClick={() => setTransactionType(tt)}
                      className={`flex-1 px-2 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        transactionType === tt
                          ? tt === 'Ingreso' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === 'project' && (
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                <Tag className="w-3.5 h-3.5" /> Etiqueta
              </label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="General"
                className={inputCls}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white text-sm font-bold shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
