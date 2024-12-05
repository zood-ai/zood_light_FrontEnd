import HeaderPage from "@/components/ui/custom/HeaderPage";
import FilterOptions from "./components/FilterOption";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import useFilterQuery from "@/hooks/useFilterQuery";
import { handleType } from "./helpers/helpers";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formWastEditSchema, formWastSchema } from "./schema/Schema";
import ItemsList from "./components/SelectItem";
import { Button } from "@/components/ui/button";
import SingleItem from "./components/SingleItem";
import ArrowReturn from "@/assets/icons/ArrowReturn";
import SingleItemCreate from "./components/SingleItemCreate";
import ChooseBranch from "@/components/ui/custom/ChooseBranch";
import { useSearchParams } from "react-router-dom";
import useWasteHttp from "./queriesHttp/useWasteHttp";
import CustomCircle from "@/components/ui/custom/CustomCircle";
import Summary from "./components/Summary";
import CustomModal from "@/components/ui/custom/CustomModal";
import moment from "moment";
import { watch } from "fs";
const Waste = () => {
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const [steps, setSteps]: [number, Dispatch<SetStateAction<number>>] =
    useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [check, setCheck] = useState(false);
  const [rowData, setRowData] = useState<number>();
  const [searchParams] = useSearchParams();
  const [modalName, setModalName] = useState("");

  const handleAccordionClick = (rowIndex: number) => {
    setOpenRowIndex((prevIndex) => (prevIndex === rowIndex ? null : rowIndex));
  };
  const { filterObj } = useFilterQuery();
  const handleClose = () => {
    setIsEdit(false);
    setModalName("");
    setIsOpen(false);
    form.reset();
    setSteps(1);
    setRowData(0);
  };

  const {
    WastesData,
    isFetchingWastes,
    wasteUpdate,
    wasteCreate,
    isFetchingWastesOne,
    isPendingDelete,
    wasteDelete,
    isPendingDownload,
    wasteDownload,
    isPendingUpdate,
    isPendingCreate,
  } = useWasteHttp({
    wasteId: rowData || undefined,
    handleClose: handleClose,
    setWasteOne: (data: any) => {
      formEdit.reset(data);
    },
  });

  const columns = [
    {
      id: "row1",
      header: () => <div>{handleType(filterObj.group_by)}</div>,
      cell: ({ row }: any) => {
        const rowData = row.original || {};

        return (
          <>
            <Accordion
              type="single"
              collapsible
              value={openRowIndex === row.index ? "item-1" : undefined}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  className="font-bold text-primary "
                  onClick={() => {
                    handleAccordionClick(row.index);
                  }}
                >
                  {rowData?.length ? `${rowData}` : "-"}
                </AccordionTrigger>
                {rowData?.length &&
                  WastesData?.data[rowData]?.map((e: any) => (
                    <AccordionContent className="pt-7">
                      {filterObj.group_by == "business_date" ? "-" : "-"}
                    </AccordionContent>
                  ))}
              </AccordionItem>
            </Accordion>
          </>
        );
      },
    },

    {
      id: "row2",
      header: () => (
        <div>{filterObj.group_by == "wastable.name" ? "Reason" : "Item"}</div>
      ),
      cell: ({ row }: any) => {
        const rowData = row?.original || {};
        const filteredItems = useMemo(() => {
          return Object.values(WastesData?.data[rowData])
            ?.filter((entry: any) => entry.item !== null)
            ?.filter((e: any, index: number, self: any[]) => {
              return (
                self.findIndex((item) => item.item?.id === e.item?.id) === index
              );
            });
        }, [rowData]);

        const filteredReasons = useMemo(() => {
          return Object.values(WastesData?.data[rowData])
            ?.filter((entry: any) => entry.item !== null)
            ?.filter((e: any, index: number, self: any[]) => {
              return (
                self.findIndex((item) => item.reason === e.reason) === index
              );
            });
        }, [rowData]);
        return (
          <div className="">
            <Accordion
              type="single"
              collapsible
              value={openRowIndex === row.index ? "item-2" : undefined}
            >
              <AccordionItem value="item-2">
                <AccordionTrigger
                  onClick={() => handleAccordionClick(row.index)}
                  showIcon={false}
                >
                  {filterObj?.group_by == "wastable.name" ? (
                    <>{filteredReasons?.length} Reason</>
                  ) : (
                    <>{filteredItems?.length} Item</>
                  )}
                </AccordionTrigger>

                {filterObj?.group_by == "wastable.name" ? (
                  <>
                    {rowData &&
                      WastesData?.data[rowData]?.map(
                        (e: { reason: string; id: number }) => (
                          <AccordionContent
                            className="pt-7 "
                            onClick={() => handleEdit(e)}
                          >
                            {e?.reason == null ? "-" : e?.reason}
                          </AccordionContent>
                        )
                      )}
                  </>
                ) : (
                  <>
                    {rowData &&
                      WastesData?.data[rowData]?.map(
                        (e: { item: { name: string }; id: number }) => (
                          <AccordionContent
                            className="pt-7"
                            onClick={() => handleEdit(e)}
                          >
                            {e?.item?.name == null ? (
                              <span className="text-warn">
                                {"Item Deleted"}
                              </span>
                            ) : (
                              e?.item?.name
                            )}
                          </AccordionContent>
                        )
                      )}
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </div>
        );
      },
    },

    {
      id: "row3",
      header: () => (
        <div>
          {" "}
          {filterObj.group_by == "poster.name" ? "Reason" : "Logged By"}
        </div>
      ),
      cell: ({ row }: any) => {
        const rowData = row?.original || {};
        const filteredReasons = useMemo(() => {
          return Object.values(WastesData?.data[rowData])
            ?.filter((entry: any) => entry.item !== null)
            ?.filter((e: any, index: number, self: any[]) => {
              return (
                self.findIndex((item) => item.reason === e.reason) === index
              );
            });
        }, [rowData]);

        const filteredPerson = useMemo(() => {
          return Object.values(WastesData?.data[rowData])
            ?.filter((entry: any) => entry.item !== null)
            ?.filter((e: any, index: number, self: any[]) => {
              return (
                self.findIndex((item) => item.poster === e.poster) === index
              );
            });
        }, [rowData]);
        return (
          <div className="">
            <Accordion
              type="single"
              collapsible
              value={openRowIndex === row.index ? "item-3" : undefined}
            >
              <AccordionItem value="item-3">
                <AccordionTrigger
                  onClick={() => handleAccordionClick(row.index)}
                  showIcon={false}
                >
                  {filterObj?.group_by == "poster.name" ? (
                    <>{filteredReasons?.length} Reason</>
                  ) : (
                    <>{filteredPerson?.length} Person</>
                  )}
                </AccordionTrigger>

                {filterObj?.group_by == "poster.name" ? (
                  <>
                    {rowData &&
                      WastesData?.data[rowData]?.map(
                        (e: { reason: string; id: number }) => (
                          <AccordionContent
                            className="pt-7 "
                            onClick={() => handleEdit(e)}
                          >
                            {e?.reason}
                          </AccordionContent>
                        )
                      )}
                  </>
                ) : (
                  <>
                    {rowData &&
                      WastesData?.data[rowData]?.map(
                        (e: { poster: string; id: number }) => (
                          <AccordionContent
                            className="pt-7 "
                            onClick={() => handleEdit(e)}
                          >
                            {e?.poster}
                          </AccordionContent>
                        )
                      )}
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </div>
        );
      },
    },
    {
      id: "row4",
      header: () => (
        <div>{filterObj.group_by == "business_date" ? "Reason" : "Date"}</div>
      ),
      cell: ({ row }: any) => {
        const rowData = row?.original || {};
        const filteredReasons = useMemo(() => {
          return Object.values(WastesData?.data[rowData])
            ?.filter((entry: any) => entry.item !== null)
            ?.filter((e: any, index: number, self: any[]) => {
              return (
                self.findIndex((item) => item.reason === e.reason) === index
              );
            });
        }, [rowData]);
        return (
          <div className=" w-44">
            <Accordion
              type="single"
              collapsible
              value={openRowIndex === row.index ? "item-4" : undefined}
            >
              <AccordionItem value="item-4">
                <AccordionTrigger
                  onClick={() => handleAccordionClick(row.index)}
                  showIcon={false}
                >
                  {filterObj.group_by == "business_date" ? (
                    <>{filteredReasons?.length} Reason</>
                  ) : (
                    <>-</>
                  )}
                </AccordionTrigger>

                {filterObj.group_by == "business_date" ? (
                  <>
                    {rowData &&
                      WastesData?.data[rowData]?.map(
                        (e: { reason: string; id: number }) => (
                          <AccordionContent
                            className="pt-7"
                            onClick={() => handleEdit(e)}
                          >
                            {e?.reason == null ? "-" : e?.reason}
                          </AccordionContent>
                        )
                      )}
                  </>
                ) : (
                  <>
                    {rowData &&
                      WastesData?.data[rowData]?.map(
                        (e: { business_date: string; id: number }) => (
                          <AccordionContent
                            className="pt-7"
                            onClick={() => handleEdit(e)}
                          >
                            {e?.business_date == null
                              ? "-"
                              : moment(e?.business_date).format("YYYY-MM-DD")}
                          </AccordionContent>
                        )
                      )}
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </div>
        );
      },
    },
    {
      id: "row5",
      header: () => <div>Quantity</div>,
      cell: ({ row }: any) => {
        const rowData = row?.original || {};

        return (
          <div>
            <Accordion
              type="single"
              collapsible
              value={openRowIndex === row.index ? "item-5" : undefined}
            >
              <AccordionItem value="item-5">
                <AccordionTrigger
                  onClick={() => handleAccordionClick(row.index)}
                  showIcon={false}
                  className="h-7"
                >
                  {"- "}
                </AccordionTrigger>
                {rowData &&
                  WastesData?.data[rowData]?.map(
                    (e: {
                      quantity: number;
                      id: number;
                      type: string;
                      item: { unit: string; stock_count: any };
                    }) => (
                      <AccordionContent
                        className="pt-7"
                        onClick={() => handleEdit(e)}
                      >
                        {e?.quantity == null
                          ? "-"
                          : `${e.type == "recipe"
                            ? e?.quantity
                            : e?.quantity /
                            e?.item?.stock_count?.find(
                              (item: { use_report: number }) =>
                                item?.use_report == 1
                            )?.count
                          } ${e.type == "recipe" ? "ea" : `(${e?.item?.unit})`
                          }`}
                      </AccordionContent>
                    )
                  )}
              </AccordionItem>
            </Accordion>
          </div>
        );
      },
    },
    {
      id: "row6",
      header: () => <div>Value</div>,
      cell: ({ row }: any) => {
        const rowData = row?.original || {};

        return (
          <div className="">
            <Accordion
              type="single"
              collapsible
              value={openRowIndex === row.index ? "item-6" : undefined}
            >
              <AccordionItem value="item-6">
                <AccordionTrigger
                  onClick={() => handleAccordionClick(row.index)}
                  showIcon={false}
                >
                  SAR{" "}
                  {WastesData?.data[rowData]
                    ?.reduce(
                      (acc: number, item: { total_cost: number }) =>
                        acc + item?.total_cost,
                      0
                    )
                    .toFixed(3)}
                </AccordionTrigger>

                {rowData &&
                  WastesData?.data[rowData]?.map(
                    (e: { total_cost: number; id: number }) => (
                      <AccordionContent
                        className="pt-7"
                        onClick={() => handleEdit(e)}
                      >
                        SAR{" "}
                        {e?.total_cost == null
                          ? "-"
                          : e?.total_cost?.toFixed(3)}
                      </AccordionContent>
                    )
                  )}
              </AccordionItem>
            </Accordion>
          </div>
        );
      },
    },
  ];

  const onSubmit = (values: any) => {
    if (isEdit) {
      wasteUpdate({ ...values, branch_id: filterObj["filter[branch]"] });
    } else {
      wasteCreate({ ...values, branch_id: filterObj["filter[branch]"] });
    }
  };
  const defaultValues = {
    item: { name: "", type: "" },
    items: [],
    reason: "",
  };

  const form = useForm<z.infer<typeof formWastSchema>>({
    resolver: zodResolver(formWastSchema),
    defaultValues,
  });
  const formEdit = useForm<z.infer<typeof formWastEditSchema>>({
    resolver: zodResolver(formWastEditSchema),
    defaultValues,
  });

  const handleEdit = (row: { id: number }) => {
    setIsEdit(true);
    setRowData(row?.id);
  };

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleClose();
    } else {
      wasteDelete();
    }
  };

  console.log();

  return (
    <>
      {filterObj?.["filter[branch]"] == null ? (
        <ChooseBranch showHeader keyBranch={"filter[branch]"} />
      ) : (
        <>
          <HeaderPage
            title="Waste"
            textButton="Log waste"
            exportInventory={true}
            onClickExportInventory={() => {
              wasteDownload();
            }}
            loading={isPendingDownload}
            onClickAdd={() => {
              setIsOpen(true);
            }}
          >
            <FilterOptions />
          </HeaderPage>

          <HeaderTable SearchInputkey="filter[item_name]" />

          <CustomTable
            data={
              (WastesData?.data && Object.keys(WastesData?.data || [])) || []
            }
            pagination={false}
            loading={isFetchingWastes}
            columns={columns}
          />
          {/* edit */}
          <CustomSheet
            isOpen={isEdit}
            isEdit={isEdit}
            handleCloseSheet={handleClose}
            headerLeftText={"Waste details"}
            form={formEdit}
            isLoadingForm={isFetchingWastesOne}
            setModalName={setModalName}
            headerStyle="border-b-0 flex items-center justify-between w-full"
            purchaseHeader={<>Waste details</>}
            receiveOrder={
              <>
                <div className="flex items-center gap-2">
                  <Button loading={isPendingDelete || isPendingUpdate}>
                    Save
                  </Button>
                  {/* <Button
                    type="button"
                    loading={isPendingDelete}
                    variant={"outline"}
                    className="w-fit px-4 font-semibold text-warn border-warn"
                    onClick={() => {
                      setModalName("delete");
                    }}
                  >
                    Delete
                  </Button> */}
                </div>
              </>
            }
            children={
              <>
                <SingleItem />
              </>
            }
            onSubmit={onSubmit}
            contentStyle="px-0"
          />
          {/* new */}
          <CustomSheet
            isOpen={isOpen}
            handleCloseSheet={handleClose}
            form={form}
            headerStyle="border-b-0 flex items-center justify-between w-full"
            purchaseHeader={
              <>
                {steps == 1 && (
                  <div className="flex items-center justify-between w-full">
                    Choose item
                  </div>
                )}
                {steps == 2 && (
                  <div className="capitalize  flex items-center">
                    <ArrowReturn
                      className="cursor-pointer"
                      height="15"
                      onClick={() => {
                        setSteps(1);
                        if (!check) {
                          const items = form.watch("items") || [];
                          const batches = form.watch("batches") || [];
                          const recipes = form.watch("recipes") || [];
                          const currentItem = form.watch("item");
                          console.log(currentItem?.type, "currentItem");

                          if (currentItem?.type == "item") {
                            if (Array.isArray(items)) {
                              const updatedItems: any = items.filter(
                                (i: { id: string }) => i?.id !== currentItem?.id
                              );

                              form.setValue("items", updatedItems);
                            }
                          }
                          if (currentItem?.type == "batch") {
                            console.log(currentItem?.type, "currentItem");
                            if (Array.isArray(batches)) {
                              const updatedbatches: any = batches.filter(
                                (i: { id: string }) => i?.id !== currentItem?.id
                              );

                              form.setValue("batches", updatedbatches);
                            }
                          }
                          if (currentItem?.type == "recipe") {
                            if (Array.isArray(recipes)) {
                              const updatedrecipes: any = recipes.filter(
                                (i: { id: string }) => i?.id !== currentItem?.id
                              );

                              form.setValue("recipes", updatedrecipes);
                            }
                          }
                        }
                      }}
                    />{" "}
                    <p>Log wastes</p>
                  </div>
                )}
                {steps == 3 && (
                  <div className="capitalize  flex items-center">
                    <ArrowReturn
                      className="cursor-pointer"
                      height="15"
                      onClick={() => {
                        setSteps(1);
                      }}
                    />{" "}
                    <p>Waste</p>
                  </div>
                )}
              </>
            }
            receiveOrder={
              <>
                {steps == 2 && (
                  <div className="flex items-center gap-2">
                    <div
                      className={` text-[20px] font-bold  ${check
                          ? "text-primary cursor-pointer"
                          : "text-primary-foreground cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (check) {
                          setSteps(1);
                        }
                        setCheck(false);
                      }}
                    >
                      Done
                    </div>
                  </div>
                )}
              </>
            }
            children={
              <div className="p-5">
                {steps == 1 && <ItemsList setSteps={setSteps} />}
                {steps == 2 && <SingleItemCreate setCheck={setCheck} />}
                {steps == 3 && <Summary isPendingCreate={isPendingCreate} />}
              </div>
            }
            onSubmit={onSubmit}
            contentStyle="px-0"
          />
        </>
      )}

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={"waste"}
      />
    </>
  );
};

export default Waste;
