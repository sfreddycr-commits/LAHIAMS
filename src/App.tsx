import React, { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { QuickAddModal } from './components/QuickAddModal';
import { DashboardView } from './components/views/DashboardView';
import { MyDayView } from './components/views/MyDayView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { ProjectsView } from './components/views/ProjectsView';
import { MoneyView } from './components/views/MoneyView';
import { NotesView } from './components/views/NotesView';
import { InboxView } from './components/views/InboxView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SettingsView } from './components/views/SettingsView';
import { INITIAL_TASKS, INITIAL_DAY_EVENTS, INITIAL_PROJECTS, INITIAL_TRANSACTIONS, INITIAL_NOTES, INITIAL_INBOX, INITIAL_CALENDAR_EVENTS, INITIAL_RECURRING, USER_PROFILE } from './data';
import { ScreenType, DayEvent, Project, Task, Note, Transaction, InboxItem } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [isMobileMockup, setIsMobileMockup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'task' | 'event' | 'project' | 'note' | 'money' | 'inbox'>('task');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [dayEvents, setDayEvents] = useState<DayEvent[]>(INITIAL_DAY_EVENTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(INITIAL_INBOX);

  const openQuickAdd = (type: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox' = 'task') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const addItem = (
    type: 'task' | 'event' | 'project' | 'note' | 'money' | 'inbox',
    data: Task | DayEvent | Project | Note | Transaction | { text: string }
  ) => {
    if (type === 'task') setTasks(prev => [data as Task, ...prev]);
    else if (type === 'event') setDayEvents(prev => [...prev, data as DayEvent]);
    else if (type === 'project') setProjects(prev => [data as Project, ...prev]);
    else if (type === 'note') setNotes(prev => [{ ...(data as Note), id: `n${Date.now()}`, updatedAt: 'Just now' }, ...prev]);
    else if (type === 'money') setTransactions(prev => [data as Transaction, ...prev]);
    else if (type === 'inbox') setInboxItems(prev => [{ ...(data as { text: string }), id: `i${Date.now()}`, createdAt: 'Just now' } as InboxItem, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const convertInbox = (id: string, type: 'Task' | 'Event' | 'Reminder' | 'Note' | 'Project') => {
    const item = inboxItems.find(i => i.id === id);
    if (!item) return;
    setInboxItems(prev => prev.map(i => i.id === id ? { ...i, convertedTo: type } : i));
    if (type === 'Task') {
      setTasks(prev => [{ id: `t${Date.now()}`, title: item.text, completed: false, priority: 'Media', time: '', project: 'Personal' }, ...prev]);
    } else if (type === 'Event') {
      setDayEvents(prev => [...prev, { id: `e${Date.now()}`, title: item.text, time: 'Por definir', period: 'Mañana', priority: 'Media', tag: 'Evento' }]);
    } else if (type === 'Note') {
      setNotes(prev => [{ id: `n${Date.now()}`, title: item.text, content: '', type: 'Nota', pinned: false, favorite: false, folder: 'Inbox', updatedAt: 'Just now' }, ...prev]);
    } else if (type === 'Project') {
      setProjects(prev => [{ id: `pr${Date.now()}`, name: item.text, progress: 0, color: 'from-indigo-500 to-cyan-400', taskCount: 0, status: 'Idea', dueDate: 'Por definir' }, ...prev]);
    }
  };

  const addInbox = (text: string) => {
    setInboxItems(prev => [{ id: `i${Date.now()}`, text, createdAt: 'Just now' }, ...prev]);
  };

  const updateNote = (note: Note) => {
    setNotes(prev => prev.map(n => n.id === note.id ? note : n));
  };

  const resetData = () => {
    setTasks(INITIAL_TASKS);
    setDayEvents(INITIAL_DAY_EVENTS);
    setProjects(INITIAL_PROJECTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotes(INITIAL_NOTES);
    setInboxItems(INITIAL_INBOX);
  };

  const getScreenComponent = () => {
    switch (currentScreen) {
      case 'dashboard': return <DashboardView tasks={tasks} projects={projects} onToggleTask={toggleTask} onNavigate={setCurrentScreen} onOpenQuickAdd={openQuickAdd} />;
      case 'my-day': return <MyDayView events={dayEvents} tasks={tasks} onToggleTask={toggleTask} onOpenQuickAdd={openQuickAdd} />;
      case 'tasks': return <TasksView tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} onOpenQuickAdd={openQuickAdd} />;
      case 'calendar': return <CalendarView onOpenQuickAdd={openQuickAdd} />;
      case 'projects': return <ProjectsView projects={projects} onOpenQuickAdd={openQuickAdd} />;
      case 'money': return <MoneyView transactions={transactions} onOpenQuickAdd={openQuickAdd} />;
      case 'notes': return <NotesView notes={notes} onAddNote={(n) => addItem('note', n)} onUpdateNote={updateNote} onDeleteNote={deleteNote} onOpenQuickAdd={openQuickAdd} />;
      case 'inbox': return <InboxView inboxItems={inboxItems} onAddInbox={addInbox} onConvertInbox={convertInbox} onDeleteInbox={(id) => setInboxItems(prev => prev.filter(i => i.id !== id))} />;
      case 'ai-assistant': return <AiAssistantView onApplyPlanToMyDay={() => setCurrentScreen('my-day')} />;
      case 'settings': return <SettingsView onResetData={resetData} />;
      default: return null;
    }
  };

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const inboxCount = inboxItems.filter(i => !i.convertedTo).length;

  const renderContent = (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f] text-slate-200 font-sans antialiased">
      {/* Ambient gradient glow backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[34rem] h-[34rem] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenQuickAdd={openQuickAdd}
        inboxCount={inboxCount}
        pendingTasksCount={pendingTasksCount}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          currentScreen={currentScreen}
          onSelectScreen={setCurrentScreen}
          onOpenQuickAdd={openQuickAdd}
          isMobileMockup={isMobileMockup}
          onToggleMobileMockup={() => setIsMobileMockup(!isMobileMockup)}
          inboxCount={inboxCount}
          onOpenMobileMenu={() => setShowMobileMenu(true)}
        />

        <main className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 py-8 pb-28 md:pb-10">
          <div className="animate-fade-in max-w-6xl mx-auto">
            {getScreenComponent()}
          </div>
        </main>
      </div>

      <MobileNav
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenQuickAdd={openQuickAdd}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={(t) => addItem('task', t)}
        onAddProject={(p) => addItem('project', p)}
        onAddNote={(n) => addItem('note', n)}
        onAddTransaction={(t) => addItem('money', t)}
        onAddInbox={(i) => addItem('inbox', i)}
        initialType={quickAddType}
      />

      {/* Mobile drawer */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white/[0.04] backdrop-blur-2xl border-r border-white/10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-black text-white tracking-tight">Menú</span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Sidebar
              currentScreen={currentScreen}
              onSelectScreen={(s) => { setCurrentScreen(s); setShowMobileMenu(false); }}
              onOpenQuickAdd={(t) => { openQuickAdd(t); setShowMobileMenu(false); }}
              inboxCount={inboxCount}
              pendingTasksCount={pendingTasksCount}
              isDrawer
            />
          </div>
        </div>
      )}
    </div>
  );

  if (isMobileMockup) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans antialiased flex flex-col items-center py-10 px-4 grain relative">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -bottom-40 right-0 w-[34rem] h-[34rem] rounded-full bg-violet-600/15 blur-[120px]" />
        </div>

        <div className="flex items-center justify-between w-full max-w-sm mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-base font-black text-white tracking-tight">LAHIAM'S</span>
          </div>
          <button
            onClick={() => setIsMobileMockup(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
          >
            <X className="w-3.5 h-3.5" /> Salir
          </button>
        </div>

        <div className="relative w-full max-w-sm">
          <div className="rounded-[2.75rem] border-[10px] border-white/5 bg-[#0a0a0f] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden h-[calc(100vh-9rem)]">
            <div className="h-full overflow-hidden">
              {renderContent}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-5 text-center max-w-sm">
          Vista previa responsive. El diseño real se adapta a escritorio con barra lateral y ancho completo.
        </p>
      </div>
    );
  }

  return renderContent;
}
