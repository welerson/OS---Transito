
import React, { useState, useRef } from 'react';
import { OperationPlan } from '../types';
import { Shield, ChevronLeft, MapPin, Calendar, Clock, Users, Car, UserCheck, Camera, X } from 'lucide-react';

interface OperationFormProps {
  onSubmit: (plan: Omit<OperationPlan, 'id' | 'status' | 'vehicles'>) => void;
  onCancel: () => void;
}

const OperationForm: React.FC<OperationFormProps> = ({ onSubmit, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    macroRegion: 'Macro 1',
    photo: ''
  });

  const [isCompressing, setIsCompressing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converte para JPEG com compressão para ocupar pouco espaço (aprox 30-50kb)
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, photo: compressed }));
      setIsCompressing(false);
    }
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
                  <Camera size={14} /> Foto do Local/Evento (Opcional)
                </label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-lg p-2 text-xs transition-colors hover:bg-slate-800 ${formData.photo ? 'border-blue-500 text-blue-400' : 'text-slate-500'}`}
                  >
                    {isCompressing ? 'Compactando...' : formData.photo ? 'Alterar Foto' : 'Selecionar Foto'}
                  </button>
                  {formData.photo && (
                    <button 
                      type="button" 
                      onClick={() => setFormData(p => ({ ...p, photo: '' }))}
                      className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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

        {formData.photo && (
          <div className="rounded-xl overflow-hidden border border-slate-700 h-48 w-full md:w-80 bg-slate-900 flex items-center justify-center">
            <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}

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
        </div>

        {/* Efetivo e Equipe Section */}
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

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 pt-10 border-t border-slate-800">
          <button type="button" onClick={onCancel} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold">Cancelar</button>
          <button type="submit" className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-all">Salvar Plano Operacional</button>
        </div>
      </form>
    </div>
  );
};

export default OperationForm;
