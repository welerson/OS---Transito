
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
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

const INITIAL_DATA: OperationPlan[] = [];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [plans, setPlans] = useState<OperationPlan[]>(() => {
    const saved = localStorage.getItem('gcmbh_plans');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // EFEITO 1: Ouvinte em Tempo Real (O segredo para ver tudo em todos os lugares)
  useEffect(() => {
    const plansRef = ref(db, 'plans');
    // Este código "escuta" o banco de dados. Se mudar no PC, o celular atualiza sozinho.
    const unsubscribe = onValue(plansRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.val();
        // Converte o objeto do Firebase em array se necessário e atualiza o estado
        const dataArray = Array.isArray(cloudData) ? cloudData : Object.values(cloudData);
        setPlans(dataArray as OperationPlan[]);
        localStorage.setItem('gcmbh_plans', JSON.stringify(dataArray));
      }
    });

    return () => unsubscribe();
  }, []);

  const selectedPlan = plans.find(p => p.id === selectedId);

  // Função auxiliar para salvar na nuvem e local simultaneamente
  const savePlans = async (newPlans: OperationPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('gcmbh_plans', JSON.stringify(newPlans));
    try {
      setIsSyncing(true);
      await set(ref(db, 'plans'), newPlans);
    } catch (error) {
      console.error("Erro ao sincronizar com nuvem:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreatePlan = (newPlan: Omit<OperationPlan, 'id' | 'status' | 'vehicles'>) => {
    const plan: OperationPlan = {
      ...newPlan,
      id: Date.now().toString(),
      status: OperationStatus.PLANNED,
      vehicles: Array.from({ length: newPlan.vehiclesCount }, (_, i) => ({ 
        id: `VT-${i + 1}`, 
        name: `VT-${i + 1}`, 
        arrived: false 
      }))
    };
    const updated = [plan, ...plans];
    savePlans(updated);
    setView('DASHBOARD');
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm('Deseja realmente excluir este registro de todos os dispositivos?')) {
      const updated = plans.filter(p => p.id !== id);
      savePlans(updated);
    }
  };

  const handleUpdatePlan = (updatedPlan: OperationPlan) => {
    const updated = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    savePlans(updated);
  };

  const updatePlanStatus = (id: string, status: OperationStatus) => {
    const updated = plans.map(p => {
      if (p.id === id) return { ...p, status };
      return p;
    });
    savePlans(updated);
  };

  const toggleVehicleArrival = (planId: string, vehicleId: string) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          vehicles: p.vehicles.map(v => v.id === vehicleId ? { ...v, arrived: !v.arrived } : v)
        };
      }
      return p;
    });
    savePlans(updated);
  };

  // Função de sincronização manual (ainda útil como "push" forçado se estiver offline)
  const manualSync = () => savePlans(plans);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <main className="flex-grow">
        {view === 'DASHBOARD' && (
          <Dashboard 
            plans={plans} 
            onNew={() => setView('CREATE')} 
            onSelect={(id) => { setSelectedId(id); setView('DETAILS'); }}
            onExport={manualSync} 
            onShowSummary={() => setView('SUMMARY_REPORT')}
            isSyncing={isSyncing}
            onCloudLoad={() => {}} // Não mais necessário carregar manual, pois é automático
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

      <footer className="py-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium no-print opacity-60">
        <p>Sistema de Gestão Operacional Integrado</p>
        <p className="mt-1">Departamento de Trânsito - GCMBH</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span>{isSyncing ? 'Sincronizando...' : 'Nuvem Conectada'}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
