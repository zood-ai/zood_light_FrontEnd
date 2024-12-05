import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ROLES_TYPES } from '@/constants/dropdownconstants'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

const AddEditRole = () => {
    const { setValue, control, watch } = useFormContext()
    const { append, remove, fields } = useFieldArray({
        control,
        name: "authorities",
    });

    const authorities = watch('authorities') || [];

    const handleCheckedChange = (role, checked) => {
        if (checked) {
            if (!authorities.includes(role)) {
                append(role);
            }
        } else {
            const indexToRemove = authorities.findIndex((item) => item === role);
            if (indexToRemove >= 0) {
                remove(indexToRemove);
            }
        }
    };

    return (
        <>
            <Input
                label="Name"
                placeholder="Enter name"
                className='mb-3'
                value={watch('name')}
                onChange={(e) => {
                    setValue('name', e.target.value, {
                        shouldDirty: true,
                        shouldValidate: true
                    });
                }}
            />
            <Label>Authorities</Label>
            <div className="flex flex-col gap-3 bg-popover px-[16px] py-[10px] mt-[16px] rounded-[4px]">
                {ROLES_TYPES.map((role, index) => (
                    <div className="border-b border-white pb-[10px] flex items-center justify-between" key={index}>
                        {role}
                        <Switch
                            checked={watch('authorities').includes(role)}
                            onCheckedChange={(checked) => handleCheckedChange(role, checked)}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default AddEditRole;
