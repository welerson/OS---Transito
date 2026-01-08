
import React, { useState } from 'react';
import { OperationPlan } from '../types';
import { Shield, ChevronLeft, MapPin, Calendar, Clock, Users, Car, UserCheck } from 'lucide-react';

interface OperationFormProps {
  onSubmit: (plan: Omit<OperationPlan, 'id' | 'status' | 'vehicles'>) => void;
  onCancel: () => void;
}

const OperationForm: React.FC<OperationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    startTime: '',
    objective: '',
    scenario: '',
    uniform: 'Uniforme Operacional',
    radio: 'Rede Operacional (153)',
    equipment: 'HT, Colete Balístico, Espargidor',
    meetingPoint: '',
    agentsCount: 10,
    vehiclesCount: 2,
    deployedTeam: '',
    responsible: '',
    inspectorate: '',
    macroRegion: 'Macro 1'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Novo Plano de Emprego Operacional - GCMBH</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">Nome da Operação / Evento</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Operação Blitz"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Local de Emprego</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Data</label>
              <input 
                required
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Hora de Início</label>
              <input 
                required
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">Diretrizes da Missão</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Objetivo Geral da Missão</label>
            <textarea 
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              rows={3}
              placeholder="Descreva a finalidade principal do emprego..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <h3 className="text-md font-bold text-blue-400 mb-6 flex items-center gap-2"><Users size={18} /> Efetivo e Mobilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-900 p-4 rounded-lg border border-slate-800 text-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Agentes</label>
                <input type="number" name="agentsCount" value={formData.agentsCount} onChange={handleChange} className="bg-transparent text-3xl font-black text-center w-full" />
              </div>
              <div className="flex-1 bg-slate-900 p-4 rounded-lg border border-slate-800 text-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Viaturas</label>
                <input type="number" name="vehiclesCount" value={formData.vehiclesCount} onChange={handleChange} className="bg-transparent text-3xl font-black text-center w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                <UserCheck size={14} /> Equipe Empenhada (Nomes)
              </label>
              <textarea 
                name="deployedTeam" 
                value={formData.deployedTeam} 
                onChange={handleChange} 
                rows={3}
                placeholder="Ex: GCM Silva, GCM Santos..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-10 border-t border-slate-800">
          <button type="button" onClick={onCancel} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold">Cancelar</button>
          <button type="submit" className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-all">Salvar Plano Operacional</button>
        </div>
      </form>
    </div>
  );
};

export default OperationForm;
