
import React, { useState, useEffect } from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { Plus, Database, MapPin, Calendar, Users, Car, FileText, Image as ImageIcon, CloudUpload, CloudDownload, Trash2 } from 'lucide-react';

interface DashboardProps {
  plans: OperationPlan[];
  onNew: () => void;
  onSelect: (id: string) => void;
  onExport: () => void;
  onShowSummary: () => void;
  isSyncing: boolean;
  onCloudLoad: () => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plans, onNew, onSelect, onExport, onShowSummary, isSyncing, onCloudLoad, onDelete }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusStyles = (plan: OperationPlan) => {
    if (plan.status === OperationStatus.IN_PROGRESS) {
      return 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    }
    if (plan.status === OperationStatus.COMPLETED) {
      // Removido o 'grayscale' para permitir que o botão de excluir seja vermelho
      return 'bg-slate-900/80 border-slate-700/50 opacity-90';
    }
    
    const eventTime = new Date(`${plan.date}T${plan.startTime}`);
    if (plan.status === OperationStatus.PLANNED && eventTime < now) {
      return 'bg-yellow-950/30 border-yellow-500/60 animate-pulse-slow shadow-[0_0_20px_rgba(234,179,8,0.2)]';
    }

    return 'bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50 shadow-lg';
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GCMBH - P.E.O.</h1>
          <p className="text-slate-400 mt-1">Gestão de Missões GCMBH</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onShowSummary}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border border-slate-700"
          >
            <FileText size={16} />
            Relatório
          </button>
          
          <div className="h-8 w-px bg-slate-800 mx-1 hidden md:block"></div>

          <button 
            disabled={isSyncing}
            onClick={onCloudLoad}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg"
          >
            <CloudDownload size={14} />
            Baixar da Nuvem
          </button>

          <button 
            disabled={isSyncing}
            onClick={onExport}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border
              ${isSyncing ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border-orange-500/50 shadow-lg shadow-orange-900/10'}
            `}
          >
            <CloudUpload size={16} className={isSyncing ? 'animate-bounce' : ''} />
            {isSyncing ? 'Enviando...' : 'Sincronizar Nuvem'}
          </button>

          <button 
            onClick={onNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Novo Plano
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Missões Agendadas
          {plans.some(isLate) && (
            <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-black uppercase animate-pulse">Atenção: Atrasados</span>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`group cursor-pointer rounded-xl p-5 border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between h-[280px] ${getStatusStyles(plan)}`}
            >
              {plan.photo && (
                <div className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none">
                  <img src={plan.photo} alt="" className="w-full h-full object-cover rounded-bl-3xl" />
                </div>
              )}

              {/* Botão de Excluir para Concluídos - Cor Vermelha Vibrante */}
              {plan.status === OperationStatus.COMPLETED && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(plan.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-xl z-20 transition-all active:scale-95"
                  title="Excluir Missão Concluída"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className={plan.status === OperationStatus.COMPLETED ? 'opacity-60' : ''}>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold leading-tight group-hover:text-blue-400 transition-colors uppercase line-clamp-2" title={plan.name}>
                      {plan.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{plan.inspectorate} / {plan.macroRegion}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border whitespace-nowrap
                    ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 
                      plan.status === OperationStatus.COMPLETED ? 'bg-slate-700/50 border-slate-600 text-slate-400' : 
                      isLate(plan) ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 animate-pulse' :
                      'bg-slate-700/50 border-slate-600 text-slate-300'}
                  `}>
                    {isLate(plan) ? 'ATRASADO' : plan.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <MapPin size={14} className={`${isLate(plan) ? 'text-yellow-500' : 'text-blue-500'} shrink-0`} />
                    <span className="truncate">{plan.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <Calendar size={14} className={`${isLate(plan) ? 'text-yellow-500' : 'text-blue-500'} shrink-0`} />
                    <span className={isLate(plan) ? 'text-yellow-500 font-bold' : ''}>{plan.date} - {plan.startTime}</span>
                  </div>
                </div>
              </div>

              <div className={`flex gap-6 pt-4 border-t border-slate-700/30 mt-auto ${plan.status === OperationStatus.COMPLETED ? 'opacity-60' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-white">{plan.agentsCount}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Users size={10} /> AGENTES
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-white">{plan.vehiclesCount}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Car size={10} /> VIATURAS
                  </span>
                </div>
                {plan.photo && (
                  <div className="ml-auto flex items-end">
                    <ImageIcon size={14} className="text-slate-500" />
                  </div>
                )}
              </div>

              {isLate(plan) && (
                <div className="absolute top-1 right-1">
                   <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping"></div>
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
