import MemoChecked from "@/assets/icons/Checked";
import CloseIcon from "@/assets/icons/Close";
import MoreIcon from "@/assets/icons/More";
import CustomDropDown from "@/components/ui/custom/CustomDropDown";
import CustomFileImage from "@/components/ui/custom/CustomFileImage";
import CustomModal from "@/components/ui/custom/CustomModal";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import useCommonRequests from "@/hooks/useCommonRequests";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import usePeopleHttp from "../../queriesHttp/usePeopleHttp";
import ReturnIcon from "@/assets/icons/Return";
import PendingIcon from "./../../../../../assets/icons/Pending";

const Documents = ({resetFrom}:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [doc, setDoc] = useState<any>(null)
  const [modalName, setModalName] = useState("");
  const { watch, control, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  const { documentsData } = useCommonRequests({ getDocuments: true })
  const { updateDocuments, isLoadingUpdateDocuments } = usePeopleHttp({
    handleCloseSheet: () => setModalName(""),
    setEmployeeOne: (data: any) => {
      resetFrom(data)
    }
  })

  const providedAndSign = documentsData?.data?.filter((doc) => doc.type == 1 || doc.type === 3)
  const providedAndSignDoc = watch('documents')?.filter((doc) => doc.type == 1 || doc.type === 3)
  const handleConfirm = () => {
    if (modalName == "reject") {

      updateDocuments({ id: doc?.pivot_id, status: 12 })
    }
    else {
      updateDocuments({ id: doc?.pivot_id, status: 11 })
    }
  }


console.log(watch('documents'),providedAndSignDoc,providedAndSign)
  return (
    <>
      {/* ------------------------------------------Provided and Sign documents---------------------------------------------------------- */}
      <Label>Documents needed from {watch('first_name')} {watch('last_name')}</Label>
      {watch('documents')?.map((item: any, index) => (
        <>
          {[1, 3].includes(item?.type) && <div className="flex flex-col gap-[10px] border-b border-input border-b-1 p-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">

                {item?.status == 1 &&
                  <div className="p-1 rounded-full bg-[#ffedd6ff]">
                    <ReturnIcon />
                  </div>
                }
                {item?.status == 2 &&

                  <div className="p-1 rounded-full bg-[#F5D9C5]">
                    <PendingIcon />
                  </div>
                }

                {item?.status == 11 &&

                  <div className="p-1 rounded-full bg-[#d2faf5ff]">
                    <MemoChecked color="#46c7b8ff" className="h-3 w-3" />
                  </div>
                }

                {item?.status == 12 &&

                  <div className="p-[6px] rounded-full bg-[#FBC6C8]">
                    <CloseIcon className="h-2 w-2" />
                  </div>
                }

                <p>

                  {item?.name}
                  {item?.status == 1 && item?.type == 1 &&

                    <p className="text-gray-300 text-[10px]">Not Submitted yet</p>

                  }
                  {item?.status == 1 && item.type == 3 &&

                    <p className="text-gray-300 text-[10px]">Not sign yet</p>

                  }
                  {item?.status == 2 &&

                    <p className="text-gray-300 text-[10px]">Ready for approval</p>
                  }

                  {item?.status == 11 &&

                    <p className="text-gray-300 text-[10px]">Approval</p>
                  }

                  {item?.status == 12 &&

                    <p className="text-gray-300 text-[10px]">Rejected</p>
                  }


                </p>
              </div>


              {item?.status == 2 && <div className="flex gap-2">
                <MemoChecked color="green" className="cursor-pointer"
                  onClick={() => {
                    setDoc(item)
                    setModalName("approve")
                  }
                  }
                />
                <CloseIcon className="cursor-pointer"
                  onClick={() => {
                    setDoc(item)
                    setModalName("reject")
                  }
                  } />
              </div>}

            </div>
          </div>
          }
        </>
      ))}
      {isOpen &&
        <div className="flex items-center gap-3">
          <CustomSelect
            options={providedAndSign?.filter((doc) => !providedAndSignDoc?.some((providedDoc) => providedDoc.id === doc.id))?.map((document) => ({ label: document.name, value: document.id }))}
            width="w-[200px] mt-5"
            // value={watch('documents')}
            onValueChange={(e) => {
              append({
                id: e, name: documentsData?.data?.find((item: any) => item?.id == e)?.name,
                type: documentsData?.data?.find((item: any) => item?.id == e)?.type,
                new_employees_required: 1
              })
            }}
          />
          <CloseIcon className="cursor-pointer mt-4" onClick={() => setIsOpen(false)} />
        </div>
      }

      <div className=" my-[16px] text-primary border-[2px]  border-dashed w-full text-center p-[17px] rounded-[4px] border-[#D1D5D7] cursor-pointer"
        onClick={() => {
          setIsOpen(true)
        }
        }>
        Request a document
      </div>
      {/*------------------------------------------------------------------------- reviewed  documents------------------------------------------------------ */}
      <Label>Uploaded by {watch('branches')?.find((item: any) => item?.is_home == true)?.name}</Label>

      {watch('documents')?.map((item: any, index) => (
        <>
          {[2].includes(item?.type) && <div className="flex flex-col gap-[10px] border-b border-input border-b-1 p-3">
            <div className="flex items-center justify-between">
              <p>

                {item?.name}
              </p>
              <CustomDropDown
                defaultValue={<MoreIcon />}
                options={[
                  { label: "Remove", value: 1 },
                ]}
                onValueChange={(e) => {
                  if (e == 1) {

                    const filterDocuments = watch('documents')?.filter((doc) => doc.id !== item.id)
                    setValue('documents', filterDocuments)
                  }
                }}
              />
            </div>
          </div>}
        </>
      ))}




      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={""}
        iconColor={modalName == 'reject' ? "red" : "var(--success)"}
        bgColor={modalName == 'reject' ? "var(--warn-foreground)" : "#E3FCF9"}
        headerModal={modalName == "reject" ? "Are you sure you want to reject?" : "Are you sure you want to approve?"}
        descriptionModal={modalName == 'reject' ? "Are you sure you want to reject this document?" : "Are you sure you want to approve this document?"}
        confirmbtnText={modalName == 'reject' ? "Reject" : "Approve"}
        isPending={isLoadingUpdateDocuments}
        confirmbtnStyle={modalName == 'reject' ? "" : " text-success border-success"}

      />
    </>
  );
};

export default Documents;
