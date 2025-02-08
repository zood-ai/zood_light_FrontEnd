export interface IRequestsList {
  id: string;
  created_at: string;
  request_by: string;
  schedule: {
    from: string;
    to: string;
  };

  original_shift: {
    date: string;
    employee: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
  shift: {
    date: string;
    employee: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
  employee: {
    id: string;
    first_name: string;
    last_name: string;
  };

  branch: {
    id: string;
    name: string;
  };

  rejected_by: {
    first_name: string;
    last_name: string;
  }[];
  approved_by: {
    first_name: string;
    last_name: string;
  }[];

  location: string;
  type: string;
  for: string;
  overlapwith: string;
  status: string;

  details: {
    from: string;
    to: string;
    start_time: string;
    type: boolean;
    notes: string;
    days: {
      date: string;
      paid: boolean;
    }[];

    end_time: string;
    repeat: boolean;
    repeat_days: string[];
  };
}
