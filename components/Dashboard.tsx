
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Machine, ProductionSummary } from '../types';
import { TrendingUp, PenTool, Trash2, DollarSign } from 'lucide-react';

interface DashboardProps {
  machines: Machine[];
}

const Dashboard: React.FC<DashboardProps> = ({ machines }) => {
  const summary: ProductionSummary = React.useMemo(() => {
    let totalCost = 0;
    let scrap = 0;
    let repairable = 0;
    let totalComp = 0;

    machines.forEach(m => {
      m.components.forEach(c => {
        totalComp++;
        totalCost += c.cost;
        if (c.status.toLowerCase().includes('phế liệu') || !c.repairable) {
          scrap++;
        } else {
          repairable++;
        }
      });
    });

    return {
      totalMachines: machines.length,
      totalRepairCost: totalCost,
      scrapCount: scrap,
      repairableRatio: totalComp > 0 ? (repairable / totalComp) * 100 : 0
    };
  }, [machines]);

  const chartData = machines.map(m => ({
    name: m.code,
    cost: m.components.reduce((acc, curr) => acc + curr.cost, 0),
    count: m.components.length
  }));

  const pieData = [
    { name: 'Sửa được', value: summary.repairableRatio },
    { name: 'Phế liệu', value: 100 - summary.repairableRatio }
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<PenTool className="text-blue-600" />} 
          label="Tổng Máy" 
          value={summary.totalMachines} 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<DollarSign className="text-emerald-600" />} 
          label="Tổng Chi Phí" 
          value={`${(summary.totalRepairCost / 1000000).toFixed(1)}M VNĐ`} 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<Trash2 className="text-red-600" />} 
          label="Lượng Phế Liệu" 
          value={summary.scrapCount} 
          color="bg-red-50" 
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-600" />} 
          label="Tỷ Lệ Phục Hồi" 
          value={`${summary.repairableRatio.toFixed(0)}%`} 
          color="bg-purple-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Chi Phí Sửa Chữa Theo Mã Máy</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} VNĐ`, 'Chi phí']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Tình Trạng Linh Kiện</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-sm text-slate-600">{d.name}: {d.value.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
