
import React from 'react';
import { OperationPlan, OperationStatus } from '../types';
import { ChevronLeft, Printer } from 'lucide-react';

interface SummaryReportProps {
  plans: OperationPlan[];
  onBack: () => void;
}

const SummaryReport: React.FC<SummaryReportProps> = ({ plans, onBack }) => {
  const stats = {
    total: plans.length,
    planned: plans.filter(p => p.status === OperationStatus.PLANNED).length,
    inProgress: plans.filter(p => p.status === OperationStatus.IN_PROGRESS).length,
    completed: plans.filter(p => p.status === OperationStatus.COMPLETED).length,
    // Garantindo conversão para número para evitar concatenação de strings
    totalAgents: plans.reduce((acc, p) => acc + Number(p.agentsCount || 0), 0),
    totalVehicles: plans.reduce((acc, p) => acc + Number(p.vehiclesCount || 0), 0)
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 no-print">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-slate-700"
        >
          <ChevronLeft size={18} />
          Voltar ao Dashboard
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg"
        >
          <Printer size={18} />
          Imprimir Relatório Geral
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white text-slate-900 p-10 rounded-xl shadow-2xl print:shadow-none print:p-0">
        <header className="text-center border-b-2 border-slate-900 pb-8 mb-8">
          <h1 className="text-2xl font-black uppercase">Relatório de Atividades Operacionais</h1>
          <h2 className="text-lg font-bold text-slate-600 uppercase">Guarda Civil Municipal de Belo Horizonte</h2>
          <p className="text-sm mt-2 font-mono">Gerado em: {new Date().toLocaleString('pt-BR')}</p>
        </header>

        {/* Resumo Estatístico */}
        <section className="mb-12">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 border-b pb-1">Resumo Estatístico</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-slate-900">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Total de Eventos</span>
              <span className="text-3xl font-black">{stats.total}</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <span className="block text-[10px] font-bold text-emerald-600 uppercase">Em Andamento</span>
              <span className="text-3xl font-black text-emerald-700">{stats.inProgress}</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <span className="block text-[10px] font-bold text-blue-600 uppercase">Planejados</span>
              <span className="text-3xl font-black text-blue-700">{stats.planned}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <span className="block text-[10px] font-bold text-red-600 uppercase">Concluídos</span>
              <span className="text-3xl font-black text-red-700">{stats.completed}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center">
              <span className="text-xs font-bold uppercase">Recursos Humanos (Total)</span>
              <span className="text-2xl font-black">{stats.totalAgents} Agentes</span>
            </div>
            <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center">
              <span className="text-xs font-bold uppercase">Mobilidade (Total)</span>
              <span className="text-2xl font-black">{stats.totalVehicles} Viaturas</span>
            </div>
          </div>
        </section>

        {/* Tabela de Eventos */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 border-b pb-1">Listagem de Empenhos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-900">
                  <th className="p-2 font-black uppercase">Evento / Equipe</th>
                  <th className="p-2 font-black uppercase">Local</th>
                  <th className="p-2 font-black uppercase">Data/Hora</th>
                  <th className="p-2 font-black uppercase">Status</th>
                  <th className="p-2 font-black uppercase text-center">Recursos</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="p-2">
                      <div className="font-bold uppercase text-[12px]">{plan.name}</div>
                      <div className="text-[10px] text-slate-500 italic truncate max-w-[200px]">Equipe: {plan.deployedTeam || 'N/A'}</div>
                    </td>
                    <td className="p-2 text-slate-600">{plan.location}</td>
                    <td className="p-2 font-mono">{plan.date} {plan.startTime}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border
                        ${plan.status === OperationStatus.IN_PROGRESS ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 
                          plan.status === OperationStatus.COMPLETED ? 'bg-red-100 border-red-500 text-red-700' : 
                          'bg-slate-100 border-slate-500 text-slate-700'}
                      `}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span className="font-bold">{plan.agentsCount}A</span> / <span className="text-slate-500">{plan.vehiclesCount}V</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em]">
          Controle Interno GCMBH - Belo Horizonte, MG
        </footer>
      </div>
    </div>
  );
};

export default SummaryReport;
