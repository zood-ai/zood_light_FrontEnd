import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUseOnboardingHttps {
    handleCloseSheet?: () => void;
    id?: string;
    setOnboardingOne?: any;
    typeDoc?: any;
    setDocumentsOne?: any
}
const useOnboardingHttps = ({ handleCloseSheet, id, typeDoc, setDocumentsOne }: IUseOnboardingHttps) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    const queryClient = useQueryClient();

    // get list
    const {
        data: OnboardingData,
        isPending: isLoadingOnboarding,
    } = useCustomQuery(
        ["onboarding", typeDoc],
        "/forecast-console/documents",
        {},
        { ["filter[type]"]: typeDoc }

    );
    // get one
    const {
        data: DocumentSingle,
        isLoading: isLoadingDocumentSingle,
    } = useCustomQuery(
        ["Documents-single", id || ""],
        `/forecast-console/documents/${id}`,
        {
            select: (data: any) => {
                const newDataFormat = {
                    id: data?.document?.id,
                    name: data?.document?.name,
                    description: data?.document?.description,
                    file: data?.document?.file,
                    new_employees_required: data?.document?.new_employees_required,

                };

                return newDataFormat;
            },
            enabled: !!id,
            onSuccess: (data) => {
                setDocumentsOne?.({
                    id: data?.document?.id,
                    name: data?.document?.name,
                    description: data?.document?.description,
                    file: data?.document?.file,
                    new_employees_required: data?.document?.new_employees_required,

                });
            },
        }
    );
    // add
    const { mutate: OnboardingAdd, isPending: isLoadingAdd } = useMutation({
        mutationKey: ["onboardingAdd, isPending: isLoadingAdd } = useMutation({-add"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/forecast-console/documents`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Added document Successfully",
            });

            handleCloseSheet?.();
            queryClient.invalidateQueries({ queryKey: ['onboarding'] });
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
    const { mutate: OnboardingEdit, isPending: isLoadingEdit } = useMutation({
        mutationKey: ["Onboarding-edit"],
        mutationFn: async (values: any) => {
            console.log(id);

            return axiosInstance.post(`/forecast-console/documents/${id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated document Successfully",
            });
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["onboarding"] });
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
    const { mutate: OnboardingDelete, isPending: isLoadingDelete } = useMutation({
        mutationKey: ["OnboardingDelete"],
        mutationFn: async (values: string) => {
            return axiosInstance.delete(`/forecast-console/documents/${values}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Deleted document Successfully",
            });
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["onboarding"] });
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
        OnboardingData,
        isLoadingOnboarding,
        OnboardingAdd, isLoadingAdd,
        OnboardingEdit, isLoadingEdit,
        DocumentSingle,
        isLoadingDocumentSingle,
        OnboardingDelete, isLoadingDelete
    };
};

export default useOnboardingHttps;
