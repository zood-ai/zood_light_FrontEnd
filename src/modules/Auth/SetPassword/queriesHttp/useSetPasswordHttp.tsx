import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { formSetPasswordSchema } from "../Schema/schema";
import { z } from "zod";


const useSetPasswordHttp = () => {
    const { toast } = useToast();

    // login
    const { mutate: setPassword, isPending: loadingSetPassword } = useMutation({
        mutationKey: ["set-password"],
        mutationFn: async (values: z.infer<typeof formSetPasswordSchema>) => {
            console.log(values);

            return axiosInstance.post(`/forecast-console/employees/set-password/${values?.invitation_token}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: data?.data?.massage,
            });


            window.location.href = `/login`;

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
        setPassword,
        loadingSetPassword
    };
};

export default useSetPasswordHttp;
