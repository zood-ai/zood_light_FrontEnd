import { FieldValues } from 'react-hook-form'

export interface IItems extends Array<IItem> {
  deliveryDate: {
    order_date: string
    time: string
    order_day: string
    delivery_date: string
    packUnit: number
    order_rules: {
      delivery_date: string
      delivery_day: string
      delivery_time: string
      id: string
    }[]
    supplier: {
      name: string
      min_order: number
      max_order: number
    }
  }
  itemDailyUsage: IItemData[]
}

export interface IItemData {
  id: string
  name: string
  unit: string
  cost: number
  packUnit: number
  tax_amount: number
  case_unit: string
  pack_size: number
  sub_total: number
  quantity: number
  pack_unit: string
  item_id?: string

  total_tax: number
  pack_per_case: number
  tax_group: {
    id: string
  }
}
export interface IItem extends IItemData {
  daily_usage: {
    day: string
    date: string
    usage: number
    in_stock: number
    isCovered: boolean
    delivery: number
    es_stock: number
  }[]
  deliveryDate: {
    order_date?: string
    time?: string
    order_day?: string
    delivery_date: string
  }
  itemDailyUsage?: {
    item_id: string
    id: string
    name: string
    case_unit: string
    quantity: number
  }[]
}

export interface IUpdatedItem extends IItem {
  neededCount: number
  didNeedStock: boolean
}

export interface MyFieldValues extends FieldValues {
  status: string
}

export type SubmitHandler<T extends MyFieldValues> = (data: T) => void | Promise<void>

export interface IPurchaseOrderForm {
  items: IItems
  setShowCart: (state: boolean) => void
  handleCloseSheet: () => void
  supplierId?: string
  formReceive?: boolean
  orderId?: string
  showCart?: boolean
}

export interface ShoppingCartFromProps {
  items: IItems
  handleCloseSheet: () => void
  formReceive?: boolean
  orderId?: string
}
