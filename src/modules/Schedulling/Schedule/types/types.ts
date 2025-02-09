export type TScheduledData = {
  days: TScheduledDay[];
  departments: TDepartment[];
  employees: TEmployee[];
  popularShifts: TShift[];
  table: {
    status: number;
  };
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
  overtime_rule_id: string;
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
  hours: number;
  attend: {
    id: string;
    start_time: string;
    end_time: string;
  };
  position: {
    id: string;
    name: string;
  };
  employee: {
    first_name: string;
    last_name: string;
  };
  shift_type: {
    id: string;
    name: string;
    icon: string;
    type: string;
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
  image: string;
  first_name: string;
  username: string;
  department_id: string;
  position_id: number;
  availability: TAvailability[];
  departments: TDepartment[];
  preferred_name: string;
  hided: boolean;
  total_shifts: number;
  total_attended: number;
  contract_hrs: number;
};

export type TAvailability = {
  day: string;
  from: string;
  to: string;
  is_available: boolean;
};

export type TScheduledShift = {
  employeeId?: string | null;
  isPublished?: boolean;
  availabilityTime?: TAvailability;
  showAvaliability?: boolean;
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
  departments?: TDepartment[];
  sortBy: string;
  prevLastDay?: string;
};

export type TDrawerType = "addShiftDrawer" | "peopleDrawer";
