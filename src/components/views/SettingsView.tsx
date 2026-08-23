import React from 'react';
import { 
  User, 
  Moon, 
  Sun, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { USER_PROFILE } from '../../data';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          Configuración & Preferencias
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajustes del perfil, notificaciones y opciones del santuario personal.
        </p>
      </div>

      {/* Profile Section Bento Card */}
      <div className="p-6 sm:p-7 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Perfil de Usuario</h3>
        <div className="flex items-center gap-4">
          <img
            src={USER_PROFILE.avatar}
            alt={USER_PROFILE.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{USER_PROFILE.fullName}</h4>
            <p className="text-xs text-slate-400">freddy.mercer@lahiams.app</p>
            <span className="mt-1.5 inline-block text-[10px] font-bold px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
              {USER_PROFILE.plan}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Section Bento Card */}
      <div className="p-6 sm:p-7 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Personalización</h3>

        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-xs font-bold text-white">Tema Bento Dark Grid</p>
              <p className="text-[10px] text-slate-500">Paleta ultra-oscura de alto contraste inspirada en Bento UI</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-400">Activo</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-xs font-bold text-white">Recordatorios Inteligentes</p>
              <p className="text-[10px] text-slate-500">Alertas 15 minutos antes de eventos de alta prioridad</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 cursor-pointer" />
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-xs font-bold text-white">Sugerencias Automáticas de IA</p>
              <p className="text-[10px] text-slate-500">Resumen diario y optimización de bloques de deep work</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 cursor-pointer" />
        </div>
      </div>

      {/* Demo Reset Options Bento Card */}
      <div className="p-6 sm:p-7 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Reiniciar Datos del Demo</h4>
          <p className="text-[10px] text-slate-500">Restaura las tareas, transacciones y notas de ejemplo originales.</p>
        </div>
        <button
          onClick={onResetData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>
      </div>
    </div>
  );
};
