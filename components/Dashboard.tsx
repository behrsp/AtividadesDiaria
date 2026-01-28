
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from '../types';
import { SECTORS } from '../constants';
import { LayoutDashboard, Clock, FileText, CheckCircle, Users } from 'lucide-react';

interface DashboardProps {
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ activities }) => {
  const sectorChartData = useMemo(() => {
    return SECTORS.map(sector => ({
      name: sector,
      count: activities.filter(a => a.sector === sector).length
    })).sort((a, b) => b.count - a.count);
  }, [activities]);

  const userChartData = useMemo(() => {
    const userCounts: Record<string, number> = {};
    activities.forEach(a => {
      userCounts[a.user] = (userCounts[a.user] || 0) + 1;
    });
    
    return Object.entries(userCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 users
  }, [activities]);

  const totalTime = useMemo(() => {
    return activities.reduce((acc, curr) => acc + curr.durationInMinutes, 0);
  }, [activities]);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const stats = [
    { label: 'Total Atividades', value: activities.length, icon: <FileText className="text-yellow-400" /> },
    { label: 'Tempo Total Gasto', value: formatDuration(totalTime), icon: <Clock className="text-yellow-400" /> },
    { label: 'Média por Atividade', value: activities.length ? formatDuration(Math.floor(totalTime / activities.length)) : '0h 0m', icon: <CheckCircle className="text-yellow-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1f1f1f] border border-[#333] p-6 rounded-xl flex items-center gap-4">
            <div className="bg-[#2a2a2a] p-3 rounded-lg border border-[#444]">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Chart */}
        <div className="bg-[#1f1f1f] border border-[#333] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <LayoutDashboard className="text-yellow-400" /> Atividades por Setor
          </h3>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorChartData} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#999" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#999" 
                  fontSize={10} 
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444', borderRadius: '8px' }}
                  itemStyle={{ color: '#FACC15' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {sectorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#FACC15' : '#333'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User (Responsible) Chart */}
        <div className="bg-[#1f1f1f] border border-[#333] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <Users className="text-yellow-400" /> Atividades por Responsável (Top 10)
          </h3>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userChartData} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#999" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#999" 
                  fontSize={10} 
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444', borderRadius: '8px' }}
                  itemStyle={{ color: '#FACC15' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {userChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#FACC15' : '#333'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
