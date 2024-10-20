export enum Roles {
    ADMIN = 'admin',
    USER = 'user',
    // SELLER = 'SELLER',
  }
  
  export enum Permissions {
    VIEW_DASHBOARD = 'view_dashboard',
    EDIT_USER = 'edit_user',
  }
  
  export const rolePermissions: Record<Roles, Permissions[]> = {
    [Roles.ADMIN]: [Permissions.VIEW_DASHBOARD, Permissions.EDIT_USER],
    [Roles.USER]: [Permissions.VIEW_DASHBOARD],
  };
  