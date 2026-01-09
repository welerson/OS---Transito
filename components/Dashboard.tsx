
import React, { useState, useEffect, useMemo } from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { Plus, MapPin, Calendar, Users, Car, FileText, Image as ImageIcon, CloudUpload, RefreshCw, Trash2, Search, Filter } from 'lucide-react';

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

const Dashboard: React.FC<DashboardProps> = ({ plans, onNew, onSelect, onExport, onShowSummary, isSyncing, onDelete }) => {
  const [now, setNow] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.inspectorate && plan.inspectorate.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [plans, searchTerm]);

  const getStatusStyles = (plan: OperationPlan) => {
    if (plan.status === OperationStatus.IN_PROGRESS) {
      return 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    }
    if (plan.status === OperationStatus.COMPLETED) {
      return 'bg-slate-900/60 border-slate-700/50 shadow-sm';
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
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

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">GCMBH - P.E.O.</h1>
          <p className="text-slate-400 mt-1 uppercase text-sm tracking-wide font-medium">Departamento de Trânsito</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          <button 
            onClick={onShowSummary}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border border-slate-700"
          >
            <FileText size={16} />
            Relatório
          </button>
          
          <button 
            disabled={isSyncing}
            onClick={onExport}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border
              ${isSyncing ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border-emerald-500/50 shadow-lg shadow-emerald-900/10'}
            `}
          >
            {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <CloudUpload size={16} />}
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </button>

          <button 
            onClick={onNew}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Novo Plano
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Buscar por nome, local ou inspetoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-colors text-white"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium ml-auto">
          <Filter size={14} />
          Exibindo <span className="text-blue-400 font-bold">{filteredPlans.length}</span> de <span className="text-white font-bold">{plans.length}</span> registros online
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          Quadro Geral de Missões
          {plans.some(isLate) && (
            <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-black uppercase animate-pulse">Atrasados</span>
          )}
        </h2>
        
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => onSelect(plan.id)}
                className={`group cursor-pointer rounded-xl p-5 border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between h-[280px] ${getStatusStyles(plan)} text-white`}
              >
                {/* Botão de Excluir - Disponível para TODOS os registros */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(plan.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg shadow-xl z-20 transition-all active:scale-95 border border-red-500/50"
                  title="Excluir este registro de todos os dispositivos"
                >
                  <Trash2 size={16} />
                </button>

                {plan.photo && (
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none">
                    <img src={plan.photo} alt="" className="w-full h-full object-cover rounded-bl-3xl" />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex-1 pr-8"> {/* Padding para não bater no botão de excluir */}
                      <h3 className="text-lg font-bold leading-tight group-hover:text-blue-400 transition-colors uppercase line-clamp-2" title={plan.name}>
                        {plan.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{plan.inspectorate} / {plan.macroRegion}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
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

                <div className={`flex gap-6 pt-4 border-t border-slate-700/30 mt-auto`}>
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
        ) : (
          <div className="text-center py-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 font-medium">Nenhum evento encontrado na nuvem.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-500 text-sm font-bold hover:underline"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
