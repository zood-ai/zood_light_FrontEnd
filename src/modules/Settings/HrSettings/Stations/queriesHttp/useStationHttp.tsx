import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUseStationsHttps {
  handleCloseSheet?: () => void;
}
const useStationHttp = ({ handleCloseSheet }: IUseStationsHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();

  // get list
  const {
    data: StationData,
    isPending: isLoadingStation,
    refetch: refetchStation,
  } = useCustomQuery(
    ["stations", filterObj],
    "/forecast-console/station",
    {},
    { ...filterObj }
  );

  // add
  const { mutate: StationAdd, isPending: isLoadingAdd } = useMutation({
    mutationKey: ["station-add"],
    mutationFn: async (values: any) => {
      return axiosInstance.post(`/forecast-console/station`, values);
    },
    onSuccess: (data) => {
      toast({
        description: "Added Station Successfully",
      });
      refetchStation();
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["Statione-one"] });
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
  const { mutate: stationDelete, isPending: isLoadingDelete } = useMutation({
    mutationKey: ["station-delete"],
    mutationFn: async (values: string) => {
      return axiosInstance.delete(`/forecast-console/station/${values}`);
    },
    onSuccess: (data) => {
      toast({
        description: "Deleted Station Successfully",
      });
      refetchStation();
      handleCloseSheet?.();

      queryClient.invalidateQueries({ queryKey: ["station-one"] });
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
    StationData,
    isLoadingStation,

    StationAdd,
    isLoadingAdd,

    isLoadingDelete,
    stationDelete,
  };
};

export default useStationHttp;
