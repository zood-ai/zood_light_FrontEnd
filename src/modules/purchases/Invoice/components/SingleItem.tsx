import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import { Button } from "@/components/ui/button";

const SingleItem = ({
  setIsEditItem,
}: {
  setIsEditItem: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setValue, watch, getValues, trigger, getFieldState } =
    useFormContext();

  const { taxGroupsSelect, taxGroups } = useCommonRequests({
    getTaxGroups: true,
  });
  const ItemIndex =
    watch(`items`)?.findIndex(
      (item: { id: string }) => item.id === watch("item")?.id
    ) || 0;

  const handleInvoiceQtyChange = (e) => {
    const { value } = e.target;

    //Update Single Item Values

    setValue(`items.${ItemIndex}.invoice_quantity`, +value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      `items.${ItemIndex}.sub_total`,
      +watch(`items.${ItemIndex}.cost`) *
        +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      `items.${ItemIndex}.tax_amount`,
      +(
        +(
          taxGroups?.find(
            (e: { id: string }) =>
              e.id === watch(`items.[${ItemIndex}].tax_group_id`)
          )?.rate / 100
        ) *
        (+watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`))
      ),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      `items.${ItemIndex}.total_cost`,
      +watch(`items.${ItemIndex}.tax_amount`) +
        +watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );

    //Update Items Values

    setValue(
      "sub_total",
      +watch("items")?.reduce((acc: number, item: any) => {
        return acc + (item?.sub_total || 0);
      }, 0),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      "total_vat",
      +watch("items")?.reduce((acc: number, item: any) => {
        return acc + (item?.tax_amount || 0);
      }, 0),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue("total", +watch("sub_total") + +watch("total_vat"), {
      shouldDirty: true,
      shouldValidate: true,
    });

    //Update the Credit Notes

    if (
      watch(`items.${ItemIndex}.invoice_quantity`) !==
      watch(`items.${ItemIndex}.quantity`)
    ) {
      const creditNotices = watch("creditNotices");

      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "quantity"
      );

      if (targetIndex !== -1) {
        setValue(`creditNotices.${targetIndex}.invoice_quantity`, value, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue(
          `creditNotices.${targetIndex}.quantity`,
          watch(`items.${ItemIndex}.quantity`),
          { shouldDirty: true, shouldValidate: true }
        );
        setValue(
          `creditNotices.${targetIndex}.cost`,
          watch(`items.${ItemIndex}.cost`),
          { shouldDirty: true, shouldValidate: true }
        );

        const tax_value =
          (watch(`items.${ItemIndex}.invoice_quantity`) -
            watch(`items.${ItemIndex}.quantity`)) *
          watch(`items.${ItemIndex}.cost`) *
          (taxGroups?.find(
            (e: { id: string }) =>
              e.id === watch(`items.[${ItemIndex}].tax_group_id`)
          )?.rate /
            100);

        setValue(
          `creditNotices.${targetIndex}.credit_amount`,
          (watch(`items.${ItemIndex}.invoice_quantity`) -
            watch(`items.${ItemIndex}.quantity`)) *
            watch(`items.${ItemIndex}.cost`) +
            tax_value,
          { shouldDirty: true, shouldValidate: true }
        );
      } else {
        const newCreditNote = {
          id: watch(`items.${ItemIndex}.id`),
          item_id: watch(`items.${ItemIndex}.id`),
          invoice_quantity: watch(`items.${ItemIndex}.invoice_quantity`),
          quantity: watch(`items.${ItemIndex}.quantity`),
          cost: watch(`items.${ItemIndex}.cost`),
          name: watch(`items.${ItemIndex}.name`),
          type: "quantity",
          note: `Order: ${watch(
            `items.${ItemIndex}.quantity`
          )} , Invoice: ${watch(`items.${ItemIndex}.invoice_quantity`)}`,
          old_cost: watch(`items.${ItemIndex}.old_cost`),
          status: 1,
          credit_amount:
            (watch(`items.${ItemIndex}.invoice_quantity`) -
              watch(`items.${ItemIndex}.quantity`)) *
              watch(`items.${ItemIndex}.cost`) +
            (watch(`items.${ItemIndex}.invoice_quantity`) -
              watch(`items.${ItemIndex}.quantity`)) *
              watch(`items.${ItemIndex}.cost`) *
              (taxGroups?.find(
                (e: { id: string }) =>
                  e.id === watch(`items.[${ItemIndex}].tax_group_id`)
              )?.rate /
                100),
        };

        console.log([...creditNotices, newCreditNote], "ASKA");
        // Append the new credit note to the existing list
        setValue("creditNotices", [...creditNotices, newCreditNote], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    if (
      watch(`items.${ItemIndex}.cost`) !==
        watch(`items.${ItemIndex}.old_cost`) &&
      watch(`accept_price_change_from_supplier`) == 0
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "price"
      );

      setValue(`creditNotices.${targetIndex}.invoice_quantity`, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(
        `creditNotices.${targetIndex}.name`,
        watch(`items.${ItemIndex}.name`),
        { shouldDirty: true, shouldValidate: true }
      );
      setValue(
        `creditNotices.${targetIndex}.quantity`,
        watch(`items.${ItemIndex}.quantity`),
        { shouldDirty: true, shouldValidate: true }
      );
      setValue(
        `creditNotices.${targetIndex}.cost`,
        watch(`items.${ItemIndex}.cost`),
        { shouldDirty: true, shouldValidate: true }
      );

      const tax_value =
        watch(`creditNotices.${targetIndex}.quantity`) *
        (watch(`items.${ItemIndex}.cost`) -
          watch(`creditNotices.${targetIndex}.old_cost`)) *
        (taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate /
          100);

      setValue(
        `creditNotices.${targetIndex}.credit_amount`,
        watch(`creditNotices.${targetIndex}.quantity`) *
          (watch(`items.${ItemIndex}.cost`) -
            watch(`creditNotices.${targetIndex}.old_cost`)) +
          tax_value,
        { shouldDirty: true, shouldValidate: true }
      );
    }
    if (
      watch(`items.${ItemIndex}.invoice_quantity`) ===
      watch(`items.${ItemIndex}.quantity`)
    ) {
      const creditNotices = watch("creditNotices");
      const items = watch(`items.${ItemIndex}`);

      const filteredCreditNotes = creditNotices.filter((i) => {
        return !(i.item_id === items.id && i.type == "quantity");
      });

      setValue("creditNotices", filteredCreditNotes, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    console.log("Get Items :", watch(`items.${ItemIndex}`));
    console.log("Watch Items :", watch(`items.${ItemIndex}`));
  };

  const handleReceivedQtyChange = (e) => {
    const { value } = e.target;

    //Update Single Item Values

    setValue(`items.${ItemIndex}.quantity`, +value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      `items.${ItemIndex}.total_cost`,
      +watch(`items.${ItemIndex}.tax_amount`) +
        +watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      `items.${ItemIndex}.total_cost`,
      +watch(`items.${ItemIndex}.tax_amount`) +
        +watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );

    //Update the Credit Notes

    if (
      watch(`items.${ItemIndex}.invoice_quantity`) !==
      watch(`items.${ItemIndex}.quantity`)
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "quantity"
      );

      if (targetIndex !== -1) {
        setValue(`creditNotices.${targetIndex}.quantity`, value, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue(
          `creditNotices.${targetIndex}.invoice_quantity`,
          watch(`items.${ItemIndex}.invoice_quantity`),
          { shouldDirty: true, shouldValidate: true }
        );
        setValue(
          `creditNotices.${targetIndex}.cost`,
          watch(`items.${ItemIndex}.cost`),
          { shouldDirty: true, shouldValidate: true }
        );

        const tax_value =
          (watch(`items.${ItemIndex}.invoice_quantity`) -
            watch(`items.${ItemIndex}.quantity`)) *
          watch(`items.${ItemIndex}.cost`) *
          (taxGroups?.find(
            (e: { id: string }) =>
              e.id === watch(`items.[${ItemIndex}].tax_group_id`)
          )?.rate /
            100);

        setValue(
          `creditNotices.${targetIndex}.credit_amount`,
          (watch(`items.${ItemIndex}.invoice_quantity`) -
            watch(`items.${ItemIndex}.quantity`)) *
            watch(`items.${ItemIndex}.cost`) +
            tax_value,
          { shouldDirty: true, shouldValidate: true }
        );
      } else {
        const newCreditNote = {
          id: watch(`items.${ItemIndex}.id`),
          item_id: watch(`items.${ItemIndex}.id`),
          invoice_quantity: watch(`items.${ItemIndex}.invoice_quantity`),
          quantity: watch(`items.${ItemIndex}.quantity`),
          cost: watch(`items.${ItemIndex}.cost`),
          name: watch(`items.${ItemIndex}.name`),
          type: "quantity",
          note: `Order: ${watch(
            `items.${ItemIndex}.quantity`
          )} , Invoice: ${watch(`items.${ItemIndex}.invoice_quantity`)}`,
          old_cost: watch(`items.${ItemIndex}.old_cost`),
          status: 1,
          credit_amount:
            (watch(`items.${ItemIndex}.invoice_quantity`) -
              watch(`items.${ItemIndex}.quantity`)) *
              watch(`items.${ItemIndex}.cost`) +
            (watch(`items.${ItemIndex}.invoice_quantity`) -
              watch(`items.${ItemIndex}.quantity`)) *
              watch(`items.${ItemIndex}.cost`) *
              (taxGroups?.find(
                (e: { id: string }) =>
                  e.id === watch(`items.[${ItemIndex}].tax_group_id`)
              )?.rate /
                100),
        };
        // Append the new credit note to the existing list
        setValue("creditNotices", [...creditNotices, newCreditNote], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    if (
      watch(`items.${ItemIndex}.cost`) !==
        watch(`items.${ItemIndex}.old_cost`) &&
      watch(`accept_price_change_from_supplier`) == 0
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "price"
      );

      setValue(`creditNotices.${targetIndex}.quantity`, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(
        `creditNotices.${targetIndex}.name`,
        watch(`items.${ItemIndex}.name`),
        { shouldDirty: true, shouldValidate: true }
      );
      setValue(
        `creditNotices.${targetIndex}.invoice_quantity`,
        watch(`items.${ItemIndex}.invoice_quantity`),
        { shouldDirty: true, shouldValidate: true }
      );
      setValue(
        `creditNotices.${targetIndex}.cost`,
        watch(`items.${ItemIndex}.cost`),
        { shouldDirty: true, shouldValidate: true }
      );

      const tax_value =
        watch(`creditNotices.${targetIndex}.quantity`) *
        (watch(`items.${ItemIndex}.cost`) -
          watch(`creditNotices.${targetIndex}.old_cost`)) *
        (taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate /
          100);

      setValue(
        `creditNotices.${targetIndex}.credit_amount`,
        watch(`creditNotices.${targetIndex}.quantity`) *
          (watch(`items.${ItemIndex}.cost`) -
            watch(`creditNotices.${targetIndex}.old_cost`)) +
          tax_value,
        { shouldDirty: true, shouldValidate: true }
      );
    }
    if (
      watch(`items.${ItemIndex}.invoice_quantity`) ===
      watch(`items.${ItemIndex}.quantity`)
    ) {
      const creditNotices = watch("creditNotices");
      const items = watch(`items.${ItemIndex}`);

      const filteredCreditNotes = creditNotices.filter((i) => {
        return !(i.item_id === items.id && i.type == "quantity");
      });

      setValue("creditNotices", filteredCreditNotes, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;

    setValue(`items.${ItemIndex}.cost`, +value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      `items.${ItemIndex}.sub_total`,
      +watch(`items.${ItemIndex}.cost`) *
        +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      `items.${ItemIndex}.tax_amount`,
      +(
        +(
          taxGroups?.find(
            (e: { id: string }) =>
              e.id === watch(`items.[${ItemIndex}].tax_group_id`)
          )?.rate / 100
        ) *
        (+watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`))
      ),
      { shouldDirty: true, shouldValidate: true }
    );

    setValue(
      `items.${ItemIndex}.sub_total`,
      +watch(`items.${ItemIndex}.cost`) *
        +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      `items.${ItemIndex}.total_cost`,
      +watch(`items.${ItemIndex}.tax_amount`) +
        +watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      "sub_total",
      +watch("items")?.reduce((acc: number, item: any) => {
        return acc + (item?.sub_total || 0);
      }, 0),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      "total_vat",
      +watch("items")?.reduce((acc: number, item: any) => {
        return acc + (item?.tax_amount || 0);
      }, 0),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue("total", +watch("sub_total") + +watch("total_vat"), {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (
      watch(`items.${ItemIndex}.cost`) !==
        watch(`items.${ItemIndex}.old_cost`) &&
      watch(`accept_price_change_from_supplier`) == 0
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "price"
      );

      if (targetIndex !== -1) {
        setValue(`creditNotices.${targetIndex}.cost`, value, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue(
          `creditNotices.${targetIndex}.name`,
          watch(`items.${ItemIndex}.name`),
          { shouldDirty: true, shouldValidate: true }
        );
        setValue(
          `creditNotices.${targetIndex}.quantity`,
          watch(`items.${ItemIndex}.quantity`),
          { shouldDirty: true, shouldValidate: true }
        );
        setValue(
          `creditNotices.${targetIndex}.invoice_quantity`,
          watch(`items.${ItemIndex}.invoice_quantity`),
          { shouldDirty: true, shouldValidate: true }
        );

        const tax_value =
          watch(`creditNotices.${targetIndex}.quantity`) *
          (watch(`items.${ItemIndex}.cost`) -
            watch(`creditNotices.${targetIndex}.old_cost`)) *
          (taxGroups?.find(
            (e: { id: string }) =>
              e.id === watch(`items.[${ItemIndex}].tax_group_id`)
          )?.rate /
            100);

        setValue(
          `creditNotices.${targetIndex}.credit_amount`,
          watch(`creditNotices.${targetIndex}.quantity`) *
            (watch(`items.${ItemIndex}.cost`) -
              watch(`creditNotices.${targetIndex}.old_cost`)) +
            tax_value,
          { shouldDirty: true, shouldValidate: true }
        );
      } else {
        const newCreditNote = {
          id: watch(`items.${ItemIndex}.id`),
          item_id: watch(`items.${ItemIndex}.id`),
          invoice_quantity: watch(`items.${ItemIndex}.invoice_quantity`),
          quantity: watch(`items.${ItemIndex}.quantity`),
          cost: watch(`items.${ItemIndex}.cost`),
          name: watch(`items.${ItemIndex}.name`),
          type: "price",
          note: `Order: ${watch(
            `items.${ItemIndex}.quantity`
          )} , Invoice: ${watch(`items.${ItemIndex}.invoice_quantity`)}`,
          old_cost: watch(`items.${ItemIndex}.old_cost`),
          status: 1,
          credit_amount:
            (watch(`items.${ItemIndex}.invoice_quantity`) -
              watch(`items.${ItemIndex}.quantity`)) *
              watch(`items.${ItemIndex}.cost`) +
            (watch(`items.${ItemIndex}.invoice_quantity`) -
              watch(`items.${ItemIndex}.quantity`)) *
              watch(`items.${ItemIndex}.cost`) *
              (taxGroups?.find(
                (e: { id: string }) =>
                  e.id === watch(`items.[${ItemIndex}].tax_group_id`)
              )?.rate /
                100),
        };
        // Append the new credit note to the existing list
        setValue("creditNotices", [...creditNotices, newCreditNote], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    if (
      watch(`items.${ItemIndex}.cost`) ===
        watch(`items.${ItemIndex}.old_cost`) &&
      watch(`accept_price_change_from_supplier`) == 0
    ) {
      const creditNotices = watch("creditNotices");
      const items = watch(`items.${ItemIndex}`);

      const filteredCreditNotes = creditNotices.filter((i) => {
        return !(i.item_id === items.id && i.type == "price");
      });

      setValue("creditNotices", filteredCreditNotes, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (
      watch(`items.${ItemIndex}.invoice_quantity`) !==
      watch(`items.${ItemIndex}.quantity`)
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "quantity"
      );

      setValue(`creditNotices.${targetIndex}.cost`, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(
        `creditNotices.${targetIndex}.quantity`,
        watch(`items.${ItemIndex}.quantity`),
        { shouldDirty: true, shouldValidate: true }
      );
      setValue(
        `creditNotices.${targetIndex}.invoice_quantity`,
        watch(`items.${ItemIndex}.invoice_quantity`),
        { shouldDirty: true, shouldValidate: true }
      );

      const tax_value =
        (watch(`items.${ItemIndex}.invoice_quantity`) -
          watch(`items.${ItemIndex}.quantity`)) *
        watch(`items.${ItemIndex}.cost`) *
        (taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate /
          100);

      setValue(
        `creditNotices.${targetIndex}.credit_amount`,
        (watch(`items.${ItemIndex}.invoice_quantity`) -
          watch(`items.${ItemIndex}.quantity`)) *
          watch(`items.${ItemIndex}.cost`) +
          tax_value,
        { shouldDirty: true, shouldValidate: true }
      );
    }
  };

  const handleTaxChange = (e) => {
    setValue(`items.${ItemIndex}.tax_group_id`, e, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(
      `items.${ItemIndex}.tax_amount`,
      +(
        +(
          taxGroups?.find(
            (e: { id: string }) =>
              e.id === watch(`items.[${ItemIndex}].tax_group_id`)
          )?.rate / 100
        ) *
        (+watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`))
      ),
      { shouldDirty: true, shouldValidate: true }
    );

    setValue(
      `items.${ItemIndex}.total_cost`,
      +watch(`items.${ItemIndex}.tax_amount`) +
        +watch(`items.${ItemIndex}.cost`) *
          +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue(
      "total_vat",
      +watch("items")?.reduce((acc: number, item: any) => {
        return acc + (item?.tax_amount || 0);
      }, 0),
      { shouldDirty: true, shouldValidate: true }
    );
    setValue("total", +watch("sub_total") + +watch("total_vat"), {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (
      watch(`items.${ItemIndex}.cost`) !==
        watch(`items.${ItemIndex}.old_cost`) &&
      watch(`accept_price_change_from_supplier`) == 0
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "price"
      );

      const tax_value =
        watch(`creditNotices.${targetIndex}.quantity`) *
        (watch(`items.${ItemIndex}.cost`) -
          watch(`creditNotices.${targetIndex}.old_cost`)) *
        (taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate /
          100);

      setValue(
        `creditNotices.${targetIndex}.credit_amount`,
        watch(`creditNotices.${targetIndex}.quantity`) *
          (watch(`items.${ItemIndex}.cost`) -
            watch(`creditNotices.${targetIndex}.old_cost`)) +
          tax_value,
        { shouldDirty: true, shouldValidate: true }
      );
    }
    if (
      watch(`items.${ItemIndex}.invoice_quantity`) !==
      watch(`items.${ItemIndex}.quantity`)
    ) {
      const creditNotices = watch("creditNotices");
      const targetIndex = creditNotices.findIndex(
        (notice: any, index: number) =>
          index !== -1 &&
          notice.item_id === watch(`items.${ItemIndex}.id`) &&
          notice.type === "quantity"
      );

      const tax_value =
        (watch(`items.${ItemIndex}.invoice_quantity`) -
          watch(`items.${ItemIndex}.quantity`)) *
        watch(`items.${ItemIndex}.cost`) *
        (taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate /
          100);

      setValue(
        `creditNotices.${targetIndex}.credit_amount`,
        (watch(`items.${ItemIndex}.invoice_quantity`) -
          watch(`items.${ItemIndex}.quantity`)) *
          watch(`items.${ItemIndex}.cost`) +
          tax_value,
        { shouldDirty: true, shouldValidate: true }
      );
    }
  };

  useEffect(() => {
    setValue(
      `items.${ItemIndex}.sub_total`,
      +watch(`items.${ItemIndex}.cost`) *
        +watch(`items.${ItemIndex}.invoice_quantity`),
      { shouldDirty: true, shouldValidate: true }
    );
  }, [watch(`items.${ItemIndex}.invoice_quantity`)]);

  return (
    <div className="flex flex-col gap-8 px-5">
      <div className="flex justify-between items-center">
        <p>
          Invoice qty <span className="text-warn">*</span>
        </p>
        <div>
          <Input
            className="w-[104px]"
            value={getValues(`items.${ItemIndex}.invoice_quantity`)}
            type="number"
            onChange={handleInvoiceQtyChange}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p>
          Received qty <span className="text-warn">*</span>
        </p>
        <Input
          className="w-[104px]"
          type="number"
          value={getValues(`items.${ItemIndex}.quantity`)}
          onChange={handleReceivedQtyChange}
        />
      </div>
      <div
        className={`text-warn text-[12px]  ${
          watch(`items.${ItemIndex}.quantity`) !==
          watch(`items.${ItemIndex}.invoice_quantity`)
            ? "absolute top-[180px] right-[20px]"
            : "hidden"
        }`}
      >
        {watch(`items.${ItemIndex}.quantity`) !==
          watch(`items.${ItemIndex}.invoice_quantity`) && (
          <>Qty difference added to credit note</>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p>
          Price per unit<span className="text-warn">*</span>
        </p>
        <div>
          <Input
            className="w-[104px]"
            textLeft="SAR"
            type="number"
            value={getValues(`items.${ItemIndex}.cost`)}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <div
        className={`text-warn text-[12px]  ${
          watch(`items.${ItemIndex}.cost`) !==
          watch(`items.${ItemIndex}.old_cost`)
            ? "absolute top-[246px] right-[20px]"
            : "hidden"
        }`}
      >
        {watch(`items.${ItemIndex}.cost`) !==
          watch(`items.${ItemIndex}.old_cost`) && (
          <>Price difference added to credit note</>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p>Item subtotal</p>
        <div>SAR {+watch(`items.${ItemIndex}.sub_total`) || "  00.00 "}</div>
      </div>
      <div className="flex justify-between items-center">
        <p>
          VAT rate <span className="text-warn">*</span>
        </p>
        <div>
          <CustomSelect
            options={taxGroupsSelect}
            width="w-[104px]"
            value={getValues(`items.${ItemIndex}.tax_group_id`)}
            onValueChange={handleTaxChange}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p>Tax Value</p>

        <div>
          {watch(`items.${ItemIndex}.tax_amount`) == undefined
            ? " SAR 00.00"
            : `SAR ${+watch(`items.${ItemIndex}.tax_amount`)}`}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p>Total price</p>

        <div>
          {watch(`items.${ItemIndex}.tax_amount`) == undefined
            ? " SAR 00.00"
            : `SAR ${
                +watch(`items.${ItemIndex}.tax_amount`) +
                +watch(`items.${ItemIndex}.cost`) *
                  +watch(`items.${ItemIndex}.invoice_quantity`)
              }`}
        </div>
      </div>
      <Button
        type="button"
        className="absolute bottom-0 w-[630px] mb-5 bg-primary font-semibold h-[48px] rounded-3xl"
        onClick={() => {
          // const formValues = getValues(`items.${ItemIndex}`);
          // console.log("Form values:", formValues);

          // const isValid = await trigger();
          // console.log("Validation result:", isValid);
          console.log("Get Items :", watch(`items.${ItemIndex}`));
          console.log("Watch Credit :", watch(`creditNotices.${ItemIndex}`));

          // if (!isValid) {
          //   const formErrors = getFieldState(`items.${ItemIndex}`);
          //   console.log("Validation errors:", formErrors);
          // }

          // if (isValid) {
          setIsEditItem(false);
          // }
        }}
      >
        {" "}
        Update
      </Button>
    </div>
  );
};

export default SingleItem;
