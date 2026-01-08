
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { OperationPlan, ViewState, OperationStatus } from './types';
import Dashboard from './components/Dashboard';
import OperationForm from './components/OperationForm';
import OperationDetails from './components/OperationDetails';
import OfficialDocument from './components/OfficialDocument';
import SummaryReport from './components/SummaryReport';

// Configuração fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyC1HxDakANcWO8_D50osS29SwxG0kVsmoY",
  authDomain: "os-transito.firebaseapp.com",
  projectId: "os-transito",
  storageBucket: "os-transito.firebasestorage.app",
  messagingSenderId: "620327303820",
  appId: "1:620327303820:web:554653b622cbdfc56299a9",
  measurementId: "G-1EWNEF9Q1S"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const INITIAL_DATA: OperationPlan[] = [
  {
    id: '1',
    name: 'Exemplo de Operação',
    inspectorate: 'Inspetoria Exemplo',
    macroRegion: 'Macro 1',
    location: 'Belo Horizonte, MG',
    date: '2024-12-31',
    startTime: '10:00',
    objective: 'Demonstração do sistema.',
    scenario: 'Normal.',
    uniform: 'Operacional',
    radio: 'Rede 1',
    equipment: 'HT',
    meetingPoint: 'Base',
    agentsCount: 5,
    vehiclesCount: 2,
    deployedTeam: 'Agentes Exemplo',
    status: OperationStatus.PLANNED,
    responsible: 'Inspetor Exemplo',
    vehicles: [{ id: 'VT-1', name: 'VT-1', arrived: false }, { id: 'VT-2', name: 'VT-2', arrived: false }]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [plans, setPlans] = useState<OperationPlan[]>(() => {
    const saved = localStorage.getItem('gcmbh_plans');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem('gcmbh_plans', JSON.stringify(plans));
  }, [plans]);

  const selectedPlan = plans.find(p => p.id === selectedId);

  // Função para enviar ao Banco de Dados (Firebase)
  const syncWithFirebase = async () => {
    setIsSyncing(true);
    try {
      await set(ref(db, 'plans'), plans);
      alert('Dados sincronizados com sucesso na Nuvem Firebase!');
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert('Falha ao enviar para o banco de dados. Verifique as regras do Firebase.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Função para carregar do Banco de Dados
  const loadFromFirebase = async () => {
    setIsSyncing(true);
    try {
      const snapshot = await get(ref(db, 'plans'));
      if (snapshot.exists()) {
        const cloudData = snapshot.val();
        setPlans(cloudData);
        alert('Dados baixados da Nuvem com sucesso!');
      } else {
        alert('Nenhum dado encontrado na nuvem.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados da nuvem.');
    } finally {
      setIsSyncing(false);
    }
  };

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

  const handleDeletePlan = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta missão concluída? Esta ação não pode ser desfeita localmente.')) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdatePlan = (updatedPlan: OperationPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const updatePlanStatus = (id: string, status: OperationStatus) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    }));
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <main className="flex-grow">
        {view === 'DASHBOARD' && (
          <Dashboard 
            plans={plans} 
            onNew={() => setView('CREATE')} 
            onSelect={(id) => { setSelectedId(id); setView('DETAILS'); }}
            onExport={syncWithFirebase} 
            onShowSummary={() => setView('SUMMARY_REPORT')}
            isSyncing={isSyncing}
            onCloudLoad={loadFromFirebase}
            onDelete={handleDeletePlan}
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
            onUpdatePlan={handleUpdatePlan}
          />
        )}

        {view === 'OFFICIAL_DOC' && selectedPlan && (
          <OfficialDocument 
            plan={selectedPlan} 
            onBack={() => setView('DETAILS')} 
          />
        )}

        {view === 'SUMMARY_REPORT' && (
          <SummaryReport 
            plans={plans} 
            onBack={() => setView('DASHBOARD')} 
          />
        )}
      </main>

      {/* Rodapé Discreto */}
      <footer className="py-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium no-print opacity-60">
        <p>Sistema Desenvolvido por GCMIII Welerson Faria</p>
        <p className="mt-1">Departamento de Trânsito - GCMBH</p>
        <p className="mt-1">2026</p>
      </footer>
    </div>
  );
};

export default App;
