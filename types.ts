
export enum RepairStatus {
  REPAIRABLE = 'Có thể sửa',
  NOT_REPAIRABLE = 'Không thể sửa',
  SCRAP = 'Phế liệu',
  PENDING = 'Đang kiểm tra'
}

export interface ComponentItem {
  id: string;
  name: string;
  machineCode: string;
  status: string;
  repairable: boolean;
  cost: number;
  condition: string;
}

export interface Machine {
  code: string;
  type: string;
  brand: string;
  components: ComponentItem[];
}

export interface ProductionSummary {
  totalMachines: number;
  totalRepairCost: number;
  scrapCount: number;
  repairableRatio: number;
}
