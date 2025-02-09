import HistoryIcon from "@/assets/icons/History";
import MoreIcon from "@/assets/icons/More";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import moment from "moment";
import usePeopleHttp from "../../queriesHttp/usePeopleHttp";
import CustomDropDown from "@/components/ui/custom/CustomDropDown";
import CustomModal from "@/components/ui/custom/CustomModal";
import { useState } from "react";
import useFilterQuery from "@/hooks/useFilterQuery";
import FileUpload from "@/components/ui/custom/FileMultiple";
import LinkIcon from "@/assets/icons/Link";
import { Loader2 } from "lucide-react";

const Feedback = () => {
  const { filterObj } = useFilterQuery();
  const [modalName, setModalName] = useState("");
  const { setValue, watch, reset } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);  
 const handleClear = () => {
    setValue("message", "");
    setValue("attachment", []);
    setValue("share", false);
    setModalName("");
    setFiles([])
  };
  const {
    addFeedback,
    isLoadingAddFeedback,
    deleteFeedback,
    isLoadingDeleteFeedback,
    updateFeedback,
    isLoadingFeedback,
    isLoadingUpdateFeedback,
  } = usePeopleHttp({
    setModalName: setModalName,
    setEmployeeOne: (data: any) => {
      reset(data);
    },
    handleCloseSheet:handleClear
  });
 
  const [rowData, setRowData] = useState<any>();

  const deleteFn = (note) => {
    deleteFeedback({
      id: note?.id,
    });
  };
  const handleConfirm = () => {
    if (modalName === "delete") {
      deleteFn(rowData);
    } else if (modalName === "share") {
      updateFeedback({
        id: rowData?.id,
        note: rowData?.note,
        employee_id: filterObj?.id,
        sender_id: Cookies.get("id"),
        share: 1,
      });
    } else {
      updateFeedback({
        id: rowData?.id,
        note: rowData?.note,
        employee_id: filterObj?.id,
        sender_id: Cookies.get("id"),
        share: 0,
      });
    }
    setRowData(undefined);
  };

  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <HistoryIcon />{" "}
        </div>
        <h3 className="font-bold text-[16px]">Employee details</h3>
      </div>
      <Label>New note</Label>
      <Textarea
      value={watch("message")}
        placeholder="Type here...."
        onChange={(e) => {
          setValue("message", e.target.value);
        }}
      />

      <div className="mt-[8px] flex justify-end gap-2 ml-auto">
        <Checkbox
        checked={watch("share")}
          onCheckedChange={(e) => {
            setValue("share", !!e);
          }}
        />

        <Label>
          Share with {watch("first_name")} {watch("last_name")}
        </Label>
      </div>
      <div className="mt-[8px] flex justify-end gap-2 ml-auto">
        <div className="flex items-center gap-2">
          <FileUpload setValue={setValue} setFiles={setFiles} files={files} />
          <Button
            className="ml-auto"
            type="button"
            loading={isLoadingAddFeedback || isLoadingDeleteFeedback}
            disabled={
              !watch("message")
            }
            onClick={() => {
              const formData = new FormData();
              formData.append("note", watch("message"));
              formData.append("employee_id", filterObj?.id);
              formData.append("sender_id", Cookies.get("id") || "");
              formData.append("share", watch("share"));
              watch("attachment")?.forEach((item: any, index: number) => {
                formData.append(`attachment[${index}]`, item);
              });

              addFeedback(formData);
            }}
            
          >
            Save
          </Button>
        </div>
      </div>

      {isLoadingFeedback ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : (
        <>
          {watch("notes")?.length == 0 ? (
            <div className="mt-[45px] flex flex-col justify-center items-center text-[#595959] text-[14px]">
              <p>👀</p>
              There are no notes for this employee yet. add a note in the box
              above
            </div>
          ) : (
            <>
              {watch("notes")?.map((note: any, index: number) => (
                <div
                  className=" flex items-center justify-between p-3 border border-input rounded-[4px] mt-[30px] mb-[13px] bg-popover"
                  key={index}
                >
                  <div className="flex flex-col gap-2">
                    <h1 className="w-[500px] overflow-hidden text-ellipsis">
                      {note?.note}
                    </h1>

                    <div className=" gap-2">
                      {note?.attachment?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="cursor-pointer hover:text-primary"
                          onClick={() => {
                            window.open(`${item?.url}`, "_blank");
                          }}
                        >
                          <div className="flex gap-2 items-center">
                            <p>{item?.name}</p>

                            <div>
                              <LinkIcon />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="py-2 text-[12px]">
                      {note?.sender?.first_name} {note?.sender?.last_name},
                      {moment(note?.created_at).format("LL")} , 
                      {note?.share?<span className="font-bold"> Shared</span>:<></>}
                    </p>
                  </div>

                  <CustomDropDown
                    defaultValue={
                      <div className="py-2">
                        <MoreIcon />
                      </div>
                    }
                    options={
                      note?.share
                        ? [
                            { label: "Delete", value: 1 },
                            { label: "Unshare with employee", value: 2 },
                          ]
                        : [
                            { label: "Delete", value: 1 },
                            { label: "Share with employee", value: 2 },
                          ]
                    }
                    onValueChange={(e) => {
                      if (e == 1) {
                        setRowData(note);
                        setModalName("delete");
                      }
                      if (e == 2) {
                        if (note?.share) {
                          setRowData(note);
                          setModalName("unshare");
                        } else {
                          setRowData(note);
                          setModalName("share");
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </>
      )}

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={""}
        iconColor={modalName == "delete" ? "red" : "var(--success)"}
        bgColor={modalName == "delete" ? "var(--warn-foreground)" : "#E3FCF9"}
        headerModal={
          modalName == "delete"
            ? "Are you sure you want to delete?"
            : modalName == "share"
            ? "Are you sure you want to share?"
            : "Are you sure you want to unshare?"
        }
        descriptionModal={
          modalName == "delete"
            ? "Are you sure you want to delete this feedback?"
            : modalName == "share"
            ? "Are you sure you want to share this feedback?"
            : "Are you sure you want to unshare this feedback?"
        }
        confirmbtnText={
          modalName == "delete"
            ? "delete"
            : modalName == "share"
            ? "Share"
            : "Unshare"
        }
        isPending={
          isLoadingDeleteFeedback ||
          isLoadingUpdateFeedback ||
          isLoadingUpdateFeedback
        }
        confirmbtnStyle={
          modalName == "delete" ? "" : " text-success border-success"
        }
      />
    </>
  );
};

export default Feedback;
