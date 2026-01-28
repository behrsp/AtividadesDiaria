
import React, { useState } from 'react';
import { Activity } from '../types';
import { Edit2, Trash2, Search, FileDown, Calendar, User } from 'lucide-react';
import { exportToExcel } from '../services/exportService';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sector.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade permanentemente?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-[#333] flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Listagem de Atividades
          <span className="bg-[#333] text-yellow-400 text-xs px-2 py-1 rounded-full">{activities.length}</span>
        </h2>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título, usuário ou setor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] pl-10 pr-4 py-2 rounded-md text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          <button 
            onClick={() => exportToExcel(activities)}
            className="bg-[#2a2a2a] border border-[#3a3a3a] p-2 rounded-md text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-2"
            title="Exportar para Excel"
          >
            <FileDown size={20} />
            <span className="hidden md:inline">Exportar</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Atividade</th>
              <th className="px-6 py-4 font-medium">Setor</th>
              <th className="px-6 py-4 font-medium">Responsável</th>
              <th className="px-6 py-4 font-medium">Início / Fim</th>
              <th className="px-6 py-4 font-medium">Duração</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {filteredActivities.length > 0 ? filteredActivities.map(activity => (
              <tr key={activity.id} className="hover:bg-[#252525] transition-colors group">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-500 text-xs line-clamp-1">{activity.details || 'Sem detalhes'}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded border border-yellow-400/20">
                    {activity.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-500" />
                    {activity.user}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(activity.startDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-600 rounded-full" /> {new Date(activity.endDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-yellow-400 text-sm">
                  {formatDuration(activity.durationInMinutes)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(activity)}
                      className="p-2 hover:bg-yellow-400/10 text-gray-400 hover:text-yellow-400 rounded-lg transition-all"
                      title="Editar Atividade"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                      title="Excluir Atividade"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nenhuma atividade encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityList;
