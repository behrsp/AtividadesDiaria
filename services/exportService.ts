
import * as XLSX from 'xlsx';
import { Activity } from '../types';

export const exportToExcel = (activities: Activity[]) => {
  const data = activities.map(a => ({
    'Atividade': a.title,
    'Setor': a.sector,
    'Usuário': a.user,
    'Data Inclusão': new Date(a.createdAt).toLocaleDateString('pt-BR'),
    'Início': new Date(a.startDate).toLocaleString('pt-BR'),
    'Fim': new Date(a.endDate).toLocaleString('pt-BR'),
    'Duração (Minutos)': a.durationInMinutes,
    'Duração Formatada': formatDuration(a.durationInMinutes),
    'Solução': a.solution,
    'Detalhes': a.details
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Atividades");
  
  // Create and download file
  XLSX.writeFile(workbook, `atividades_${new Date().getTime()}.xlsx`);
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
