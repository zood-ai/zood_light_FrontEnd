import CustomAlert from "@/components/ui/custom/CustomAlert";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useFormContext } from "react-hook-form";

type IStationForm = {
  isEdit: boolean;
};
const StationForm = ({ isEdit }: IStationForm) => {
  const { filterObj } = useFilterQuery();
  const { departmentsSelect, isDepartmentsLoading } = useCommonRequests({
    getDepartments: true,
    locationId: filterObj["filter[branch]"],
  });

  const { setValue, register, getValues } = useFormContext();
  return (
    <>
      <div className="flex  gap-[54px] items-center">
        <Input
          label="Station name"
          type="text"
          disabled={isEdit}
          placeholder="Enter name"
          {...register("name")}
        />

        <FormItem className="items-center gap-2 mt-5 ">
          <Label htmlFor="department" className="block mb-2 font-bold">
            Department
          </Label>
          <CustomSelect
            placeHolder="Choose department"
            className="h-[32px] "
            disabled={isEdit}
            removeDefaultOption
            width="w-[200px]"
            loading={isDepartmentsLoading}
            value={getValues("department_id")}
            options={departmentsSelect}
            onValueChange={(e) => {
              setValue("department_id", e, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
        </FormItem>
      </div>
      {isEdit && (
        <CustomAlert
          icon={"👀"}
          className="!mt-8"
          bgColor="bg-[#FFF8F3]"
          colorIcon="var(--info)"
          content=" Careful now! Deleting a station won't change any shifts that are already
        assigned to that station. You'll have to change those on Schedule view."
        />
      )}
    </>
  );
};

export default StationForm;
