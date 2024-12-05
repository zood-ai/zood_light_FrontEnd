import { Checkbox } from "@/components/ui/checkbox";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { contractTypes, wageTypes } from "@/constants/dropdownconstants";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import { useFieldArray, useFormContext } from "react-hook-form";

const CreateModal = () => {
  const { register, watch, setValue, getValues, control, formState } = useFormContext()
  const { filterObj } = useFilterQuery()
  const { positionsSelect, departmentsSelect, branchesSelect,
    isBranchesLoading, isDepartmentsLoading, isPositionsLoading, rolesSelect,
    documentProvidedData, documentReviewedData, documentSignedData
  } = useCommonRequests({
    departmentId: watch('departments.[0].id'),
    locationId: watch('branches.[0].id') || filterObj['filter[branch]'],
    getBranches: true,
    getRoles: true,
    getProvided: true,
    getReviewed: true,
    getSigned: true
  })
  const { append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const documents = watch('documents') || [];

  const handleCheckedChange = (doc, checked) => {
    if (checked) {
      if (!documents.includes(doc)) {
        append({id:doc});
      }
    } else {
      const indexToRemove = documents.findIndex((item) => item === doc);
      if (indexToRemove >= 0) {
        remove(indexToRemove);
      }
    }
  };




  return (
    <>
      <Input label="First name" className="w-[400px]" {...register("first_name", { required: true })}

      />
      <Input label="Last name" className="w-[400px]" {...register("last_name", { required: true })} />

      <Input label="Prefered name (optional)" className="w-[400px]" {...register('preferred_name')} />
      <Input label="Email" className="w-[400px]" {...register('email')} />

      <div className="bg-popover p-[16px] rounded-[10px] mb-[13px]  mt-8 w-[400px] h-40 overflow-x-scroll ">
        <RadioGroup
          className="grid grid-cols-2 gap-2"
          onChange={(event: any) => {
            const selectedValue = event?.target._wrapperState.initialValue;
            setValue('roles', [{ id: selectedValue }]);
          }}
        >
          {rolesSelect?.map((items: { label: string; value: string }) => (
            <div key={items.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={items.value}
                id={items.value}
              />
              <p>{items.label}</p>
            </div>
          ))}
        </RadioGroup>

      </div>

      <CustomSelect options={branchesSelect}
        value={watch('branches.[0].id') || filterObj['filter[branch]']}
        label="Home Location" width="w-[400px]"

        loading={isBranchesLoading}
        onValueChange={(e) => {
          if (e == "null") {
            setValue('branches.[0].id', "")
            return;
          }
          setValue("branches.[0].id", e, { shouldValidate: true })
          setValue("branches.[0].is_home", true, { shouldValidate: true })
        }
        } />
      <CustomSelect
        options={departmentsSelect}
        value={watch('departments.[0].id')}
        label="Department" width="w-[400px]"
        loading={isDepartmentsLoading}
        onValueChange={(e) => {
          if (e == "null") {
            setValue('departments.[0].id', 0)
            return;
          }
          setValue("departments.[0].id", e, { shouldValidate: true })
        }
        } />

      <CustomSelect
        options={positionsSelect}
        label="Position"
        loading={isPositionsLoading}
        width="w-[400px]"
        value={watch('departments.[0].forecast_position_id')}
        onValueChange={(e) => {
          if (e == "null") {
            setValue('departments.[0].forecast_position_id', "")
            return;
          }
          setValue("departments.[0].forecast_position_id", +e, { shouldValidate: true })
        }
        } />
      <div className="flex items-center gap-1">
        <CustomSelect options={contractTypes}
          value={watch('contract')}
          onValueChange={(e) => {
            if (e == "null") {
              setValue('contract', "")
              return;
            }
            setValue('contract', e, { shouldValidate: true })
          }
          }
          label="Contract" width="w-[300px]" />
        <div className="mt-[42px]">
          <Input
            textRight="hrs"
            className="w-[95px]"
            type="number"
            value={getValues('contract_hrs')}
            onChange={(e: any) => {
              if (+e.target.value > 168) {
                setValue('contract_hrs', 168, { shouldValidate: true });
                return
              }
              setValue('contract_hrs', +e.target.value, { shouldValidate: true });
            }}
          />

        </div>
      </div>

      <CustomInputDate
        defaultValue={!watch("start_date") ? null : moment(watch("start_date")).format("YYYY-MM-DD")}
        onSelect={(e) => {
          setValue('start_date', moment(e).format("YYYY-MM-DD"), { shouldValidate: true })
        }}
        label="Start Date"
        className="mt-5 "
        width="w-[400px]"
      />

      <CustomInputDate
        defaultValue={!watch("birth_date") ? null : moment(watch("birth_date")).format("YYYY-MM-DD")}

        onSelect={(e) => {
          setValue('birth_date', moment(e).format("YYYY-MM-DD"), { shouldValidate: true })
        }}
        label="Date of birth"
        className="mt-5 "
        width="w-[400px]"
      />
      <div className="flex items-center gap-2">
        <Input textLeft="SAR" label="Wage" type="number" className="w-[100px]" {...register('wage', { required: true, valueAsNumber: true })} />
        <CustomSelect
          options={wageTypes}
          width="w-[290px] mt-[46px]"
          value={watch('wage_type')}
          onValueChange={(e) => {
            if (e == "null") {
              setValue('wage_type', "")
              return;
            }
            setValue('wage_type', e, { shouldValidate: true })
          }
          }
        />
      </div>

      <p className="font-bold mt-5 mb-1">
        Document that need to be provided by the employee
      </p>
      {documentProvidedData?.data?.map((doc) => (

        <div className="p-[16px] bg-popover rounded-[10px] flex items-center gap-2 w-[400px] my-3">
          <Checkbox
            onCheckedChange={(checked) => handleCheckedChange(doc.id, checked)}
          />
          <p>{doc.name}</p>
        </div>
      ))}

      <p className="font-bold mt-5 mb-1">
        Document that need to be reviewed by the employee
      </p>
      {documentReviewedData?.data?.map((doc) => (

        <div className="p-[16px] bg-popover rounded-[10px] flex items-center gap-2 w-[400px] my-3">
          <Checkbox
            onCheckedChange={(checked) => handleCheckedChange(doc.id, checked)}
          />
          <p>{doc.name}</p>
        </div>
      ))}

      <p className="font-bold mt-5 mb-1">
        Document that need to be signed by the employee
      </p>
      {documentSignedData?.data?.map((doc) => (

        <div className="p-[16px] bg-popover rounded-[10px] flex items-center gap-2 w-[400px] my-3">
          <Checkbox
            onCheckedChange={(checked) => handleCheckedChange(doc.id, checked)}
          />
          <p>{doc.name}</p>
        </div>
      ))}
    </>
  );
};

export default CreateModal;
