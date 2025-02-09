import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useFlashHttp = () => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: FlashsData,
    isPending: isFetchingFlashs,
    refetch: refetchFlashs,
  } = useCustomQuery(
    ["forecast-console/flash-pl", filterObj],
    `forecast-console/flash-pl`,
    {},
    {
      ...filterObj,
    }
  );

  return {
    FlashsData,
    isFetchingFlashs,
  };
};

export default useFlashHttp;
