
import React from 'react';
import { Database, FileSpreadsheet, QrCode, Wrench, BrainCircuit, Download, ArrowRight, ArrowDown, Layers, Cpu, ClipboardCheck } from 'lucide-react';

const DiagramView: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Section 1: Data Structure Diagram */}
      <section>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-blue-600" size={24} />
            Cấu trúc Dữ liệu Excel (Schema)
          </h3>
          <p className="text-slate-500 text-sm">Mô hình phân cấp từ Master Sheet đến các linh kiện chi tiết.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Master Sheet */}
          <div className="w-64 p-5 bg-blue-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4 border-b border-blue-400 pb-2">
              <FileSpreadsheet size={20} />
              <span className="font-bold text-sm">Sheet 1: MASTER</span>
            </div>
            <ul className="text-xs space-y-2 opacity-90">
              <li className="flex justify-between"><span>MÃ MÁY (PK)</span> <span className="font-mono">ID</span></li>
              <li className="flex justify-between"><span>LOẠI MÁY</span></li>
              <li className="flex justify-between"><span>HÃNG SX</span></li>
              <li className="flex justify-between"><span>QR_TOKEN</span></li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <ArrowRight className="hidden md:block text-slate-300" size={32} />
            <ArrowDown className="md:hidden text-slate-300" size={32} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Liên kết QR</span>
          </div>

          {/* Sub Sheets Group */}
          <div className="relative">
            {/* Decoration Stack */}
            <div className="absolute inset-0 bg-slate-100 rounded-xl translate-x-3 translate-y-3 -z-10 border border-slate-200"></div>
            <div className="absolute inset-0 bg-slate-50 rounded-xl translate-x-1.5 translate-y-1.5 -z-10 border border-slate-200"></div>
            
            <div className="w-64 p-5 bg-white border-2 border-emerald-500 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 text-emerald-600">
                <Database size={20} />
                <span className="font-bold text-sm">Sheets: LINH KIỆN</span>
              </div>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex justify-between font-bold text-blue-600"><span>MÃ MÁY (FK)</span></li>
                <li className="flex justify-between"><span>Tên linh kiện</span></li>
                <li className="flex justify-between"><span>Tình trạng sửa</span></li>
                <li className="flex justify-between"><span>Phế liệu (Yes/No)</span></li>
                <li className="flex justify-between font-bold text-emerald-600"><span>Chi phí phục dựng</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Process Workflow */}
      <section>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" size={24} />
            Luồng Xử lý Nghiệp vụ (Workflow)
          </h3>
          <p className="text-slate-500 text-sm">Quy trình từ lúc nhập file đến khi xuất báo cáo cuối cùng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <WorkflowStep 
            icon={<FileSpreadsheet className="text-blue-500" />} 
            title="Import Excel" 
            desc="Tải file HQa_POM_Master.xlsx lên hệ thống."
          />
          <WorkflowArrow />
          <WorkflowStep 
            icon={<QrCode className="text-purple-500" />} 
            title="QR Code Gen" 
            desc="Tự động tạo mã QR định danh cho từng loại máy."
          />
          <WorkflowArrow />
          <WorkflowStep 
            icon={<Wrench className="text-amber-500" />} 
            title="Technician" 
            desc="Kỹ thuật quét QR, điền thông tin sửa chữa/phế liệu."
          />
          <WorkflowArrow />
          <WorkflowStep 
            icon={<BrainCircuit className="text-indigo-500" />} 
            title="AI Analysis" 
            desc="Gemini phân tích chi phí và hiệu quả phục dựng."
          />
          <WorkflowArrow />
          <WorkflowStep 
            icon={<Download className="text-emerald-500" />} 
            title="Export Data" 
            desc="Xuất ngược lại file Excel đã cập nhật thông tin."
          />
        </div>
      </section>

      {/* Logic Summary */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Cpu className="text-blue-400" size={32} />
          <h4 className="text-lg font-bold">Thuật toán Phân loại (Logic Gate)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-emerald-400 font-bold mb-2">IF Sửa chữa được</div>
            <p className="text-sm text-slate-400">Trạng thái = REPAIRABLE. Tính toán chi phí linh kiện + công thợ.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-red-400 font-bold mb-2">IF Thành phế liệu</div>
            <p className="text-sm text-slate-400">Trạng thái = SCRAP. Ghi nhận khối lượng/giá trị thanh lý phế liệu.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-blue-400 font-bold mb-2">OUTPUT QR</div>
            <p className="text-sm text-slate-400">Lưu trữ toàn bộ lịch sử thay đổi linh kiện vào database theo Mã QR.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowStep = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
      {icon}
    </div>
    <h5 className="font-bold text-sm text-slate-800 mb-1">{title}</h5>
    <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
  </div>
);

const WorkflowArrow = () => (
  <div className="flex items-center justify-center py-2 md:py-0">
    <ArrowRight className="hidden md:block text-slate-300" size={20} />
    <ArrowDown className="md:hidden text-slate-300" size={20} />
  </div>
);

export default DiagramView;
