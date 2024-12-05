export type TScheduledData = {
  days: TScheduledDay[];
  departments: TDepartment[];
  employees: TEmployee[];
  popularShifts: TShift[];
};

export type TScheduledDay = {
  date: string;
  day: string;
  shifts: TShift[];
};

export type TPopularShift = {
  id: string;
  branch_id: string;
  shift_type_id: string;
  time_to: string;
  time_from: string;
};

export type TShift = {
  id: string;
  branch_id: string;
  employee_id: string;
  department_id: string;
  position_id: number;
  shift_type_id: string;
  time_from: string;
  station_id: string;
  time_to: string;
  notes: string;
  day: string;
  date: string;
  status: number;
  position: {
    id: string;
    name: string;
  };
  shift_type: {
    id: string;
    name: string;
    icon: string;
  };
};

export type TDepartment = {
  id: string;
  name: string;
  pivot: {
    forecast_position_id: number;
  };
};

export type TEmployee = {
  id: string;
  last_name: string;
  first_name: string;
  username: string;
  department_id: string;
  position_id: number;
  availability: TAvailability[];
  departments: TDepartment[];
  hided: boolean;
  total_shifts: number;
};

export type TAvailability = {
  day: string;
  form: string;
  to: string;
  is_available: boolean;
};

export type TScheduledShift = {
  employeeId?: string | null;
  positionId?: number;
  departmentId?: string;
  day: TScheduledDay;
  isFetchingSchedule?: boolean;
  nextDay?: string;
  index: number;
  setCellIndex: React.Dispatch<React.SetStateAction<number | null>>;
  cellIndex: number | null;
  fromOpenShift?: boolean;
  isAvaliabile: boolean;
};

export type TDrawerType = "addShiftDrawer" | "peopleDrawer";
