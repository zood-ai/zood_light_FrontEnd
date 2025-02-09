import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUseBranchesHttps {
  handleCloseSheet?: () => void;
  setBranchOne?: any;
  branchId?: string;
}
const useBranchesHttps = ({ handleCloseSheet, setBranchOne, branchId }: IUseBranchesHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();

  // get list
  const {
    data: BranchesData,
    isPending: isLoadingBranches,
    refetch: refetchBranches,
  } = useCustomQuery(
    ["branches"],
    "/forecast-console/branches-location-setting",
 
  );

  const { data: BrancheOne, isPending: isLoadingBrancheOne } = useCustomQuery(
    ["branche-single-hr", branchId || ""],
    `/forecast-console/get-location-setting/${branchId}`,
    {
      select: (data: any) => {
        const newData = {
          name: data?.data?.name,
          branch_id: data?.data?.id,
          weekly_target: data?.data?.weekly_target,
          holiday_entitlements: data?.data?.holiday_entitlements,
          holidays: data?.data?.holidays,
          opening_hours: data?.data?.opening_hours,
          departments: data?.data?.departments,
          mobile_clock_in: data?.data?.mobile_clock_in,


        };
        return newData;
      },
      enabled: !!branchId,
      onSuccess: (data) => {
        setBranchOne?.({
          name: data?.data?.name,
          branch_id: data?.data?.id,
          weekly_target: data?.data?.weekly_target,
          holiday_entitlements: data?.data?.holiday_entitlements,
          holidays: data?.data?.holidays,
          opening_hours: data?.data?.opening_hours,
          departments: data?.data?.departments,
          mobile_clock_in: data?.data?.mobile_clock_in,


        });
      },
    }
  );
  // edit
  const { mutate: branchEdit, isPending: isLoadingEdit } = useMutation({
    mutationKey: ["branch-edit"],
    mutationFn: async (values: any) => {
      return axiosInstance.post(`/forecast-console/update-location-setting/${values?.branch_id}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: "Updated branch Successfully",
      });
      refetchBranches();
      handleCloseSheet?.();

      queryClient.invalidateQueries({ queryKey: ["branche-one"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error.message,
        });
      }
    },
  });

  return {
    isLoadingBranches,
    BranchesData,
    branchEdit,
    isLoadingEdit,
    BrancheOne,
    isLoadingBrancheOne,
  };

};

export default useBranchesHttps;
