
import React from 'react';
import { OperationPlan } from '../types';
import { ChevronLeft, Printer } from 'lucide-react';

interface OfficialDocumentProps {
  plan: OperationPlan;
  onBack: () => void;
}

const OfficialDocument: React.FC<OfficialDocumentProps> = ({ plan, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleString('pt-BR');

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* UI Controls */}
      <div className="max-w-[21cm] mx-auto flex justify-between items-center mb-8 no-print">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
        >
          <ChevronLeft size={18} />
          Voltar para Edição
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg"
        >
          <Printer size={18} />
          Imprimir / PDF
        </button>
      </div>

      {/* Document Content */}
      <div className="max-w-[21cm] mx-auto bg-white text-black p-[2cm] shadow-2xl min-h-[29.7cm] print:shadow-none print:p-[1cm] flex flex-col">
        <header className="text-center mb-8">
          <h1 className="text-lg font-bold leading-tight uppercase">Prefeitura Municipal de Belo Horizonte</h1>
          <h2 className="text-md font-bold leading-tight uppercase">Secretaria Municipal de Segurança e Prevenção</h2>
          <h3 className="text-md font-bold leading-tight uppercase">Guarda Civil Municipal de Belo Horizonte</h3>
          <div className="h-px bg-black my-4"></div>
          <p className="font-bold text-sm">PLANO DE EMPREGO OPERACIONAL Nº {plan.date.split('-')[0]}/{plan.id.slice(-2)}</p>
        </header>

        <section className="mb-6">
          <h4 className="font-bold border-b border-black mb-3 py-1 text-sm uppercase">I - IDENTIFICAÇÃO DA OPERAÇÃO</h4>
          <div className="grid grid-cols-2 gap-y-2 text-[12px]">
            <div><span className="font-bold">Evento/Operação:</span> {plan.name}</div>
            <div><span className="font-bold">Macro Região:</span> {plan.macroRegion}</div>
            <div><span className="font-bold">Local:</span> {plan.location}</div>
            <div><span className="font-bold">Data:</span> {plan.date}</div>
            <div><span className="font-bold">Hora de Início:</span> {plan.startTime}h</div>
            <div><span className="font-bold">Inspetoria Responsável:</span> {plan.inspectorate}</div>
          </div>
        </section>

        <section className="mb-6">
          <h4 className="font-bold border-b border-black mb-3 py-1 text-sm uppercase">II - MISSÃO E OBJETIVO</h4>
          <p className="text-[12px] leading-relaxed text-justify">
            {plan.objective || "Assegurar a incolumidade das pessoas e do patrimônio público durante a realização do evento supracitado, garantindo o livre exercício das liberdades individuais através do policiamento preventivo e comunitário."}
          </p>
        </section>

        <section className="mb-6">
          <h4 className="font-bold border-b border-black mb-3 py-1 text-sm uppercase">III - RECURSOS EMPREGADOS</h4>
          <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3 rounded text-[12px]">
            <div>
              <div className="mb-1"><span className="font-bold">Efetivo Total:</span> {plan.agentsCount} Agentes</div>
              <div><span className="font-bold">Viaturas:</span> {plan.vehiclesCount} Unidades</div>
            </div>
            <div>
              <div className="mb-1"><span className="font-bold">Uniforme:</span> {plan.uniform}</div>
              <div><span className="font-bold">Ponto de Reunião:</span> {plan.meetingPoint || plan.location}</div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h4 className="font-bold border-b border-black mb-3 py-1 text-sm uppercase">IV - LOGÍSTICA E COMUNICAÇÕES</h4>
          <div className="grid grid-cols-2 gap-y-2 text-[12px]">
            <div><span className="font-bold">Canal Rádio:</span> {plan.radio}</div>
            <div><span className="font-bold">Equipamentos:</span> {plan.equipment}</div>
          </div>
        </section>

        <section className="mb-8">
          <h4 className="font-bold border-b border-black mb-3 py-1 text-sm uppercase">V - EQUIPE EMPENHADA (EFETIVO NOMINAL)</h4>
          <div className="border border-slate-200 p-3 rounded text-[11px] min-h-[100px] whitespace-pre-wrap leading-tight">
            {plan.deployedTeam || "Não há listagem nominal cadastrada para este empenho."}
          </div>
        </section>

        <footer className="mt-auto text-center">
          <div className="w-64 mx-auto border-t border-black pt-2 mb-1">
            <p className="text-[11px] font-bold uppercase">{plan.responsible || "Comandante da Operação"}</p>
            <p className="text-[10px] uppercase">Responsável pela Ordem</p>
          </div>
          
          <div className="mt-10 text-[9px] text-slate-500 italic text-left flex justify-between items-end border-t border-slate-100 pt-3">
            <div>
              Gerado eletronicamente em {today}.<br />
              Este documento é de uso interno da GCMBH. As informações contidas podem ser sigilosas.
            </div>
            <div className="text-right">
              Página 1 de 1
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OfficialDocument;
