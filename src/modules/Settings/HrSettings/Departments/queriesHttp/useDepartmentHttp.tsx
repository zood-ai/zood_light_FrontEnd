import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUseDepartmentsHttps {
    handleCloseSheet?: () => void;
    id?: string;
    setDepartmentOne?: any;
}
const useDepartmentsHttps = ({ handleCloseSheet, id, setDepartmentOne }: IUseDepartmentsHttps) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    const queryClient = useQueryClient();

    // get list
    const {
        data: DepartmentsData,
        isPending: isLoadingDepartments,
        refetch: refetchDepartments,
    } = useCustomQuery(
        ["Departments", filterObj],
        "/forecast-console/department",
        {},
        { ...filterObj }
    );

    // get one
    const {
        data: DepartmentSingle,
        isLoading: isLoadingDepartmentSingle,
    } = useCustomQuery(
        ["department-single", filterObj, id || ""],
        `/forecast-console/department/${id}`,
        {
            select: (data: any) => {
                const newDataFormat = {
                    name: data?.data?.name,
                    branches: data?.data?.branches?.map((b: any) => ({
                        id: b?.id,

                    })),

                };

                return newDataFormat;
            },
            enabled: !!id,
            onSuccess: (data) => {
                setDepartmentOne?.({
                    name: data?.data?.name,
                    branches: data?.data?.branches?.map((b: any) => ({
                        id: b?.id,

                    })),
                });
            },
        }
    );
    // add
    const { mutate: departmentAdd, isPending: isLoadingAdd } = useMutation({
        mutationKey: ["department-add"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/forecast-console/department`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Added department Successfully",
            });
            refetchDepartments();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["departmente-one"] });
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
    const { mutate: departmentEdit, isPending: isLoadingEdit } = useMutation({
        mutationKey: ["department-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.put(`/forecast-console/department/${values?.id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated department Successfully",
            });
            refetchDepartments();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["departmente-one"] });
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
    const { mutate: departmentDelete, isPending: isLoadingDelete } = useMutation({
        mutationKey: ["department-delete"],
        mutationFn: async (values: string) => {
            return axiosInstance.delete(`/forecast-console/department/${values}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Deleted department Successfully",
            });
            refetchDepartments();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["departmente-one"] });
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
        isLoadingDepartments,
        DepartmentsData,
        isLoadingDepartmentSingle,
        DepartmentSingle,
        departmentAdd,
        departmentDelete,
        isLoadingAdd,
        departmentEdit,
        isLoadingEdit,
        isLoadingDelete
    };
};

export default useDepartmentsHttps;
