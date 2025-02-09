import SelectionIcon from "@/assets/icons/Selection";
import { Input } from "@/components/ui/input";
import { register } from "module";
import { useFieldArray, useFormContext } from "react-hook-form";

const Selection = () => {
  const { control, watch, register, setValue } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "tables",
  });
  console.log(fields, watch("tables"));

  return (
    <div className="relative border-b border-input">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <SelectionIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Selection</h3>
      </div>
      <div className="pb-[25px] px-[14px] bg-popover flex items-center gap-4 rounded-[4px] border-b border-input">
        <Input label="Section name" className="w-[200px]" />
        <Input
          label="Number of tables"
          className="w-[150px]"
          {...register("tablesNo", { valueAsNumber: true })}
        />
      </div>
      {!isNaN(watch("tablesNo")) && (
        <>
          <div className="bg-popover">
            <div className="flex px-[14px] py-3">
              <p className="w-[200px]">Table name</p>
              <p>Number of seats</p>
            </div>
            {Array.from({ length: watch("tablesNo") }).map((_, index) => (
              <div className="flex flex-col gap-3 px-[14px] pb-3">
                <div className="flex justify-between">
                  <div className="flex">
                    <Input
                      className="w-[200px]"
                      {...register(`tables.selection.[${index}].table_num`)}
                    />
                    <Input
                      className="w-[150px]"
                      type="number"
                      {...register(`tables.selection.[${index}].seats_num`)}
                    />
                  </div>
                  <div
                    className="text-[20px] cursor-pointer -ml-1 text-warn "
                    onClick={() => {
                      const indexTable = watch("tables.selection").findIndex(
                        (i: number) => i == index
                      );
                      watch("tables.selection").splice(indexTable, 1);
                      setValue("tablesNo", watch("tables.selection")?.length);
                    }}
                  >
                    X
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div
        className="absolute right-0 text-primary pt-3 mb-5"
        onClick={() => {
          append(watch("tables.selection"));
        }}
      >
        {" "}
        Add another sections
      </div>
    </div>
  );
};

export default Selection;
