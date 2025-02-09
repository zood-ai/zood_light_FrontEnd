import StockIcon from '@/assets/icons/Stock'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { useFormContext } from 'react-hook-form'
import { StockCountUnits } from '@/constants/dropdownconstants'

const StockCount = ({ fromBatch }: { fromBatch?: boolean }) => {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()
  const supplierMain = watch('suppliers')?.find(
    (supplier: { is_main: number }) => supplier?.is_main == 1
  )

  const packUnit = fromBatch ? getValues('storage_unit') : supplierMain?.pack_unit
  const packSize = supplierMain?.pack_size
  const packPerCase = supplierMain?.pack_per_case

  return (
    <>
      {packUnit && (
        <>
          {/* header */}
          <div className='flex items-center gap-3 mb-[13px] mt-[30px]'>
            <div className='w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground'>
              <StockIcon />
            </div>
            <h3 className='font-bold text-[16px]'>Stock Count</h3>
          </div>
          {/* content */}

          <div className='rounded-[4px]'>
            <div className='flex justify-between items-center mt-4 mb-2'>
              <span className='w-16'>Counts as</span>
              <span>Show as</span>
              <span>Use in reports?</span>
              <span>Report preview</span>
            </div>

            {/* unit */}
            {(getValues('stock_counts.[0]')?.pack_unit?.length > 0 || (fromBatch && packUnit)) && (
              <div className=' bg-popover rounded-[4px] flex justify-between items-center p-2'>
                <FormItem className={`flex gap-2 items-center`}>
                  <Checkbox
                    id='count'
                    disabled={true}
                    checked={!!getValues(`stock_counts.[0].checked`)}
                    onCheckedChange={(checked) => {
                      setValue('stock_counts.[0].checked', +checked, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />
                  <FormLabel htmlFor='location' className='text-sm font-medium mt-0 w-16'>
                    {packUnit}
                  </FormLabel>
                </FormItem>
                <FormItem className={`flex gap-2 items-center`}>
                  <FormLabel htmlFor='location' className='text-sm font-medium  '>
                    1
                  </FormLabel>
                  <CustomSelect
                    width='w-[90px] '
                    disabled
                    placeHolder='Select'
                    options={[{ label: 'kg', value: '1' }]}
                  />
                </FormItem>
                <FormControl>
                  <Switch
                    checked={getValues(`stock_counts.[0].use_report`)}
                    disabled={
                      getValues('stock_counts')?.filter((sc) => sc.checked).length === 1 &&
                      !!getValues(`stock_counts.[0].use_report`)
                    }
                    onCheckedChange={(checked) => {
                      setValue(`stock_counts.[0].use_report`, +checked, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                      setValue(`stock_counts.[1].use_report`, +!checked)
                    }}
                  />
                </FormControl>
                <span>
                  {getValues(`stock_counts.[0].use_report`) == 1
                    ? 1
                    : packSize == 0
                    ? 0
                    : 1 / packSize}{' '}
                  {getValues(`stock_counts.[1].use_report`) == 1
                    ? getValues(`stock_counts.[1].show_as`) || 'Packs'
                    : packUnit}
                </span>
              </div>
            )}
          </div>
          {/* pack */}
          {packSize > 0 && packUnit && (
            <div className=' bg-popover rounded-[4px] flex justify-between items-center p-2'>
              <FormItem className={`flex gap-2 items-center`}>
                <Checkbox
                  id='count'
                  checked={!!getValues(`stock_counts.[1].checked`)}
                  disabled={
                    getValues('stock_counts').filter((sc) => sc.checked).length === 1 &&
                    !!getValues(`stock_counts.[1].checked`)
                  }
                  onCheckedChange={(checked) => {
                    setValue('stock_counts.[1].checked', +checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                    if (!checked) {
                      setValue('stock_counts.[1].use_report', 0)
                      setValue('stock_counts.[0].use_report', 1)
                    }
                  }}
                />
                <FormLabel htmlFor='location' className='text-sm font-medium mt-0 w-16'>
                  Packs ({packSize} {packUnit})
                </FormLabel>
              </FormItem>
              <FormItem className={`flex gap-2 items-center`}>
                <FormLabel htmlFor='location' className='text-sm font-medium  '>
                  1
                </FormLabel>
                <CustomSelect
                  width='w-[90px] '
                  placeHolder='Select'
                  options={StockCountUnits}
                  value={getValues('stock_counts.[1].show_as') || ''}
                  onValueChange={(e) => {
                    if (e === 'null') {
                      setValue('stock_counts.[1].show_as', '', {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                      return
                    }

                    setValue('stock_counts.[1].show_as', e, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                />
              </FormItem>
              <FormControl>
                <Switch
                  checked={getValues(`stock_counts.[1].use_report`)}
                  onCheckedChange={(checked) => {
                    setValue(`stock_counts.[1].use_report`, +checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                    setValue(`stock_counts.[0].use_report`, +!checked)

                    setValue(
                      'stock_counts.[0].report_preview',
                      (getValues(`stock_counts.[0].use_report`) == 1 ? 1 : 1 / packSize).toString()
                    )

                    setValue(
                      'stock_counts.[1].report_preview',
                      (getValues(`stock_counts.[0].use_report`) == 1
                        ? packSize / 1
                        : packSize / packSize
                      ).toString()
                    )
                    if (packPerCase) {
                      setValue(
                        'stock_counts.[2].report_preview',
                        (getValues(`stock_counts.[0].use_report`) == 1
                          ? packPerCase * packSize
                          : `${(packPerCase * packSize) / packSize}`
                        ).toString()
                      )
                    }
                  }}
                />
              </FormControl>
              <span>
                {getValues(`stock_counts.[0].use_report`) == 1
                  ? packSize / 1
                  : packSize == 0
                  ? 0
                  : packSize / packSize}{' '}
                {getValues(`stock_counts.[1].use_report`) == 1
                  ? getValues(`stock_counts.[1].show_as`) || 'Packs'
                  : packUnit}
              </span>
            </div>
          )}
          {/* case */}
          {packPerCase > 0 && packSize > 0 && packUnit && (
            <div className=' bg-popover rounded-[4px] flex justify-between items-center p-2'>
              <FormItem className={`flex gap-2 items-center`}>
                <Checkbox
                  id='count'
                  disabled={
                    getValues('stock_counts').filter((sc) => sc.checked).length === 1 &&
                    !!getValues(`stock_counts.[2].checked`)
                  }
                  checked={!!getValues(`stock_counts.[2].checked`)}
                  onCheckedChange={(checked) => {
                    setValue('stock_counts.[2].checked', +checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                />
                <FormLabel htmlFor='location' className='text-sm font-medium mt-0 w-16'>
                  Cases ({packPerCase} X {packSize} {packUnit})
                </FormLabel>
              </FormItem>
              <FormItem className={`flex gap-2 items-center`}>
                <FormLabel htmlFor='location' className='text-sm font-medium  '>
                  1
                </FormLabel>
                <CustomSelect
                  width='w-[90px] '
                  placeHolder='Select'
                  value={getValues('stock_counts.[2].show_as') || ''}
                  options={StockCountUnits}
                  onValueChange={(e) => {
                    if (e === 'null') {
                      setValue('stock_counts.[2].show_as', '', {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                      return
                    }
                    setValue('stock_counts.[2].show_as', e, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                />
              </FormItem>
              <FormControl>
                <Switch disabled />
              </FormControl>
              <span>
                {getValues(`stock_counts.[0].use_report`) == 1
                  ? `${packPerCase} X ${packSize}`
                  : `${(packPerCase * packSize) / packSize}`}{' '}
                {getValues(`stock_counts.[1].use_report`) == 1
                  ? getValues(`stock_counts.[1].show_as`) || 'Packs'
                  : packUnit}
              </span>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default StockCount
