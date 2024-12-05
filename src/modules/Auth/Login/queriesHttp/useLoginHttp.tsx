import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { formLoginSchema } from "../schema/Schema";
import { z } from "zod";
import Cookies from "js-cookie";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";

const useLoginHttp = () => {
  const { toast } = useToast();

  // login
  const { mutate: login, isPending: loadingLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: z.infer<typeof formLoginSchema>) => {
      return axiosInstance.post(`/auth/Login`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      Cookies.set("token", data?.data?.data?.token);
      Cookies.set("name", data?.data?.data?.user?.name);
      Cookies.set("id", data?.data?.data?.forecast_employee?.id);
      Cookies.set("profile_photo", data?.data?.data?.employee?.profile_photo);
      // localStorage.setItem("___permission",JSON.stringify( ["can_access_inventory_management_features"]));

      console.log(data?.data);
      
 
      // window.location.href = `/insights/sales?${DEFAULT_INSIGHTS_DATE}`;
      window.location.href = `/schedulling/schedule`;

      toast({
        description: data?.data?.message,
      });
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.message,
      });
    },
  });

  return {
    loadingLogin,
    login,
  };
};

export default useLoginHttp;
