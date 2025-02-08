import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { IRequestsList } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";

const RequestDetailsApprovals = ({
  rowData,
}: {
  rowData: IRequestsList | undefined;
}) => {
  const name = rowData?.employee.first_name + " " + rowData?.employee.last_name;
  const navigate = useNavigate();
  const { setValue } = useFormContext();

  return (
    <div className="-mt-2">
      <h3 className="font-semibold">Request made by {name}</h3>
      <div className="my-3">
        <Label>Notes</Label>
        <Textarea
          rows={6}
          placeholder="Add note"
          onChange={(e) =>
            setValue("notes", e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      </div>

      <Button
        variant="link"
        onClick={() =>
          navigate(
            `/schedulling/schedule?filter[branch]=${rowData?.branch.id}&from=${rowData?.schedule.from}&to=${rowData?.schedule.to}`
          )
        }
        className="pl-2 text-md hover:no-underline"
      >
        Go to schedule
      </Button>
    </div>
  );
};

export default RequestDetailsApprovals;
