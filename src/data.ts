import { Task, DayEvent, CalendarEvent, Project, Transaction, RecurringPayment, Note, InboxItem, ChatMessage } from './types';

export const USER_PROFILE = {
  name: 'Freddy',
  fullName: 'Freddy Alex Mercer',
  plan: 'Premium Sanctuary',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKUOGg8FhZLxrmH3H68OEg9OGpiKpLwqF1RKWqBGelm4SJWwTVmSnq-qRsf3wJK_wUMLFZu-5MhEVX_DY-ubqgkuiBInLWzRbi2DrEI0H_I0lxWfulEuPRE3whSzWABBYiyikCd4r6oRo--mQRzyCYD-5lO0py0zNWxNl1Y4EhgqXqYnYcSVq-9TB3UO5JuqQVQTHuVFsQ5V16Rb83awDAgkS2E5kCI7sVdiH7P8OEfXV4aew7Q8ZQLw',
  dateFormatted: 'Lunes, 24 de Octubre'
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Revisar propuesta financiera Q3',
    time: '14:00',
    date: '2023-10-24',
    priority: 'Alta',
    project: 'Finanzas',
    category: 'Presupuesto',
    completed: false,
    dueDateLabel: '14:00'
  },
  {
    id: 't2',
    title: 'Preparar presentación de diseño',
    time: '16:30',
    date: '2023-10-24',
    priority: 'Media',
    project: 'Proyecto Alpha',
    category: 'UI/UX',
    completed: false,
    dueDateLabel: '16:30'
  },
  {
    id: 't3',
    title: 'Leer artículos pendientes',
    date: '2023-10-24',
    priority: 'Baja',
    project: 'Personal',
    completed: false,
    dueDateLabel: 'Hoy'
  },
  {
    id: 't4',
    title: 'Revisar wireframes finales',
    time: '10:00 AM',
    date: '2023-10-24',
    priority: 'Alta',
    project: 'Equipo Diseño',
    completed: false,
    dueDateLabel: '10:00 AM • Equipo Diseño'
  },
  {
    id: 't5',
    title: 'Daily Standup',
    time: '09:00 AM',
    date: '2023-10-24',
    priority: 'Media',
    project: 'Meet',
    completed: true,
    dueDateLabel: '09:00 AM • Meet'
  },
  {
    id: 't6',
    title: 'Enviar reporte mensual',
    date: '2023-10-24',
    priority: 'Alta',
    project: 'Finanzas',
    completed: false,
    dueDateLabel: 'Alta prioridad'
  },
  {
    id: 't7',
    title: 'Revisar PRs frontend',
    date: '2023-10-24',
    priority: 'Media',
    project: 'Proyecto Alpha',
    completed: false,
    dueDateLabel: 'Proyecto Alpha'
  }
];

export const INITIAL_DAY_EVENTS: DayEvent[] = [
  {
    id: 'de1',
    title: 'Reunión de Diseño',
    subtitle: 'Revisión de componentes UI',
    time: '09:00 AM',
    timeSlot: 'morning',
    priority: 'High',
    type: 'meeting',
    meetLink: 'Google Meet'
  },
  {
    id: 'de2',
    title: 'Daily Standup Team Alpha',
    subtitle: 'Sincronización de sprint',
    time: '10:00 - 10:30',
    timeSlot: 'morning',
    priority: 'Med',
    type: 'meeting',
    meetLink: 'Google Meet'
  },
  {
    id: 'de3',
    title: 'Trabajo Profundo',
    subtitle: 'Implementación de diseño',
    time: '11:30 AM - Ahora',
    timeSlot: 'afternoon',
    priority: 'Med',
    isCurrent: true,
    type: 'work'
  },
  {
    id: 'de4',
    title: 'Llamada con Cliente',
    subtitle: 'Sincronización semanal',
    time: '02:00 PM',
    timeSlot: 'afternoon',
    priority: 'Low',
    type: 'meeting'
  },
  {
    id: 'de5',
    title: 'Preparar presentación Q4',
    subtitle: 'Reporte de métricas clave',
    time: '14:00 - 16:00',
    timeSlot: 'afternoon',
    type: 'work'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Rediseño Web Corp',
    description: 'Actualización visual y estructural del sitio corporativo principal para mejorar la conversión.',
    status: 'En Progreso',
    progress: 65,
    tasksCompleted: 12,
    tasksTotal: 18,
    dueDate: '15 Nov',
    category: 'Cliente Alfa'
  },
  {
    id: 'p2',
    title: 'App Móvil V2',
    description: 'Exploración de requerimientos para la próxima versión de la aplicación móvil.',
    status: 'Idea',
    progress: 0,
    tasksCompleted: 0,
    tasksTotal: 5,
    dueDate: 'Sin fecha',
    category: 'Startup Beta'
  },
  {
    id: 'p3',
    title: 'Migración Servidores',
    description: 'Pausado por falta de presupuesto para la infraestructura de AWS en este trimestre.',
    status: 'Pausado',
    progress: 30,
    tasksCompleted: 4,
    tasksTotal: 12,
    dueDate: '--',
    category: 'DevOps'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr1',
    title: 'Supermercado',
    category: 'Alimentación',
    amount: 120.50,
    type: 'expense',
    paymentMethod: 'Tarjeta Débito',
    date: '2023-05-15',
    dateGroup: 'Hoy, 15 Mayo',
    icon: 'shopping_cart'
  },
  {
    id: 'tr2',
    title: 'Recibo de Luz',
    category: 'Servicios',
    amount: 45.00,
    type: 'expense',
    paymentMethod: 'Transferencia',
    date: '2023-05-15',
    dateGroup: 'Hoy, 15 Mayo',
    icon: 'bolt'
  },
  {
    id: 'tr3',
    title: 'Freelance Diseño',
    category: 'Ingresos extra',
    amount: 450.00,
    type: 'income',
    paymentMethod: 'Paypal',
    date: '2023-05-14',
    dateGroup: 'Ayer, 14 Mayo',
    icon: 'payments'
  },
  {
    id: 'tr4',
    title: 'Cena amigos',
    category: 'Ocio',
    amount: 35.00,
    type: 'expense',
    paymentMethod: 'Efectivo',
    date: '2023-05-14',
    dateGroup: 'Ayer, 14 Mayo',
    icon: 'restaurant'
  }
];

export const INITIAL_RECURRING: RecurringPayment[] = [
  {
    id: 'r1',
    title: 'Netflix',
    dueDate: 'Mañana',
    amount: 15.99,
    logoLetter: 'N',
    color: '#E50914'
  },
  {
    id: 'r2',
    title: 'Spotify',
    dueDate: '20 Mayo',
    amount: 9.99,
    logoLetter: 'S',
    color: '#1DB954'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Redesign Marketing Site',
    content: `Need to update the hero section with the new brand guidelines. Focusing on lighter colors and softer shadows. The typography needs to be tighter.

### Key Objectives
- Implement the new "Fluid-Fixed Hybrid" layout model.
- Ensure all soft shadows follow the Triple-Layer blur technique.
- Update primary call-to-action buttons to use Brand Indigo.

The aesthetic should feel modern minimalist with soft elevation. Avoid the sterility of pure functionalism. We need generous whitespace and high-fidelity typography.

> "Every interaction is designed to reduce cognitive load through a content-first hierarchy."`,
    type: 'Project-related',
    tags: ['#design', '#web'],
    pinned: true,
    favorite: true,
    updatedAt: 'Today, 10:42 AM',
    folder: 'Website Overhaul V2'
  },
  {
    id: 'n2',
    title: 'App Gamification Concept',
    content: `Introduce small rewards for completing daily tasks. Maybe a subtle particle effect or unlocking different ambient color themes.

- Micro-interactions for checking off items
- Visual streak celebrations
- Audio cues with organic, relaxing feedback`,
    type: 'Idea',
    tags: ['#product'],
    pinned: false,
    favorite: false,
    updatedAt: 'Yesterday',
    folder: 'Innovation'
  },
  {
    id: 'n3',
    title: 'Groceries',
    content: `- Almond milk
- Avocados
- Coffee beans
- Organic sourdough bread
- Fresh spinach`,
    type: 'Quick note',
    tags: ['#personal'],
    pinned: false,
    favorite: false,
    updatedAt: 'Oct 12',
    folder: 'Personal'
  }
];

export const INITIAL_INBOX: InboxItem[] = [
  {
    id: 'in1',
    text: 'Renovar el seguro del auto antes del viernes.',
    createdAt: 'Hace 10 min'
  },
  {
    id: 'in2',
    text: 'Idea para la campaña de marketing Q3: Usar más testimoniales en video.',
    createdAt: 'Hace 1 hora'
  },
  {
    id: 'in3',
    text: 'Comprar pan y leche',
    createdAt: 'Hoy, 09:15',
    convertedTo: 'Task'
  },
  {
    id: 'in4',
    text: 'Reunión con cliente a las 15hs',
    createdAt: 'Hoy, 08:30',
    convertedTo: 'Event'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ce1',
    day: 2,
    month: 10,
    year: 2023,
    title: 'Standup Team',
    time: '09:00 AM',
    type: 'event',
    attendees: 3
  },
  {
    id: 'ce2',
    day: 4,
    month: 10,
    year: 2023,
    title: 'Diseño UI V2',
    time: '11:00 AM',
    type: 'task'
  },
  {
    id: 'ce3',
    day: 6,
    month: 10,
    year: 2023,
    title: 'Factura AWS',
    time: '18:00',
    type: 'payment'
  },
  {
    id: 'ce4',
    day: 10,
    month: 10,
    year: 2023,
    title: 'Demo Cliente',
    time: '14:00 - 15:30',
    type: 'event',
    attendees: 4
  },
  {
    id: 'ce5',
    day: 10,
    month: 10,
    year: 2023,
    title: 'Enviar reporte',
    time: '16:00',
    type: 'task'
  },
  {
    id: 'ce6',
    day: 12,
    month: 10,
    year: 2023,
    title: 'Lanzamiento Beta',
    type: 'milestone'
  }
];
