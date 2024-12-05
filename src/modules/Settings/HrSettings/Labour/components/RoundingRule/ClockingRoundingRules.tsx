import CustomAlert from '@/components/ui/custom/CustomAlert'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { clockPeriod, clockRules } from '@/constants/dropdownconstants'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

const ClockingRoundingRules = () => {
    const { control, setValue, watch } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "rounding_rules",
    });
    console.log(fields);

    return (
        <div className='mt-5'>
            <Label> Clock rounding rules</Label>

            <CustomAlert
                bgColor="bg-[#edfafcff]"
                colorIcon="var(--secondary-foreground)"
                className="mb-3"
                content={`Choose when clocking in and out should be rounded to the predefined scheduled shifts.`}
            />
            {/* custom rules */}
            <Label> Custom rules</Label>
            {fields.map((_, index) => (
                <div className='mt-5 p-5 bg-popover rounded-[4px] flex flex-col gap-3 relative'>
                    <div className='absolute right-0 pr-5 text-[20px] text-gray cursor-pointer' onClick={() => {
                        remove(index)
                    }
                    }>X</div>
                    <div className="flex flex-col gap-4">
                        <p>
                            Rounded to schedules time, when employees
                        </p>


                        <div className="flex items-center gap-2">
                            <CustomSelect options={clockRules} width="w-[100px]"
                                value={watch(`rounding_rules.${index}.type`)}
                                onValueChange={(e) => {
                                    setValue(`rounding_rules.${index}.type`, e, { shouldDirty: true, shouldValidate: true })
                                }}
                            />
                            <CustomSelect options={clockPeriod} width="w-[100px]"
                                value={watch(`rounding_rules.${index}.option`)}
                                onValueChange={(e) => {
                                    setValue(`rounding_rules.${index}.option`, e, { shouldDirty: true, shouldValidate: true })
                                }}
                            />
                            <p>for a period of up to </p>
                            <Input className="w-[70px]" value={watch(`rounding_rules.${index}.minutes`)}
                                onChange={(e) => {
                                    setValue(`rounding_rules.${index}.minutes`, +e.target.value, { shouldDirty: true, shouldValidate: true })
                                }}
                            />
                            <p>minutes</p>
                        </div>

                    </div>

                </div>

            ))}

            {/* --------------------------------------------------------- */}
            <div className="border border-input rounded-[4px] mt-5 p-3 font-bold text-primary text-[16px] cursor-pointer"
                onClick={() => {

                    append({ type: "", option: "", minutes: 0 })
                }
                }

            >
                Add clock rounding rule +

            </div>
        </div>
    )
}

export default ClockingRoundingRules