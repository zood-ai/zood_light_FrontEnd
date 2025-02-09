import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { formSetPasswordSchema } from "../Schema/schema";
import { z } from "zod";
import Cookies from "js-cookie";
import useLoginHttp from "../../Login/queriesHttp/useLoginHttp";

const useSetPasswordHttp = () => {
  const { toast } = useToast();
  const { login } = useLoginHttp();
  // login
  const { mutate: setPassword, isPending: loadingSetPassword } = useMutation({
    mutationKey: ["set-password"],
    mutationFn: async (values: z.infer<typeof formSetPasswordSchema>) => {
      await axiosInstance.post(
        `/forecast-console/employees/set-password/${values?.invitation_token}`,
        values
      );
      return login({business_reference:values.business_reference,
        email:values.email,
        password:values?.password
      });
    },
    onSuccess: (data:any) => {
      toast({
        description: data?.data?.massage,
      });

      Cookies.remove("name");
      Cookies.remove("profile_photo");
      Cookies.remove("token");
      Cookies.remove("id");
      localStorage.removeItem("___admin");
      localStorage.removeItem("___permission");
      localStorage.removeItem("___role");

      // window.location.href = `/login`;

      toast({
        description: data?.data?.message,
        variant:"error"

      });
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.message,
      });
    },
  });

  return {
    setPassword,
    loadingSetPassword,
  };
};

export default useSetPasswordHttp;
