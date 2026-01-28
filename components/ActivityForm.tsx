
import React, { useState, useEffect } from 'react';
import { Activity, Sector } from '../types';
import { SECTORS } from '../constants';
import { PlusCircle, Save, X } from 'lucide-react';

interface ActivityFormProps {
  onSave: (activity: Activity) => void;
  editingActivity?: Activity | null;
  onCancel: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSave, editingActivity, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    details: '',
    user: '',
    sector: 'Compras',
    createdAt: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    solution: ''
  });

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        ...editingActivity,
        createdAt: editingActivity.createdAt.split('T')[0],
        startDate: editingActivity.startDate.slice(0, 16),
        endDate: editingActivity.endDate.slice(0, 16)
      });
    }
  }, [editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.user) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const start = new Date(formData.startDate as string);
    const end = new Date(formData.endDate as string);
    
    if (end < start) {
      alert("A data de finalização não pode ser anterior à data de início.");
      return;
    }

    const durationInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));

    const activity: Activity = {
      id: editingActivity?.id || crypto.randomUUID(),
      title: formData.title as string,
      details: formData.details || '',
      user: formData.user as string,
      sector: formData.sector as Sector,
      createdAt: new Date(formData.createdAt as string).toISOString(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      solution: formData.solution || '',
      durationInMinutes
    };

    onSave(activity);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      user: '',
      sector: 'Compras',
      createdAt: new Date().toISOString().split('T')[0],
      startDate: '',
      endDate: '',
      solution: ''
    });
  };

  const inputClass = "w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";

  return (
    <div className="bg-[#1f1f1f] border border-[#333] p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-400">
        {editingActivity ? <Save size={24} /> : <PlusCircle size={24} />}
        {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Nome da Atividade *</label>
          <input 
            className={inputClass} 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="Ex: Manutenção Servidor"
          />
        </div>

        <div>
          <label className={labelClass}>Usuário *</label>
          <input 
            className={inputClass} 
            type="text" 
            value={formData.user} 
            onChange={e => setFormData({...formData, user: e.target.value})}
            placeholder="Nome do responsável"
          />
        </div>

        <div>
          <label className={labelClass}>Setor *</label>
          <select 
            className={inputClass}
            value={formData.sector}
            onChange={e => setFormData({...formData, sector: e.target.value as Sector})}
          >
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Data de Inclusão</label>
          <input 
            className={inputClass} 
            type="date" 
            value={formData.createdAt}
            onChange={e => setFormData({...formData, createdAt: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-1">
          {/* Espaçador */}
        </div>

        <div>
          <label className={labelClass}>Início (Data e Hora) *</label>
          <input 
            className={inputClass} 
            type="datetime-local" 
            value={formData.startDate}
            onChange={e => setFormData({...formData, startDate: e.target.value})}
          />
        </div>

        <div>
          <label className={labelClass}>Fim (Data e Hora) *</label>
          <input 
            className={inputClass} 
            type="datetime-local" 
            value={formData.endDate}
            onChange={e => setFormData({...formData, endDate: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Detalhes</label>
          <textarea 
            className={`${inputClass} h-24 resize-none`}
            value={formData.details}
            onChange={e => setFormData({...formData, details: e.target.value})}
            placeholder="Descrição adicional..."
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Solução</label>
          <textarea 
            className={`${inputClass} h-24 resize-none`}
            value={formData.solution}
            onChange={e => setFormData({...formData, solution: e.target.value})}
            placeholder="Como foi resolvido (Ações realizadas)..."
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-[#444] text-gray-400 hover:text-white hover:border-gray-400 rounded-md transition-all flex items-center gap-2"
          >
            <X size={18} /> Cancelar
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-all flex items-center gap-2 shadow-lg shadow-yellow-400/20"
          >
            <PlusCircle size={18} /> {editingActivity ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
