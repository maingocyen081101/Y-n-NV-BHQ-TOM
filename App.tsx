
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  LayoutDashboard, 
  QrCode, 
  Settings, 
  Bell,
  Cpu,
  BrainCircuit,
  Upload,
  ChevronRight,
  AlertCircle,
  Wrench,
  Download,
  CheckCircle2,
  Package,
  Layers
} from 'lucide-react';
import { Machine, ComponentItem } from './types';
import { MOCK_MACHINES } from './constants';
import Dashboard from './components/Dashboard';
import QRCodeModal from './components/QRCodeModal';
import RepairForm from './components/RepairForm';
import DiagramView from './components/DiagramView';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'analysis' | 'diagrams'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [repairingItem, setRepairingItem] = useState<{ machineCode: string, item: ComponentItem } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const gemini = useMemo(() => new GeminiService(), []);

  const filteredMachines = machines.filter(m => 
    m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await gemini.analyzeRepairStrategy(machines);
      setAiAnalysis(result);
      setActiveTab('analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateComponent = (machineCode: string, updatedItem: ComponentItem) => {
    setMachines(prev => prev.map(m => {
      if (m.code === machineCode) {
        return {
          ...m,
          components: m.components.map(c => c.id === updatedItem.id ? updatedItem : c)
        };
      }
      return m;
    }));

    if (selectedMachine?.code === machineCode) {
      setSelectedMachine(prev => {
        if (!prev) return null;
        return {
          ...prev,
          components: prev.components.map(c => c.id === updatedItem.id ? updatedItem : c)
        };
      });
    }
  };

  const exportToExcel = () => {
    let csv = "\uFEFFSheet,Ma Thiet Bi,Loai,Hang,Linh Kien,Trang Thai,Sua Duoc,Chi Phi,Tinh Trang\n";
    machines.forEach(m => {
      m.components.forEach(c => {
        csv += `Sub_Sheet,${m.code},${m.type},${m.brand},${c.name},${c.status},${c.repairable ? 'YES' : 'NO'},${c.cost},"${c.condition}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "HQa_Production_Master_Report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">
              H
            </div>
            <div>
              <h1 className="text-white font-bold leading-none">HQa POM</h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Production Master</span>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              label="Bảng điều khiển" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={<Package size={18} />} 
              label="Kho Thiết bị" 
              active={activeTab === 'inventory'} 
              onClick={() => setActiveTab('inventory')} 
            />
            <SidebarItem 
              icon={<Layers size={18} />} 
              label="Sơ đồ Hệ thống" 
              active={activeTab === 'diagrams'} 
              onClick={() => setActiveTab('diagrams')} 
            />
            <SidebarItem 
              icon={<BrainCircuit size={18} />} 
              label="Phân tích AI" 
              active={activeTab === 'analysis'} 
              onClick={() => setActiveTab('analysis')} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800 space-y-4">
           <div className="bg-slate-800/50 p-4 rounded-xl">
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Trạng thái hệ thống</p>
             <div className="flex items-center gap-2 text-emerald-400 text-xs">
               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
               Đang kết nối Cloud
             </div>
           </div>
           <SidebarItem icon={<Settings size={18} />} label="Cài đặt" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm máy hoặc linh kiện..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-100"
            >
              <Download size={16} />
              <span>Xuất Excel</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Giám sát Sản xuất</h2>
                  <p className="text-slate-500 text-sm">Dữ liệu hợp nhất từ HQa_POM_Master_Production.xlsx</p>
                </div>
                <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl border-2 border-blue-100 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? "Đang xử lý..." : "Chạy AI Chẩn Đoán"}
                  <BrainCircuit size={18} />
                </button>
              </div>
              
              <Dashboard machines={machines} />
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="text-slate-400" size={18} />
                    <h3 className="font-bold text-slate-800">Dữ liệu Master Machine</h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white text-slate-400 text-[10px] uppercase tracking-widest border-b">
                      <tr>
                        <th className="px-6 py-4 font-bold">Mã Thiết Bị</th>
                        <th className="px-6 py-4 font-bold">Thông tin</th>
                        <th className="px-6 py-4 font-bold">Hãng</th>
                        <th className="px-6 py-4 font-bold text-center">QR Tracking</th>
                        <th className="px-6 py-4 font-bold">Linh kiện</th>
                        <th className="px-6 py-4 font-bold text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredMachines.map((m) => (
                        <tr 
                          key={m.code} 
                          className="hover:bg-slate-50 transition-colors cursor-pointer group" 
                          onClick={() => setSelectedMachine(m)}
                        >
                          <td className="px-6 py-5">
                            <span className="font-black text-slate-900">{m.code}</span>
                          </td>
                          <td className="px-6 py-5 text-slate-600 font-medium">{m.type}</td>
                          <td className="px-6 py-5">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold uppercase">{m.brand}</span>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex justify-center">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setShowQR(m.code); }}
                                 className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                               >
                                 <QrCode size={18} />
                               </button>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-1.5">
                              {m.components.slice(0, 2).map(c => (
                                <span key={c.id} className={`w-2 h-2 rounded-full ${c.repairable ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                              ))}
                              <span className="text-xs text-slate-500 font-bold ml-1">{m.components.length} items</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <ChevronRight className="text-slate-300 group-hover:text-slate-600 transition-colors inline" size={18} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
             <div className="space-y-6">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Linh kiện Sửa chữa</h2>
                   <p className="text-slate-500 text-sm">Phân loại linh kiện theo từng thiết bị</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {machines.map(m => (
                   <div key={m.code} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h4 className="font-black text-slate-900">{m.code}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.brand} • {m.type}</p>
                       </div>
                       <button onClick={() => setShowQR(m.code)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg">
                         <QrCode size={18} />
                       </button>
                     </div>
                     <div className="space-y-2 flex-1">
                       {m.components.map(c => (
                         <div 
                          key={c.id} 
                          onClick={() => setRepairingItem({ machineCode: m.code, item: c })}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer group"
                        >
                           <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.repairable ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                               {c.repairable ? <Wrench size={14} /> : <AlertCircle size={14} />}
                             </div>
                             <div>
                               <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{c.name}</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <p className={`text-[9px] font-bold uppercase ${c.status === 'Đã hoàn thành' ? 'text-emerald-500' : 'text-slate-400'}`}>{c.status}</p>
                             <p className="text-[11px] font-black text-slate-900">{(c.cost / 1000).toFixed(0)}k</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'diagrams' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sơ đồ Mô hình Diagrams</h2>
              <DiagramView />
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                   <BrainCircuit size={200} />
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                    <BrainCircuit size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">AI Production Insight</h2>
                    <p className="text-slate-500 text-sm">Phân tích chiến lược sửa chữa từ dữ liệu Excel</p>
                  </div>
                </div>
                
                {!aiAnalysis && !isAnalyzing && (
                  <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <button 
                      onClick={handleAIAnalysis}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center gap-2 mx-auto"
                    >
                      Bắt đầu phân tích <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="space-y-6 py-12 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-blue-600 animate-pulse">Hệ thống đang tổng hợp dữ liệu...</p>
                  </div>
                )}

                {aiAnalysis && (
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-inner">
                      {aiAnalysis}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Overlays (Modals & Drawers) */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
           <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-blue-600">
                       <Cpu size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedMachine.code}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedMachine.brand} • {selectedMachine.type}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMachine(null)} className="p-2.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                    <Plus className="rotate-45" size={24} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 <div>
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                     <Wrench size={16} className="text-blue-500" />
                     Bản kê linh kiện (Sub-Sheets)
                   </h3>
                   <div className="space-y-4">
                     {selectedMachine.components.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => setRepairingItem({ machineCode: selectedMachine.code, item: c })}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                        >
                           <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.name}</h4>
                              <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${c.repairable ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {c.repairable ? 'Có thể sửa' : 'Phế liệu'}
                              </div>
                           </div>
                           <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">"{c.condition}"</p>
                           <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái</span>
                                <span className="text-xs font-bold text-slate-700">{c.status}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Chi phí</span>
                                <p className="text-sm font-black text-blue-600">{c.cost.toLocaleString()} VNĐ</p>
                              </div>
                           </div>
                        </div>
                     ))}
                   </div>
                 </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t flex gap-3">
                 <button 
                  onClick={exportToExcel}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
                >
                    <Download size={18} /> Xuất Báo Cáo
                 </button>
                 <button 
                  onClick={() => setShowQR(selectedMachine.code)}
                  className="px-5 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all"
                >
                    <QrCode size={20} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {showQR && (
        <QRCodeModal 
          data={`https://hqa-pom.production/technician/${showQR}`} 
          title={showQR} 
          onClose={() => setShowQR(null)} 
          onOpenTechnician={() => {
            const machine = machines.find(m => m.code === showQR);
            if (machine) {
              setSelectedMachine(machine);
              setShowQR(null);
            }
          }}
        />
      )}

      {repairingItem && (
        <RepairForm 
          component={repairingItem.item}
          onClose={() => setRepairingItem(null)}
          onSave={(updated) => handleUpdateComponent(repairingItem.machineCode, updated)}
        />
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold group ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </button>
);

export default App;
