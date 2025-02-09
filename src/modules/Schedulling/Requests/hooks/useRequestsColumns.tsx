import { ColumnDef, Row } from "@tanstack/react-table";
import { IRequestsList } from "../types/types";
import { differenceInDays, format } from "date-fns";
import Avatar from "@/components/ui/avatar";
import { Status, Type } from "../contants/contants";
import { Badge } from "@/components/ui/badge";
import { getBadgeColor } from "../helpers/helpers";
import WarningBgIcon from "@/assets/icons/WarningBg";
import UserIcon from "@/assets/icons/User";

const useRequestsColumns = () => {
  const ApprovalsColumns: ColumnDef<IRequestsList>[] = [
    {
      accessorKey: "created_at",
      header: () => <div>Requested date</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{format(row.getValue("created_at"), "dd MMM")}</>
      ),
    },
    {
      accessorKey: "employee",
      header: () => <div>Request by</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        const name =
          row.original.employee?.first_name +
          " " +
          row.original.employee?.last_name;
        return (
          <div className="flex items-center gap-2">
            <Avatar text={name} />
            <div>{name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: () => <div>Location</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{row.original.branch.name || "-"}</>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">{Type[row.getValue("type") as number] || "-"}</div>
        );
      },
    },
    // {
    //   accessorKey: "for",
    //   header: () => <div>For</div>,
    //   cell: ({ row }: { row: Row<IRequestsList> }) => {
    //     return <div className="">{row.getValue("for") || "-"}</div>;
    //   },
    // },
    // {
    //   accessorKey: "overlapwith",
    //   header: () => <div>Overlapwith</div>,
    //   cell: ({ row }: { row: Row<IRequestsList> }) => {
    //     return <div className="">SAR {row.getValue("overlapwith") || "-"}</div>;
    //   },
    // },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">
            <Badge variant={getBadgeColor(row.getValue("status"))}>
              {Status[row.getValue("status") as number]}
            </Badge>
          </div>
        );
      },
    },
  ];

  const TimeOffColumns: ColumnDef<IRequestsList>[] = [
    {
      accessorKey: "created_at",
      header: () => <div>Requested date</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{format(row.getValue("created_at"), "dd MMM")}</>
      ),
    },
    {
      accessorKey: "employee",
      header: () => <div>Request by</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        const name =
          row.original.employee.first_name +
          " " +
          row.original.employee.last_name;
        return (
          <div className="flex items-center gap-2">
            <Avatar text={name} />
            <div>{name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: () => <div>Location</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{row.original.branch.name || "-"}</>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">
            {row?.getValue("type") === 2 && row?.original?.details?.type
              ? "🏝 Holiday"
              : "💤 Day off"}{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "for",
      header: () => <div>For</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">
            {row.original.details?.repeat &&
            row.original.details.start_time &&
            row.original.details.end_time ? (
              <div>
                {format(row.original.details.from, "EEE d MMM")} ,{" "}
                {row.original.details.start_time} -{" "}
                {row.original.details.end_time}{" "}
                <span className="text-gray-500">(weekly)</span>
              </div>
            ) : (
              <div>
                {row.original.details.to === row.original.details.from
                  ? format(row.original.details.to, "EEE d MMM")
                  : `${format(row.original.details.from, "EEE d")} ,${format(
                      row.original.details.to,
                      "EEE d MMM"
                    )}`}{" "}
                <span className="text-gray-500">
                  (
                  {row.original.details.to === row.original.details.from
                    ? 1
                    : differenceInDays(
                        row.original.details.to,
                        row.original.details.from
                      ) + 1}{" "}
                  days)
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">
            <Badge variant={getBadgeColor(row.getValue("status"))}>
              {Status[row.getValue("status") as number]}
            </Badge>
          </div>
        );
      },
    },
  ];

  const ShiftChangesColumns: ColumnDef<IRequestsList>[] = [
    {
      accessorKey: "created_at",
      header: () => <div>Requested date</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{format(row.getValue("created_at"), "dd MMM")}</>
      ),
    },
    {
      accessorKey: "employee",
      header: () => <div>Swap From</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        const name =
          row.original.employee?.first_name +
          " " +
          row.original.employee?.last_name;

        return (
          <div className="flex items-center gap-2">
            {row.original.type == "1" ? (
              <>
                <WarningBgIcon width="30" height="30" className="" />
                Open Shift
              </>
            ) : (
              <>
                <Avatar text={name} />
                <div>
                  {name}{" "}
                  {row.original?.original_shift?.date &&
                    `- ${format(
                      row.original?.original_shift?.date,
                      "EEE , d MMM"
                    )}`}
                </div>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "employee",
      header: () => <div>Swap To</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        const name =
          row.original.shift?.employee?.first_name +
          " " +
          row.original.shift?.employee?.last_name;

        return (
          <div className="flex items-center gap-2">
            {row.original.type != "1" ? (
              <>
                {row.original.shift && row.original.original_shift ? (
                  <>
                    <Avatar text={name} />
                    <div>
                      {name}{" "}
                      {row.original?.shift?.date &&
                        `- ${format(row.original?.shift?.date, "EEE , d MMM")}`}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center p-1.5 rounded-full bg-popover-foreground">
                      <UserIcon width="20" height="20" className="" />
                    </div>
                    Drop Shift
                  </>
                )}
              </>
            ) : (
              <>
                <Avatar
                  text={
                    row.original?.employee?.first_name +
                    " " +
                    row.original?.employee?.last_name
                  }
                />
                <div>
                  {row.original?.employee?.first_name +
                    " " +
                    row.original?.employee?.last_name}{" "}
                  {row.original?.shift?.date &&
                    `- ${format(row.original?.shift?.date, "EEE , d MMM")}`}
                </div>
              </>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "location",
      header: () => <div>Location</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{row.original.branch.name || "-"}</>
      ),
    },

    // {
    //   accessorKey: "for",
    //   header: () => <div>Col difference</div>,
    //   cell: ({ row }: { row: Row<IRequestsList> }) => {
    //     return <div className="">{row.getValue("for") || "-"}</div>;
    //   },
    // },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">
            <Badge variant={getBadgeColor(row.getValue("status"))}>
              {Status[row.getValue("status") as number]}
            </Badge>
          </div>
        );
      },
    },
  ];

  return { ApprovalsColumns, TimeOffColumns, ShiftChangesColumns };
};

export default useRequestsColumns;
