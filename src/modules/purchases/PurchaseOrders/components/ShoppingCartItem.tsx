import { memo, useState } from 'react'
import { IItemData, IItems, IUpdatedItem } from '../types/type'
import AddRemoveItems from './AddRemoveItems'
import { FieldValues, UseFormGetValues, UseFormSetValue } from 'react-hook-form'

interface ShoppingCartItemProps {
  item: IItemData
  items: IItems
  deliveryDate: string
  getValues: UseFormGetValues<FieldValues>
  setValue: UseFormSetValue<FieldValues>
}
const ShoppingCartItem = ({
  item,
  items,
  deliveryDate,
  getValues,
  setValue,
}: ShoppingCartItemProps) => {
  const [qty, setQty] = useState(item?.quantity || 0)
  const [updatedItem, setUpdatedItem] = useState<IUpdatedItem>()

  const singleItem = items?.itemDailyUsage?.find(
    (it: { id: string; unit: string }) => it.unit === item.unit && it.id === item.id
  )

  return (
    <div className='flex justify-between items-center  mt-4 text-textPrimary  last:border-b pb-4'>
      <div className='flex flex-col '>
        <span className='font-semibold text-[16px]'>{singleItem?.name}</span>
        <span className='text-[12px] text-gray tracking-wider'>
          SAR {singleItem?.cost} / {singleItem?.pack_per_case ? 'case' : 'pack'} /{' '}
          {singleItem?.unit}
        </span>
      </div>
      <AddRemoveItems
        qty={item?.quantity}
        item={item}
        fromShopping
        getValues={getValues}
        setValue={setValue}
        updatedItems={{
          ...items?.itemDailyUsage.find((it) => it.unit === item.unit && it.id === item.id),
          deliveryDate: items?.deliveryDate,
        }}
        setQty={setQty}
        deliveryDate={deliveryDate}
        setUpdatedItem={setUpdatedItem}
        packUnit={item?.pack_per_case ? item?.pack_per_case * item?.pack_size : item?.pack_size}
      />
    </div>
  )
}

export default memo(ShoppingCartItem)
