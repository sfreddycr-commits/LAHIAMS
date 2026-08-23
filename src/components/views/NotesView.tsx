import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Star, 
  Pin, 
  Trash2, 
  Folder, 
  Tag, 
  Clock, 
  Bold, 
  Italic, 
  List, 
  Quote,
  Check
} from 'lucide-react';
import { Note } from '../../types';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenQuickAdd: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onOpenQuickAdd
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter((n) => {
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType === 'pinned') return n.pinned;
    if (filterType === 'favorites') return n.favorite;
    return true;
  });

  const handleTitleChange = (newTitle: string) => {
    if (!selectedNote) return;
    onUpdateNote({ ...selectedNote, title: newTitle, updatedAt: 'Just now' });
  };

  const handleContentChange = (newContent: string) => {
    if (!selectedNote) return;
    onUpdateNote({ ...selectedNote, content: newContent, updatedAt: 'Just now' });
  };

  const handleTogglePin = () => {
    if (!selectedNote) return;
    onUpdateNote({ ...selectedNote, pinned: !selectedNote.pinned });
  };

  const handleToggleFavorite = () => {
    if (!selectedNote) return;
    onUpdateNote({ ...selectedNote, favorite: !selectedNote.favorite });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Notas & Documentos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Captura ideas, especificaciones de diseño y listas de verificación rápidas.
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Nota</span>
        </button>
      </div>

      {/* Split View Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 1 Col: Notes list */}
        <div className="space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todas ({notes.length})
            </button>
            <button
              onClick={() => setFilterType('pinned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'pinned' ? 'bg-indigo-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fijadas
            </button>
            <button
              onClick={() => setFilterType('favorites')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'favorites' ? 'bg-indigo-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Favoritas
            </button>
          </div>

          {/* Note cards */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-indigo-400">
                      {note.type}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      {note.pinned && <Pin className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />}
                      {note.favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-2.5 truncate">
                    {note.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {note.content.replace(/#|\*|>|-/g, '')}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{note.updatedAt}</span>
                    <span className="text-indigo-400 font-bold">{note.folder}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Note Editor */}
        <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
          {selectedNote ? (
            <div className="space-y-4">
              {/* Note meta & actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-300">{selectedNote.folder || 'General'}</span>
                  <span>•</span>
                  <span>{selectedNote.updatedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePin}
                    className={`p-2 rounded-xl border border-slate-800 transition-colors cursor-pointer ${
                      selectedNote.pinned ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Fijar nota"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-xl border border-slate-800 transition-colors cursor-pointer ${
                      selectedNote.favorite ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Marcar favorita"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(selectedNote.id)}
                    className="p-2 rounded-xl border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Eliminar nota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title input */}
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-lg sm:text-2xl font-black text-white outline-none placeholder-slate-600 border-none bg-transparent"
                placeholder="Título de la nota..."
              />

              {/* Editor Toolbar */}
              <div className="flex items-center gap-1.5 py-2 px-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
                <button 
                  onClick={() => handleContentChange(selectedNote.content + '\n**Texto en negrita**')}
                  className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg text-xs font-bold cursor-pointer"
                  title="Negrita"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleContentChange(selectedNote.content + '\n*Texto en cursiva*')}
                  className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg text-xs cursor-pointer"
                  title="Cursiva"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleContentChange(selectedNote.content + '\n- Elemento de lista')}
                  className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg text-xs cursor-pointer"
                  title="Lista"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleContentChange(selectedNote.content + '\n> Cita importante')}
                  className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg text-xs cursor-pointer"
                  title="Cita"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-500 ml-auto font-medium">Guardado automático</span>
              </div>

              {/* Note Content Textarea */}
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={14}
                className="w-full text-xs sm:text-sm text-slate-200 outline-none leading-relaxed bg-transparent resize-none font-sans"
                placeholder="Comienza a escribir tus notas..."
              />
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-slate-500">
              Selecciona una nota o crea una nueva.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
