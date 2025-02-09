import { useSearchParams } from 'react-router-dom'

// Hooks
import useFilterQuery from '@/hooks/useFilterQuery'

// Icons
import ArrowRightIcon from '@/assets/icons/ArrowRight'
import usePurchaseOrderHttp from '../queriesHttp/usePurchaseOrderHttp'
import { Skeleton } from '@/components/ui/skeleton'
import Avatar from '@/components/ui/avatar'

const SuppliersList = () => {
  const [_, setSearchParams] = useSearchParams()
  const { filterObj } = useFilterQuery()
  const branchId = filterObj['filter[branch]']
  const { SuppliersSelect, isFetching } = usePurchaseOrderHttp({ branchId })

  const SuppliersSkeleton = ({ suppliers, type }) => {
    return isFetching ? (
      <div className='flex gap-5 flex-col'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className='flex gap-2 items-center' key={index}>
            <Skeleton className='h-[40px] w-[40px] rounded-full' key={index} />
            <Skeleton className='h-4 w-[250px]' key={index} />
          </div>
        ))}
      </div>
    ) : (
      !suppliers.length && (
        <div className='flex gap-5 flex-col'>
          <p className='text-textPrimary text-center font-medium text-[16px]'>
            <div>👀</div>
            No {type} Found
          </p>
        </div>
      )
    )
  }

  return (
    <div>
      <h1 className='font-semibold text-[24px] mb-3'>Place Order</h1>
      <div className='mb-8'>
        <SuppliersSkeleton suppliers={SuppliersSelect} type='Suppliers' />
        {SuppliersSelect?.length > 0 &&
          SuppliersSelect?.map((supplier, i) => (
            <div
              key={i}
              className='flex justify-between items-center py-[15px] cursor-pointer  border-b-[1px] border-[#ECF0F1]'
              onClick={() =>
                setSearchParams({
                  ...filterObj,
                  'filter[supplier]': supplier.value,
                  'filter[supplier_name]': supplier.label,
                })
              }
            >
              <div className='flex items-center gap-2 text-textPrimary'>
                <Avatar text={supplier?.label} />
                {supplier?.label}
              </div>
              <ArrowRightIcon className=' w-5 h-5 ' />
            </div>
          ))}
      </div>
    </div>
  )
}

export default SuppliersList
