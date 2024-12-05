import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const CPUDetails = () => {
  const { register, watch, formState, setValue, getValues } = useFormContext();

  console.log(getValues());

  return (
    <>
      {/*Contact details */}
      <div className="border-t my-[16px] ">
        <div className="text-[16px] font-bold mt-[16px]">Contact details</div>
        <Input
          label="CPU name"
          placeholder="Enter name"
          className="w-[268px]"
          {...register("name")}
          required
        />
        <div className="flex gap-3">
          <Input
            label="Order email"
            placeholder="Enter email"
            className="w-[268px]"
            {...register("primary_email")}
            required
          />
          <Input
            label="Order phone number"
            className="w-[268px]"
            placeholder="Contact info"
            {...register("phone")}
            required
            type="number"
          />
        </div>
        <Textarea
          placeholder="Enter comment"
          label="Comments"
          {...register("comment")}
          className="w-[268px]"
        />
      </div>
      {/* Settings */}
      <div className="border-t my-[16px] ">
        <div className="text-[16px] font-bold  mt-[16px]">Settings</div>

        <div className="flex items-center gap-[8px] mt-2">
          <Checkbox
            id="accept_price_change"
            defaultChecked={!!getValues("accept_price_change")}
            onCheckedChange={(checked) => {
              if (checked) {
                setValue("accept_price_change", 1);
              } else {
                setValue("accept_price_change", 0);
              }
            }}
          />
          <p>Accept price changes from this CPU</p>
        </div>
      </div>
      {/*order details  */}
      <div className="border-t my-[16px] ">
        <div className="text-[16px] font-bold  mt-[16px]">Order details</div>
        <div className="flex items-center gap-[100px]">
          <Input
            label="Minimum order value"
            className="w-[100px]"
            textLeft="SAR"
            type="number"
            defaultValue={watch("min_order") || ""}
            onChange={(e) => {
              const { value } = e.target;
              if (value.length == 0) {
                setValue("min_order", null, { shouldDirty: true });
              } else {
                setValue("min_order", +value, { shouldDirty: true });
              }
            }}
          />
          <Input
            label="Maximum order value"
            className="w-[100px]"
            textLeft="SAR"
            type="number"
            defaultValue={watch("max_order") || ""}
            onChange={(e) => {
              const { value } = e.target;
              console.log(getValues(), formState.errors);

              if (value.length == 0) {
                setValue("max_order", null, { shouldDirty: true });
              } else {
                setValue("max_order", +value, { shouldDirty: true });
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CPUDetails;
