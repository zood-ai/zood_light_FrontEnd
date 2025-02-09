import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUseRoleHttp {
    handleCloseSheet?: () => void;
    setRoleOne?: any;
}
const UseRoleHttp = ({ handleCloseSheet,
    setRoleOne

}: IUseRoleHttp) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    const queryClient = useQueryClient();

    // get list
    const {
        data: rolesData,
        isPending: isLoadingRoles,
        refetch: refetchroles,
    } = useCustomQuery(
        ["roles", filterObj],
        "/roles?filter[model]=1",
        {},
        { ...filterObj}
    );


    // add
    const { mutate: roleAdd, isPending: isLoadingAdd } = useMutation({
        mutationKey: ["role-add"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/roles`,values);
        },
        onSuccess: (data) => {
            toast({
                description: "Create Role Successfully",
            });
            refetchroles();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["role-one"] });
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
    const { mutate: roleEdit, isPending: isLoadingEdit } = useMutation({
        mutationKey: ["role-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.put(`/roles/${values?.id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated Role Successfully",
            });
            refetchroles();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["role-one"] });
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
    const { mutate: roleDelete, isPending: isLoadingDelete } = useMutation({
        mutationKey: ["role-delete"],
        mutationFn: async (id: string) => {

            return axiosInstance.delete(`/roles/${id}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated Role Successfully",
            });
            refetchroles();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["role-one"] });
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
        rolesData,
        isLoadingRoles,
        roleEdit,
        isLoadingEdit,
        roleAdd,
        isLoadingAdd,
        roleDelete,
        isLoadingDelete

    };
};

export default UseRoleHttp;
