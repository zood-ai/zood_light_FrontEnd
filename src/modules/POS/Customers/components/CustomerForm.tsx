import FolderIcon from "@/assets/icons/Folder";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ICustomersList } from "../types/type";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { cn } from "@/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const CustomerForm = ({
  isEdit,
  CustomerOne,
}: {
  isEdit: boolean;
  CustomerOne: ICustomersList;
}) => {
  const { register, setValue, control } = useFormContext();
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3 ">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <FolderIcon />
        </div>
        <h3 className="font-medium text-textPrimary text-[16px]">
          Customer details
        </h3>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex  justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-textPrimary text-[16px]">
              Name <span className="text-warn">*</span>
            </Label>
            <Input id="name" className="w-[268px] " {...register("name")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="text-textPrimary text-[16px]">
              Phone number <span className="text-warn">*</span>
            </Label>
            <Input id="phone" className="w-[268px] " {...register("phone")} />
          </div>
        </div>
        <div className="flex  justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-textPrimary text-[16px]">
              email
            </Label>
            <Input id="email" className="w-[268px] " {...register("email")} />
          </div>
          {isEdit && (
            <FormField
              control={control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 relative">
                  <FormLabel className="text-textPrimary text-[16px]">
                    Birth of date
                  </FormLabel>
                  <FormControl
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "py-3 pl-3  text-left font-normal w-[268px] ",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || CustomerOne?.birth_date ? (
                        format(
                          field.value || CustomerOne?.birth_date,
                          "dd MMMM yyyy"
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>

                  {showDatePicker && (
                    <Calendar
                      mode="single"
                      className="absolute z-10 bg-white top-16"
                      selected={
                        new Date(field.value || CustomerOne?.birth_date)
                      }
                      onSelect={(date) => {
                        if (!date) {
                          return;
                        }
                        field.onChange(format(date, "yyyy-MM-dd"));
                        setShowDatePicker(false);
                      }}
                    />
                  )}
                </FormItem>
              )}
            />
          )}
        </div>
        {isEdit && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="gender" className="text-textPrimary text-[16px]">
              Gender
            </Label>
            <CustomSelect
              width="w-[120px]"
              placeHolder="Any"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              onValueChange={(value) => {
                setValue("gender", value);
              }}
              defaultValue={CustomerOne?.gender}
            />
          </div>
        )}
        {isEdit && (
          <div className="flex  justify-between">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="house_account_limit"
                className="text-textPrimary text-[16px]"
              >
                House Account Limit
              </Label>
              <Input
                type="number"
                id="house_account_limit"
                className="w-[268px] "
                {...register("house_account_limit", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="is_loyalty_enabled"
                className="text-textPrimary text-[16px]"
              >
                Loyalty
              </Label>
              <CustomSelect
                width="w-[268px]"
                options={[
                  { value: "0", label: "Disabled" },
                  { value: "1", label: "Enabled" },
                ]}
                onValueChange={(value) => {
                  setValue("is_loyalty_enabled", +value);
                }}
                defaultValue={String(CustomerOne?.is_loyalty_enabled)}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="notes" className="text-textPrimary text-[16px]">
            Customer notes
          </Label>
          <Textarea
            id="notes"
            className="w-[268px] mt-0"
            {...register("notes")}
          />
        </div>

        {isEdit && (
          <div className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={(e) => {
                setValue("is_blacklisted", +e);
              }}
              defaultChecked={!!CustomerOne?.is_blacklisted}
            />
            <Label className="leading-[0px]">Blacklisted</Label>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;
