import Avatar from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

const DaliyBreakDown = ({
  day,
  overlabs,
  requestedBy,
  employeeId,
}: {
  requestedBy: string;
  employeeId: string;
  day: { date: string; paid: boolean };
  overlabs: {
    from: string;
    details: {
      days: { date: string; paid: boolean }[];
    };
    employee: {
      first_name: string;
      last_name: string;
      id: string;
    };
  }[];
}) => {
  const { setValue, getValues } = useFormContext();

  const getOverlapEmployee = overlabs?.find((o) =>
    o.details.days.find(
      (d) => d.date === day.date && employeeId !== o.employee.id
    )
  );

  const employeeName =
    getOverlapEmployee?.employee?.first_name +
    " " +
    getOverlapEmployee?.employee?.last_name;

  return (
    <div
      className="grid grid-cols-[1fr,160px,160px] space-x-3 items-center border-b-[1px] border-[#d4e2ed] px-4"
      key={day.date}
    >
      <p className="">{format(day.date, "EEE d MMMM")}</p>
      <p className="border-x-[1px] min-h-[58px] border-[#d4e2ed] px-3 py-4 flex relative ">
        {getOverlapEmployee && (
          <>
            {" "}
            <Avatar text={employeeName} className="z-20" />
            <Avatar
              text={requestedBy}
              className="absolute -translate-y-1/2 top-1/2 left-9"
            />
          </>
        )}
      </p>

      <p className="flex items-center justify-between ">
        {day.paid ? (
          <>
            {" "}
            Paid{" "}
            <Switch
              checked={
                getValues("details")?.days?.find((d) => d.date === day.date)
                  ?.paid
              }
              onCheckedChange={(e) => {
                const findDay = getValues("details")?.days?.find(
                  (d) => d.date === day.date
                );
                if (findDay) {
                  setValue(
                    "details",
                    {
                      ...getValues("details"),
                      days: getValues("details")?.days?.map((d) => {
                        if (d.date === day.date) return { ...d, paid: e };
                        return d;
                      }),
                    },
                    {
                      shouldValidate: true,
                    }
                  );
                } else {
                  setValue("details", {
                    ...getValues("details"),
                    days: [
                      ...(getValues("details")?.days ?? []),
                      { date: day.date, paid: e },
                    ],
                  });
                }
              }}
            />
          </>
        ) : (
          "Unpaid"
        )}
      </p>
    </div>
  );
};

export default DaliyBreakDown;
