import { Switch } from '@/components/ui/switch'
import { useFormContext } from 'react-hook-form'

const ClockingMobile = () => {
    const { watch ,setValue} = useFormContext()
    return (
        <div className='px-3 mt-3'>
            <h1 className='font-bold'>Mobile clock in</h1>
            <div className='flex items-center justify-between mt-5'>
                <p>Only allow clocks ins visa Dot app</p>
                <Switch 
                checked={!!watch('mobile_clock_in')}
                onCheckedChange={(e) => {
                    setValue('mobile_clock_in', +e,{ shouldDirty: true })

                }} />
            </div>
        </div>
    )
}

export default ClockingMobile