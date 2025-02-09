import { DateRange } from "react-day-picker";

export interface PropsIcon {
  color?: string;
  className?: string;
  onClick?: (e?: any) => void;
  height?: string;
  width?: string;
  bgColor?: string;
  iconColor?: string;
}

export type DateType = "daily" | "weekly" | "monthly" | "custom";

export interface CustomCalendarProps {
  dateType: DateType;
  date: Date;
  month: number;
  year: number;
  selectedWeek: DateRange | undefined;
  setSelectedWeek: React.Dispatch<React.SetStateAction<DateRange>>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}

export interface MonthlyCalendarProps {
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}

export interface CustomDropDownProps {
  options: { label: string; value: any }[];
  removeDefaultOption?: boolean;
  className?: string;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  placeHolder?: string;
  label?: string;
  width?: string;
  height?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  value?: any;
  optionDefaultLabel?: string;
  displayValue?: boolean;
  showSearch?: boolean;
  showIcon?: boolean;
}

export interface IHeaderPageProps {
  title: string | React.ReactNode;
  textButton?: string;
  exportButton?: boolean;
  generateButton?: boolean;
  onClickAdd?: () => void;
  disabled?: boolean;
  loading?: boolean;
  exportInventory?: boolean;
  onClickExportInventory?: () => void;
  handleExport?: () => void;
  handleImport?: any;
  handleDownloadTemplate?: () => void;
  children?: React.ReactNode;
  modalName?: string;
  handleDropDownSelect?: (value: string) => void;
  dropDownSelectOptions?: string[];
  disabledDropDown?: boolean;
  setIsShowDropDown?: React.Dispatch<React.SetStateAction<boolean>>;
  isShowDropDown?: boolean;
  permission?: string[];
  permissionExport?:string[]
}

export interface ICustomSelect {
  options: ISelect[];
}

export interface ISelect {
  label: string;
  value: string;
}
