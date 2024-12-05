export interface IRequestsList {
  id: number;
  created_at: string;
  request_by: string;
  schedule: {
    from: string;
    to: string;
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

  location: string;
  type: string;
  for: string;
  overlapwith: string;
  status: string;
}
