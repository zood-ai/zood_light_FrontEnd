import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation } from "@tanstack/react-query";



const usePayRollHttps = ({handleClose,timeCardId,setTimeCardOne}:{handleClose?:()=>void,timeCardId?:any,setTimeCardOne?:any}) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();

// get all
  const { data: timeCardData, isLoading: isLoadingtimeCardData ,refetch: refetchTimeCardData } =
    useCustomQuery(
      ["time-card",  filterObj],
      `/forecast-console/get-payroll`,
      {},
      { ...filterObj }
    );
// get one 

  // get one
  const {
    data: timeCardOne,
    isFetchedAfterMount: isLoadingTimeCardOne,
  } = useCustomQuery(
    ["timecard-one", timeCardId],
    `forecast-console/show-payroll/${timeCardId || ""}`,
    {
      select: (data: any) => {
        const newDataFormat = {
          id: data?.data?.id,
          employee_name: data?.data?.employee_name,
          date: data?.data?.date,
          shift_time:data?.data?.shift_time,
          histories: data?.data?.histories,
          shift_histories: data?.data?.shift_histories,
         
        };

        return newDataFormat;
      },
      enabled: !!timeCardId,
      onSuccess: (data) => {
        console.log(data?.data)
        setTimeCardOne({
         id: data?.data?.id,
         employee_name: data?.data?.employee_name,
         date: data?.data?.date,
         shift_time:data?.data?.shift_time,
         histories: data?.data?.histories,
         shift_histories: data?.data?.shift_histories,



         
        });
      },
    }
  );
   
// update
    const {
      mutate: updatePayroll,
      isPending: isLoadingUpdatePayroll,
    } = useMutation({
      mutationKey: ["update-payroll"],
      mutationFn: async (values:any) => {
        return axiosInstance.post(`forecast-console/update-payroll/${values.id}`, values);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        refetchTimeCardData()
      
        handleClose?.()
      },
      onError: (error: any) => {
        toast({
          description: error.data.message,
        });
      },
    });
// approve
    const {
      mutate: approvePayroll,
      isPending: isLoadingApprovePayroll,
    } = useMutation({
      mutationKey: ["approve-payroll"],
      mutationFn: async ({timecardIds,approveCheck}:any) => {

        const response = await axiosInstance.post(
          `forecast-console/${
            approveCheck ? "approve-payroll" : "un-approve-payroll"
          }`,
          {
            ids: timecardIds,
          }
        );
        return response.data;
      },
      onSuccess: (data) => {
        console.log(data)
        
        toast({
          description: data?.message,
        });
        refetchTimeCardData()
        handleClose?.()
      },
      onError: (error: any) => {
        toast({
          description: error.data.message,
        });
      },
    });
// delete
    const {
      mutate: deletePayroll,
      isPending: isLoadingDeletePayroll,
    } = useMutation({
      mutationKey: ["delete-payroll"],
      mutationFn: async (id:any) => {
        return axiosInstance.delete(`forecast-console/delete-payroll/${id}`);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        refetchTimeCardData()
        handleClose?.()
      },
      onError: (error: any) => {
        toast({
          description: error.data.message,
        });
      },
    });
    // export 
   

    // const { data: exportPayroll, isLoading: isLoadingExportPayroll  } =
    // useMutation(
    //   ["time-card-export",  filterObj],
    //   `/forecast-console/get-payroll`,
    //   {},
    //   { ...filterObj, type: "export" }
    // );


      // export
  const { mutate: exportPayroll, isPending: isLoadingExportPayroll } = useMutation({
    mutationKey: ["time-card-export",  filterObj],
    mutationFn: async () => {
      return axiosInstance.get("/forecast-console/get-payroll", {
        params: { ...filterObj, type: "export" },
      });
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });

      window.open(data?.data?.url, "_blank");
    },
    onError: (error) => {
      // if (axios.isAxiosError(error)) {
      //   toast({
      //     description: error.response?.data.message,
      //   });
      // } else {
      //   toast({
      //     description: error.message,
      //   });
      // }
    },
  });

  return {
    timeCardData,
    isLoadingtimeCardData,
    updatePayroll,
    isLoadingUpdatePayroll,
    approvePayroll,
    isLoadingApprovePayroll,
    deletePayroll,
    isLoadingDeletePayroll,
    timeCardOne,
    isLoadingTimeCardOne,
    exportPayroll,
    isLoadingExportPayroll

  };
};



export default usePayRollHttps;
