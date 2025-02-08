import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { formLoginSchema } from "../schema/Schema";
import { z } from "zod";
import Cookies from "js-cookie";
import useRedirectToPermissionLink from "@/hooks/useRedirectToPermissionLink";


const useLoginHttp = () => {
  const { toast } = useToast();
  const {redirectFn} = useRedirectToPermissionLink()
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
      localStorage.setItem("___permission", JSON.stringify(data?.data?.data?.permissions));
      localStorage.setItem("___role", JSON.stringify(data?.data?.data?.role?.name));
      localStorage.setItem("___admin", JSON.stringify(data?.data?.data?.role.is_owner));
      redirectFn(data?.data?.data?.permissions);

      toast({
        description: data?.data?.message,
      });
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.message,
        variant:"error"
      });
    },
  });

  return {
    loadingLogin,
    login,
  };
};

export default useLoginHttp;
