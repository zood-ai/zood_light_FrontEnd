import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import { useMutation } from "@tanstack/react-query";

const useGeneralSettingsHttp = ({
  setGeneralSetting,
}: {
  setGeneralSetting: (data: any) => void;
}) => {
  const { toast } = useToast();
  // get settings
  const {
    data: settingsData,
    isFetching: isLoadingsettings,
    refetch: refetchsettings,
  } = useCustomQuery(["settings"], "/manage/settings", {
    onSuccess: (data) => {
      setGeneralSetting(data?.data);
    },
  });

  //   edit settings
  const { mutate: updateSettings, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["settings/update"],
    mutationFn: async (values) => {
      const res = await axiosInstance.put(`manage/settings`, values);
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        description: data?.massage,
      });
      refetchsettings();
    },
  });
  return {
    isLoadingsettings,
    settingsData: settingsData?.data,
    updateSettings,
    isPendingUpdate,
  };
};

export default useGeneralSettingsHttp;
