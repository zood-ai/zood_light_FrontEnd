import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usReceiptSettingsHttp from "./queriesHttp/useReceiptSettingsHttp";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { languagetag, mainlocalize } from "@/constants/dropdownconstants";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formReceiptSettingsSchema } from "./Schema/schema";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import CustomFileImage from "@/components/ui/custom/CustomFileImage";

const ReceiptSettings = () => {
  const { updateSettings, isPendingUpdate, isLoadingsettings } =
    usReceiptSettingsHttp({
      setGeneralSetting: (data) => {
        form.reset({
          receipt_print_language: data?.receipt_print_language,
          receipt_main_language: data?.receipt_main_language,
          receipt_localized_language: data?.receipt_localized_language,
          receipt_header: data?.receipt_header,
          receipt_footer: data?.receipt_footer,
          receipt_invoice_title: data?.receipt_invoice_title,
          receipt_show_order_number: data?.receipt_show_order_number,
          receipt_show_calories: data?.receipt_show_calories,
          receipt_show_subtotal: data?.receipt_show_subtotal,
          receipt_show_rounding: data?.receipt_show_rounding,
          receipt_show_closer_username: data?.receipt_show_closer_username,
          receipt_show_creator_username: data?.receipt_show_creator_username,
          receipt_show_check_number: data?.receipt_show_check_number,
          receipt_hide_free_modifier_options:
            data?.receipt_hide_free_modifier_options,
          enable_printing_default_modifiers_on_kitchen_receipt:
            data?.enable_printing_default_modifiers_on_kitchen_receipt,
          business_logo: data?.business_logo,
        });
      },
    });

  const form = useForm<z.infer<typeof formReceiptSettingsSchema>>({
    resolver: zodResolver(formReceiptSettingsSchema),
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
        <div className="ml-[241px] w-[645px]">
          <h3 className="text-[#3A4145] text-[20px] font-bold tracking-wider mb-[17px]">
            Receipt setting
          </h3>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-[20px]">
                <div>
                  <CustomFileImage
                    fileParam="business_logo"
                    defaultValue={form.getValues("business_logo")}
                  />
                </div>
                <div>
                  <Label className="text-[14px] text-[#3A4145] ">
                    Main Language
                  </Label>
                  <CustomSelect
                    className="mt-[4px]"
                    width="w-[645px]"
                    options={languagetag}
                    defaultValue={form.getValues("receipt_main_language")}
                    onValueChange={(value) => {
                      form.setValue("receipt_main_language", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-[14px] text-[#3A4145] ">
                    Print Language
                  </Label>
                  <CustomSelect
                    className="mt-[4px]"
                    width="w-[645px]"
                    options={mainlocalize}
                    defaultValue={String(
                      form.getValues("receipt_print_language")
                    )}
                    onValueChange={(value) => {
                      form.setValue("receipt_print_language", +value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-[14px] text-[#3A4145] ">
                    Localized Language
                  </Label>
                  <CustomSelect
                    className="mt-[4px]"
                    width="w-[645px]"
                    options={languagetag}
                    defaultValue={
                      languagetag?.filter(
                        (x: any) =>
                          x.value ===
                          form.getValues("receipt_localized_language")
                      )[0]?.value
                    }
                    onValueChange={(value) => {
                      form.setValue("receipt_localized_language", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-[14px] text-[#3A4145] ">
                    Invoice Title
                  </Label>
                  <Input
                    placeholder="Invoice Title"
                    className="w-[645px] mt-[4px]"
                    {...form.register("receipt_invoice_title")}
                  />
                </div>
                <div>
                  <Label className="text-[14px] text-[#3A4145] ">
                    Receipt Header
                  </Label>
                  <Textarea
                    placeholder="Choose one"
                    className="w-[645px] mt-[4px]"
                    {...form.register("receipt_header")}
                  />
                </div>
                <div>
                  <Label className="text-[14px] text-[#3A4145] ">
                    Receipt Footer
                  </Label>
                  <Textarea
                    placeholder="Choose one"
                    className="w-[645px] mt-[4px]"
                    {...form.register("receipt_footer")}
                  />
                </div>

                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_order_number"
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
                    Show Order Number
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_calories"
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
                    Show Calories
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_subtotal"
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
                    Show Subtotal
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_rounding"
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
                    Show Rounding
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_closer_username"
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
                    Show Closer Username
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_creator_username"
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
                    Show Creator Username
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_show_check_number"
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
                    Show Check Number
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="receipt_hide_free_modifier_options"
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
                    Hide Free Modifier Options
                  </Label>
                </div>
                <div className="flex items-center gap-x-[20px] mt-[10px]">
                  <Controller
                    name="enable_printing_default_modifiers_on_kitchen_receipt"
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
                    Enable printing default modifiers on kitchen receipt
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
            </form>
          </FormProvider>
        </div>
      )}
    </>
  );
};

export default ReceiptSettings;
