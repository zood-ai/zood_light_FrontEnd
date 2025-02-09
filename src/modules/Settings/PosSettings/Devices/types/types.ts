export interface IDevices {
    id: string,
    name: string,
    reference: string,
    type: number,
    in_use: number,
    branch: {
        id: string,
        name: string,
    },
    
}
export interface ICreateDevices {
    name: string,
    name_localized: string,
    reference: number,
    branch_id: string,
    type: number,
}