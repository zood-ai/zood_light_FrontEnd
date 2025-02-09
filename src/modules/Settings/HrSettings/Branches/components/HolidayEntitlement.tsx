import React from 'react'
import Holiday from "./../../../../Schedulling/People/components/EditModal/Role/Holiday ";
import CustomInputDate from '@/components/ui/custom/CustomInputDate';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

const HolidayEntitlement = () => {
    const { watch ,setValue} = useFormContext()
    return (

        <>
            <div className='px-3'>

                <h1 className='font-bold'>Holiday Entitlements</h1>

                <div className='flex items-center justify-between pt-3'>
                    <p>
                        Holiday year start date
                    </p>
                    <CustomInputDate
                    defaultValue={watch('holiday_entitlements')}
                     onSelect={(date) => {
                        setValue('holiday_entitlements', moment(date).format("YYYY-MM-DD"))
                        console.log(date);
                        
                    }} />

                </div>
            </div>
        </>
    )
}

export default HolidayEntitlement