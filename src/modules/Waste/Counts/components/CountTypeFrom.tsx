import RightIcon from "@/assets/icons/Right";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { typeOptons } from "@/constants/dropdownconstants";
import { cn } from "@/utils";
import { changeFirstLetterToUpperCase } from "@/utils/function";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import useCountsHttp from "../queriesHttp/useCountsHttp";
import { useSearchParams } from "react-router-dom";

interface ICountTypeFrom {
  control: any;
  nextStep: (stepNumber: number, countId: string) => void;
  isEdit: boolean;
  businessDate: string;
  fromReport?: boolean;
  countId?: string;
  handleCloseSheet?: () => void;
  setOpenReport?: (open: boolean) => void;
  setGetReport?: (getReport: boolean) => void;
}
const CountTypeFrom = ({
  control,
  nextStep,
  isEdit,
  businessDate,
  fromReport,
  countId,
  handleCloseSheet,
  setOpenReport,
  setGetReport,
}: ICountTypeFrom) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { setValue, watch, getValues } = useFormContext();
  const [searchParams] = useSearchParams();
  const { createCount, isPendingCreate, updateCounts, isPendingUpdate } =
    useCountsHttp({
      nextStep,
      countId,
      handleCloseSheet,
      setOpenReport,
      setGetReport,
      setBussinessDate: (date: string) => {
        if (!fromReport) {
          setValue("business_date", date, { shouldValidate: true });
        }
      },
    });

  const onCreateCount = async () => {
    if (!isEdit) {
      createCount({
        ...(getValues() as {
          business_date: string;
          type: string;
          day_option: string;
        }),
        branch_id: searchParams.get("filter[branch]") ?? "",
      });
    } else if (fromReport) {
      updateCounts({
        id: countId as string,
        values: getValues(),
      });
    } else {
      nextStep(2, "");
    }
  };

  return (
    <div className="relative flex flex-col h-full gap-4 px-6 ">
      <div className="flex flex-col gap-4">
        {typeOptons.map((type) => (
          <button
            key={type}
            className="flex cursor-pointer items-center justify-between border-b-[#F1F1F1] border-b-[1px] pb-4"
            onClick={() => setValue("type", type)}
          >
            <span className="font-medium text-textPrimary">
              {changeFirstLetterToUpperCase(type)}
            </span>

            {watch("type") === type && (
              <RightIcon color="var(--secondary-foreground)" />
            )}
          </button>
        ))}
      </div>
      <FormField
        control={control}
        name="business_date"
        render={({ field }) => (
          <FormItem className="relative flex flex-col">
            <FormControl onClick={() => setShowDatePicker(!showDatePicker)}>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "py-3 pl-3 h-[33px] text-left font-normal ",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "dd MMMM yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
              </Button>
            </FormControl>

            {showDatePicker && (
              <>
                <Calendar
                  mode="single"
                  className="absolute z-10 bg-white top-10"
                  selected={new Date(field.value)}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }
                    field.onChange(format(date, "yyyy-MM-dd"));
                    setShowDatePicker(false);
                  }}
                  fromDate={new Date(businessDate)}
                />
                <div
                  className="absolute top-16 z-[2]  h-screen w-full"
                  onClick={() => setShowDatePicker(false)}
                />
              </>
            )}
          </FormItem>
        )}
      />

      <div className="w-[170px] text-gray-500 flex items-center justify-around min-h-[32px] border-[#E1E9ED] border rounded-sm">
        {["start", "end"].map((day) => (
          <button
            key={day}
            className={`${
              watch("day_option") === day && "bg-popover gap-1 flex-[1.2]"
            } cursor-pointer gap-1 flex-[1.2] w-full h-full flex items-center justify-center`}
            onClick={() => setValue("day_option", day)}
          >
            {watch("day_option") === day && (
              <RightIcon color="var(--secondary-foreground)" />
            )}
            Day {day}
          </button>
        ))}
      </div>

      <div className="absolute left-0 flex items-end justify-center w-full px-2 -bottom-4">
        <Button
          disabled={
            !watch("type") ||
            !watch("day_option") ||
            !watch("business_date") ||
            isPendingCreate ||
            isPendingUpdate
          }
          onClick={() => onCreateCount()}
          className="bg-primary font-semibold h-[48px] w-full"
        >
          {fromReport ? "Finish update" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default CountTypeFrom;
