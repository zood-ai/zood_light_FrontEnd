import ClearIcon from '@/assets/icons/Clear';
import { Button } from '@/components/ui/button';
import CustomInputDate from '@/components/ui/custom/CustomInputDate';
import CustomSelect from '@/components/ui/custom/CustomSelect';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TimeOptions, Types } from '@/constants/dropdownconstants';
import moment from 'moment';
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

const HolidayandEvents = () => {
    const { control, register, setValue, watch } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "single_holiday",
    });

    const { fields: fieldsHolidays, append: appendHolidays } = useFieldArray({
        control,
        name: "holidays",
    });



    console.log(fields, "watch holiday");


    return (
        <>
            <div className='px-3 pt-5'>
                <div className='flex items-center justify-between  font-bold'>

                    <h1>Holiday and Events</h1>

                </div>


                <div className='grid grid-cols-7 pt-5 font-bold' >
                    <p>Name</p>
                    <p >Dates</p>
                    <p >Dine In </p>
                    <p >Pick Up </p>
                    <p >Delivery </p>
                    <p >Drive Thru </p>
                    <p >Delivery Partners </p>
                </div>
                {fieldsHolidays?.length > 0 ?
                    (
                        <div className='flex flex-col    justify-between items-center'>
                            {fieldsHolidays?.map((field: any, i) => (
                                <div className='grid grid-cols-7 pt-5 gap-3' >
                                    <p>{field.name}</p>
                                    <p>{moment(field.from).format('ll')}-{moment(field.to).format('ll')}</p>

                                    <p>{field.dine_in_checked == false ? <div className='flex items-center gap-2'><ClearIcon className='h-2 w-2' /> Closed</div> : <>{field.dine_in_from}-{field.dine_in_to}</>}</p>
                                    <p>{field.pickup_checked == false ? <div className='flex items-center gap-2'><ClearIcon className='h-2 w-2' /> Closed</div> : <>{field.pickup_from}-{field.pickup_to}</>}</p>
                                    <p>{field.delivery_checked == false ? <div className='flex items-center gap-2'><ClearIcon className='h-2 w-2' /> Closed</div> : <>{field.delivery_from}-{field.delivery_to}</>}</p>
                                    <p>{field.drive_thru_checked == false ? <div className='flex items-center gap-2'><ClearIcon className='h-2 w-2' /> Closed</div> : <>{field.drive_thru_from}-{field.drive_thru_to}</>}</p>
                                    <p>{field.delivery_partners_checked == false ? <div className='flex items-center gap-2'><ClearIcon className='h-2 w-2' /> Closed</div> : <>{field.delivery_partners_from}-{field.delivery_partners_to}</>}</p>
                                </div>
                            ))}
                        </div>
                    ) :
                    (
                        <div className='flex justify-center items-center'>
                            <p>No holiday added</p>

                        </div>
                    )

                }


                {/* -----------------------------------Add----------------------------------- */}

                {fields.map((_, i) => (
                    <div className='p-5 bg-popover rounded-lg mt-5'>
                        <div className='flex justify-between items-center'>

                            <h1 className='font-bold'>Add a holdiay</h1>
                            <ClearIcon onClick={() => {
                                remove(i)
                            }
                            } />
                        </div>
                        <div className='flex  items-center gap-4  mt-2 pb-5  border-b border-white'>
                            <Input label='Name' className='w-[150px]'
                                {...register(`single_holiday.${i}.name`)}
                            />
                            <CustomInputDate
                                className='mt-5'
                                label='From'
                                onSelect={(e) => {
                                    setValue(`single_holiday.${i}.from_date`, moment(e).format("YYYY-MM-DD"))
                                }}
                                defaultValue={watch(`single_holiday.${i}.from_date`)}

                            />
                            <CustomInputDate
                                className='mt-5'
                                label='To'
                                onSelect={(e) => {
                                    setValue(`single_holiday.${i}.to_date`, moment(e).format("YYYY-MM-DD"))
                                }}
                                defaultValue={watch(`single_holiday.${i}.to_date`)}

                            />
                        </div>

                        <div className='flex items-center gap-3 mt-5'>
                            <Switch
                                checked={Types?.map((type) => watch(`single_holiday.${i}.${type?.value}_checked`))?.map((item) => item == true).includes(true)}
                                onCheckedChange={(e) => {
                                    Types?.map((type) =>
                                        setValue(`single_holiday.${i}.${type?.value}_checked`, +e)
                                    )

                                }} />
                            <p className='font-bold'>Location open</p>
                        </div>

                        {Types?.map((type) =>
                        (
                            <div className='grid  grid-cols-3 mt-3 '>

                                <div className='flex gap-3 items-center'>
                                    <Switch
                                        checked={watch(`single_holiday.${i}.${type?.value}_checked`)}
                                        disabled={watch(`single_holiday.${i}.${type?.value}_checked`) == false}
                                        onCheckedChange={(e) => {
                                            setValue(`single_holiday.${i}.${type?.value}_checked`, +e)
                                        }} />
                                    <p className='font-bold'>{type?.label}</p>
                                </div>
                                <div className="flex items-center gap-3 col-span-2">
                                    <p>open from</p>
                                    <CustomSelect
                                        disabled={watch(`single_holiday.${i}.${type?.value}_checked`) == false}
                                        options={TimeOptions} width="w-[60px]"
                                        value={watch(`single_holiday.${i}.${type?.value}_from`)}
                                        onValueChange={(e) => {
                                            setValue(`single_holiday.${i}.${type?.value}_from`, e)
                                        }}
                                    />
                                    <p>to</p>
                                    <CustomSelect
                                        disabled={watch(`single_holiday.${i}.${type?.value}_checked`) == false}
                                        options={TimeOptions}
                                        width="w-[60px]"
                                        value={watch(`single_holiday.${i}.${type?.value}_to`)}
                                        onValueChange={(e) => {
                                            setValue(`single_holiday.${i}.${type?.value}_to`, e)
                                        }}
                                    />

                                </div>
                            </div>
                        ))}

                        <Button variant="default" className="w-fit px-4 mt-2"
                            type="button"
                            disabled={!watch("single_holiday")?.[0]?.name}
                            // loading={isLoadingAdd}
                            onClick={() => {
                                appendHolidays(watch("single_holiday"))
                                remove(i)

                            }}
                        >
                            Save
                        </Button>
                    </div>
                ))}
                <div className='flex justify-end'>
                    <button className={`cursor-pointer text-right py-3 font-bold text-primary text-[16px] ${fields.length == 1 ? "text-primary-foreground" : ""}`}
                        disabled={fields.length == 1}
                        onClick={() => {
                            append({
                                name: "",
                                to_date: moment(new Date()).format("YYYY-MM-DD"),
                                from_date: moment(new Date()).format("YYYY-MM-DD"),
                                dine_in_checked: 1,
                                pickup_checked: 1,
                                delivery_checked: 1,
                                drive_thru_checked: 1,
                                delivery_partners_checked: 1,
                                dine_in_to: "09:00",
                                dine_in_from: "23:00",
                                pickup_to: "09:00",
                                pickup_from: "23:00",
                                delivery_to: "09:00",
                                delivery_from: "23:00",
                                drive_thru_to: "09:00",
                                drive_thru_from: "23:00",
                                delivery_partners_to: "09:00",
                                delivery_partners_from: "23:00"

                            })
                        }}>
                        + Add Holiday
                    </button>
                </div>
            </div>
        </>
    )
}

export default HolidayandEvents