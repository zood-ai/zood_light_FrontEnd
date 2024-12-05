import StorageArea from '../../../../components/StorageArea'
import RecipeDetails from './RecipeDetails'
import IngredientsInfo from './IngredientsInfo'

// Icons
// import { StockCount } from './StockCount'
import useCommonRequests from '@/hooks/useCommonRequests'
import { useFieldArray, useFormContext } from 'react-hook-form'
import PurchasingInfo from '@/components/ui/custom/PurchasingInfo'
import CartIcon from '@/assets/icons/Cart'
import StockCount from '../../Items/components/StockCount'

const BatchesDetailsForm = ({ isEdit }: { isEdit: boolean }) => {
  const {
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'suppliers',
  })
  const { isBranchesLoading } = useCommonRequests({
    getBranches: true,
    setBranches: (data: any) => {
      if (getValues('branches')?.length === 0) {
        setValue('branches', data, { shouldValidate: true, shouldDirty: true })
      }
    },
  })

  console.log('stock from ', getValues('stock_counts'))

  return (
    <div className='flex flex-col gap-[30px]'>
      {/* Recipe details description */}
      <RecipeDetails />

      {/* Ingredients info */}
      <IngredientsInfo />

      {/* Purchasing info */}
      <>
        {/* header */}
        <div className='flex items-center gap-3 mt-[30px] mb-[13px]'>
          <div className='w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]'>
            <CartIcon />
          </div>
          <h3 className='font-bold text-[16px]'>Purchasing info</h3>
        </div>
        {/* content */}
        <>
          {fields.map((field, index) => (
            <PurchasingInfo
              index={index}
              key={field.id}
              fromBatch
              remove={remove}
              count={fields.length}
              isEdit={isEdit}
            />
          ))}
          <p
            className='text-primary text-right mt-2 cursor-pointer select-none'
            onClick={() => {
              fields.length > 0
                ? append({
                    id: '',
                    item_supplier_code: '',
                    specific_name: null,
                    // pack_size: 0,
                    pack_unit: getValues('storage_unit'),
                    // pack_per_case: 0,
                    // cost: 0,
                    tax_group_id: '',
                    is_main: 0,
                  })
                : append({
                    id: '',
                    item_supplier_code: '',
                    specific_name: null,
                    // pack_size: 0,
                    pack_unit: getValues('storage_unit'),
                    // pack_per_case: 0,
                    // cost: 0,
                    tax_group_id: '',
                    is_main: 1,
                  })
            }}
          >
            {fields.length > 0 ? '+ Add another Supplier' : '+ Add Supplier'}
          </p>
        </>
      </>

      {/* Storage area */}
      <StorageArea />

      {/* Stock count */}
      {/* <StockCount /> */}
      <div>
        <StockCount fromBatch />
      </div>
    </div>
  )
}

export default BatchesDetailsForm
