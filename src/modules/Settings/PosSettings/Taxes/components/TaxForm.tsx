import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OrderTypesOptions } from "@/constants/dropdownconstants";
import { ISelect } from "@/types/global.type";
import { useFormContext } from "react-hook-form";

const CreateTax = () => {
  const { control, register } = useFormContext();

  return (
    <>
      <div className="flex gap-3">
        <Input label="Name" {...register("name")} required />
        <Input label="Name Localized" {...register("name_localized")} />
      </div>
      <div className="absolute">
        <Input
          label="Rate"
          textRight="%"
          className="w-[90px] "
          required
          type="number"
          {...register("rate", { valueAsNumber: true })}
        />
      </div>
      <div className="mt-24">
        <p className="font-bold">
          Applies on <span className="text-warn"> *</span>
        </p>
        <FormField
          control={control}
          name="applies_on_order_types"
          render={({ field }) => {
            return (
              <>
                <div>
                  <>
                    {OrderTypesOptions?.map((order: any) => (
                      <FormItem
                        className={`flex gap-2 items-center  mb-3 mt-3 `}
                        key={order.value}
                      >
                        <Checkbox
                          checked={field.value
                            ?.map((value: string) => value)
                            .includes(order.value)}
                          value={order.value}
                          name={order.value}
                          onCheckedChange={(checked) => {
                            console.log(field);

                            if (checked) {
                              if (order.value === "") {
                                field.onChange(
                                  OrderTypesOptions.map(
                                    (order: ISelect) => order.value
                                  )
                                );
                              } else {
                                field?.value?.length
                                  ? field.onChange([
                                      ...field?.value,
                                      order.value,
                                    ])
                                  : field.onChange([order.value]);
                              }
                            } else {
                              field.onChange(
                                field.value?.filter(
                                  (value: any) => value !== order.value
                                )
                              );
                            }
                          }}
                        />

                        <FormLabel
                          htmlFor={order.value}
                          className="text-sm font-medium "
                        >
                          {order?.label}
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    ))}
                  </>
                </div>
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default CreateTax;
