
import React, { useState, useEffect } from 'react';
import { OperationPlan, ViewState, OperationStatus, Vehicle } from './types';
import Dashboard from './components/Dashboard';
import OperationForm from './components/OperationForm';
import OperationDetails from './components/OperationDetails';
import OfficialDocument from './components/OfficialDocument';

const INITIAL_DATA: OperationPlan[] = [
  {
    id: '1',
    name: 'Final do Campeonato Mineiro',
    inspectorate: 'Inspetoria de Operações Especiais (IOPE)',
    macroRegion: 'Macro 3',
    location: 'Estádio Mineirão, Belo Horizonte',
    date: '2024-07-28',
    startTime: '16:00',
    objective: 'Assegurar a ordem pública no entorno do estádio.',
    scenario: 'Grande fluxo de torcedores e trânsito intenso.',
    uniform: 'Uniforme Operacional',
    radio: 'Rede Operacional (153)',
    equipment: 'HT, Colete Balístico, Espargidor',
    meetingPoint: 'Entrada Sul do Mineirão',
    agentsCount: 150,
    vehiclesCount: 15,
    status: OperationStatus.PLANNED,
    responsible: 'Inspetor Chefe Silva',
    vehicles: Array.from({ length: 15 }, (_, i) => ({ id: `VT-${i + 1}`, name: `VT-${i + 1}`, arrived: false }))
  },
  {
    id: '2',
    name: 'Show da Banda Skank - Turnê Final',
    inspectorate: 'Inspetoria Regional Centro-Sul',
    macroRegion: 'Macro 1',
    location: 'Esplanada do Mineirão, Belo Horizonte',
    date: '2024-08-15',
    startTime: '20:00',
    objective: 'Garantir a segurança dos participantes do evento.',
    scenario: 'Local aberto com capacidade para 50 mil pessoas.',
    uniform: 'Uniforme Operacional',
    radio: 'Rede Operacional (153)',
    equipment: 'HT, Colete Balístico',
    meetingPoint: 'Esplanada Principal',
    agentsCount: 120,
    vehiclesCount: 10,
    status: OperationStatus.PLANNED,
    responsible: 'Subinspetor Lima',
    vehicles: Array.from({ length: 10 }, (_, i) => ({ id: `VT-${i + 1}`, name: `VT-${i + 1}`, arrived: false }))
  },
  {
    id: '3',
    name: 'Feira de Artesanato da Afonso Pena',
    inspectorate: 'Inspetoria Regional Leste',
    macroRegion: 'Macro 2',
    location: 'Avenida Afonso Pena, Belo Horizonte',
    date: 'Todo Domingo',
    startTime: '08:00',
    objective: 'Assegurar a incolumidade das pessoas e do patrimônio público.',
    scenario: 'Evento tradicional com grande circulação de turistas.',
    uniform: 'Uniforme Operacional',
    radio: 'Rede Principal',
    equipment: 'Padrão GCMBH',
    meetingPoint: 'Avenida Afonso Pena',
    agentsCount: 80,
    vehiclesCount: 8,
    status: OperationStatus.IN_PROGRESS,
    responsible: 'Subinspetor Lima',
    vehicles: Array.from({ length: 8 }, (_, i) => ({ id: `VT-${i + 1}`, name: `VT-${i + 1}`, arrived: i < 3 }))
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [plans, setPlans] = useState<OperationPlan[]>(() => {
    const saved = localStorage.getItem('gcmbh_plans');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gcmbh_plans', JSON.stringify(plans));
  }, [plans]);

  const selectedPlan = plans.find(p => p.id === selectedId);

  const handleCreatePlan = (newPlan: Omit<OperationPlan, 'id' | 'status' | 'vehicles'>) => {
    const plan: OperationPlan = {
      ...newPlan,
      id: Date.now().toString(),
      status: OperationStatus.PLANNED,
      vehicles: Array.from({ length: newPlan.vehiclesCount }, (_, i) => ({ id: `VT-${i + 1}`, name: `VT-${i + 1}`, arrived: false }))
    };
    setPlans(prev => [plan, ...prev]);
    setView('DASHBOARD');
  };

  const updatePlanStatus = (id: string, status: OperationStatus) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const toggleVehicleArrival = (planId: string, vehicleId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          vehicles: p.vehicles.map(v => v.id === vehicleId ? { ...v, arrived: !v.arrived } : v)
        };
      }
      return p;
    }));
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plans));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "gcmbh_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen">
      {view === 'DASHBOARD' && (
        <Dashboard 
          plans={plans} 
          onNew={() => setView('CREATE')} 
          onSelect={(id) => { setSelectedId(id); setView('DETAILS'); }}
          onExport={exportBackup}
        />
      )}

      {view === 'CREATE' && (
        <OperationForm 
          onSubmit={handleCreatePlan} 
          onCancel={() => setView('DASHBOARD')} 
        />
      )}

      {view === 'DETAILS' && selectedPlan && (
        <OperationDetails 
          plan={selectedPlan} 
          onBack={() => setView('DASHBOARD')}
          onStatusChange={updatePlanStatus}
          onVehicleToggle={toggleVehicleArrival}
          onViewOfficial={() => setView('OFFICIAL_DOC')}
        />
      )}

      {view === 'OFFICIAL_DOC' && selectedPlan && (
        <OfficialDocument 
          plan={selectedPlan} 
          onBack={() => setView('DETAILS')} 
        />
      )}
    </div>
  );
};

export default App;
