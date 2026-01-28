
import React, { useState, useEffect, useCallback } from 'react';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import Dashboard from './components/Dashboard';
import { Activity } from './types';
import { storageService } from './services/storageService';
import { ClipboardList, Briefcase, BarChart3, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [view, setView] = useState<'list' | 'dashboard'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const loadedActivities = storageService.getActivities();
    setActivities(loadedActivities);
  }, []);

  const handleSaveActivity = useCallback((activity: Activity) => {
    if (editingActivity) {
      storageService.updateActivity(activity);
    } else {
      storageService.addActivity(activity);
    }
    
    // Refresh list and reset UI
    setActivities(storageService.getActivities());
    setIsFormOpen(false);
    setEditingActivity(null);
  }, [editingActivity]);

  const handleDeleteActivity = useCallback((id: string) => {
    storageService.deleteActivity(id);
    // Atualiza o estado imediatamente para refletir a remoção na UI
    const updatedActivities = storageService.getActivities();
    setActivities(updatedActivities);
  }, []);

  const handleEditActivity = useCallback((activity: Activity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  }, []);

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingActivity(null);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-[#333] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Briefcase className="text-black" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Atividades<span className="text-yellow-400">Diária</span>
            </h1>
          </div>

          <nav className="flex gap-2">
            <button 
              onClick={() => { setView('list'); setIsFormOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'list' ? 'bg-[#222] text-yellow-400 border border-yellow-400/30' : 'text-gray-400 hover:text-white'}`}
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">Listagem</span>
            </button>
            <button 
              onClick={() => { setView('dashboard'); setIsFormOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'dashboard' ? 'bg-[#222] text-yellow-400 border border-yellow-400/30' : 'text-gray-400 hover:text-white'}`}
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-24">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {view === 'list' ? (isFormOpen ? 'Cadastro de Atividade' : 'Atividades Recentes') : 'Dashboard de Operações'}
            </h2>
            <p className="text-gray-500 text-sm">Gerencie e analise as tarefas do dia a dia.</p>
          </div>
          
          {view === 'list' && !isFormOpen && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition-all flex items-center gap-2 shadow-xl shadow-yellow-400/10 active:scale-95"
            >
              <Plus size={20} />
              Nova Atividade
            </button>
          )}
        </div>

        {isFormOpen ? (
          <div className="max-w-4xl mx-auto">
            <ActivityForm 
              onSave={handleSaveActivity} 
              editingActivity={editingActivity} 
              onCancel={handleCancel} 
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {view === 'list' ? (
              <ActivityList 
                activities={activities} 
                onEdit={handleEditActivity} 
                onDelete={handleDeleteActivity} 
              />
            ) : (
              <Dashboard activities={activities} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-[#333] py-8 text-center text-gray-600 text-xs">
        <p>© 2024 Atividades Diária. Todos os direitos reservados.</p>
        <p className="mt-2 text-gray-700">Sistema de Gestão Interna de Atividades v1.0.1</p>
      </footer>
    </div>
  );
};

export default App;
