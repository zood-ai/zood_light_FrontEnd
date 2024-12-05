import HistoryIcon from "@/assets/icons/History";
import MoreIcon from "@/assets/icons/More";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useFormContext } from "react-hook-form";
import moment from "moment";
import usePeopleHttp from "../../queriesHttp/usePeopleHttp";
import CustomDropDown from "@/components/ui/custom/CustomDropDown";
import CustomModal from "@/components/ui/custom/CustomModal";
import { useState } from "react";
import useFilterQuery from "@/hooks/useFilterQuery";

const Feedback = ({ feedbackData }: any) => {
  const { filterObj } = useFilterQuery()
  const [modalName, setModalName] = useState("");
  const { setValue, watch, control, getValues } = useFormContext();
  const { append } = useFieldArray({ control, name: "notes" });
  const handleAppend = (data: any) => {

    const currentNotes = watch("notes");
    const newNote = {
      note: watch("message"),
      sender: {
        first_name: Cookies.get("name"),
        created_at: moment(new Date()).format("YYYY-MM-DD"),
      }

    };
    setValue("notes", [newNote, ...currentNotes]);
    append(newNote);
  }

  const { addFeedback, isLoadingAddFeedback, deleteFeedback, isLoadingDeleteFeedback } = usePeopleHttp({
    setModalName: setModalName,
    handleAppend: handleAppend,
  })
  const [rowData, setRowData] = useState<any>();

  const deleteFn = (note) => {
    setValue('notes', watch('notes')?.filter((item: any) => item?.id != note?.id))
    deleteFeedback({
      id: note?.id
    })
  }
  const handleConfirm = () => {
    if (modalName === "Are you sure you want to delete this feedback?") {
      deleteFn(rowData)

    } else {
      setModalName("")
      setRowData(undefined)
    }
  };
  console.log(getValues("back_id"));


  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <HistoryIcon />{" "}
        </div>
        <h3 className="font-bold text-[16px]">Employee details</h3>
      </div>
      <Label>New note</Label>
      <Textarea placeholder="Type here...." onChange={(e) => {
        setValue('message', e.target.value)
      }} />

      <div className="mt-[8px] flex justify-end gap-2 ml-auto">
        <Checkbox onCheckedChange={(e) => {
          setValue('share', e)

        }} />
        <Label>Share with {watch('first_name')} {watch('last_name')}</Label>
      </div>
      <div className="mt-[8px] flex justify-end gap-2 ml-auto">
        <Button className="ml-auto " type="button"
          loading={isLoadingAddFeedback || isLoadingDeleteFeedback}
          disabled={!watch('message') || isLoadingAddFeedback}
          onClick={() => {


            addFeedback({
              note: watch('message'),
              employee_id: filterObj?.id,
              sender_id: Cookies.get("id"),
              share: +watch('share') || 0
            })
          }}>Save</Button>
      </div>


      {
        watch('notes')?.length == 0 ? (
          <div className="mt-[45px] flex flex-col justify-center items-center text-[#595959] text-[14px]">
            <p>👀</p>
            There are no notes for this employee yet. add a note in the box above
          </div>
        ) : (
          <>
            {watch('notes')?.map((note: any, index: number) => (
              <div className=" flex items-center justify-between p-3 border border-input rounded-[4px] mt-[30px] mb-[13px] bg-popover" key={index}>
                <div className="flex flex-col gap-2">
                  <h1>{note?.note}</h1>
                  <p className="py-3 text-[12px]">{note?.sender?.first_name} {note?.sender?.last_name},
                    {moment(note?.created_at).format("LL")}
                  </p>
                </div>


                <CustomDropDown
                  defaultValue={<MoreIcon />}
                  options={[
                    { label: "Delete", value: 1 },

                  ]}
                  onValueChange={(e) => {
                    if (e == 1) {
                      setRowData(note)
                      setModalName("Are you sure you want to delete this feedback?")
                    }
                  }}
                />


              </div>
            ))}
          </>
        )
      }

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={""}

        confirmbtnText="Yes, delete"

      />
    </>
  );
};

export default Feedback;
