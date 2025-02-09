import CustomCircle from "@/components/ui/custom/CustomCircle";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import useCommonRequests from "@/hooks/useCommonRequests";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreditNotes } from "./CreditNotes";
import InfoIcon from "@/assets/icons/Info";
import { AddNewItem } from "./AddNewItem";

import { CreateNewItem } from "./CreateNewItem";
import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";

const OrderItems = ({
  rowData,
  isAddImage,
}: {
  rowData?: string;
  isAddImage?: boolean;
}) => {
  const [newItem, setNewItem] = useState<boolean>(false);
  const { taxGroupsSelect, taxGroups } = useCommonRequests({
    getTaxGroups: true,
    getCategories: true,
  });
  const { control, setValue, getValues, watch, trigger } = useFormContext();

  const { remove, append }: any = useFieldArray({
    control,
    name: "items",
  });

  const CheckCreditNotesValidtion = (ItemIndex: number) => {
    console.log(
      watch(`items`),
      watch("credit_notes"),
      watch("credit_notes_price")
    );

    let itemId = watch(`items.${ItemIndex}.id`);
    let invoiceQuantity = watch(`items.${ItemIndex}.invoice_quantity`);
    let originalQuantity = watch(`items.${ItemIndex}.quantity`);
    let cost = watch(`items.${ItemIndex}.cost`);
    let orderCost = watch(`items.${ItemIndex}.order_cost`);
    let name = watch(`items.${ItemIndex}.name`);
    let code = watch(`items.${ItemIndex}.code`);
    let unit = watch(`items.${ItemIndex}.unit`);
    let tax_rate =
      (watch(`items.[${ItemIndex}].tax_group_id`) == null
        ? 0
        : taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate) / 100;
    let tax_amount =
      tax_rate *
      (+watch(`items.${ItemIndex}.cost`) *
        (+watch(`items.[${ItemIndex}].quantity`) -
          +watch(`items.${ItemIndex}.invoice_quantity`))) || 0;

    let tax_amount_price =
      +tax_rate *
      (+watch(`items.${ItemIndex}.cost`) -
        +watch(`items.[${ItemIndex}].order_cost`)) *
      +watch(`items.${ItemIndex}.quantity`) || 0;

    let total_credit =
      (+watch(`items.[${ItemIndex}].quantity`) -
        +watch(`items.[${ItemIndex}].invoice_quantity`)) *
      +watch(`items.${ItemIndex}.cost`);

    let total_credit_price =
      (+watch(`items.[${ItemIndex}].cost`) -
        +watch(`items.[${ItemIndex}].order_cost`)) *
      +watch(`items.[${ItemIndex}].quantity`);

    let creditNotes = watch("credit_notes") || [];
    let creditNotesPrice = watch("credit_notes_price") || [];

    let addCreditNote = (type: string, additionalFields = {}) => {
      console.log(creditNotes);

      let noteIndex = creditNotes.findIndex(
        (note: { id: string; type: string; unit: string }) =>
          note.id === itemId && note.type === type && note.unit == unit
      );

      if (noteIndex === -1) {
        setValue(`credit_notes.${creditNotes.length}`, {
          id: itemId,
          type,
          ...additionalFields,
        });
      } else {
        let updatedNote = { ...creditNotes[noteIndex], ...additionalFields };
        setValue(`credit_notes.${noteIndex}`, updatedNote);
      }
    };
    let addCreditNotePrice = (type: string, additionalFields = {}) => {
      let noteIndex = creditNotesPrice.findIndex(
        (note: { id: string; type: string; unit: string }) =>
          note.id === itemId && note.type === type && note.unit === unit
      );

      if (noteIndex === -1) {
        setValue(`credit_notes_price.${creditNotesPrice.length}`, {
          id: itemId,
          type,
          ...additionalFields,
        });
      } else {
        let updatedNote = {
          ...creditNotesPrice[noteIndex],
          ...additionalFields,
        };
        setValue(`credit_notes_price.${noteIndex}`, updatedNote);
      }
    };

    if (invoiceQuantity !== originalQuantity) {
      addCreditNote("quantity", {
        invoice_quantity: invoiceQuantity,
        quantity: originalQuantity,
        name: name,
        cost,
        code,
        order_cost: orderCost,
        unit,
        tax_rate,
        tax_amount,
        total_credit,
      });
    } else {
      // debugger;

      let filteredNotes = creditNotes.filter(
        (note: { id: string; type: string; unit: string }) =>
          !(
            note.id === itemId &&
            note.type === "quantity" &&
            note.unit === unit
          )
      );
      setValue("credit_notes", filteredNotes);
    }

    if (cost !== orderCost && watch(`accept_price_change_from_supplier`) == 0) {
      addCreditNotePrice("price", {
        invoice_quantity: invoiceQuantity,
        quantity: originalQuantity,
        cost,
        order_cost: orderCost,
        name: name,
        code,
        unit,
        tax_rate,
        tax_amount_price,
        total_credit_price,
      });
    } else {
      let filteredNotes = creditNotesPrice.filter(
        (note: { id: string; type: string; unit: string }) =>
          !(note.id === itemId && note.type === "price" && note.unit === unit)
      );
      setValue("credit_notes_price", filteredNotes);
    }
  };

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
      )
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
  const {
    isLoadingUploadImage,
    isLoadingremoveImage,
    uploadImage,
    removeImage,
    isLoadingReceiveOrderOne,
  } = useReceiveOrdersHttp({ orderId: rowData || "" });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.[0] || null;

    if (file) {
      const formData: any = new FormData();
      formData.append("image", file, file.name);
      formData.append("id", rowData || "");
      formData.append("type", "purchasing");

      const reader = new FileReader();

      reader.readAsDataURL(file);

      uploadImage(formData);
    }
  };
  const scrollToRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isAddImage ? (
        <div className="flex flex-col  items-center">
          {watch("image")?.url && (
            <div
              className="text-warn flex items-center justify-center text-[25px] border-[2px] mt-2 border-warn p-4 w-[20px] h-[20px] rounded-full cursor-pointer ml-[800px]"
              onClick={() => {
                removeImage({ id: watch("image")?.id });
              }}
            >
              <p>x</p>
            </div>
          )}
          <div>
            {isLoadingUploadImage || isLoadingremoveImage ? (
              <>loading</>
            ) : (
              <>
                {watch("image")?.url ? (
                  <img
                    src={watch("image")?.url}
                    className="h-[500px] mt-[50px] w-full "
                  />
                ) : (
                  <div className="mt-40">
                    <label id="file-input-label" htmlFor="file-input">
                      <div>
                        <div className="p-5 border border-primary cursor-pointer font-bold text-primary text-[18px] ">
                          +
                        </div>

                        <div>
                          <input
                            type="file"
                            id="file-input"
                            name="file-input"
                            className="hidden"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
          <p className="font-bold text-textPrimary text-[14px] mt-[16px]">
            No photos attached. Add your first photo.
          </p>
        </div>
      ) : (
        <div className="p-[16px]">
          {/* Create item */}
          <CreateNewItem
            newItem={newItem}
            setNewItem={setNewItem}
            rowData={rowData}
            scollToRef={scrollToRef}
          />
          {/* Order items */}
          <p
            className={`text-[16px] font-bold py-10 border-t ${newItem ? "border-secondary-foreground" : ""
              }`}
          >
            Order items
          </p>

          <div className="grid grid-cols-12 gap-4 font-bold pb-2  mb-[27px]">
            <div>Item code</div>
            <div className="col-span-2">Item name</div>
            <div>Order unit</div>
            <div>Invoice qty</div>
            <div>Received qty</div>
            <div>Price per unit</div>
            <div>Item subtotal</div>
            <div>Tax rate</div>
            <div>Tax value</div>
            <div>Total price</div>
            <div></div>
          </div>
          {getValues("items")?.length && (
            <>
              {getValues("items")?.map(
                (
                  item: {
                    code: string;
                    name: string;
                    unit: string;
                    item_id: string;
                  },
                  _i: number
                ) => {
                  const invoiceQuantity = +watch(
                    `items.[${_i}].invoice_quantity`
                  );
                  const costItem = +watch(`items.[${_i}].cost`);
                  const quantity = +watch(`items.[${_i}].quantity`);
                  const subTotalCost = costItem * invoiceQuantity;
                  const taxGroupId = watch(`items.[${_i}].tax_group_id`);
                  const taxRate =
                    taxGroups?.find((e: { id: string }) => e.id === taxGroupId)
                      ?.rate || 0;
                  const taxAmount = +((costItem * quantity) * (taxRate / 100)).toFixed(
                    2
                  );
                  const totalCost = subTotalCost + taxAmount;

                  // const updateCosts = useCallback(() => {
                  //   // Fetch the latest form values using `watch`
                  //   const invoiceQuantity =
                  //     +watch(`items.[${_i}].invoice_quantity`) || 0;
                  //   const costItem = +watch(`items.[${_i}].cost`) || 0;

                  //   // Calculate the subtotal cost
                  //   const subTotalCost = costItem * invoiceQuantity;

                  //   // Get tax group ID and find the rate
                  //   const taxGroupId = watch(`items.[${_i}].tax_group_id`);
                  //   const taxRate =
                  //     taxGroups?.find((e) => e.id === taxGroupId)?.rate || 0;

                  //   // Calculate the tax amount
                  //   const taxAmount = +(subTotalCost * (taxRate / 100)).toFixed(
                  //     2
                  //   );

                  //   // Calculate the total cost
                  //   const totalCost = subTotalCost + taxAmount;

                  //   // Update the form fields with the new values
                  //   setValue(`items.[${_i}].sub_total`, subTotalCost);
                  //   setValue(`items.[${_i}].tax_amount`, taxAmount);
                  //   setValue(`items.[${_i}].total_cost`, totalCost);

                  //   // Trigger any additional logic
                  //   calculationSun();
                  //   CheckCreditNotesValidtion(_i);
                  // }, [
                  //   watch(`items.[${_i}].cost`),
                  //   watch(`items.[${_i}].invoice_quantity`),
                  //   watch(`items.[${_i}].tax_group_id`),
                  //   taxGroups,
                  // ]);

                  const updateCosts = () => {
                    setValue(
                      `items.[${_i}].sub_total`,
                      +watch(`items.[${_i}].cost`) *
                      +watch(`items.[${_i}].invoice_quantity`)
                    );
                    setValue(
                      `items.[${_i}].tax_amount`,
                      +watch(`items.[${_i}].cost`) *
                      +watch(`items.[${_i}].quantity`) *
                      ((taxGroups?.find(
                        (e: { id: string }) =>
                          e.id === watch(`items.[${_i}].tax_group_id`)
                      )?.rate || 0) /
                        100)
                    );
                    setValue(
                      `items.[${_i}].total_cost`,
                      +watch(`items.[${_i}].cost`) *
                      +watch(`items.[${_i}].invoice_quantity`) +
                      +watch(`items.[${_i}].cost`) *
                      +watch(`items.[${_i}].invoice_quantity`) *
                      (taxRate / 100)
                    );
                    calculationSun();
                    CheckCreditNotesValidtion(_i);
                  };

                  return (
                    <div className="grid grid-cols-12 gap-4 mb-2" key={_i}>
                      <div>{item?.code}</div>
                      <div className="mb-3 col-span-2">
                        <CustomCircle text={item?.name} />
                      </div>
                      <div className="mb-3">({item?.unit})</div>

                      {/* Invoice Quantity */}
                      <div>
                        <Input
                          step={"0.01"}
                          min={0}
                          type="number"
                          className="w-[80px]"
                          defaultValue={invoiceQuantity}
                          onChange={(e) => {
                            const newInvoiceQuantity = +e.target.value;
                            setValue(
                              `items.[${_i}].invoice_quantity`,
                              newInvoiceQuantity, {
                              shouldValidate: true,
                              shouldDirty: true
                            }
                            );
                            updateCosts();
                          }}
                        />
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center mb-6">
                        <Input
                          type="number"
                          step={"0.01"}
                          min={0}
                          className="w-[80px]"
                          defaultValue={quantity}
                          onChange={(e) => {
                            setValue(`items.[${_i}].quantity`, +e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true
                            });
                            updateCosts();
                          }}
                        />
                        <div className="ml-[5px]">
                          {invoiceQuantity !== quantity && (
                            <InfoIcon color="var(--warn)" />
                          )}
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="flex items-center mb-6">
                        <Input
                          step={"0.01"}
                          min={0}
                          type="number"
                          className="w-[80px]"
                          textLeft="SAR"
                          defaultValue={costItem}
                          onChange={(e) => {
                            setValue(`items.[${_i}].cost`, +e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true
                            });
                            updateCosts();
                          }}
                        />
                        <div className="ml-[5px]">
                          {costItem !== watch(`items.[${_i}].order_cost`) && (
                            <InfoIcon color="var(--warn)" />
                          )}
                        </div>
                      </div>

                      <div>SAR {subTotalCost.toFixed(2)}</div>

                      {/* Tax Group */}
                      <div>
                        <CustomSelect
                          width="w-[80px]"
                          options={taxGroupsSelect}
                          value={taxGroupId}
                          optionDefaultLabel="Select Tax"
                          onValueChange={(a) => {
                            setValue(`items.[${_i}].tax_group_id`, a);
                            updateCosts();
                          }}
                        />
                      </div>

                      <div>
                        {taxGroupId
                          ? `SAR ${taxAmount.toFixed(2)}`
                          : "SAR 00.00"}
                      </div>

                      <div>SAR {totalCost.toFixed(2)}</div>

                      {/* Remove Button */}
                      {watch("items")?.length > 1 && (
                        <div
                          className="text-[20px] cursor-pointer -ml-1 text-warn"
                          onClick={() => {
                            const creditNotes = watch("credit_notes");
                            const creditNotesPrice =
                              watch("credit_notes_price");

                            remove(_i);

                            const creditNotesFiltered = creditNotes?.filter(
                              (credit: { id: string }) =>
                                credit?.id !== item?.item_id
                            );
                            const creditNotesPriceFiltered =
                              creditNotesPrice?.filter(
                                (credit: { id: string }) =>
                                  credit?.id !== item?.item_id
                              );

                            setValue("credit_notes", creditNotesFiltered);
                            setValue(
                              "credit_notes_price",
                              creditNotesPriceFiltered
                            );

                            calculationSun();
                          }}
                        >
                          X
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </>
          )}

          {/* New items */}

          <AddNewItem
            setNewItem={setNewItem}
            rowData={rowData}
            scollToRef={scrollToRef}
          />

          {/* Credit notes */}
          <CreditNotes />
        </div>
      )}
    </>
  );
};

export default OrderItems;
