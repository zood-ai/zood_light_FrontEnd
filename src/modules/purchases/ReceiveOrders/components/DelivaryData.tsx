import { Button } from "@/components/ui/button";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TooltipIcon from "@/assets/icons/Tooltip";
const DelivaryData = ({
  setSteps,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
}) => {
  const { setValue, watch, register } = useFormContext();
  const [date, setDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [dateReceive, setDateReceive] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );

  useEffect(() => {
    setValue("invoice_date", moment(new Date()).format("YYYY-MM-DD"));
    setValue("business_date", moment(new Date()).format("YYYY-MM-DD"));
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-8">
          <p>
            Invoice number <span className="text-warn">*</span>
          </p>
          <div className="flex items-center gap-2">
            <p>Invoice Date </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TooltipIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    The date on the document, used <br />
                    for export and Reconciliation
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <p>Received on</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <TooltipIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    The date the goods were received, used <br />
                    for stock management and reports
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <Input
            className="w-[150px] h-[40px]"
            value={watch("invoice_number")}
            onChange={(e) => {
              const value = e.target.value;

              setValue("invoice_number", +value);
            }}
            type="number"
          />
          <CustomInputDate
            width="h-[40px] w-[150px]"
            date={watch("invoice_date")}
            defaultValue={watch("invoice_date")}
            onSelect={(selectedDate) => {
              setValue(
                "invoice_date",
                moment(selectedDate).format("YYYY-MM-DD")
              );
            }}
          />

          <CustomInputDate
            width="h-[40px] w-[150px]"
            date={dateReceive}
            defaultValue={watch("business_date")}
            onSelect={(selectedDate) => {
              setDateReceive(moment(selectedDate).format("YYYY-MM-DD"));
              setValue(
                "business_date",
                moment(selectedDate).format("YYYY-MM-DD")
              );
            }}
          />
        </div>
      </div>

      <Button
        type="button"
        className="w-[580px] absolute bottom-0 my-2 mx-5"
        disabled={watch("invoice_number") ? false : true}
        onClick={() => {
          setSteps(3);
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default DelivaryData;
