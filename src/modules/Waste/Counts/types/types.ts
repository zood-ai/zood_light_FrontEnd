import { Dispatch, SetStateAction } from "react";

export interface ICountsList {
  id: string;
  day_option: string;
  date: {
    time: string;
    type: string;
  };
  type: string;
  status: number;
}

export interface ISingleItem {
  selectedItemIndex: number;
  setSelectedItemIndex: Dispatch<SetStateAction<number>>;
  itemStorageAreas: { name: string; branch_id: string }[];
  itemsCount: number;
  stockCounts: IStockCounts[];
  basicUnit: string;
}

export interface ICountFormContent {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setSelectedItemIndex: Dispatch<SetStateAction<number>>;
  formControl: any;
  itemsData: {
    name: string;
    id: string;
    storage_areas: { name: string; branch_id: string }[];
    stock_counts: IStockCounts[];
  }[];
  isFetchingItems: boolean;
  selectedItemIndex: number;
  countId: string;
  nextStep: (stepNumber: number, countId: string) => void;
  isEdit: boolean;
  handleCloseSheet?: () => void;
  businessDate: string;
  setOpenReport?: (open: boolean) => void;
  setGetReport?: (getReport: boolean) => void;
  getReport?: boolean;
  setCountId?: (countId: string) => void;
  setIsFirst?: (isFirst: boolean) => void;
  fromReport?: boolean;
}

export interface ActualVsTargetType {
  title: string;
  type?: string;
  value: string;
  show?: boolean;
  percentage?: string;
  content?: { label: string; value: string; percentage?: string }[];
}

export interface IReconciliationReport {
  name: string;
  opining_count: number;
  opining_value: number;
  delivers_count: number;
  delivers_value: number;
  transfer_count: number;
  transfer_value: number;
  waste_count: number;
  waste_value: number;
  batching_count: number;
  batching_value: number;
  used_count: number;
  used_value: number;
  pos_count: number;
  pos_value: number;
  variance_count: number;
  variance_value: number;
  closing_count: number;
  closing_value: number;
  deliveries: number;
  transfers: number;
  waste: number;
  batch_created: number;
  used_qty: number;
  pos_sales: number;
  variance_qty: number;
  is_estimated: number;
}

export type IStockCounts = {
  id: number;
  show_as: string;
  item_id: string;
  use_report: number;
  count: number;
  checked: number;
  report_preview: string;
  unit: string;
  cost: number;
  quantity: number;
};
type StockCountWithQuantity = IStockCounts & { quantity: number };

export interface ICountHeader {
  step: number;
  itemName: string;
  businessDate: string;
  dayOption: string;
  type: string;
  setStep: Dispatch<SetStateAction<number>>;
  isEdit: boolean;
  countId: string;
  status: string;
  handleCloseSheet: () => void;
  modalName: string;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  mainUnit: IStockCounts;
  packUnit: string;
  stockCounts: StockCountWithQuantity[];
  fromReport?: boolean;
  quantity?: number;
  useReportCount: number;
}

export interface ICountItem {
  id: string;
  quantity: number;
  total_cost: number;
  array_stock_counts: IStockCounts[];
  unit: string;
  is_estimated: number;
}
