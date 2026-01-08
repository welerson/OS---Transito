
import React from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { ChevronLeft, ShieldCheck, MapPin, Users, Car, Radio, Power, UserCheck } from 'lucide-react';

interface OperationDetailsProps {
  plan: OperationPlan;
  onBack: () => void;
  onStatusChange: (id: string, status: OperationStatus) => void;
  onVehicleToggle: (planId: string, vehicleId: string) => void;
  onViewOfficial: () => void;
}

const OperationDetails: React.FC<OperationDetailsProps> = ({ 
  plan, 
  onBack, 
  onStatusChange, 
  onVehicleToggle,
  onViewOfficial
}) => {
  const isCompleted = plan.status === OperationStatus.COMPLETED;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          <ChevronLeft size={18} />
          Voltar
        </button>
        <button 
          onClick={onViewOfficial}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <ShieldCheck size={18} />
          Plano Oficial
        </button>
      </div>

      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-black tracking-tight text-white uppercase">{plan.name}</h1>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-md
            ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-orange-500 text-slate-950' : 
              plan.status === OperationStatus.COMPLETED ? 'bg-emerald-500 text-slate-950' : 
              'bg-slate-700 text-slate-300'}
          `}>
            {plan.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin size={18} className="text-blue-500" />
          <span className="text-lg">{plan.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6">Missão</h3>
            <div className="p-6 bg-slate-900/60 rounded-lg border-l-4 border-blue-500">
              <p className="text-slate-200 leading-relaxed text-lg italic">
                {plan.objective || "Sem objetivo definido."}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
              <UserCheck size={14} /> Equipe Empenhada
            </h3>
            <div className="p-6 bg-slate-900/60 rounded-lg border border-slate-700">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {plan.deployedTeam || "Nenhum agente listadonominalmente."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-blue-500">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Agentes</p>
                <p className="text-2xl font-black">{plan.agentsCount}</p>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-blue-500">
                <Car size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Viaturas</p>
                <p className="text-2xl font-black">{plan.vehiclesCount}</p>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-yellow-500/80">
                <Radio size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Rádio</p>
                <p className="text-2xl font-black truncate max-w-[120px]">{plan.radio || "--"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Control and Lists Column */}
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Controle</h3>
            {!isCompleted ? (
              <button 
                onClick={() => onStatusChange(plan.id, OperationStatus.COMPLETED)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/20"
              >
                <Power size={20} />
                Encerrar Missão
              </button>
            ) : (
              <div className="text-center py-4 text-emerald-500 font-bold border border-emerald-500/20 rounded-lg bg-emerald-500/5">
                Missão Finalizada
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Viaturas</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {plan.vehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg flex justify-between items-center transition-all hover:border-slate-700">
                  <span className="font-bold text-slate-300">{vehicle.name}</span>
                  <button 
                    disabled={isCompleted}
                    onClick={() => onVehicleToggle(plan.id, vehicle.id)}
                    className={`px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all
                      ${vehicle.arrived ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700 hover:text-slate-300'}
                      ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {vehicle.arrived ? 'Check-in OK' : 'Arrivo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationDetails;
