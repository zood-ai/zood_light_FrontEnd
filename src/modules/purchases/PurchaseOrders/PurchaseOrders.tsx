import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { format } from 'date-fns'

// Components
import ChooseBranch from '@/components/ui/custom/ChooseBranch'
import SuppliersList from './components/SuppliersList'
import { CustomSheet } from '@/components/ui/custom/CustomSheet'
import PurchaseOrderForm from './components/PurchaseOrderForm'
import ShoppingCartFrom from './components/ShoppingCartFrom'
import CustomModal from '@/components/ui/custom/CustomModal'

// Hooks
import useFilterQuery from '@/hooks/useFilterQuery'
import useCustomQuery from '@/hooks/useCustomQuery'
import usePurchaseOrderHttp from './queriesHttp/usePurchaseOrderHttp'

// Form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSupplierSchema } from './schema/Schema'
import { z } from 'zod'

const PurchaseOrders = () => {
  // State
  const [showCart, setShowCart] = useState(false)
  const [modalName, setModalName] = useState('')

  // Hooks
  const [_, setSeachParams] = useSearchParams()
  const { filterObj } = useFilterQuery()

  const { CreatePurchaseOrder, LoadingCreatePurchaseOrder } = usePurchaseOrderHttp({
    handleCloseSheet,
  })
  const { data: items, isFetching } = useCustomQuery(
    ['get/purchase-orders'],
    `forecast-console/orders/${filterObj['filter[branch]']}/supplier/${filterObj['filter[supplier]']}/items`,
    {
      enabled: !!filterObj['filter[supplier]'] && !!filterObj['filter[branch]'],
      onSuccess: (data) => {
        form.setValue('delivery_date', data?.deliveryDate?.delivery_date)
      },
    },
    {},
    'post'
  )

  const defaultValues = {
    business_date: format(new Date(), 'yyyy-MM-dd'),
    delivery_date: items?.deliveryDate?.delivery_date,
    notes: '',
    items: [],
  }

  const form = useForm<z.infer<typeof formSupplierSchema>>({
    resolver: zodResolver(formSupplierSchema),
    defaultValues,
  })

  function handleCloseSheet() {
    form.reset(defaultValues)
    setSeachParams({
      ['filter[branch]']: filterObj['filter[branch]'] || '',
    })
    setShowCart(false)
    setModalName('')
  }

  const handleRequest = () => {
    CreatePurchaseOrder({ ...form.getValues(), status: '1' })
  }

  const onSubmit = (values: z.infer<typeof formSupplierSchema>) => {
    CreatePurchaseOrder({ ...values, status: '2' })
  }

  return (
    <>
      {filterObj['filter[branch]'] ? <SuppliersList /> : <ChooseBranch showHeader />}

      <CustomSheet
        width='w-[672px]'
        isOpen={!!filterObj['filter[supplier]']}
        handleCloseSheet={handleCloseSheet}
        isDirty={form.getValues('items').length > 0}
        form={form}
        onSubmit={onSubmit}
        isEdit={form.getValues('items').length > 0}
        setModalName={setModalName}
        isLoadingForm={isFetching}
        titleStyle='justify-center w-full'
        purchaseHeader={
          <div className='-m-3 text-center '>
            <h3 className='font-semibold text-textPrimary'>{filterObj['filter[supplier_name]']}</h3>
            <span className='text-gray-500 font-medium text-[14px]'>
              Deliver{' '}
              {items?.deliveryDate?.order_rules
                ?.map((rule: any) => rule.delivery_day.slice(0, 3))
                .join(',')}
            </span>
          </div>
        }
      >
        <PurchaseOrderForm
          items={items}
          setShowCart={setShowCart}
          handleCloseSheet={handleCloseSheet}
          showCart={showCart}
        />
      </CustomSheet>
      <CustomSheet
        width='w-[672px]'
        isOpen={!!filterObj['filter[supplier]'] && showCart}
        handleCloseSheet={() => setShowCart(false)}
        form={form}
        onSubmit={onSubmit}
        contentStyle='px-2'
        headerStyle='border-b-0 w-full'
        titleStyle='justify-center'
        purchaseHeader={
          <div className='-m-3 text-center '>
            <h3 className='font-semibold text-textPrimary'>{filterObj['filter[supplier_name]']}</h3>
            <span className='text-gray-500 font-medium text-[14px]'>
              Deliver{' '}
              {items?.deliveryDate?.order_rules
                ?.map((rule: any) => rule.delivery_day.slice(0, 3))
                .join(',')}
            </span>
          </div>
        }
      >
        <ShoppingCartFrom items={items} handleCloseSheet={handleCloseSheet} />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        headerModal='Are you sure you want to stop ordering?'
        descriptionModal='Are you sure you want to cancel this order? You can save it for later or delete and start again.'
        handleConfirm={handleCloseSheet}
        handleRequest={handleRequest}
        isPending={LoadingCreatePurchaseOrder}
        contentStyle='pt-[32px] pb-[10px] font-medium'
        confirmbtnText='Cancel Order'
        confirmbtnStyle='bg-warn text-white'
        modalWidth='w-[448px]'
        showSaveLaterBtn
      />
    </>
  )
}

export default PurchaseOrders
