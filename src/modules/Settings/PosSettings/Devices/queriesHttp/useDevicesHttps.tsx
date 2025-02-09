import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { formDevicesSchema } from "../Schema/schema";

interface IUseDevicesHttps {
  handleCloseSheet?: () => void;
  deviceId?: string;
  setReference?: (value: string) => void;
  setDeviceOne?: (value: {
    data: {
      name: string;
      name_localized: string;
      reference: number;
      branch: { id: string };
      type: number;
      tags: { id: string }[];
    };
  }) => void;
}
const useDevicesHttps = ({
  handleCloseSheet,
  deviceId,
  setReference,
  setDeviceOne,
}: IUseDevicesHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  // get list
  const {
    data: DevicesData,
    isFetching: isLoadingDevices,
    refetch: refetchDevices,
  } = useCustomQuery(
    ["Devices", filterObj],
    "/manage/devices",
    {},
    { ...filterObj }
  );

  // get one
  const { data: DeviceOne, isLoading: isLoadingDeviceOne } = useCustomQuery(
    ["Devices-one", deviceId || ""],
    `/manage/devices/${deviceId}`,
    {
      enabled: !!deviceId,
      onSuccess: (data) => {
        setDeviceOne?.(data);
      },
    }
  );

  // create
  const { mutate: deviceCreate, isPending: isLoadingCreate } = useMutation({
    mutationKey: ["device-create"],
    mutationFn: async (values: z.infer<typeof formDevicesSchema>) => {
      return axiosInstance.post("/manage/devices", values);
    },
    onSuccess: (data) => {
      toast({
        description: "Device created successfully",
      });
      refetchDevices();
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

  // generate
  const { mutate: generateRef, isPending: isLoadingGenerate } = useMutation({
    mutationKey: ["geanrate-sku"],
    mutationFn: async () => {
      return axiosInstance.post("/manage/generate_reference", {
        model: "devices",
      });
    },
    onSuccess: (data) => {
      setReference?.(data?.data?.data);
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
  const { mutate: DeviceEdit, isPending: isLoadingEdit } = useMutation({
    mutationKey: ["device-edit", deviceId],
    mutationFn: async (values: z.infer<typeof formDevicesSchema>) => {
      return axiosInstance.put(`/manage/devices/${deviceId}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: "Device edited successfully",
      });
      refetchDevices();
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

  // delete device
  const { mutate: DeleteDevice, isPending: isPendingDelete } = useMutation({
    mutationKey: ["devices/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`manage/devices/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: "Device deleted successfully",
      });
      refetchDevices();
      handleCloseSheet?.();
    },
  });

  return {
    isLoadingDevices,
    DevicesData,
    isLoadingCreate,
    deviceCreate,
    isLoadingGenerate,
    generateRef,
    DeviceEdit,
    isLoadingEdit,
    DeviceOne: DeviceOne?.data,
    isLoadingDeviceOne,
    DeleteDevice,
    isPendingDelete,
  };
};

export default useDevicesHttps;
