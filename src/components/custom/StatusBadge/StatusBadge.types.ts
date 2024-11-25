export type StatusBadgeProps = {
  status?:
    | 'reported'
    | 'pending'
    | 'completed'
    | 'error'
    | 'active'
    | 'Inactive';

  text?: string;
  type?: number;
};
