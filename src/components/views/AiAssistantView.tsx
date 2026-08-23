import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  RotateCcw, 
  ArrowRight,
  Bot,
  User
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { USER_PROFILE } from '../../data';

interface AiAssistantViewProps {
  onApplyPlanToMyDay: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onApplyPlanToMyDay }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Organizame el día',
      timestamp: '08:15 AM'
    },
    {
      id: 'm2',
      sender: 'ai',
      text: '¡Hola Freddy! Analicé tus 3 reuniones y 5 prioridades. He estructurado tu jornada para maximizar tu enfoque matutino y asegurar la entrega de la propuesta financiera:',
      timestamp: '08:15 AM',
      agendaBlocks: [
        {
          time: '08:00 - 08:45',
          period: 'Mañana',
          title: 'Revisión & Inbox Zero',
          description: 'Despejar bandeja de entrada y alinear prioridades del sprint.',
          color: 'border-l-indigo-600',
          tag: 'Rutina'
        },
        {
          time: '09:00 - 10:00',
          period: 'Mañana',
          title: 'Reunión de Diseño',
          description: 'Revisión de componentes UI con equipo Alfa.',
          color: 'border-l-rose-500',
          isHighPriority: true,
          tag: 'Meet'
        },
        {
          time: '10:30 - 12:30',
          period: 'Mañana',
          title: 'Deep Work: Wireframes & QA',
          description: 'Avance del 65% en Rediseño Web Corp.',
          color: 'border-l-blue-600',
          tag: 'Enfoque'
        },
        {
          time: '14:00 - 15:30',
          period: 'Tarde',
          title: 'Presentación Cliente Q3',
          description: 'Demostración de propuesta financiera y entregables.',
          color: 'border-l-emerald-600',
          isHighPriority: true,
          tag: 'Hito'
        }
      ],
      actions: [
        { label: 'Aplicar a Mi Día', action: 'apply', icon: 'check', variant: 'primary' },
        { label: 'Modificar bloques', action: 'modify', icon: 'rotate', variant: 'secondary' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [planApplied, setPlanApplied] = useState(false);

  const suggestionPrompts = [
    'Organizame el día',
    '¿Qué tengo pendiente hoy?',
    '¿Qué pagos vienen esta semana?',
    'Dame un resumen de mis proyectos'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q.trim(),
      timestamp: 'Ahora'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Entendido. He procesado tu solicitud sobre "${q.trim()}".`;
      let agendaBlocks;

      if (q.toLowerCase().includes('organiza') || q.toLowerCase().includes('dia')) {
        aiResponseText = 'He re-optimizado tu calendario para incluir 90 minutos de trabajo ininterrumpido:';
        agendaBlocks = [
          {
            time: '09:00 - 10:00',
            period: 'Mañana',
            title: 'Sincronización de Diseño',
            description: 'Alineación con el equipo técnico.',
            color: 'border-l-indigo-600',
            tag: 'Reunión'
          },
          {
            time: '11:00 - 13:00',
            period: 'Mañana',
            title: 'Bloque Deep Work',
            description: 'Rediseño Web Corp & Propuesta Financiera.',
            color: 'border-l-blue-600',
            isHighPriority: true,
            tag: 'Enfoque'
          },
          {
            time: '15:00 - 16:00',
            period: 'Tarde',
            title: 'Revisión y feedback',
            description: 'Cierre de ciclo diario.',
            color: 'border-l-emerald-600',
            tag: 'Cierre'
          }
        ];
      } else if (q.toLowerCase().includes('pago') || q.toLowerCase().includes('dinero') || q.toLowerCase().includes('finanz')) {
        aiResponseText = 'Estado financiero actual: Tienes un saldo disponible de $24,500.00. Tu suscripción a Netflix ($15.99) vence mañana y Spotify ($9.99) el 20 de Mayo. Tienes $500.00 pendientes por cobrar.';
      } else if (q.toLowerCase().includes('proyecto')) {
        aiResponseText = 'Tienes 3 proyectos activos. "Rediseño Web Corp" está al 65% (12/18 tareas completadas), "App Móvil V2" está en fase de Idea y "Migración Servidores" está pausado.';
      } else {
        aiResponseText = `He tomado nota de tu consulta. Tu agenda está equilibrada y tienes 4 tareas prioritarias restantes para hoy. ¿Te gustaría que agregue un recordatorio o programe una sesión de concentración?`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Ahora',
        agendaBlocks,
        actions: agendaBlocks ? [
          { label: 'Aplicar a Mi Día', action: 'apply', icon: 'check', variant: 'primary' }
        ] : undefined
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: string) => {
    if (action === 'apply') {
      onApplyPlanToMyDay();
      setPlanApplied(true);
      setTimeout(() => setPlanApplied(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Asistente Personal IA
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Optimización inteligente de agenda, priorización y análisis continuo.
            </p>
          </div>
        </div>

        {planApplied && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>¡Plan sincronizado con Mi Día!</span>
          </div>
        )}
      </div>

      {/* Suggestion Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {suggestionPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="text-xs font-bold text-indigo-400 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-800 whitespace-nowrap transition-all cursor-pointer shadow-sm"
          >
            ✦ {p}
          </button>
        ))}
      </div>

      {/* Chat Stream Window Bento Box */}
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6 min-h-[440px] flex flex-col justify-between">
        {/* Messages */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl space-y-3 ${
                m.sender === 'user'
                  ? 'bg-indigo-500 text-white p-4 rounded-3xl rounded-tr-sm text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-950 border border-slate-800 p-5 rounded-3xl rounded-tl-sm text-xs sm:text-sm text-slate-200'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {/* Structured Agenda Blocks if returned by AI */}
                {m.agendaBlocks && (
                  <div className="space-y-2.5 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                      Bloques Sugeridos
                    </span>
                    {m.agendaBlocks.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className={`p-3.5 rounded-2xl bg-slate-900 border border-slate-800 border-l-4 ${b.color} shadow-sm`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{b.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-indigo-400">
                            {b.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{b.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {m.actions && (
                  <div className="pt-2 flex items-center gap-2">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act.action)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          act.variant === 'primary'
                            ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/30'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {act.icon === 'check' && <Check className="w-3.5 h-3.5" />}
                        {act.icon === 'rotate' && <RotateCcw className="w-3.5 h-3.5" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <img
                  src={USER_PROFILE.avatar}
                  alt={USER_PROFILE.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-2xl object-cover shrink-0 mt-0.5 border border-slate-800"
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 p-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="font-semibold">LAHIAM’S AI está organizando tu respuesta...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-4 border-t border-slate-800"
        >
          <input
            type="text"
            placeholder="Pregúntale a LAHIAM’S AI (ej: 'Reorganiza mi tarde', '¿Cuánto gasté este mes?')..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 text-white rounded-2xl shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
