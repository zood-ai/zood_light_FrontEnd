import { useFieldArray, useFormContext } from "react-hook-form";
import CartIcon from "@/assets/icons/Cart";
import PurchasingInfo from "../../../../components/ui/custom/PurchasingInfo";
import ProductDescription from "@/modules/Inventory/Items/components/ProductDescription";
import StorageArea from "@/components/StorageArea";

import StockCount from "./StockCount";
import useCommonRequests from "@/hooks/useCommonRequests";

const ItemDetailsForm = ({ isEdit }: { isEdit: boolean }) => {
  const { control, watch, setValue, getValues } = useFormContext();
  const findIsMainIndex = watch(`suppliers`).findIndex((e: any) => e.is_main);
  const mainSupplierUnit = watch(`suppliers[${findIsMainIndex}].pack_unit`);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "suppliers",
  });

  const { isBranchesLoading } = useCommonRequests({
    getBranches: true,
    setBranches: (data: any) => {
      if (getValues("branches")?.length === 0) {
        setValue("branches", data, { shouldValidate: true, shouldDirty: true });
      }
    },
  });

  return (
    <>
      {/* Product description */}
      <ProductDescription />

      {/* Purchasing info */}
      <>
        {/* header */}
        <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
            <CartIcon />
          </div>
          <h3 className="font-bold text-[16px]">Purchasing info</h3>
        </div>
        {/* content */}

        <>
          {fields.map((field, index) => (
            <PurchasingInfo
              index={index}
              key={field.id}
              remove={remove}
              count={fields.length}
              isEdit={isEdit}
            />
          ))}
          <p
            className="text-primary text-right mt-2 cursor-pointer select-none"
            onClick={() => {
              append({
                pack_unit: mainSupplierUnit,
              });
            }}
          >
            + Add another Supplier
          </p>
        </>
      </>

      {/* Storage area */}
      <StorageArea />

      {/* Stock Count info */}
      <StockCount />
    </>
  );
};

export default ItemDetailsForm;
