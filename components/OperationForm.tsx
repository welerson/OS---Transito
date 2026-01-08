
import React, { useState } from 'react';
import { OperationPlan, OperationStatus } from '../types';
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6">
             <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-400">Nome da Operação / Evento</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Operação Lapa"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="w-full md:w-64 space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                  <Shield size={14} /> Senha de Acesso (Sigilo)
                </label>
                <input 
                  disabled
                  value="Auto-preenchida pela Macro"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-600 rounded-lg p-3 cursor-not-allowed"
                />
              </div>
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
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  required
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Hora de Início</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  required
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Guidelines */}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Descrição do Cenário</label>
            <textarea 
              name="scenario"
              value={formData.scenario}
              onChange={handleChange}
              rows={2}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Logistics and Tactics */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-slate-800 space-y-6">
            <h3 className="text-md font-bold text-blue-400">Logística e Tática</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Uniforme</label>
                <input name="uniform" value={formData.uniform} onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700 rounded p-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Rede de Rádio</label>
                <input name="radio" value={formData.radio} onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700 rounded p-2 text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Equipamentos/Armamento</label>
              <input name="equipment" value={formData.equipment} onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700 rounded p-2 text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Ponto de Reunião</label>
              <input name="meetingPoint" value={formData.meetingPoint} onChange={handleChange} placeholder="Local de encontro do efetivo" className="w-full bg-slate-800/40 border border-slate-700 rounded p-2 text-sm" />
            </div>
          </div>

          <div className="md:col-span-2 p-6 bg-slate-800/20 flex flex-col justify-center">
            <h3 className="text-md font-bold text-slate-400 mb-4 text-center">Efetivo Alocado</h3>
            <div className="flex gap-4 mb-4 justify-center">
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 flex flex-col items-center min-w-[100px]">
                <input 
                  type="number" 
                  name="agentsCount" 
                  value={formData.agentsCount} 
                  onChange={handleChange}
                  className="bg-transparent text-2xl font-bold text-white text-center w-full outline-none"
                />
                <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} /> Agentes
                </span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 flex flex-col items-center min-w-[100px]">
                <input 
                  type="number" 
                  name="vehiclesCount" 
                  value={formData.vehiclesCount} 
                  onChange={handleChange}
                  className="bg-transparent text-2xl font-bold text-white text-center w-full outline-none"
                />
                <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                  <Car size={12} /> Viaturas
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <UserCheck size={12} /> Equipe Empenhada (Nomes)
              </label>
              <textarea 
                name="deployedTeam" 
                value={formData.deployedTeam} 
                onChange={handleChange} 
                placeholder="Liste os agentes empenhados..."
                rows={3}
                className="w-full bg-slate-800/40 border border-slate-700 rounded p-2 text-xs outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Responsibility Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Responsável pela Ordem</label>
            <input name="responsible" value={formData.responsible} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Inspetoria</label>
            <input name="inspectorate" value={formData.inspectorate} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Macro Região</label>
            <select name="macroRegion" value={formData.macroRegion} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors appearance-none">
              <option value="Macro 1">Macro 1</option>
              <option value="Macro 2">Macro 2</option>
              <option value="Macro 3">Macro 3</option>
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 pt-10">
          <button 
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            Salvar Plano Operacional
          </button>
        </div>
      </form>
    </div>
  );
};

export default OperationForm;
