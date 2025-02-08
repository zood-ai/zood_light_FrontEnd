import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useFormContext } from "react-hook-form";

const ActionModal = ({ modalType }: { modalType: string }) => {
  const { employeesSelect, isEmployeesLoading } = useCommonRequests({
    getEmployees: true,
  });
  const { setValue, register } = useFormContext();
  return (
    <div>
      {modalType === "approve" ? (
        <>
          <div className="mb-4">
            <Label>Send to</Label>
            <CustomSelect
              options={employeesSelect}
              loading={isEmployeesLoading}
              onValueChange={(e) => {
                setValue("approvals", [e]);
              }}
            />
          </div>
          <Label>Note</Label>
          <Textarea {...register("notes")} />
        </>
      ) : (
        <>
          <Label>Email body</Label>
          <Textarea placeholder="email body" {...register("email_body")} />
        </>
      )}
    </div>
  );
};

export default ActionModal;
