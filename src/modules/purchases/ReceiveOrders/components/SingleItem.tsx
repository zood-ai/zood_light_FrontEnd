import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useFormContext } from "react-hook-form";
import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";

const SingleItem = ({
  index,
  setCheck,
}: {
  index: number
  setCheck: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setValue, watch, trigger } = useFormContext();
  const { taxGroupsSelect, taxGroups } = useCommonRequests({
    getTaxGroups: true,
  });

  const items = watch("items") || [];
  const selectedItem = watch("item")?.id;
  const itemUnit = watch("item")?.unit;
  const ItemIndex = index === -1 ?
    items.findIndex(
      (item: { item_id: string; unit: string }) =>
        item.item_id === selectedItem && item.unit === itemUnit
    ) : index;


  const itemFields = watch(`items.${ItemIndex}`);

  const calculateSubTotalCost = useCallback(() => {
    return +itemFields?.cost * +itemFields?.invoice_quantity || 0;
  }, [itemFields]);

  const calculateTaxAmount = useCallback(() => {
    const taxRate =
      taxGroups?.find((e: { id: string }) => e.id === itemFields?.tax_group_id)
        ?.rate || 0;
    return +((taxRate / 100) * calculateSubTotalCost()).toFixed(2);
  }, [calculateSubTotalCost, itemFields?.tax_group_id, taxGroups]);

  const calculateTotalCost = useCallback(() => {
    return (
      +calculateTaxAmount() +
      (+itemFields?.cost * +itemFields?.invoice_quantity || 0)
    );
  }, [calculateTaxAmount, itemFields]);

  const validateItem = useCallback(() => {
    return (
      itemFields &&
      Object.keys(itemFields).every((key) => {
        if (key === "tax_amount") return true;
        const value = itemFields[key];

        return value !== undefined && value !== 0;
      })
    );
  }, [itemFields]);

  useEffect(() => {
    setCheck(validateItem());
  }, [validateItem()]);

  const handleQuantityChange = (field: string, value: number) => {
    setValue(field, +value || 0);
    setValue(`items.${ItemIndex}.sub_total`, calculateSubTotalCost());
    setValue(`items.${ItemIndex}.total_cost`, calculateTotalCost());
    setValue(`items.${ItemIndex}.tax_amount`, calculateTaxAmount());

    setCheck(validateItem());
    CheckCreditNotesValidation();
  };

  const CheckCreditNotesValidation = () => {
    const {
      invoice_quantity,
      quantity,
      cost,
      order_cost,
      id,
      name,
      code,
      unit,
      tax_group_id,
      sub_total,
    } = itemFields || {};

    const taxRate =
      taxGroups?.find((e: { id: string }) => e.id === itemFields?.tax_group_id)
        ?.rate || 0;
    const tax_amount = +(
      (taxRate / 100) *
      (itemFields?.cost * (itemFields?.quantity - itemFields?.invoice_quantity))
    ).toFixed(2);

    const tax_rate = taxGroups?.find(
      (e: { id: string }) => e.id === tax_group_id
    )?.rate;
    const tax_amount_price =
      (tax_rate / 100) * (+cost - +order_cost) * quantity;
    const total_credit = (+invoice_quantity - +quantity) * +cost;

    const creditNotes = watch("creditNotes") || [];
    const creditNotesPrice = watch("creditNotesPrice") || [];

    const addOrUpdateNote = (
      notesArray,
      setField,
      type,
      additionalFields = {},
      unit
    ) => {
      const noteIndex = notesArray.findIndex(
        (note: { id: string; type: string; unit: string }) =>
          note.id === id && note.type === type && note.unit == unit
      );
      const updatedNote = { id, type, ...additionalFields };

      if (noteIndex === -1) {
        setValue(`${setField}.${notesArray.length}`, updatedNote);
      } else {
        setValue(`${setField}.${noteIndex}`, {
          ...notesArray[noteIndex],
          ...additionalFields,
        });
      }
    };

    // Check for quantity differences
    if (invoice_quantity !== quantity) {
      addOrUpdateNote(
        creditNotes,
        "creditNotes",
        "quantity",
        {
          invoice_quantity,
          quantity,
          name,
          cost,
          code,
          order_cost,
          order_unit: unit,
          unit,
          tax_rate,
          tax_amount,
          total_credit,
          sub_total,
        },
        unit
      );
    } else {
      setValue(
        "creditNotes",
        creditNotes.filter(
          (note: { id: string; type: string; unit: string }) =>
            !(note.id === id && note.type === "quantity" && note.unit == unit)
        )
      );
    }

    // Check for price differences
    if (
      cost !== order_cost &&
      watch(`accept_price_change_from_supplier`) === 0
    ) {
      addOrUpdateNote(
        creditNotesPrice,
        "creditNotesPrice",
        "price",
        {
          invoice_quantity,
          quantity,
          cost,
          order_cost,
          name,
          code,
          order_unit: unit,
          tax_rate,
          unit,
          tax_amount_price,
        },
        unit
      );
    } else {
      setValue(
        "creditNotesPrice",
        creditNotesPrice.filter(
          (note: { id: string; type: string; unit: string }) =>
            !(note.id === id && note.type === "price" && note.unit == unit)
        )
      );
    }
  };

  useEffect(() => {
    CheckCreditNotesValidation();
  }, [
    itemFields?.invoice_quantity,
    itemFields?.quantity,
    itemFields?.cost,
    itemFields?.order_cost,
  ]);
  const calculationSun = () => {
    setValue(
      "sub_total",
      watch("items").reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
      ),
      { shouldValidate: true }
    );
    setValue(
      "total_tax",
      watch("items").reduce(
        (acc: number, curr: { tax_amount: number }) => acc + +curr?.tax_amount,
        0
      ),
      { shouldValidate: true }
    );
    setValue(
      "sub_total",
      watch("items").reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
      ),
      { shouldValidate: true }
    );
    setValue("total_cost", watch("sub_total") + watch("total_tax"), {
      shouldValidate: true,
    });
    trigger("total");
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex justify-between items-center">
        <p>
          Ordered ({itemUnit})<span className="text-warn">*</span>
        </p>
        <Input
          className="w-[104px] h-[40px]"
          value={watch(`items.${ItemIndex}.invoice_quantity`) || 0}
          type="number"
          min={1}
          step={"0.01"}
          onChange={(e) => {
            if (+e.target.value < 0) {
              return;
            }
            handleQuantityChange(
              `items.${ItemIndex}.invoice_quantity`,
              +e?.target.value
            );
            calculationSun();
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p>
          Received ({itemUnit}) <span className="text-warn">*</span>
        </p>
        <Input
          className="w-[104px] h-[40px]"
          type="number"
          step={"0.01"}
          min={1}
          value={itemFields?.quantity || 0}
          onChange={(e) => {
            if (+e.target.value < 0) {
              return;
            }
            handleQuantityChange(
              `items.${ItemIndex}.quantity`,
              +e?.target.value
            );
            calculationSun();
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p>
          Price ({itemUnit}) <span className="text-warn">*</span>
        </p>
        <Input
          className="w-[104px] h-[40px]"
          textLeft="SAR"
          type="number"
          min={1}
          step={"0.01"}
          value={itemFields?.cost || 0}
          onChange={(e) => {
            if (+e.target.value < 0) {
              return;
            }
            handleQuantityChange(`items.${ItemIndex}.cost`, +e?.target.value);
            calculationSun();
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p>Item subtotal</p>
        <div>SAR {calculateSubTotalCost() || "00.00"}</div>
      </div>

      <div className="flex justify-between items-center">
        <p>
          VAT rate <span className="text-warn">*</span>
        </p>
        <CustomSelect
          options={taxGroupsSelect}
          width="w-[104px]"
          placeHolder="0 %"
          value={itemFields?.tax_group_id}
          onValueChange={(e) => {
            setValue(`items.${ItemIndex}.tax_group_id`, e);
            setValue(`items.${ItemIndex}.tax_amount`, calculateTaxAmount());
            setValue(`items.${ItemIndex}.total_cost`, calculateTotalCost());
            setCheck(validateItem());
            CheckCreditNotesValidation();
            calculationSun();
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p>Total price</p>
        <div>SAR {calculateTotalCost() || "00.00"}</div>
      </div>
    </div>
  );
};

export default SingleItem;
