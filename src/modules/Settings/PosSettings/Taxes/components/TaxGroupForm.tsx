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
import Taxes from "./Taxes";

const TaxGroupForm = () => {
  const { control, register } = useFormContext();

  return (
    <>
      <div className="flex gap-3">
        <Input label="Name" {...register("name")} required />
        <Input label="Name Localized" {...register("name_localized")} />
      </div>

      <Input
        label="Reference"
        textLeft="#"
        className="w-[90px] "
        {...register("reference")}
      />
      <Taxes />
    </>
  );
};

export default TaxGroupForm;
