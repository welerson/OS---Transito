
import React, { useRef, useState } from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { ChevronLeft, ShieldCheck, MapPin, Users, Car, Radio, Power, UserCheck, Camera, X, Play, Shield } from 'lucide-react';

interface OperationDetailsProps {
  plan: OperationPlan;
  onBack: () => void;
  onStatusChange: (id: string, status: OperationStatus) => void;
  onVehicleToggle: (planId: string, vehicleId: string) => void;
  onViewOfficial: () => void;
  onUpdatePlan: (plan: OperationPlan) => void;
}

const OperationDetails: React.FC<OperationDetailsProps> = ({ 
  plan, 
  onBack, 
  onStatusChange, 
  onVehicleToggle,
  onViewOfficial,
  onUpdatePlan
}) => {
  const isCompleted = plan.status === OperationStatus.COMPLETED;
  const isInProgress = plan.status === OperationStatus.IN_PROGRESS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
      };
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      const compressed = await compressImage(file);
      onUpdatePlan({ ...plan, photo: compressed });
      setIsCompressing(false);
    }
  };

  const removePhoto = () => {
    onUpdatePlan({ ...plan, photo: undefined });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          <ChevronLeft size={18} />
          Voltar
        </button>
        <button 
          onClick={onViewOfficial}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg"
        >
          <ShieldCheck size={18} />
          Plano Oficial
        </button>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-white uppercase mb-2">{plan.name}</h1>
        <div className="flex flex-wrap items-center gap-4">
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border
            ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 
              plan.status === OperationStatus.COMPLETED ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 
              'bg-slate-700/50 border-slate-600 text-slate-300'}
          `}>
            {plan.status}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <MapPin size={16} className="text-blue-500" />
            {plan.location}
          </div>
          {plan.responsible && (
            <div className="flex items-center gap-1.5 text-slate-400 text-sm ml-2">
              <Shield size={16} className="text-yellow-500" />
              <span className="font-bold text-slate-200">Cmdte:</span> {plan.responsible}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">Missão</h3>
            <div className="p-6 bg-slate-900/40 rounded-lg border-l-4 border-blue-500">
              <p className="text-slate-200 leading-relaxed italic">
                {plan.objective || "Aguardando definição de diretrizes."}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
              <UserCheck size={14} /> Equipe Empenhada
            </h3>
            <div className="p-6 bg-slate-900/40 rounded-lg border border-slate-700/50">
              <p className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                {plan.deployedTeam || "NENHUM AGENTE LISTADO NOMINALMENTE."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-900/60 rounded-lg text-blue-500">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Agentes</p>
                <p className="text-xl font-black">{plan.agentsCount}</p>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-900/60 rounded-lg text-blue-500">
                <Car size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Viaturas</p>
                <p className="text-xl font-black">{plan.vehiclesCount}</p>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-900/60 rounded-lg text-yellow-500">
                <Radio size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Rádio</p>
                <p className="text-xl font-black truncate">{plan.radio || "Rede Ops"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Controle de Status</h3>
            
            {plan.status === OperationStatus.PLANNED && (
              <button 
                onClick={() => onStatusChange(plan.id, OperationStatus.IN_PROGRESS)}
                className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-900/20"
              >
                <Play size={18} />
                Iniciar Missão
              </button>
            )}

            {plan.status === OperationStatus.IN_PROGRESS && (
              <button 
                onClick={() => onStatusChange(plan.id, OperationStatus.COMPLETED)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
              >
                <Power size={18} />
                Encerrar Missão
              </button>
            )}

            {plan.status === OperationStatus.COMPLETED && (
              <div className="text-center py-4 text-emerald-500 font-bold border border-emerald-500/20 rounded-lg bg-emerald-500/5 uppercase text-xs">
                Missão Finalizada
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Evidência Fotográfica</h3>
              {plan.photo && (
                <button onClick={removePhoto} className="p-1 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
            
            {plan.photo ? (
              <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-video relative group">
                <img src={plan.photo} alt="Operação" className="w-full h-full object-cover" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black uppercase gap-2"
                >
                  <Camera size={16} /> Substituir
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="w-full aspect-video border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-all bg-slate-900/20"
              >
                {isCompressing ? (
                  <span className="text-[10px] animate-pulse">Compactando...</span>
                ) : (
                  <>
                    <Camera size={24} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Adicionar Foto</span>
                  </>
                )}
              </button>
            )}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload} 
            />
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 uppercase">Check-in de Viaturas</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {plan.vehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
                  <span className="font-bold text-slate-200 text-sm">{vehicle.name}</span>
                  <button 
                    disabled={isCompleted}
                    onClick={() => onVehicleToggle(plan.id, vehicle.id)}
                    className={`px-3 py-1.5 rounded text-[9px] font-black uppercase transition-all border
                      ${vehicle.arrived ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}
                      ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {vehicle.arrived ? 'Check-in OK' : 'Aguardando'}
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
