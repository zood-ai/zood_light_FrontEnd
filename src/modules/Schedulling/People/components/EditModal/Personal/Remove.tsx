import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import usePeopleHttp from "../../../queriesHttp/usePeopleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useFormContext } from "react-hook-form";
import { resaonsDelete } from "@/constants/dropdownconstants";
import CustomModal from "@/components/ui/custom/CustomModal";
import { useState } from "react";
const Remove = ({handleCloseSheet}: any) => {
  const [modalName, setModalName] = useState("");

  const { deleteEmployee } = usePeopleHttp({handleCloseSheet: handleCloseSheet})
  const { filterObj } = useFilterQuery()
  const { watch,setValue } = useFormContext()
  const handleConfirm = () => {
    deleteEmployee({ id: filterObj?.id||'',reason_removed:watch('reason_removed')})
    setModalName("")
  }
  return (
    <div className="border border-warn rounded-[4px] mt-[40px] p-[16px]">
      <div className="flex items-center">
        <p className="text-[20px] text-warn pr-2 ">X</p>
        <p className="">Remove this employee</p>
      </div>

      <p className="text-warn pb-8">
        Removed employees can’t be rostered and all their pending requests will
        be deleted
      </p>

      <p className="text-warn pb-4">
        Dot can pay out their remaining holidays, too – just remember that your
        salaried employees’ holidays are calculated pro rata from the start of
        the holiday year for their home location.
      </p>

      <CustomSelect options={resaonsDelete} 
      label="Reason of removal"
       className="pb-8" 
       
       value={watch('reason_removed')}
        onValueChange={(e) => {
        setValue('reason_removed', e)
      }} />

      <div className="flex flex-col gap-4 mt-5">
        {/* <Label>Holiday entitlement</Label>
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" disabled />
            <Label htmlFor="r1" className="text-[#D1D5D7]">
              Pay out holiday entitlements automatically
            </Label>
          </div>
        </RadioGroup>

        <p className="text-warn">
          Holiday entitlements can’t be paid out because this employee has a
          negative balance
        </p>

        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" disabled />
            <Label htmlFor="r1">Do not pay entitlements</Label>
          </div>
        </RadioGroup> */}

        <Button
          className="w-fit px-4 font-semibold text-warn border-warn "
          disabled={!watch('reason_removed')}
          variant="outline"
          type="button"
          onClick={() => {
            setModalName("remove")
          }}
        >
          Remove
        </Button>
      </div>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={ ""}
      />
    </div>
  );
};

export default Remove;
