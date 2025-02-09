import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useCommonRequests from "@/hooks/useCommonRequests";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { DaysOptions, TimeOptions } from "@/constants/dropdownconstants";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const OrderRules = () => {
  const { control, getValues, watch } = useFormContext();
  const { branchesSelect } = useCommonRequests({ getBranches: true });

  const { fields: branches } = useFieldArray({
    control,
    name: "branches",
  });

  const [searchItem, setSearchItem] = useState("");

  const handleInputChange = (e: any) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
  };

  const [branchesFilter, setBranchesFilter] = useState<any>();

  useEffect(() => {
    setBranchesFilter(branches);
  }, []);
  useEffect(() => {
    if (searchItem) {
      setBranchesFilter(
        branches?.filter((branch: any) => branch?.name?.includes(searchItem))
      );
    } else {
      setBranchesFilter(branches);
    }
  }, [branches, searchItem]);

  return (
    <>
      <div className="bg-popover  justify-between border-gray-200 border-[1px] h-[64px] rounded-[4px] flex items-center p-[24px] ">
        <div className="flex gap-[16px] ">
          <Input
            placeholder={"Search by Branch"}
            searchIcon={true}
            onChange={handleInputChange}
            defaultValue={searchItem}
          />
        </div>
        {searchItem?.length ? (
          <p
            className="text-primary cursor-pointer"
            onClick={() => {
              setSearchItem("");
            }}
          >
            {" "}
            Clear filters
          </p>
        ) : (
          <></>
        )}
      </div>
      {branchesFilter?.map(
        // @ts-ignore
        (branch: { id: string; name: string }, indexBranch: number) => (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            key={branch.id}
          >
            <AccordionItem value={`item-${indexBranch + 1}`}>
              <AccordionTrigger className="font-bold text-[18px] capitalize my-2 text-text">
                {branchesSelect?.find(
                  (e: { value: string }) => e?.value == branch?.name
                )?.label || branch?.name}
              </AccordionTrigger>
              <AccordionContent className="text-text">
                <div className="grid grid-cols-2">
                  <p className="pb-6 font-bold">For delivery on</p>
                  <p className="pb-3 font-bold mb-2">Order by</p>
                </div>
                {DaysOptions?.map((day, index) => {
                  const removedBranchIndex: number = watch(
                    `branches.${indexBranch}.order_rules`
                  )?.findIndex((branch) => branch?.delivery_day === day?.value);

                  return (
                    <Controller
                      control={control}
                      name={`branches.${indexBranch}.order_rules`}
                      render={({
                        field: { onChange, onBlur, value = [], ref },
                      }) => (
                        <div
                          className="grid grid-cols-2 mb-5 items-center text-text"
                          key={index}
                        >
                          <div>
                            <Checkbox
                              key={day.value}
                              defaultChecked={
                                getValues(
                                  `branches.${indexBranch}.order_rules`
                                )?.find(
                                  (v: { delivery_day: string }) =>
                                    v.delivery_day === day.label
                                )
                                  ? true
                                  : false
                              }
                              onCheckedChange={(checked: boolean) => {
                                if (checked) {
                                  const newValue: Array<{}> = [
                                    ...value,
                                    {
                                      delivery_day: day?.label,
                                    },
                                  ];
                                  onChange(newValue);
                                } else {
                                  onChange(
                                    value.filter(
                                      (v: { delivery_day: string }) =>
                                        v.delivery_day !== day.label
                                    )
                                  );
                                }
                              }}
                            />
                            <span className="mx-5">{day.label}</span>
                          </div>
                          <div>
                            <div className="flex gap-3">
                              <CustomSelect
                                options={DaysOptions}
                                width="w-[140px]"
                                placeHolder="Choose day"
                                disabled={
                                  !watch(
                                    `branches.${indexBranch}.order_rules.${removedBranchIndex}.delivery_day`
                                  )
                                }
                                value={
                                  getValues(
                                    `branches.${indexBranch}.order_rules`
                                  )?.find(
                                    (v: { delivery_day: string }) =>
                                      v.delivery_day === day.label
                                  )?.order_day
                                }
                                onValueChange={(val) => {
                                  const selectedDayObj = value.find(
                                    (d: { delivery_day: string }) =>
                                      d.delivery_day === day.label
                                  );
                                  const newValue: Array<{}> = [
                                    ...value.filter(
                                      (va: { delivery_day: string }) =>
                                        va.delivery_day !== day.label
                                    ),
                                    { ...selectedDayObj, order_day: val },
                                  ];
                                  onChange(newValue);
                                }}
                                optionDefaultLabel="Choose day"
                              />
                              <CustomSelect
                                options={TimeOptions}
                                width="w-[80px]"
                                disabled={
                                  !watch(
                                    `branches.${indexBranch}.order_rules.${removedBranchIndex}.delivery_day`
                                  )
                                }
                                value={
                                  getValues(
                                    `branches.${indexBranch}.order_rules`
                                  )?.find(
                                    (v: { delivery_day: string }) =>
                                      v.delivery_day === day.label
                                  )?.order_time
                                }
                                onValueChange={(val) => {
                                  const selectedDayObj = value.find(
                                    (d: { delivery_day: string }) =>
                                      d.delivery_day === day.label
                                  );
                                  const newValue: Array<{}> = [
                                    ...value.filter(
                                      (va: { delivery_day: string }) =>
                                        va.delivery_day !== day.label
                                    ),
                                    { ...selectedDayObj, order_time: val },
                                  ];
                                  onChange(newValue);
                                  console.log(
                                    newValue?.find(
                                      (e: any) => e.order_time == ""
                                    ),
                                    "newValue"
                                  );
                                  console.log(selectedDayObj, "selectedDayObj");

                                  if (
                                    newValue?.find(
                                      (e: any) => e.order_time == ""
                                    )
                                  ) {
                                    onChange(
                                      value.filter(
                                        (v: { delivery_day: string }) =>
                                          v.delivery_day !== day.label
                                      )
                                    );
                                  }
                                }}
                                optionDefaultLabel="Choose time"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      )}

      {/* ---------- */}
    </>
  );
};

export default OrderRules;
