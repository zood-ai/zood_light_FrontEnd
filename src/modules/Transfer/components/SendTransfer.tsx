import { Button } from "@/components/ui/button";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const SendTransfer = ({
  setSteps,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
}) => {
  const { branchesSelect } = useCommonRequests({
    getBranches: true,
  });
  const [date, setDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const { setValue, watch, getValues } = useFormContext();
  const [branch, setBranches] = useState([]);
  const { filterObj } = useFilterQuery();
  useEffect(() => {
    const filterBranches = branchesSelect?.filter(
      (branch: any) => branch?.value !== filterObj["filter[branch]"]
    );
    setBranches(filterBranches);
  }, [branchesSelect]);

  useEffect(() => {
    setValue("warehouse_id", filterObj["filter[branch]"]);
  }, []);

  return (
    <div className="px-[8px] mt-[25px]">
      <div className="flex justify-between items-center ">
        <p>
          Send to<span className="text-warn">*</span>
        </p>
        <div>
          <CustomSelect
            placeHolder="Choose one"
            options={branch}
            width="w-[150px]"
            value={watch("branch_id")}
            onValueChange={(e) => {
              if (e == "null") {
                setValue("branch_id", null);
              } else {
                setValue("branch_id", e);
              }
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-[8px]">
        <p>
          Delivery date<span className="text-warn">*</span>
        </p>
        <div>
          <CustomInputDate
            width="w-[150px] "
            date={watch("delivery_date")}
            defaultValue={watch("delivery_date")}
            onSelect={(selectedDate) => {
              setValue(
                "delivery_date",
                moment(selectedDate).format("YYYY-MM-DD")
              );
            }}
          />
        </div>
      </div>
      <Button
        className="w-[645px] absolute bottom-0 mb-2 ml-1 bg-primary font-semibold h-[48px] rounded-3xl"
        disabled={!watch("branch_id")?.length}
        onClick={() => {
          setSteps(4);
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default SendTransfer;
