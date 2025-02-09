import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IReason } from "../types/type";

interface IUseReasonsHttps {
  handleCloseSheet?: () => void;
  reasonId?: string;
  setReasonOne?: any;
}
const useReasonsHttps = ({
  handleCloseSheet,
  reasonId,
  setReasonOne,
}: IUseReasonsHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();

  // get list
  const { data: ReasonsData, isLoading: isLoadingResons } = useCustomQuery(
    ["reasons", filterObj],
    "/manage/reasons?is_deleted=false&sort=created_at",
    {},
    { ...filterObj }
  );
  // get one
  const { data: ReasonOne, isLoading: isLoadingReasonOne } = useCustomQuery(
    ["reason-one", reasonId || ""],
    `/manage/reasons/${reasonId}`,
    {
      select: (data: any) => {
        const newData = {
          name: data?.data?.name,
          id: data?.data?.id,
          name_localized: data?.data?.name_localized,
        };
        return newData;
      },
      enabled: !!reasonId,
      onSuccess: (data) => {
        setReasonOne?.({
          name: data?.data?.name,
          id: data?.data?.id,
          name_localized: data?.data?.name_localized,
        });
      },
    }
  );
  // create
  const { mutate: createReason, isPending: isLoadingCreateReason } =
    useMutation({
      mutationKey: ["create-Reason"],
      mutationFn: async (values: any) => {
        return axiosInstance.post("/manage/reasons", values);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        handleCloseSheet?.();
        queryClient.invalidateQueries({ queryKey: ["reasons"] });
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

  // edit
  const { mutate: editReason, isPending: isLoadingEditReason } = useMutation({
    mutationKey: ["edit-Reason"],
    mutationFn: async (values: IReason) => {
      return axiosInstance.put(`/manage/reasons/${reasonId}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["reasons"] });
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

  // delete
  const { mutate: deleteReason, isPending: isLoadingDeleteReason } =
    useMutation({
      mutationKey: ["delete-Reason"],
      mutationFn: async () => {
        return axiosInstance.delete(`/manage/reasons/${reasonId}`);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        handleCloseSheet?.();
        queryClient.invalidateQueries({ queryKey: ["reasons"] });
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
    isLoadingResons,
    ReasonsData,
    isLoadingCreateReason,
    createReason,
    editReason,
    isLoadingEditReason,
    ReasonOne,
    isLoadingReasonOne,
    deleteReason,
    isLoadingDeleteReason,
  };
};

export default useReasonsHttps;
