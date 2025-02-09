import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useState } from 'react'

// Components
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ShoppingCartItem from './ShoppingCartItem'
import PurchaseModal from './PurchaseModal'
import DeliveryWarning from './DeliveryWarning'

// Types
import { IItemData, ShoppingCartFromProps } from '../types/type'

// Hooks
import usePurchaseOrderHttp from '../queriesHttp/usePurchaseOrderHttp'

const ShoppingCartFrom = ({
  items,
  handleCloseSheet,
  formReceive,
  orderId,
}: ShoppingCartFromProps) => {
  const { getValues, register, watch, setValue } = useFormContext()
  const [clickedSaveLaterbtn, setClickedSaveLaterbtn] = useState(false)
  const [modalName, setModalName] = useState('')
  const {
    LoadingCreatePurchaseOrder,
    CreatePurchaseOrder,
    UpdatePurchaseOrder,
    LoadingUpdatePurchaseOrder,
  } = usePurchaseOrderHttp({
    handleCloseSheet,
  })

  const totalPrice =
    getValues('items')?.reduce((acc: number, item: IItemData) => acc + item.sub_total, 0) +
    getValues('items')?.reduce((acc: number, item: IItemData) => acc + item.total_tax, 0)

  return (
    <div>
      <DeliveryWarning deliveryDate={items?.deliveryDate} shoppingCart />
      <div className='flex justify-between items-center mt-4 text-textPrimary font-semibold'>
        Delivery Date
        <span>{format(getValues('delivery_date'), 'dd MMM')}</span>
      </div>

      {/* comment */}
      <div className='mt-4'>
        <h2 className='text-textPrimary font-semibold'>Comment</h2>
        <Textarea
          placeholder='Type your comment here...'
          maxLength={300}
          {...register('notes', { maxLength: 300 })}
        />
      </div>
      <p className='text-right text-gray text-[12px]'>{watch('notes')?.length || 0}/300</p>

      {/* list items */}
      <div>
        <h3 className='font-semibold text-textPrimary mt-8 '>Your items</h3>
        <div className='px-2'>
          {getValues('items').length > 0 ? (
            getValues('items')?.map((item: IItemData) => (
              <ShoppingCartItem
                item={item}
                items={items}
                getValues={getValues}
                setValue={setValue}
                deliveryDate={getValues('delivery_date')}
              />
            ))
          ) : (
            <div className=' flex items-center justify-center flex-col gap-2 '>
              <p className='text-textPrimary font-semibold text-[16px]'>No items</p>
              <span className='text-[12px] text-textPrimary'>
                You Can Close this window to add items
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className={`${
          // modify this condition to remove null by 0
          (totalPrice < items?.deliveryDate?.supplier?.min_order &&
            items?.deliveryDate?.supplier?.min_order !== null) ||
          (totalPrice > items?.deliveryDate?.supplier?.max_order &&
            items?.deliveryDate?.supplier?.max_order !== null)
            ? 'bg-[#FDF2F5]'
            : 'bg-popover'
        }
        }  flex justify-between mt-8 text-textPrimary items-center p-2 rounded-sm font-medium`}
      >
        <div className='flex gap-4 flex-col '>
          <span>Subtotal</span>
          <span>Total VAT</span>
          <span>Total</span>
        </div>
        <div className='flex gap-4 flex-col items-end'>
          <span>
            SAR{' '}
            {getValues('items')
              ?.reduce((acc: number, item: IItemData) => acc + item.sub_total, 0)
              .toFixed(2)}
          </span>
          <span>
            SAR{' '}
            {getValues('items')
              ?.reduce((acc: number, item: IItemData) => acc + +item.total_tax, 0)
              .toFixed(2)}
          </span>
          <span>SAR {totalPrice?.toFixed(2)}</span>
        </div>
      </div>

      <div className='mt-2 pb-20 flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          {items?.deliveryDate?.supplier?.min_order && (
            <>
              <p className='text-textPrimary'>Min order value: </p>
              <span>SAR {items?.deliveryDate?.supplier?.min_order}</span>
            </>
          )}
        </div>
        <div className='flex justify-between items-center '>
          {items?.deliveryDate?.supplier?.max_order && (
            <>
              <p className='text-textPrimary'>Max order value:</p>
              <span>SAR {items?.deliveryDate?.supplier?.max_order}</span>
            </>
          )}
        </div>
      </div>

      <div className='bg-white w-full p-2 left-0 absolute bottom-2 flex gap-3'>
        <Button
          variant={'outline'}
          type='button'
          className='w-full mt-4 text-primary border-gray-400 text-[16px] h-[50px] font-semibold rounded-3xl'
          disabled={
            LoadingCreatePurchaseOrder || !getValues('items').length || LoadingUpdatePurchaseOrder
          }
          onClick={() => {
            if (formReceive) {
              UpdatePurchaseOrder({
                values: getValues(),
                orderId: orderId as string,
              })
            } else {
              CreatePurchaseOrder({ ...getValues(), status: '1' })
            }
          }}
        >
          Save for later
        </Button>
        <Button
          className='w-full mt-4 h-[50px] flex gap-2 font-semibold bg-primary rounded-3xl'
          type='button'
          onClick={() => {
            const findDate = items?.deliveryDate?.order_rules.find(
              (d) => d.delivery_date === getValues('delivery_date')
            )
            if (
              totalPrice < items?.deliveryDate?.supplier?.min_order &&
              items?.deliveryDate?.supplier?.min_order !== null
            ) {
              if (!findDate) {
                setModalName('date&min')
                setClickedSaveLaterbtn(false)
                return
              }
              setModalName('min_order')
              setClickedSaveLaterbtn(false)
              return
            }

            if (
              totalPrice > items?.deliveryDate?.supplier?.max_order &&
              items?.deliveryDate?.supplier?.max_order !== null
            ) {
              if (!findDate) {
                setModalName('date&max')
                setClickedSaveLaterbtn(false)
                return
              }
              setModalName('max_order')
              setClickedSaveLaterbtn(false)
              return
            }

            if (!findDate) {
              setModalName('different_date')
              setClickedSaveLaterbtn(false)
              return
            }
            if (formReceive) {
              UpdatePurchaseOrder({
                values: { ...getValues(), status: '2' },
                orderId: orderId as string,
              })
            } else {
              CreatePurchaseOrder({ ...getValues(), status: '2' })
            }
          }}
          disabled={
            LoadingCreatePurchaseOrder || !getValues('items').length || LoadingUpdatePurchaseOrder
          }
        >
          Place order
        </Button>
      </div>

      <PurchaseModal
        isPending={LoadingCreatePurchaseOrder || LoadingUpdatePurchaseOrder}
        modalName={modalName}
        suplierName={items?.deliveryDate?.supplier?.name}
        selectedDeliveredDate={format(getValues('delivery_date'), 'dd MMMM')}
        deliveryDate={format(items?.deliveryDate?.delivery_date, 'dd MMMM')}
        setModalName={setModalName}
        orderValue={
          modalName === 'max_order' || modalName === 'date&max'
            ? items?.deliveryDate?.supplier?.max_order
            : items?.deliveryDate?.supplier?.min_order
        }
        handleConfirm={() => {
          if (formReceive) {
            UpdatePurchaseOrder({
              values: { ...getValues(), status: '2' },
              orderId: orderId as string,
            })
            return
          }
          CreatePurchaseOrder({
            ...getValues(),
            status: clickedSaveLaterbtn ? '1' : '2',
          })
        }}
      />
    </div>
  )
}

export default ShoppingCartFrom
