import ArrowReturn from "@/assets/icons/ArrowReturn";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NewTransfer from "./components/NewTransfer";
import RequestTransfer from "./components/RequestTransfer";
import SendTransfer from "./components/SendTransfer";
import ItemsList from "./components/SelectItems";
import ChooseQuantity from "./components/ChooseQuantity";
import TransferDetails from "./components/TransferDetails";
import useFilterQuery from "@/hooks/useFilterQuery";
import useTransferHttp from "./queriesHttp/useTransferHttp";
import { StatusOptionsTransfer } from "@/constants/dropdownconstants";
import { formTransferSchema } from "./schema/Schema";
import EditTransfer from "./components/EditTransfer";
import RejectTransfer from "./components/RejectTransfer";
import ContantTransfer from "./components/ContantTransfer";
import moment from "moment";

const Transfer = () => {
  const { filterObj } = useFilterQuery();
  const [steps, setSteps] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [check, setCheck] = useState(false);
  const [id, setId] = useState("");

  const [modalName, setModalName] = useState("");

  const defaultValues = {
    items: [],
    item: {},
    delivery_date: moment(new Date()).format("YYYY-MM-DD"),
    branch_id: filterObj["filter[branch]"],
    warehouse_id: filterObj["filter[branch]"],
  };
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false);
    form.reset(defaultValues);
    setSteps(1);
    setId("");
  };
  const {
    transferCreate,
    TransferOne,
    isFetchingOne,
    transferUpdate,
    isLoadingCreate,
    isLoadingUpdate,
  } = useTransferHttp({ handleCloseSheet: handleCloseSheet, transferId: id });

  const form = useForm({
    resolver: zodResolver(formTransferSchema),
    defaultValues,
  });

  const onSubmit = (values: any) => {
    if (isOpen) {
      if (modalName == "send") {
        // send
        transferCreate({ ...values, status: 2, type: 1 });
      } else {
        // request
        transferCreate({ ...values, status: 1, type: 4 });
      }
    } else {
      transferUpdate({ ...values });
    }
  };

  useEffect(() => {
    if (Object.keys(TransferOne || {}).length) {
      form.reset(TransferOne);
    }
  }, [TransferOne, form]);

  return (
    <>
      <HeaderPage
        title="Transfers"
        textButton={filterObj["filter[branch]"] ? "New transfer" : ""}
        onClickAdd={() => {
          setIsOpen(true);
        }}
      />
      <HeaderTable
        isBranches={true}
        isSearch={false}
        isStatusType={true}
        isStatus={true}
        branchkey="filter[branch]"
        optionStatus={StatusOptionsTransfer}
      />
      <ContantTransfer setIsEdit={setIsEdit} setId={setId} />
      {/* create -------------------------------------------------------------------------------------------------------------------------------------------*/}

      <CustomSheet
        width="w-[672px]"
        isOpen={isOpen}
        handleCloseSheet={handleCloseSheet}
        form={form}
        onSubmit={onSubmit}
        contentStyle="p-0"
        receiveOrder={
          steps == 5 ? (
            <div
              className={` text-[20px] font-bold cursor-pointer ${
                check
                  ? "text-primary"
                  : "text-primary-foreground cursor-not-allowed"
              }`}
              onClick={() => {
                setSteps(4);
                if (check) {
                }
                setCheck(false);
              }}
            >
              Done
            </div>
          ) : (
            <></>
          )
        }
        purchaseHeader={
          <div className="flex ">
            {steps == 1 && <div>New transfer</div>}
            {steps == 2 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    setSteps(1);
                  }}
                />{" "}
                <div className="px-3 mt-1">Send Transfer</div>
              </div>
            )}
            {steps == 3 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    setSteps(1);
                  }}
                />{" "}
                <div className="px-3 mt-1">Request Transfer</div>
              </div>
            )}
            {steps == 4 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    if (modalName == "request") {
                      setSteps(3);
                    } else {
                      setSteps(2);
                    }
                  }}
                />{" "}
                <div className="px-3 mt-1 capitalize">
                  {/* {form.watch("item")?.name} */}
                  Choose item
                </div>
              </div>
            )}
            {steps == 5 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    if (!check) {
                      const items = form.watch("items") || []; // Capture the current items
                      const currentItem: any = form.watch("item"); // Capture the current item to be removed
                      if (Array.isArray(items)) {
                        const updatedItems: any = items.filter(
                          (i: { id: string }) => i?.id !== currentItem?.id
                        );
                        form.setValue("items", updatedItems);
                      }
                    }
                    setSteps(4);
                  }}
                />{" "}
                <div className="px-3 mt-1"> Choose Quantity</div>
              </div>
            )}
            {steps == 6 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    setSteps(4);
                  }}
                />{" "}
                <div className="px-3 mt-1"> Transfer details</div>
              </div>
            )}
          </div>
        }
      >
        <>
          {steps == 1 && (
            <div>
              <NewTransfer setSteps={setSteps} setModalName={setModalName} />
            </div>
          )}
          {steps == 2 && <SendTransfer setSteps={setSteps} />}
          {steps == 3 && <RequestTransfer setSteps={setSteps} />}
          {steps == 4 && <ItemsList setSteps={setSteps} />}
          {steps == 5 && <ChooseQuantity setCheck={setCheck} />}
          {steps == 6 && (
            <TransferDetails
              setSteps={setSteps}
              modalName={modalName}
              isLoadingCreate={isLoadingCreate}
            />
          )}
        </>
      </CustomSheet>
      {/* isEdit -------------------------------------------------------------------------------------------------------------------------------------------*/}
      <CustomSheet
        width="w-[672px]"
        contentStyle="p-0"
        isOpen={isEdit}
        handleCloseSheet={handleCloseSheet}
        form={form}
        onSubmit={onSubmit}
        isLoadingForm={isFetchingOne}
        receiveOrder={
          steps == 2 ? (
            <div
              className={` text-[20px] font-bold cursor-pointer text-primary`}
              onClick={() => {
                if (check) {
                }
                setSteps(1);
                setCheck(false);
              }}
            >
              Done
            </div>
          ) : (
            <></>
          )
        }
        purchaseHeader={
          <div className="flex ">
            {steps == 1 && <>Outgoing transfer</>}
            {steps == 2 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    setSteps(1);
                  }}
                />{" "}
                <div className="px-3 mt-1">Edit Quantity</div>
              </div>
            )}
            {steps == 3 && (
              <div className="flex items-center">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    setSteps(1);
                  }}
                />{" "}
                <div className="px-3 mt-1">Reject Reason</div>
              </div>
            )}
          </div>
        }
      >
        <>
          {steps == 1 && (
            <div>
              <EditTransfer
                setSteps={setSteps}
                TransferOne={TransferOne}
                isLoadingUpdate={isLoadingUpdate}
              />
            </div>
          )}
          {steps == 2 && <ChooseQuantity setCheck={setCheck} isEdit={isEdit} />}
          {steps == 3 && (
            <RejectTransfer
              TransferOne={TransferOne}
              isLoadingUpdate={isLoadingUpdate}
            />
          )}
        </>
      </CustomSheet>
    </>
  );
};

export default Transfer;
