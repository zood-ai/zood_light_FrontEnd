import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import EmojiPicker from "emoji-picker-react/dist/emoji-picker-react.esm";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';

const ShiftType = () => {
    const { register, setValue, watch } = useFormContext()
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

    const toggleEmojiPicker = () => {
        setEmojiPickerVisible(!isEmojiPickerVisible);
    };

    const onEmojiClick = (emojiObject) => {


        setValue('icon', emojiObject.emoji, { shouldValidate: true })
        setEmojiPickerVisible(false);
    };


    return (
        <>
            <div className='flex items-center gap-2 mb-5'>

                <Input type="text" label="Shift name" placeholder="e.g. Training" className="w-[300px]"
                    {...register("name", { required: true })} />
                <div className='mt-[45px]'>

                    <button onClick={toggleEmojiPicker}
                        type="button"
                        className=" rounded-[4px] border border-input p-[5px]">
                        {watch('icon') ? watch('icon') : ""}
                    </button>
                    {isEmojiPickerVisible && (
                        <div className="absolute mt-2">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
            </div>

            <Label >Shift pay</Label>

            <RadioGroup
                className="flex items-center gap-2 my-5"
                defaultValue={watch('is_paid') == 1 ? "true" : "false"}
                onValueChange={(value) => {
                    const selectedValue = value === "true";  // convert to boolean
                    setValue('is_paid', selectedValue, { shouldValidate: true });
                }}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" />
                    <p>Paid</p>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" />
                    <p>UnPaid</p>
                </div>
            </RadioGroup>



            <Label >Settings</Label>

            <div className='flex flex-col gap-4 mt-5'>
                <div className='flex items-center space-x-2'>

                    <Checkbox
                        checked={!!(watch("include_employee_working_hours"))}
                        onCheckedChange={(checked) => {
                            setValue('include_employee_working_hours', !!checked, { shouldValidate: true })
                        }}
                    />
                    <Label htmlFor="">Include in employees working hours and cost of labour</Label>
                </div>

                <div className='flex items-center space-x-2'>

                    <Checkbox
                        checked={!!(watch("employee_need_to_punch"))}
                        onCheckedChange={(checked) => {
                            setValue('employee_need_to_punch', !!checked, { shouldValidate: true })
                        }}
                    />
                    <Label htmlFor="">Employee needs to punch in for this shift</Label>
                </div> <div className='flex items-center space-x-2'>

                    <Checkbox
                        checked={!!(watch("deleted_when_schedule_cleared"))}
                        onCheckedChange={(checked) => {
                            setValue('deleted_when_schedule_cleared', !!checked, { shouldValidate: true })
                        }}
                    />
                    <Label htmlFor="">Shift will be deleted when the schedule is cleared</Label>
                </div>

            </div>
        </>
    );
};

export default ShiftType;
