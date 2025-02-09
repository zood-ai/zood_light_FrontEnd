export interface Branch {
    id: string;
    name: string;
}

export interface Warehouse {
    id: string;
    name: string;
}

export interface TransferData {
    id: string;
    branch: Branch;
    warehouse: Warehouse;
    status: number;
    type: number;
    delivery_date: string;
}

export interface FilterObj {
    branch_id?: string;
}


