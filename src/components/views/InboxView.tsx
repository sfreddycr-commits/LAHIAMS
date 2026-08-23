import React, { useState } from 'react';
import { 
  Inbox, 
  Plus, 
  Send, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Bell, 
  FileText, 
  FolderKanban, 
  Trash2, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { InboxItem, Task } from '../../types';

interface InboxViewProps {
  inboxItems: InboxItem[];
  onAddInbox: (text: string) => void;
  onConvertInbox: (id: string, type: 'Task' | 'Event' | 'Reminder' | 'Note' | 'Project') => void;
  onDeleteInbox: (id: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  inboxItems,
  onAddInbox,
  onConvertInbox,
  onDeleteInbox,
}) => {
  const [inputText, setInputText] = useState('');

  const pendingItems = inboxItems.filter(i => !i.convertedTo);
  const convertedItems = inboxItems.filter(i => i.convertedTo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddInbox(inputText.trim());
    setInputText('');
  };

  const suggestionChips = [
    'Llamar al dentista para turno',
    'Comprar repuesto cargador USB-C',
    'Idea: nuevo dashboard de métricas',
    'Renovar dominio antes del viernes'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Inbox / Descarga Mental
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vuelca rápidamente cualquier idea o pendiente sin clasificar. Procesa luego en 1 clic.
          </p>
        </div>
      </div>

      {/* Fast Capture Input Box Bento Box */}
      <div className="p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input
            type="text"
            placeholder="¿Qué tienes en la cabeza ahora mismo? (ej: Comprar café, Revisar contrato...)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Capturar</span>
          </button>
        </form>

        {/* Suggestion quick chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0 mr-1">
            Ejemplos:
          </span>
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(chip)}
              className="text-[11px] text-slate-300 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:text-white px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Pendientes de organizar Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Pendientes de Organizar</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
            {pendingItems.length} por procesar
          </span>
        </div>

        <div className="space-y-3">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white">{item.text}</p>
                <p className="text-[10px] text-slate-500 mt-1">{item.createdAt}</p>
              </div>

              {/* Conversion Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => onConvertInbox(item.id, 'Task')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Tarea</span>
                </button>
                <button
                  onClick={() => onConvertInbox(item.id, 'Event')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Evento</span>
                </button>
                <button
                  onClick={() => onConvertInbox(item.id, 'Note')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Nota</span>
                </button>
                <button
                  onClick={() => onConvertInbox(item.id, 'Project')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Proyecto</span>
                </button>

                <button
                  onClick={() => onDeleteInbox(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-1 cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {pendingItems.length === 0 && (
            <div className="p-10 text-center bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-800">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-white">¡Bandeja de entrada despejada!</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Inbox Zero logrado. Nada pendiente de clasificar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ya organizados Section */}
      {convertedItems.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Organizados Recientemente
          </h3>
          <div className="space-y-2">
            {convertedItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400"
              >
                <span className="truncate">{item.text}</span>
                <span className="font-bold text-[10px] px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shrink-0">
                  Convertido a {item.convertedTo}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
