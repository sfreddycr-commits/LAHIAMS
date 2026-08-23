import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Clock, 
  CreditCard, 
  AlertCircle, 
  ShoppingBag, 
  Zap, 
  Coffee, 
  DollarSign, 
  Layers,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { Transaction, RecurringPayment } from '../../types';
import { INITIAL_RECURRING } from '../../data';

interface MoneyViewProps {
  transactions: Transaction[];
  onOpenQuickAdd: () => void;
}

type MoneyTab = 'Movimientos' | 'Pagos pendientes' | 'Deudas' | 'Por cobrar' | 'Recurrentes';

export const MoneyView: React.FC<MoneyViewProps> = ({
  transactions,
  onOpenQuickAdd
}) => {
  const [activeTab, setActiveTab] = useState<MoneyTab>('Movimientos');
  const [chartPeriod, setChartPeriod] = useState<'6M' | '1A'>('6M');

  const tabs: MoneyTab[] = ['Movimientos', 'Pagos pendientes', 'Deudas', 'Por cobrar', 'Recurrentes'];

  // Monthly breakdown for chart
  const monthlyData = [
    { month: 'May', income: 9500, expense: 7200 },
    { month: 'Jun', income: 10200, expense: 8100 },
    { month: 'Jul', income: 11000, expense: 7800 },
    { month: 'Ago', income: 10800, expense: 8900 },
    { month: 'Sep', income: 11500, expense: 8300 },
    { month: 'Oct', income: 12000, expense: 8450 },
  ];

  const maxChartVal = 13000;

  const totalBalance = 24500.00;
  const monthlyIncome = 12000.00;
  const monthlyExpense = 8450.00;
  const pendingBills = 1200.00;
  const receivables = 500.00;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200 text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Control de Dinero
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión inteligente de flujos de caja, presupuestos y suscripciones.
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Movimiento</span>
        </button>
      </div>

      {/* Main Financial Balance Cards Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="md:col-span-1 p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Balance Total Actual</span>
            <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight text-white">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5.2% vs mes anterior</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Cuenta Principal</span>
            <span className="text-indigo-400 font-mono font-bold">•••• 4892</span>
          </div>
        </div>

        {/* Ingresos & Gastos Highlights */}
        <div className="p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ingresos del Mes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
            +${monthlyIncome.toLocaleString('en-US')}
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Por cobrar: <span className="font-bold text-white">${receivables}</span>
          </div>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gastos del Mes</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-3">
            -${monthlyExpense.toLocaleString('en-US')}
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Pendientes: <span className="font-bold text-rose-400">${pendingBills}</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart: Ingresos vs Gastos Bento Box */}
      <div className="p-6 sm:p-7 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Flujo de Caja: Ingresos vs Gastos</h3>
            <p className="text-[11px] text-slate-400">Comparativa mensual de balance operativo e inversiones</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-medium">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300 font-medium">Gastos</span>
              </div>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setChartPeriod('6M')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartPeriod === '6M' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                6 Meses
              </button>
              <button
                onClick={() => setChartPeriod('1A')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartPeriod === '1A' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Año
              </button>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 border-b border-slate-800">
          {monthlyData.map((d) => {
            const incomeHeight = (d.income / maxChartVal) * 100;
            const expenseHeight = (d.expense / maxChartVal) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Income bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-emerald-500/90 rounded-t-lg transition-all duration-500 hover:brightness-125 relative shadow-lg shadow-emerald-500/20"
                    style={{ height: `${incomeHeight}%` }}
                    title={`Ingreso ${d.month}: $${d.income}`}
                  />
                  {/* Expense bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-rose-500/80 rounded-t-lg transition-all duration-500 hover:brightness-125 relative shadow-lg shadow-rose-500/20"
                    style={{ height: `${expenseHeight}%` }}
                    title={`Gasto ${d.month}: $${d.expense}`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions list (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            {tabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Transactions */}
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-6 shadow-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeTab === 'Movimientos' ? 'Últimos Movimientos' : activeTab}
            </h4>

            <div className="space-y-3">
              {transactions.map((tr) => (
                <div
                  key={tr.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                      tr.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {tr.type === 'income' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">{tr.title}</p>
                      <p className="text-[10px] text-slate-400">{tr.category} • {tr.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs sm:text-sm font-black ${
                      tr.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                    }`}>
                      {tr.type === 'income' ? '+' : '-'}${tr.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500">{tr.dateGroup}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Insights & Subscriptions */}
        <div className="space-y-6">
          {/* Insights Card */}
          <div className="p-6 rounded-[2.5rem] bg-amber-950/20 border border-amber-500/30 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">Consejo de Gasto</h4>
            </div>
            <p className="text-xs text-amber-200 mt-2 leading-relaxed font-medium">
              Tus gastos en <span className="font-bold text-white">Ocio</span> han alcanzado el 75% del límite mensual configurado.
            </p>
            <div className="mt-4 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          {/* Próximos Recurrentes */}
          <div className="p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Próximos Recurrentes</h4>
              <span className="text-[10px] text-indigo-400 font-bold cursor-pointer">Gestionar</span>
            </div>

            <div className="space-y-3">
              {INITIAL_RECURRING.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.logoLetter}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{r.title}</p>
                      <p className="text-[10px] text-slate-400">Vence: {r.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-white">${r.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
