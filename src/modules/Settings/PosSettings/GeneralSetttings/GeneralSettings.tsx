import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGeneralSettingsHttp from "./queriesHttp/useGeneralSettingsHttp";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { SettingTimeZoneOption } from "@/constants/dropdownconstants";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formGeneralSettingsSchema } from "./Schema/schema";
import { Loader2 } from "lucide-react";

const GeneralSettings = () => {
  const { settingsData, updateSettings, isPendingUpdate, isLoadingsettings } =
    useGeneralSettingsHttp({
      setGeneralSetting: (data) => {
        form.reset({
          country: data?.country,
          business_currency: data?.business_currency,
          business_name: data?.business_name,
          business_timezone: data?.business_timezone,
          tax_registration_name: data?.tax_registration_name,
          business_tax_number: data?.business_tax_number,
          tax_inclusive_pricing: data?.tax_inclusive_pricing,
          localization_enabled: data?.localization_enabled,
          restrict_purchased_items_to_supplier:
            data?.restrict_purchased_items_to_supplier,
        });
      },
    });

  const defaultValues = {
    country: settingsData?.country,
    business_currency: settingsData?.business_currency,
    business_name: settingsData?.business_name,
    business_timezone: settingsData?.business_timezone,
    tax_registration_name: settingsData?.tax_registration_name,
    business_tax_number: settingsData?.business_tax_number,
    tax_inclusive_pricing: settingsData?.tax_inclusive_pricing,
    localization_enabled: settingsData?.localization_enabled,
    restrict_purchased_items_to_supplier:
      settingsData?.restrict_purchased_items_to_supplier,
  };

  const form = useForm<z.infer<typeof formGeneralSettingsSchema>>({
    resolver: zodResolver(formGeneralSettingsSchema),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    updateSettings({ ...data });
  };

  return (
    <>
      {isLoadingsettings ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="ml-[241px] w-[645px]">
            <h3 className="text-[#3A4145] text-[20px] font-bold tracking-wider mb-[17px]">
              General Settings
            </h3>
            <div className="flex flex-col gap-y-[20px]">
              <div>
                <Label className="text-[14px] text-[#3A4145] ">Country</Label>
                <Input
                  placeholder="Choose one"
                  disabled
                  className="w-[645px] mt-[4px]"
                  {...form.register("country")}
                />
              </div>
              <div>
                <Label className="text-[14px] text-[#3A4145] ">
                  Business Name
                </Label>
                <Input
                  placeholder="Choose one"
                  className="w-[645px] mt-[4px]"
                  {...form.register("business_name")}
                />
              </div>
              <div>
                <Label className="text-[14px] text-[#3A4145] ">
                  Tax Registration Name
                </Label>
                <Input
                  placeholder="Choose one"
                  className="w-[645px] mt-[4px]"
                  {...form.register("tax_registration_name")}
                />
              </div>
              <div>
                <Label className="text-[14px] text-[#3A4145] ">Currency</Label>
                <Input
                  placeholder="Choose one"
                  disabled
                  {...form.register("business_currency")}
                  className="w-[645px] mt-[4px]"
                />
              </div>
              <div>
                <Label className="text-[14px] text-[#3A4145] ">Time Zone</Label>
                <CustomSelect
                  className="mt-[4px]"
                  width="w-[645px]"
                  options={SettingTimeZoneOption}
                  defaultValue={
                    SettingTimeZoneOption?.filter(
                      (x: any) =>
                        x.value === form.getValues("business_timezone")
                    )[0]?.value || "Africa/Albania"
                  }
                  onValueChange={(value) => {
                    form.setValue("business_timezone", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </div>
              <div>
                <Label className="text-[14px] text-[#3A4145] ">
                  Tax Number
                </Label>
                <Input
                  placeholder="Choose one"
                  className="w-[645px] mt-[4px]"
                  {...form.register("business_tax_number")}
                />
              </div>
              <div className="flex items-center gap-x-[20px] mt-[10px]">
                <Controller
                  name="tax_inclusive_pricing"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(value) => {
                        field.onChange(+value);
                      }}
                    />
                  )}
                />

                <Label className="text-[14px] text-[#3F474B] ">
                  Tax Inclusive Pricing
                </Label>
              </div>
              <div className="flex items-center gap-x-[20px] mt-[10px]">
                <Controller
                  name="localization_enabled"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(value) => {
                        field.onChange(+value);
                      }}
                    />
                  )}
                />
                <Label className="text-[14px] text-[#3F474B] ">
                  Enable Localization
                </Label>
              </div>
              <div className="flex items-center gap-x-[20px] mt-[10px]">
                <Controller
                  name="restrict_purchased_items_to_supplier"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(value) => {
                        field.onChange(+value);
                      }}
                    />
                  )}
                />
                <Label className="text-[14px] text-[#3F474B] ">
                  Restrict Purchased Items To Supplier
                </Label>
              </div>

              <div className="w-full text-right">
                <Button
                  className="w-fit"
                  type="submit"
                  disabled={isPendingUpdate}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default GeneralSettings;
