export interface IProductionsList {
  id: string;
  name: string;
  business_date: string;
  quantity: string;
  row_id: number;
  storage_unit: string;
}

export interface IProductionsHeader {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  singleItem: {
    id: string;
    quantity: number;
    storage_unit: string;
  };
  setValue: any;
  row_id: number;
  getValues: any;
  handleCloseSheet?: () => void;
  quantity: string;
  modalName: string;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  BatchName: string;
  oldQuantity: string;
}

export interface IProductionsFormContent {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  singleItem: {
    id: string;
    quantity: number;
    storage_unit: string;
    name: string;
  };
  setSingleItem: React.Dispatch<
    React.SetStateAction<{
      id: string;
      quantity: number;
      storage_unit: string;
      name: string;
    }>
  >;
  setSelectedItemIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedItemIndex: number;
  rowData: IProductionsList;
  handleCloseSheet?: () => void;
  setRowData: React.Dispatch<React.SetStateAction<IProductionsList>>;
}

export interface ICreateValues {
  business_date: string;
  items: {
    id: string;
    quantity: number;
    storage_unit: string;
    name: string;
  };
  branch_id: string;
}
