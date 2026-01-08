
import React from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { Plus, Database, MapPin, Calendar, Users, Car } from 'lucide-react';

interface DashboardProps {
  plans: OperationPlan[];
  onNew: () => void;
  onSelect: (id: string) => void;
  onExport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plans, onNew, onSelect, onExport }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GCMBH - Plano de Emprego Operacional</h1>
          <p className="text-slate-400 mt-1">Gestão tática e acompanhamento de missões</p>
        </div>
        <div className="flex items-center gap-4">
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
        <h2 className="text-xl font-semibold mb-6">Eventos Agendados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`group cursor-pointer rounded-xl p-5 border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden
                ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-orange-950/20 border-orange-500/30' : 
                  plan.status === OperationStatus.COMPLETED ? 'bg-emerald-950/20 border-emerald-500/30' : 
                  'bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50'}
              `}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{plan.inspectorate} / {plan.macroRegion}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border
                  ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 
                    plan.status === OperationStatus.COMPLETED ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 
                    'bg-slate-700/50 border-slate-600 text-slate-300'}
                `}>
                  {plan.status}
                </span>
              </div>

              {/* Info Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="truncate">{plan.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Calendar size={16} className="text-blue-500" />
                  <span>{plan.date} - {plan.startTime}</span>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="flex gap-8 pt-4 border-t border-slate-700/50">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{plan.agentsCount}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Users size={10} /> AGENTES
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{plan.vehiclesCount}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Car size={10} /> VIATURAS
                  </span>
                </div>
              </div>

              {/* Status Glow for 'In Progress' */}
              {plan.status === OperationStatus.IN_PROGRESS && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full m-3 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
