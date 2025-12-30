
import React, { useState } from 'react';
import { X, Check, AlertTriangle, Hammer, Trash2 } from 'lucide-react';
import { ComponentItem, RepairStatus } from '../types';

interface RepairFormProps {
  component: ComponentItem;
  onSave: (updated: ComponentItem) => void;
  onClose: () => void;
}

const RepairForm: React.FC<RepairFormProps> = ({ component, onSave, onClose }) => {
  const [formData, setFormData] = useState<ComponentItem>({ ...component });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <Hammer size={20} />
            <h3 className="font-bold">Cập nhật Kỹ thuật: {component.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tình trạng thực tế</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              placeholder="Mô tả chi tiết hư hỏng hoặc công việc đã thực hiện..."
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Khả năng phục hồi</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                value={formData.repairable ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, repairable: e.target.value === "true" })}
              >
                <option value="true">Sửa được (Repairable)</option>
                <option value="false">Phế liệu (Scrap)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chi phí dự kiến (VNĐ)</label>
              <input 
                type="number"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trạng thái xử lý</label>
            <div className="grid grid-cols-2 gap-2">
              {['Đang sửa', 'Đã hoàn thành', 'Chờ linh kiện', 'Phế liệu'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                    formData.status === status 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <Check size={18} /> Lưu thông tin
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairForm;
