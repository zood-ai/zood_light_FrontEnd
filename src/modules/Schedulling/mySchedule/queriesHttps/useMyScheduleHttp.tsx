import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUseMyScheduleHttps {
  userId?: string;
}
const useMyScheduleHttps = ({ userId }: IUseMyScheduleHttps) => {
  const { filterObj } = useFilterQuery();

  const { data: myScheduleData, isPending: isLoadingMyScheduleData } =
    useCustomQuery(
      ["my-schedule", userId || "", filterObj],
      `/forecast-console/get-employee-schedule/${userId}?from=${filterObj.from}&to=${filterObj.to}`,
      {
        select: (data: any) => {
          return data;
        },
      }
    );

  return {
    myScheduleData,
    isLoadingMyScheduleData,
  };
};

export default useMyScheduleHttps;
