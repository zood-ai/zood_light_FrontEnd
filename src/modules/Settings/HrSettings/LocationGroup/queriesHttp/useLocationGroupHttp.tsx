import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface IUseLocationGroupsHttps {
  handleCloseSheet?: () => void;
}
const useLocationGroupHttp = ({
  handleCloseSheet,
}: IUseLocationGroupsHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  // get list
  const {
    data: LocationGroupData,
    isPending: isLoadingLocationGroup,
    refetch: refetchLocationGroup,
  } = useCustomQuery(
    ["location-groups", filterObj],
    "/forecast-console/location-group",
    {},
    { ...filterObj }
  );

  // add
  const { mutate: LocationGroupAdd, isPending: isLoadingAdd } = useMutation({
    mutationKey: ["location-group-add"],
    mutationFn: async (values: any) => {
      return axiosInstance.post(`/forecast-console/location-group`, values);
    },
    onSuccess: (data) => {
      toast({
        description: "Added Location Group Successfully",
      });
      refetchLocationGroup();
      handleCloseSheet?.();
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
  const { mutate: LocationGroupDelete, isPending: isLoadingDelete } =
    useMutation({
      mutationKey: ["location-group-delete"],
      mutationFn: async (values: string) => {
        return axiosInstance.delete(
          `/forecast-console/location-group/${values}`
        );
      },
      onSuccess: (data) => {
        toast({
          description: "Deleted Location Group Successfully",
        });
        refetchLocationGroup();
        handleCloseSheet?.();
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
  const { mutate: LocationGroupEdit, isPending: isLoadingEdit } = useMutation({
    mutationKey: ["location-group-edit"],
    mutationFn: async (values: any) => {
      return axiosInstance.put(
        `/forecast-console/location-group/${values?.id}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: "Updated  Successfully",
      });
      refetchLocationGroup();
      handleCloseSheet?.();
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
    LocationGroupData,
    isLoadingLocationGroup,

    LocationGroupAdd,
    isLoadingAdd,

    isLoadingDelete,
    LocationGroupDelete,

    LocationGroupEdit,
    isLoadingEdit,
  };
};

export default useLocationGroupHttp;
