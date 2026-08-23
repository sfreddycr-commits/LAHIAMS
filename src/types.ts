export type ScreenType = 
  | 'dashboard'
  | 'my-day'
  | 'tasks'
  | 'calendar'
  | 'projects'
  | 'money'
  | 'reminders'
  | 'notes'
  | 'inbox'
  | 'ai-assistant'
  | 'settings';

export type Priority = 'Alta' | 'Media' | 'Baja';

export interface Task {
  id: string;
  title: string;
  time?: string;
  date?: string;
  priority: Priority;
  project?: string;
  category?: string;
  completed: boolean;
  dueDateLabel?: string;
}

export interface DayEvent {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  priority?: 'High' | 'Med' | 'Low';
  isCurrent?: boolean;
  type?: 'meeting' | 'work' | 'personal';
  meetLink?: string;
}

export interface CalendarEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  time?: string;
  type: 'event' | 'task' | 'payment' | 'milestone';
  attendees?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'En Progreso' | 'Idea' | 'Pausado' | 'Completado';
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
  category?: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  paymentMethod: string;
  date: string;
  dateGroup: 'Hoy, 15 Mayo' | 'Ayer, 14 Mayo' | 'Esta semana';
  icon: string;
}

export interface RecurringPayment {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  logoLetter: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'Project-related' | 'Idea' | 'Quick note' | 'General';
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  updatedAt: string;
  folder?: string;
}

export interface InboxItem {
  id: string;
  text: string;
  createdAt: string;
  convertedTo?: 'Task' | 'Event' | 'Reminder' | 'Note' | 'Project';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agendaBlocks?: {
    time: string;
    period: string;
    title: string;
    description: string;
    color: string;
    tag?: string;
    isHighPriority?: boolean;
  }[];
  actions?: {
    label: string;
    action: string;
    icon: string;
    variant: 'primary' | 'secondary' | 'danger';
  }[];
}
