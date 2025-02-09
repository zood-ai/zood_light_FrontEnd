import { Input } from '@/components/ui/input'
import React from 'react'
import { useFormContext } from 'react-hook-form';

const ContentModifier = () => {
    const { register } = useFormContext();

    return (
        <>
            <Input label="Name" className="w-full" placeholder="Modifier name" {...register('name')} required />
            <Input label="Name Localized" className="w-full" placeholder="Modifier name localized" {...register('name_localized')} />
            <Input label="Reference" className="w-full" placeholder="Reference" {...register('reference')} />
        </>
    )
}

export default ContentModifier