export interface IPurchaseBy<T> {
    isLoading: boolean;
    data: T;
    columns: T
    title: string;
}