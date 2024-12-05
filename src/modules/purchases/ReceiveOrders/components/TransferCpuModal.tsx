import CustomCircle from "@/components/ui/custom/CustomCircle";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import InfoIcon from "@/assets/icons/Info";
import { CreateNewItem } from "./CreateNewItem";
import { AddNewItem } from "./AddNewItem";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomTooltip from "@/components/ui/custom/CustomTooltip";

const TransferCPUModal = ({ rowData }: { rowData?: { id: string } }) => {
    const [newItem, setNewItem] = useState<boolean>(false);
    const { taxGroupsSelect, taxGroups } = useCommonRequests({
        getTaxGroups: true,
        getCategories: true,
    });
    const { control, setValue, getValues, watch, trigger } = useFormContext();

    const { remove }: any = useFieldArray({
        control,
        name: "items",
    });

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

    const scrollToRef = useRef<HTMLDivElement>(null);

    const previousItemsRef = useRef(watch("items"));
    const taxAmount = +watch("items")?.reduce(
        (acc: number, curr: { tax_amount: number }) => acc + +curr?.tax_amount,
        0
    );
    const subTotalCost = +watch("items")?.reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
    );

    useEffect(() => {
        setValue("total", 0);

        if (
            watch("items")?.length !== previousItemsRef?.current?.length ||
            watch("total") > 0
        ) {
            trigger("total");
        }
    }, [watch("items").length]);


    return (
        <>

            <div className="bg-popover flex justify-between p-[15px]">
                <div className="flex flex-col ">
                    <div className="flex  items-center mb-2">
                        <Label className="mr-[95px] flex items-center gap-2">
                            <p>Order Date</p>
                            <CustomTooltip tooltipContent="The date on the document, used for export the reconcilication." />{" "}
                        </Label>

                    </div>
                    <div className="flex gap-[24px] items-center ">
                        <CustomInputDate
                            defaultValue={moment(watch("business_date")).format("MMM DD")}
                            disabled={true}
                            onSelect={(selectedDate) => {
                                setValue(
                                    "invoice_date",
                                    moment(selectedDate).format("YYYY-MM-DD")
                                );
                            }}
                        />


                    </div>
                </div>

                <div className="flex flex-col gap-[7px] bg-[#FFFFFF] border-[1px] border-gray-400 p-[8px] rounded-[4px]">
                    <div className="flex gap-[87px] justify-between">
                        <p>Subtotal</p>
                        <p>SAR {(watch("items")?.length && subTotalCost) || 0}</p>
                    </div>
                    <div className="flex gap-[87px] justify-between">
                        <p>Total tax</p>
                        <p>SAR {(watch("items")?.length && taxAmount) || 0}</p>
                    </div>
                    <div className="flex gap-[87px] justify-between font-bold">
                        <p>Total</p>
                        <p>SAR {taxAmount + subTotalCost}</p>
                    </div>
                </div>
            </div>
            <div className="p-[16px]">
                {/* Create item */}
                <CreateNewItem
                    newItem={newItem}
                    setNewItem={setNewItem}
                    rowData={rowData?.id}
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
                    <div>Qty ordered</div>
                    <div>Qty to deliver</div>
                    <div>Price per unit</div>
                    <div>Item subtotal</div>
                    <div>Tax rate</div>
                    <div>Tax value</div>
                    <div>Total price</div>
                    <div></div>
                </div>
                {watch("items")?.length && (
                    <>
                        {watch("items")?.map(
                            (
                                item: {
                                    code: string;
                                    name: string;
                                    unit: string;
                                    item_id: string;
                                },
                                _i: number
                            ) => {
                                const quantity = +watch(
                                    `items.[${_i}].quantity`
                                );
                                const costItem = +watch(`items.[${_i}].cost`) || 0;
                                const invoice_quantity = +watch(`items.[${_i}].invoice_quantity`) || 0;

                                const subTotalCost = costItem * quantity || 0;
                                const taxGroupId = watch(`items.[${_i}].tax_group_id`) || 0;
                                const taxRate =
                                    taxGroups?.find((e: { id: string }) => e.id === taxGroupId)
                                        ?.rate || 0;
                                const taxAmount = +(subTotalCost * (taxRate / 100)).toFixed(2);
                                const totalCost = subTotalCost + taxAmount;

                                const updateCosts = () => {
                                    setValue(
                                        `items.[${_i}].sub_total`,
                                        +watch(`items.[${_i}].cost`) *
                                        +watch(`items.[${_i}].invoice_quantity`)
                                    );
                                    setValue(
                                        `items.[${_i}].tax_amount`,
                                        +watch(`items.[${_i}].cost`) *
                                        +watch(`items.[${_i}].invoice_quantity`) *
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
                                };


                                return (
                                    <div className="grid grid-cols-12 gap-4 mb-2" key={_i}>
                                        <div>{item?.code}</div>
                                        <div className="mb-3 col-span-2">
                                            <CustomCircle text={item?.name} />
                                        </div>
                                        <div className="mb-3">({item?.unit})</div>

                                        {/* order Quantity */}
                                        <div>{quantity || 0}</div>

                                        {/* Quantity */}
                                        <div className="flex items-center mb-6">
                                            <Input
                                                type="number"
                                                step={"0.01"}
                                                min={0}
                                                className="w-[80px]"
                                                defaultValue={invoice_quantity}
                                                onChange={(e) => {
                                                    setValue(`items.[${_i}].invoice_quantity`, +e.target.value, {
                                                        shouldDirty: true,
                                                    });
                                                    updateCosts();
                                                }}
                                            />
                                        </div>

                                        {/* Cost */}
                                        <div className="flex items-center mb-6">
                                            <Input
                                                step={"0.01"}
                                                min={0}
                                                type="number"
                                                className="w-[80px]"
                                                textLeft="SAR"
                                                disabled={true}
                                                defaultValue={costItem}
                                            />
                                        </div>

                                        <div>SAR {subTotalCost.toFixed(2)}</div>

                                        {/* Tax Group */}
                                        <div>
                                            <CustomSelect
                                                width="w-[80px]"
                                                options={taxGroupsSelect}
                                                disabled={true}
                                                value={taxGroupId}
                                                optionDefaultLabel="Select Tax"
                                            />
                                        </div>

                                        <div>
                                            {taxGroupId ? `SAR ${taxAmount.toFixed(2)}` : "SAR 00.00"}
                                        </div>

                                        <div>SAR {totalCost.toFixed(2)}</div>
                                    </div>
                                );
                            }
                        )}
                    </>
                )}

                {/* New items */}


                <AddNewItem
                    setNewItem={setNewItem}
                    rowData={rowData?.id}
                    scollToRef={scrollToRef}
                />

            </div>
        </>
    );
};

export default TransferCPUModal;
