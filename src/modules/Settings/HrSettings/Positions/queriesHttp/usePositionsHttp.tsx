import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface IUsePositionssHttps {
    handleCloseSheet?: () => void;
    id?: string;
    setPositionsOne?: any;
}
const usePositionsHttps = ({ handleCloseSheet, id, setPositionsOne }: IUsePositionssHttps) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    const queryClient = useQueryClient();

    // get list
    const {
        data: positionsData,
        isPending: isLoadingPositions,
        refetch: refetchPositions,
    } = useCustomQuery(
        ["Positionss", filterObj],
        "/forecast-console/position",
        {},
        { ...filterObj }
    );

    // get one
    const {
        data: positionSingle,
        isLoading: isLoadingPositionSingle,
    } = useCustomQuery(
        ["Positions-single", id || ""],
        `/forecast-console/position/${id}`,
        {
            select: (data: any) => {
                const newDataFormat = {
                    name: data?.data?.name,
                    forecast_department_id: data?.data?.forecast_department_id,

                };

                return newDataFormat;
            },
            enabled: !!id,
            onSuccess: (data) => {
                setPositionsOne?.({
                    name: data?.data?.name,
                    forecast_department_id: data?.data?.forecast_department_id
                });
            },
        }
    );
    // add
    const { mutate: positionsAdd, isPending: isLoadingAdd } = useMutation({
        mutationKey: ["Positions-add"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/forecast-console/position`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Added Positions Successfully",
            });
            refetchPositions();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["Positionse-one"] });
            queryClient.invalidateQueries({ queryKey: ["branche-single-hr"] });
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
    const { mutate: positionsEdit, isPending: isLoadingEdit } = useMutation({
        mutationKey: ["Positions-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.put(`/forecast-console/position/${values?.id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated department Successfully",
            });
            refetchPositions();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["position-one"] });
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
    const { mutate: positionDelete, isPending: isLoadingDelete } = useMutation({
        mutationKey: ["position-delete"],
        mutationFn: async (values: string) => {
            return axiosInstance.delete(`/forecast-console/position/${values}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Deleted position Successfully",
            });
            refetchPositions();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["position-one"] });
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
        positionsData,
        isLoadingPositions,
        positionSingle,
        isLoadingPositionSingle,
        positionsAdd, isLoadingAdd,
        isLoadingEdit,
        positionsEdit,
        isLoadingDelete,
        positionDelete
    };
};

export default usePositionsHttps;
