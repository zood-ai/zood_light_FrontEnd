import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formAddPopularShiftSchema,
  formAddShiftSchema,
} from "../Schema/schema";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

const useScheduletHttp = ({
  handleCloseSheet,
  setCellIndex,
  fromTable = false,
}: {
  handleCloseSheet?: () => void;
  setCellIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  fromTable?: boolean;
}) => {
  const { filterObj } = useFilterQuery();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const filters = {
    branch_id: filterObj["filter[branch]"],
    date_from: filterObj.from,
    date_to: filterObj.to,
    homeOnly: filterObj.homeOnly,
  };

  // get all the data
  const { data: ScheduleData, isFetching: isFetchingSchedule } = useCustomQuery(
    ["forecast-console/schedule", filters],
    "forecast-console/schedule",
    {
      enabled: fromTable,
    },
    {
      branch_id: filterObj["filter[branch]"],
      date_from: filterObj.from,
      date_to: filterObj.to,
      homeOnly: filterObj.homeOnly,
    }
  );

  // add shift
  const { mutate: addShiftData, isPending: isAddingShift } = useMutation({
    mutationKey: ["forecast-console/schedule/assign-shift"],
    mutationFn: async (
      data: z.infer<typeof formAddShiftSchema>
    ): Promise<{ message: string }> => {
      const response = await axiosInstance.post(
        "/forecast-console/schedule/assign-shift",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/schedule", filters],
      });
      handleCloseSheet?.();
      setCellIndex?.(null);
    },
  });

  // delete shift
  const { mutate: deleteShiftData, isPending: isdeletingShift } = useMutation({
    mutationKey: ["forecast-console/schedule/delete-shift"],
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(
        `/forecast-console/schedule/shift/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        description: "Shift deleted  Successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/schedule", filters],
      });
      handleCloseSheet?.();
    },
  });

  const UpdateShiftData = formAddShiftSchema.partial();

  // update shift
  const { mutate: updateShiftData, isPending: isUpdateShiftData } = useMutation(
    {
      mutationKey: ["forecast-console/schedule/update-shift"],
      mutationFn: async ({
        id,
        data,
        cb,
      }: {
        id: string;
        data: z.infer<typeof UpdateShiftData>;
        cb?: () => void;
      }) => {
        const response = await axiosInstance.post(
          `/forecast-console/schedule/update-shift/${id}`,
          data
        );
        cb?.();
        return response.data;
      },
      onSuccess: () => {
        toast({
          description: "Shift updated Successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["forecast-console/schedule", filters],
        });
        handleCloseSheet?.();
      },
    }
  );

  // get all the data
  const { data: PopularShiftData, isFetching: isFetchingPopularShift } =
    useCustomQuery(
      ["forecast-console/popular-shift", filters],
      "forecast-console/popular-shift",
      {
        enabled: fromTable,
      },
      {
        branch_id: filterObj["filter[branch]"],
      }
    );

  // add shift
  const { mutate: addPopularShift, isPending: isAddingPopularShift } =
    useMutation({
      mutationKey: ["forecast-console/popular-shift"],
      mutationFn: async (data: z.infer<typeof formAddPopularShiftSchema>) => {
        const response = await axiosInstance.post(
          "/forecast-console/popular-shift",
          data
        );
        return response.data;
      },
      onSuccess: ({ data }) => {
        queryClient.setQueryData(
          ["forecast-console/popular-shift", filters],
          (oldData: any) => {
            if (!oldData) return;

            return [...oldData, data];
          }
        );

        handleCloseSheet?.();
      },
    });

  const { mutate: deletePopularShift, isPending: isdeletePopularShift } =
    useMutation({
      mutationKey: ["forecast-console/popular-shift"],
      mutationFn: async (id: string) => {
        const response = await axiosInstance.delete(
          `/forecast-console/popular-shift/${id}`
        );
        return response.data;
      },
      onSuccess: ({ data }) => {
        toast({
          description: "Shift deleted  Successfully",
        });

        queryClient.setQueryData(
          ["forecast-console/popular-shift", filters],
          (oldData: any) => {
            if (!oldData) return;

            return oldData.filter((shift) => shift.id !== data);
          }
        );

        handleCloseSheet?.();
      },
    });

  // // update shift
  const { mutate: updatePopularShift, isPending: isUpdatePopularShift } =
    useMutation({
      mutationKey: ["forecast-console/popular-shift"],
      mutationFn: async ({
        id,
        data,
        cb,
      }: {
        id: string;
        data: z.infer<typeof formAddPopularShiftSchema>;
        cb?: () => void;
        Promise;
      }) => {
        const response = await axiosInstance.put(
          `/forecast-console/popular-shift/${id}`,
          data
        );
        cb?.();
        return response.data;
      },
      onSuccess: ({ data }) => {
        toast({
          description: "Shift updated Successfully",
        });

        queryClient.invalidateQueries({
          queryKey: ["forecast-console/popular-shift", filters],
        });

        handleCloseSheet?.();
      },
    });

  // hide employee
  const { mutate: hideEmployee, isPending: isHideEmployee } = useMutation({
    mutationKey: ["forecast-console/schedule/hide-employee"],
    mutationFn: async (data: {
      branch_id: string;
      employee_id: string;
      from: string;
      to: string;
    }) => {
      const response = await axiosInstance.post(
        `/forecast-console/schedule/hide-employee`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["forecast-console/schedule", filters],
      // });
      handleCloseSheet?.();
    },
  });

  // show employee
  const { mutate: showEmployee, isPending: isShowEmployee } = useMutation({
    mutationKey: ["forecast-console/schedule/show-employee"],
    mutationFn: async (data: { branch_id: string; employee_id: string }) => {
      const response = await axiosInstance.post(
        `/forecast-console/schedule/show-employee`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/schedule", filters],
      });
      handleCloseSheet?.();
    },
  });

  // update status of employee
  const { mutate: updateScheduleStatus, isPending: isUpdateScheduleStatus } =
    useMutation({
      mutationKey: ["forecast-console/schedule/update-employee-status"],
      mutationFn: async (data: {
        branch_id: string;
        from: string;
        to: string;
        status: 1 | 2 | 3;

        // /Draft = 1
        // Published = 2
        // SendForApproval = 3
      }) => {
        const response = await axiosInstance.post(
          `/forecast-console/schedule/update-status`,
          data
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["forecast-console/schedule", filters],
        });
        handleCloseSheet?.();
      },
    });

  // clear schedule
  const { mutate: clearSchedule, isPending: isClearSchedule } = useMutation({
    mutationKey: ["forecast-console/schedule/clear"],
    mutationFn: async (data: {
      branch_id: string;
      from: string;
      to: string;
    }) => {
      const response = await axiosInstance.post(
        `/forecast-console/schedule/clear`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/schedule", filters],
      });
      handleCloseSheet?.();
    },
  });

  // copy schedule to next week
  const { mutate: copySchedule, isPending: isCopySchedule } = useMutation({
    mutationKey: ["forecast-console/schedule/replicate-next"],
    mutationFn: async (data: {
      branch_id: string;
      from: string;
      to: string;
    }) => {
      const response = await axiosInstance.post(
        `/forecast-console/schedule/replicate-next`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/schedule", filters],
      });
      handleCloseSheet?.();
    },
    onError: ({ data }: { data: { message: string } }) => {
      toast({
        description: data?.message || "Something went wrong",
        variant: "error",
      });
    },
  });

  // show all employees
  const { mutate: showHideEmployees, isPending: isShowHideEmployees } =
    useMutation({
      mutationKey: ["forecast-console/schedule/show-hided "],
      mutationFn: async (data: {
        branch_id: string;
        from: string;
        to: string;
      }) => {
        const response = await axiosInstance.post(
          `/forecast-console/schedule/show-hided `,
          data
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["forecast-console/schedule", filters],
        });
        handleCloseSheet?.();
      },
      onError: ({ data }: { data: { message: string } }) => {
        toast({
          description: data?.message || "Something went wrong",
          variant: "error",
        });
      },
    });

  return {
    ScheduleData,
    isFetchingSchedule,

    addShiftData,
    isAddingShift,

    deleteShiftData,
    isdeletingShift,

    updateShiftData,
    isUpdateShiftData,

    addPopularShift,
    isAddingPopularShift,

    PopularShiftData,
    isFetchingPopularShift,

    deletePopularShift,
    isdeletePopularShift,

    updatePopularShift,
    isUpdatePopularShift,

    hideEmployee,
    isHideEmployee,

    showEmployee,
    isShowEmployee,

    updateScheduleStatus,
    isUpdateScheduleStatus,

    clearSchedule,
    isClearSchedule,

    copySchedule,
    isCopySchedule,

    showHideEmployees,
    isShowHideEmployees,
  };
};

export default useScheduletHttp;
