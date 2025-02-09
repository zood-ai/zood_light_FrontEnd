import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";

const Modifiers = () => {
  return (
    <div className="">
      <h1 className="text-textPrimary text-[20px] font-bold mb-3 px-5 ">
        Modifiers
      </h1>
      <div className="bg-popover px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="">Modifier name</Label>
          <CustomSelect
            options={[{ label: "option1", value: "1" }]}
            width="w-full"
            placeHolder="Selected..."
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="">Minimum Options</Label>
            <CustomSelect
              options={[{ label: "option1", value: "1" }]}
              width="w-[290px]"
              placeHolder="Selected..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="">Maximum Options</Label>
            <CustomSelect
              options={[{ label: "option1", value: "1" }]}
              width="w-[290px]"
              placeHolder="Selected..."
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Label htmlFor="">Free Options</Label>
            <CustomSelect
              options={[{ label: "option1", value: "1" }]}
              width="w-[290px]"
              placeHolder="Selected..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="">Default Options</Label>
            <CustomSelect
              options={[{ label: "option1", value: "1" }]}
              width="w-[290px]"
              placeHolder="Selected..."
            />
          </div>
        </div>
        <div className="flex  items-center gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="">Excluded Options </Label>
            <CustomSelect
              options={[{ label: "option1", value: "1" }]}
              width="w-[290px]"
              placeHolder="Selected..."
            />
          </div>
          <div className="flex  gap-2 items-center mt-6">
            <Checkbox />
            <Label htmlFor="">Unique Options</Label>
          </div>
        </div>
      </div>
      <Button className="text-primary bg-transparent font-medium justify-end w-full pt-[22px] pr-[30px]">
        Add modifier
      </Button>
    </div>
  );
};

export default Modifiers;
