import { Input } from '@/components/ui/input'
import React from 'react'
import { useFormContext } from 'react-hook-form'

const LabourTargets = () => {
    const { watch, setValue } = useFormContext()
    return (
        <div>
            <h1 className='text-xl font-bold'> 🎯 Labour Targets</h1>
            <div className='flex justify-between items-center p-3'>
                <p>Weekly target</p>
                <div>
                    <Input 
                    textRight='%'
                    type='number'
                     className='w-[100px]'
                        value={watch('weekly_target')}
                        onChange={(e) => {
                            setValue('weekly_target', +e.target.value,{ shouldDirty: true })
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default LabourTargets