
export enum OperationStatus {
  PLANNED = 'Planejado',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluído'
}

export interface Vehicle {
  id: string;
  name: string;
  arrived: boolean;
}

export interface OperationPlan {
  id: string;
  name: string;
  inspectorate: string;
  macroRegion: string;
  location: string;
  date: string;
  startTime: string;
  objective: string;
  scenario: string;
  uniform: string;
  radio: string;
  equipment: string;
  meetingPoint: string;
  agentsCount: number;
  vehiclesCount: number;
  status: OperationStatus;
  responsible: string;
  vehicles: Vehicle[];
}

export type ViewState = 'DASHBOARD' | 'CREATE' | 'DETAILS' | 'OFFICIAL_DOC' | 'SUMMARY_REPORT';
