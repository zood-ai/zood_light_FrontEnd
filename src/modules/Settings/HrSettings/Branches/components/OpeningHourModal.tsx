
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm, useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeOptions } from "@/constants/dropdownconstants";
import { getDay } from "@/utils/function";

const OpeningHourModal = ({

    openCloseModal,
    setModalName,
    setOpenCloseModal,

}: {

    openCloseModal: boolean;
    setModalName: any;
    setOpenCloseModal: Dispatch<SetStateAction<boolean>>;

}) => {
    const defaultValues = {

    };
    const handleCloseSheet = () => {
        form.reset(defaultValues);
        setOpenCloseModal(false);
    };
    const form = useForm({});
    const { watch, setValue } = useFormContext()
    const onSubmit = (values: any) => {
    };


    return (
        <CustomSheet
            isOpen={openCloseModal}
            handleCloseSheet={handleCloseSheet}
            headerLeftText={"Opening hours"}
            form={form}
            btnText="Save Changes"
            setModalName={setModalName}
            headerStyle="border-b-0 flex items-center justify-between w-full"
            contentStyle="p-0"
            width="w-[700px]"
            onSubmit={onSubmit}

        >
            <>
                {watch("opening_hours")?.map((day, i) => (
                    <div className="grid grid-cols-4 px-3 py-3 items-center border-b border-input">
                        <p>

                            {getDay(day?.day)}
                        </p>
                        <div className="flex items-center gap-3 col-span-2">
                            <p>open from</p>
                            <CustomSelect options={TimeOptions} width="w-[60px]"
                                value={watch(`opening_hours.${i}.from`)}
                                onValueChange={(e) => {
                                    setValue(`opening_hours.${i}.from`, e)
                                }
                                }
                            />
                            <p>to</p>
                            <CustomSelect options={TimeOptions} width="w-[60px]"
                                value={watch(`opening_hours.${i}.to`)}
                                onValueChange={(e) => {
                                    setValue(`opening_hours.${i}.to`, e)
                                }
                                }
                            />
                        </div>
                        <div className="flex gap-2 items-center justify-self-end">
                            <Checkbox
                                checked={!!watch(`opening_hours.${i}.is_closed`)}
                                onCheckedChange={(e) => {
                                    setValue(`opening_hours.${i}.is_closed`, !!e)
                                }}
                            />
                            <p>Closed</p>
                        </div>

                    </div>
                ))}
            </>
        </CustomSheet>
    );
};

export default OpeningHourModal;
