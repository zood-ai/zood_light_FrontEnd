export interface IOrdersList {

}
export interface IOrder {
    name: string;
    id: string;
    status: string;
    reference: string;
    business_date: string;
    number: number;
    type: string;
    source: string;
    branch: { name: string };
    opened_at: string;
    closed_at: string;
    subtotal_price: number;
    discount_amount: number;
    total_charges: number;
    total_taxes: number;
    rounding_amount: number,
    total_price: number,
    products: [

    ]
    taxes: [],
    payments: []
}