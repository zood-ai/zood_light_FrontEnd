import { Checkbox } from '@/components/ui/checkbox'
import CustomAlert from '@/components/ui/custom/CustomAlert'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DaysOptions, OverTimeOptions } from '@/constants/dropdownconstants'
import { useFormContext } from 'react-hook-form'

const OverTime = () => {
    const { watch, setValue } = useFormContext()
    return (
        <>

            <Input type="text" label="Rule name" placeholder="Type the rule's name" className="w-[300px]"
                value={watch('name')}
                onChange={(e) => {
                    setValue('name', e.target.value, {
                        shouldDirty: true,
                        shouldValidate: true
                    });
                }}
            />

            <CustomSelect
                options={OverTimeOptions}
                value={watch('scenario')}
                label="Scenario"
                width="w-[300px]"
                onValueChange={(e) => {
                    setValue('scenario', e, {
                        shouldDirty: true,
                        shouldValidate: true
                    });
                }}
            />
            <div className='mt-5 p-5 bg-popover rounded-[4px] '>
                {watch('scenario') == 1 ? <div className='flex items-center gap-2 mb-3'>
                    <p>

                        When the employee works a shift that falls on
                    </p>
                    <CustomSelect options={DaysOptions}
                        value={watch('day')}

                        width="w-[100px]"
                        onValueChange={(e) => {
                            setValue('day', e, {
                                shouldDirty: true,
                                shouldValidate: true
                            });
                        }}
                    />
                </div> :
                    (
                        <div className='flex items-center gap-2 mb-3'>
                            <p>

                                When the employee works over
                            </p>
                            <Input type="text" className="w-[70px]"
                                value={watch('hours_per_week')}
                                onChange={(e) => {
                                    setValue('hours_per_week', +e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true
                                    });
                                }} />
                            <p>
                                hours in a week
                            </p>
                        </div>
                    )}


                <div className='flex items-center gap-2'>
                    <p>

                        The they will be paid
                    </p>
                    <Input type="text" className="w-[70px]"

                        value={watch('paid_rate')}
                        onChange={(e) => {
                            setValue('paid_rate', +e.target.value, {
                                shouldDirty: true,
                                shouldValidate: true
                            });
                        }} />
                    <p>

                        times their regular pay rate
                    </p>
                </div>

            </div>

            {watch('scenario') == 1 ? <div className='mt-3'>
                <Label>Applies to</Label>

                <div className='flex items-center space-x-2 mt-5'>

                    <div className='flex items-center space-x-2'>

                        <Checkbox
                            checked={!!watch("applies_to_hourly")}
                            onCheckedChange={(e) => {
                                setValue('applies_to_hourly', !!e, { shouldValidate: true, shouldDirty: true })
                            }}
                        />
                        <Label htmlFor="">Hourly employees</Label>
                    </div>

                    <div className='flex items-center space-x-2 '>

                        <Checkbox
                            checked={!!watch("applies_to_daily")}
                            onCheckedChange={(e) => {
                                setValue('applies_to_daily', !!e, { shouldValidate: true, shouldDirty: true })
                            }}
                        />
                        <Label htmlFor="">Daily employees</Label>
                    </div>

                    <div className='flex items-center space-x-2 '>

                        <Checkbox
                            checked={!!watch("applies_to_salaried")}

                            onCheckedChange={(e) => {
                                setValue('applies_to_salaried', !!e, { shouldValidate: true, shouldDirty: true })
                            }}
                        />
                        <Label htmlFor="">Salaried employees</Label>
                    </div>
                </div>
            </div> : <>
                <CustomAlert
                    bgColor="bg-[#edfafcff]"
                    colorIcon="var(--secondary-foreground)"
                    className="mb-3"
                    content={`This overtime scenario only applies to hourly employees.`}
                />            </>}

        </>
    )
}

export default OverTime