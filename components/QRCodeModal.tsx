
import React from 'react';
import { X, Download, Share2, Wrench } from 'lucide-react';

interface QRCodeModalProps {
  data: string;
  title: string;
  onClose: () => void;
  onOpenTechnician: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ data, title, onClose, onOpenTechnician }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm">Quản lý Mã: {title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 border rounded-xl shadow-inner mb-6">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
            Mã QR này được dùng để định danh thiết bị trong hệ thống. 
            <br/><span className="font-bold text-slate-700">Kỹ thuật viên</span> quét để cập nhật tình trạng sửa chữa.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={onOpenTechnician}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-100"
            >
              <Wrench size={18} /> Giả lập Quét QR
            </button>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                <Download size={16} /> Lưu
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                <Share2 size={16} /> Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
