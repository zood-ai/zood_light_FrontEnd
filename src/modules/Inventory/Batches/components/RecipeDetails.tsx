import FolderIcon from '@/assets/icons/Folder'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UnitOptions } from '@/constants/dropdownconstants'
import { useFormContext } from 'react-hook-form'

const RecipeDetails = () => {
  const { register, setValue, getValues } = useFormContext()

  return (
    <div>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground'>
          <FolderIcon />
        </div>
        <h3 className='font-bold text-[16px]'>Recipe details</h3>
      </div>

      <div className='flex gap-[62px] items-center'>
        <FormItem className=' gap-2 items-center mt-2 mb-3'>
          <FormLabel htmlFor='name' className='font-bold'>
            Recipe name
          </FormLabel>
          <Input id='name' className='w-[200px]' {...register(`name`)} />
        </FormItem>

        <FormItem className=' gap-2 items-center mt-2 mb-3'>
          <FormLabel htmlFor='storage_to_ingredient' className='font-bold'>
            Yeild
          </FormLabel>
          <div className='flex gap-1'>
            <Input
              type='number'
              step={'0.01'}
              id='storage_to_ingredient'
              className='w-[80px]'
              {...register(`storage_to_ingredient`, { valueAsNumber: true })}
            />
            <CustomSelect
              width='w-[75px]'
              options={UnitOptions}
              onValueChange={(e) => {
                setValue(`storage_unit`, e, {
                  shouldValidate: true,
                  shouldDirty: true,
                })

                if (getValues('suppliers')?.length) {
                  setValue(
                    'suppliers',
                    getValues('suppliers').map((supplier) => ({
                      ...supplier,
                      pack_unit: e === 'null' ? '' : e,
                    }))
                  )
                }
                setValue(`stock_counts.0.unit`, e, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
                setValue(
                  'stock_counts',
                  [
                    getValues('stock_counts.0'),
                    ...getValues('stock_counts')
                      .slice(1)
                      .map((stock: any, index: number) => {
                        return {
                          ...stock,
                          unit:
                            `${index === 0 ? 'Packs' : 'Cases'} (` +
                            getValues(`stock_counts.${index}.report_preview`) +
                            e +
                            ')',
                        }
                      }),
                  ],
                  { shouldValidate: true, shouldDirty: true }
                )
              }}
              optionDefaultLabel='Unit'
              value={getValues(`storage_unit`)}
            />
          </div>
        </FormItem>

        <FormItem className=' gap-2 items-center mt-2 mb-3'>
          <FormLabel htmlFor='cost' className='font-bold'>
            Recipe cost
          </FormLabel>
          <Input
            id='cost'
            placeholder='SAR 0.00'
            className='w-[136px]'
            readOnly
            value={getValues('cost') || ''}
          />
        </FormItem>
      </div>
    </div>
  )
}

export default RecipeDetails
