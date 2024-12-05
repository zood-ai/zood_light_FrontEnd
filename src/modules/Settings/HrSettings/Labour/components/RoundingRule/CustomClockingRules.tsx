import CustomAlert from '@/components/ui/custom/CustomAlert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { register } from "module";

const CustomClockingRules = () => {
    const { control, register, setValue, watch } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "break_rules",
    });
    console.log(fields);

    return (
        <>
            <CustomAlert
                bgColor="bg-[#edfafcff]"
                colorIcon="var(--secondary-foreground)"
                className="mb-3"
                content={`Set up automated rues to compty with labour laws.`}
            />
            <Label>Custom rules</Label>
            {fields?.map((item, index) => (
                <div className='mt-5 p-5 bg-popover rounded-[4px] flex flex-col gap-3 relative'>
                    <div className='absolute right-0 pr-5 text-[20px] text-gray cursor-pointer' onClick={() => {
                        remove(index)
                    }
                    }>X</div>
                    <div className="flex items-center gap-2">
                        <p>
                            When a shift is equal or greater than
                        </p>
                        <Input className="w-[70px]"
                            value={watch(`break_rules.${index}.shit_hours`)}
                            min={0}

                            onChange={(e) => {
                                setValue(`break_rules.${index}.shit_hours`, +e.target.value, { shouldDirty: true, shouldValidate: true })
                            }}
                        />
                        <p>
                            hours,
                        </p>
                    </div>
                    {/* -------------------------- */}
                    <div className="flex items-center gap-2">
                        <p>
                            the <span className="font-bold">Paid</span> break will be
                        </p>
                        <Input className="w-[70px]"
                            min={0}
                            value={watch(`break_rules.${index}.paid_minutes`)}
                            onChange={(e) => {

                                setValue(`break_rules.${index}.paid_minutes`, +e.target.value, { shouldDirty: true, shouldValidate: true })

                            }}
                        />
                        <p>
                            minutes
                        </p>
                    </div>
                    {/* -------------------------- */}
                    <div className="flex items-center gap-2">
                        <p>
                            the remaining <span className="font-bold">UnPaid</span> break will be for
                        </p>
                        <Input className="w-[70px]"
                            min={0}
                            value={watch(`break_rules.${index}.unpaid_minutes`)}
                            onChange={(e) => {
                                setValue(`break_rules.${index}.unpaid_minutes`, +e.target.value, { shouldDirty: true, shouldValidate: true })
                            }}
                        />
                        <p>
                            minutes
                        </p>
                    </div>

                </div>
            ))}
            <div className="border border-input rounded-[4px] mt-5 p-3 font-bold text-primary text-[16px] cursor-pointer"
                onClick={() => {
                    append({ shit_hours: 0, paid_minutes: 0, unpaid_minutes: 0 })
                }
                }

            >
                Add break rule +

            </div>
        </>
    )
}

export default CustomClockingRules