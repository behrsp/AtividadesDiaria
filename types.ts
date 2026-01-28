
export type Sector = 
  | 'Compras' 
  | 'Fiscal' 
  | 'Portaria' 
  | 'Central Notas' 
  | 'Financeiro' 
  | 'Contabilidade' 
  | 'PCP' 
  | 'TMS' 
  | 'Estoque' 
  | 'Comercial';

export interface Activity {
  id: string;
  title: string;
  details: string;
  user: string;
  sector: Sector;
  createdAt: string; // ISO String
  startDate: string; // ISO String (DateTime)
  endDate: string;   // ISO String (DateTime)
  solution: string;
  durationInMinutes: number;
}

export interface DashboardData {
  sector: string;
  count: number;
}
