import { useFieldArray, useFormContext } from 'react-hook-form'
import { StockCountUnits, UnitOptions } from '@/constants/dropdownconstants'

// UI Components
import { FormControl, FormItem, FormLabel } from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import CustomSelect from '../../../../components/ui/custom/CustomSelect'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Switch } from '../../../../components/ui/switch'
// Icons
import StockIcon from '@/assets/icons/Stock'

export const StockCount = () => {
  const { register, watch, control, getValues, setValue } = useFormContext()

  const { append, fields } = useFieldArray({
    control,
    name: 'stock_counts',
  })

  const showAs = watch(`stock_counts`)?.find(
    (e: { use_report: number }) => e.use_report == 1
  )?.show_as

  const handleSwitchChange = (index: number, checked: boolean) => {
    fields.forEach((_, idx) => {
      setValue(`stock_counts.[${idx}].use_report`, idx == index ? +checked : 0)
      setValue(
        `stock_counts.[${idx}].report_preview`,
        `${
          index == 0
            ? `1 ${watch('storage_unit')}`
            : ` ${
                watch(`stock_counts.${index}.pack_size`) /
                  watch(`stock_counts`)?.find((e: { use_report: number }) => e.use_report == 1)
                    ?.pack_size ==
                0
                  ? 1
                  : watch(`stock_counts`)?.find((e: { use_report: number }) => e.use_report == 1)
                      ?.pack_size
              } Packs`
        }`
      )
    })
  }

  return (
    <>
      {/* Stock Count info */}
      <div>
        {/* header */}
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground'>
            <StockIcon />
          </div>
          <h3 className='font-bold text-[16px]'>Stock Count</h3>
        </div>
        {/* content */}
        {/* <FormItem className=" gap-2 items-center mt-2 mb-2">
          <div className="flex gap-2 items-center">
            <Input
              min={2}
              {...register(`stock_counts.pack_size`, {
                valueAsNumber: true,
              })}
              className="w-[142px]"
              type="number"
            />
            <Input
              id=""
              className="w-[50px]"
              readOnly
              value={watch("storage_unit")}
            />
            <span
              className=" cursor-pointer"
              onClick={() => {
                if (getValues("stock_counts.pack_size") > 1) {
                  append({
                    pack_size: getValues("stock_counts.pack_size") || 0,
                    count: getValues("stock_counts.pack_size") || 0,
                    checked: 1,
                    show_as: "-",
                    unit:
                      "Packs (" +
                      getValues("stock_counts.pack_size") +
                      " " +
                      getValues("storage_unit") +
                      ")",
                    use_report: 0,
                    report_preview:
                      String(getValues("stock_counts.pack_size")) || "",
                  });
                  setValue("stock_counts.pack_size", null);
                }
              }}
            >
              + Add
            </span>
          </div>
        </FormItem> */}
        <div className='rounded-[4px]'>
          <div>
            {getValues('storage_unit')?.length > 0 && (
              <>
                <div className='flex justify-between items-center mt-4 mb-2'>
                  <div className='w-1/4'>Counts as</div>
                  <div className='w-1/4'>Show as</div>
                  <div className='w-1/4'>Use in reports?</div>
                  <div className='w-1/4'>Report preview</div>
                </div>
                {fields?.map((field, index) => (
                  <div className='bg-popover rounded-[4px] flex justify-between items-center p-2'>
                    <div className='w-1/4'>
                      <FormItem className='flex gap-2 items-center'>
                        <Checkbox
                          id='count'
                          checked={!!getValues(`stock_counts.${index}.checked`)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setValue(`stock_counts.${index}.checked`, +checked, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            } else {
                              if (
                                getValues('stock_counts').filter(
                                  (stock: { checked: number }) => stock.checked
                                ).length > 1
                              ) {
                                if (
                                  getValues(`stock_counts.${index}.use_report`) &&
                                  !getValues(`stock_counts.${0}.use_report`)
                                ) {
                                  setValue(`stock_counts.${0}.use_report`, 1, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  })
                                  setValue(`stock_counts.${index}.use_report`, 0)
                                }

                                setValue(`stock_counts.${index}.checked`, 0)
                              }
                            }
                          }}
                        />{' '}
                        <FormLabel htmlFor='location' className='text-sm font-medium mt-0'>
                          {index == 0
                            ? `1 ${watch('storage_unit')}`
                            : `  Packs (${watch(`stock_counts.${index}.count`)} ${watch(
                                'storage_unit'
                              )})`}
                        </FormLabel>
                      </FormItem>
                    </div>

                    <div className='w-1/4 '>
                      <FormItem className='flex gap-1 items-center'>
                        <FormLabel htmlFor='location' className='text-sm font-medium'>
                          1
                        </FormLabel>
                        <CustomSelect
                          width='w-[70px]'
                          placeHolder='Select'
                          options={StockCountUnits}
                          value={
                            getValues(`stock_counts.[${index}].show_as`) === '-' ||
                            !getValues(`stock_counts.[${index}].show_as`)
                              ? ''
                              : getValues(`stock_counts.[${index}].show_as`)
                          }
                          disabled={index == 0}
                          onValueChange={(e) => {
                            if (e === 'null') {
                              setValue(`stock_counts.[${index}].show_as`, '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              return
                            }

                            setValue(`stock_counts.[${index}].show_as`, e, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                            setValue(
                              `stock_counts.[${index}].count`,
                              watch(`stock_counts.${index}.pack_size`)
                            )
                            setValue(
                              `stock_counts.[${index}].report_preview`,
                              index == 0
                                ? `1 ${watch('storage_unit')}`
                                : ` ${watch(`stock_counts.${index}.pack_size`)} Packs`
                            )
                          }}
                        />
                      </FormItem>
                    </div>

                    <div className='w-1/4'>
                      <FormControl>
                        <Switch
                          checked={watch(`stock_counts.[${index}].use_report`)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSwitchChange(index, checked)
                            }
                          }}
                        />
                      </FormControl>
                    </div>

                    <div className='w-1/4'>
                      {`${Number(
                        (
                          watch(`stock_counts.${index}.count`) /
                          watch(`stock_counts`)?.find(
                            (e: { use_report: number }) => e.use_report == 1
                          )?.count
                        ).toFixed(3)
                      )} ${showAs === '-' ? watch('storage_unit') : showAs}`}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
