import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { formModifiersSchema } from "../schema/Schema";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";

interface IUseModifiersHttp {
    handleCloseSheet: () => void;
    IdModifier?: string;
}
const useModifiersHttp = ({
    handleCloseSheet,
    IdModifier,
}: IUseModifiersHttp) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    // get list
    const {
        data: ModifiersData,
        isLoading: isLoadingModifiers,
        refetch: refetchModifiers,
    } = useCustomQuery(["meun-modifiers", filterObj], "/menu/modifiers", {},
        { ...filterObj });

    // get one
    const {
        data: categoryOne,
        isLoading: isLoadingModifierOne,
        refetch: refetchModifierOne,

    } = useCustomQuery(
        ["meun-Modifiers-one", IdModifier || ''],
        `/menu/modifiers/${IdModifier}`,
        {
            select: (data: { data: { name: string; id: string, image: string, reference: string } }) => {
                console.log(data, "datadata");

                const newDataFormat = {
                    id: data?.data?.id,
                    name: data?.data?.name,
                    image: data?.data?.image,
                    reference: data?.data?.reference,
                }
                return newDataFormat;


            },
            enabled: !!IdModifier,

        }
    );

    // create
    const { mutate: CreateModifier, isPending: loadingCreate } = useMutation({
        mutationKey: ["create-category"],
        mutationFn: async (values: z.infer<typeof formModifiersSchema>) => {
            return axiosInstance.post("menu/modifiers", values);
        },
        onSuccess: (data) => {
            toast({
                description: data?.data?.massage,
            });
            handleCloseSheet();
            refetchModifiers()
        },
        onError: (data: any) => {
            toast({
                description: data?.data?.massage,
            });
        },
    });

    // edit
    const { mutate: EditModifer, isPending: loadingEdit } = useMutation({
        mutationKey: ["edit-category", IdModifier],
        mutationFn: async (values: z.infer<typeof formModifiersSchema>) => {
            return axiosInstance.put(`menu/modifiers/${IdModifier}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: data?.data?.massage,
            });
            refetchModifiers();
            refetchModifierOne()
            handleCloseSheet();
        },
        onError: (data: any) => {
            toast({
                description: data?.data?.massage,
            });
        },
    });

    // delete
    const { mutate: DeleteModifier, isPending: loadingDelete } = useMutation({
        mutationKey: ["delete-category", IdModifier],
        mutationFn: async () => {
            return axiosInstance.delete(`menu/modifiers/${IdModifier}`);
        },
        onSuccess: (data) => {
            toast({
                description: data?.data?.massage,
            });
            refetchModifiers();
            handleCloseSheet();
        },
        onError: (data: any) => {
            toast({
                description: data?.data?.massage,
            });
        },
    });


    // export
    const { mutate: ExportModifier, isPending: loadingExport } = useMutation({
        mutationKey: ["export-category"],
        mutationFn: async () => {
            return axiosInstance.post(`export/modifiers`);
        },
        onSuccess: (data) => {
            toast({
                description: data?.data?.massage,
            });
            console.log(data, "data");

            window.open(data?.data?.data?.url)
        },
        onError: (data: any) => {
            toast({
                description: data?.data?.massage,
            });
        },
    });


    return {
        isLoadingModifiers,
        ModifiersData,
        CreateModifier,
        loadingCreate,
        EditModifer,
        loadingEdit,
        DeleteModifier,
        loadingDelete,
        categoryOne,
        isLoadingModifierOne,
        ExportModifier,
        loadingExport
    };
};

export default useModifiersHttp;
