import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import { formOrdersSchema } from "../schema/Schema";
import { IOrder } from "../types/type";

interface IUseOrdersHttp {
    handleCloseSheet: () => void;
    IdOrder?: string;
}
const useOrdersHttp = ({ handleCloseSheet, IdOrder }: IUseOrdersHttp) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    // get list
    const {
        data: OrdersData,
        isLoading: isLoadingOrders,
        refetch: refetchOrders,
    } = useCustomQuery(["orders", filterObj], "/orders", {}, { ...filterObj });

    // get one
    const {
        data: OrdersOne,
        isLoading: isLoadingOrdersOne,
        refetch: refetchOrdersOne,
    } = useCustomQuery(["orders-one", IdOrder || ""], `/orders/${IdOrder}`, {
        select: (data: {
            data: IOrder
        }) => {

            const newDataFormat = {
                id: data?.data?.id,
                status: data?.data?.status,
                reference: data?.data?.reference,
                business_date: data?.data?.business_date,
                number: data?.data?.number,
                type: data?.data?.type,
                source: data?.data?.source,
                branch: data?.data?.branch?.name,
                opened_at: data?.data?.opened_at,
                closed_at: data?.data?.closed_at,
                subtotal_price: data?.data?.subtotal_price,
                total_charges: data?.data?.total_charges,
                discount_amount: data?.data?.discount_amount,
                total_taxes: data?.data?.total_taxes,
                rounding_amount: data?.data?.rounding_amount,
                total_price: data?.data?.total_price,
                products: data?.data?.products?.map((pro: any) => {
                    return (

                        {
                            quantity: pro?.pivot?.quantity,
                            name: pro?.name,
                            price: pro?.price,
                            excluded_options_ids: pro?.pivot?.excluded_options_ids,
                            discount_amount: pro?.pivot?.discount_amount
                        }
                    )

                }),
                taxes: data?.data?.taxes?.map((e: any) => {
                    return (
                        { name: e?.name }
                    )
                }),
                payments: data?.data?.payments?.map((e: any) => {
                    return (
                        {
                            payment_method: e?.payment_method,
                            amount: e?.amount,
                            business_date: e?.business_date
                        }
                    )
                })
            };
            return newDataFormat;
        },
        enabled: !!IdOrder,
    });

    // export
    const { mutate: ExportOrders, isPending: loadingExport } = useMutation({
        mutationKey: ["export-orders"],
        mutationFn: async () => {
            return axiosInstance.post(`export/orders`);
        },
        onSuccess: (data) => {
            toast({
                description: data?.data?.massage,
            });
            console.log(data, "data");

            window.open(data?.data?.data?.url);
        },
        onError: (data: any) => {
            toast({
                description: data?.data?.massage,
            });
        },
    });

    return {
        isLoadingOrders,
        OrdersData,

        OrdersOne,
        isLoadingOrdersOne,
        ExportOrders,
        loadingExport,
    };
};

export default useOrdersHttp;
