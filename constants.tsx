
import { Machine, RepairStatus } from './types';

export const MOCK_MACHINES: Machine[] = [
  {
    code: 'M-101',
    type: 'Máy nén',
    brand: 'Mitsubishi',
    components: [
      { id: 'C1', name: 'Trục khuỷu', machineCode: 'M-101', status: 'Hỏng', repairable: true, cost: 1500000, condition: 'Mòn nhẹ' },
      { id: 'C2', name: 'Van xả', machineCode: 'M-101', status: 'Phế liệu', repairable: false, cost: 0, condition: 'Gãy hoàn toàn' },
    ]
  },
  {
    code: 'D-202',
    type: 'Dàn nóng',
    brand: 'Daikin',
    components: [
      { id: 'C3', name: 'Bo mạch', machineCode: 'D-202', status: 'Lỗi nguồn', repairable: true, cost: 2500000, condition: 'Cháy tụ' },
    ]
  },
  {
    code: 'P-303',
    type: 'Bơm nước',
    brand: 'Panasonic',
    components: [
      { id: 'C4', name: 'Cánh quạt', machineCode: 'P-303', status: 'Cong', repairable: true, cost: 500000, condition: 'Biến dạng' },
    ]
  }
];
