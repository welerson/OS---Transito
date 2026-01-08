
import React, { useState, useEffect } from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { Plus, Database, MapPin, Calendar, Users, Car, FileText } from 'lucide-react';

interface DashboardProps {
  plans: OperationPlan[];
  onNew: () => void;
  onSelect: (id: string) => void;
  onExport: () => void;
  onShowSummary: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plans, onNew, onSelect, onExport, onShowSummary }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Atualiza a cada minuto
    return () => clearInterval(timer);
  }, []);

  const getStatusStyles = (plan: OperationPlan) => {
    if (plan.status === OperationStatus.IN_PROGRESS) {
      return 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    }
    if (plan.status === OperationStatus.COMPLETED) {
      return 'bg-red-950/20 border-red-500/50 grayscale opacity-90';
    }
    
    // Lógica para o Amarelo Pulsante (Atrasado e Planejado)
    const eventTime = new Date(`${plan.date}T${plan.startTime}`);
    if (plan.status === OperationStatus.PLANNED && eventTime < now) {
      return 'bg-yellow-950/30 border-yellow-500/60 animate-pulse-slow shadow-[0_0_20px_rgba(234,179,8,0.2)]';
    }

    return 'bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50';
  };

  const isLate = (plan: OperationPlan) => {
    const eventTime = new Date(`${plan.date}T${plan.startTime}`);
    return plan.status === OperationStatus.PLANNED && eventTime < now;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); border-color: rgba(234, 179, 8, 0.6); }
          50% { transform: scale(1.01); border-color: rgba(234, 179, 8, 1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GCMBH - Plano de Emprego Operacional</h1>
          <p className="text-slate-400 mt-1">Gestão tática e acompanhamento de missões</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={onShowSummary}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border border-slate-700"
          >
            <FileText size={18} />
            Relatório Resumo
          </button>
          <button 
            onClick={onExport}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <Database size={16} />
            Backup JSON
          </button>
          <button 
            onClick={onNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Novo Plano
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Eventos Agendados
          {plans.some(isLate) && (
            <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-black uppercase animate-pulse">Atenção: Atrasados</span>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`group cursor-pointer rounded-xl p-5 border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${getStatusStyles(plan)}`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors uppercase truncate pr-2">{plan.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{plan.inspectorate} / {plan.macroRegion}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border whitespace-nowrap
                  ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 
                    plan.status === OperationStatus.COMPLETED ? 'bg-red-500/20 border-red-500 text-red-500' : 
                    isLate(plan) ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 animate-pulse' :
                    'bg-slate-700/50 border-slate-600 text-slate-300'}
                `}>
                  {isLate(plan) ? 'ATRASADO' : plan.status}
                </span>
              </div>

              {/* Info Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <MapPin size={16} className={`${isLate(plan) ? 'text-yellow-500' : 'text-blue-500'}`} />
                  <span className="truncate">{plan.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Calendar size={16} className={`${isLate(plan) ? 'text-yellow-500' : 'text-blue-500'}`} />
                  <span className={isLate(plan) ? 'text-yellow-500 font-bold' : ''}>{plan.date} - {plan.startTime}</span>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="flex gap-8 pt-4 border-t border-slate-700/30">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{plan.agentsCount}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Users size={10} /> AGENTES
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{plan.vehiclesCount}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Car size={10} /> VIATURAS
                  </span>
                </div>
              </div>

              {/* Special Status Indicator */}
              {isLate(plan) && (
                <div className="absolute top-2 right-2 flex gap-1">
                   <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
