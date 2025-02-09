import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useDefaultBranch } from "@/hooks/useBranch";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useInvoiceHttp = ({
  invoiceId,
  handleCloseSheet,
  setCheck,
  setModalName,
  setInvoiceOne,
}: {
  invoiceId: any;
  handleCloseSheet: () => void;
  setCheck?: any;
  setModalName?: any;
  setInvoiceOne?: any;
}) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();

  const {
    data: invoiceData,
    isLoading: isFetchingInvoice,
    refetch: refetchInvoiceList,
  } = useCustomQuery(
    ["forecast-console/invoice", filterObj],
    "forecast-console/invoice",
    {},
    {
      ...useDefaultBranch(),
      ...(() => {
        const newFilterObj = { ...filterObj };
        delete newFilterObj["filter[branch]"];
        return newFilterObj;
      })(),
    }
  );

  // get one
  const {
    data: invoiceOne,
    isLoading: isFetchingInvoiceOne,
    isPending: isPendingInvoiceOne,
    isFetchedAfterMount: isLoadingOne,
    refetch: refetchInvoiceOne,
  } = useCustomQuery(
    ["invoice-one", invoiceId],
    `forecast-console/invoice/${invoiceId}`,
    {
      select: (data: any) => {
       
        
        const newDataFormat = {
          invoice_number: data?.data?.invoice_number,
          supplier_name: data?.data?.supplier_name,
          business_date: data?.data?.business_date,
          invoice_date: data?.data?.invoice_date,
          sub_total: data?.data?.sub_total,
          total: data?.data?.total,
          total_vat: data?.data?.total_vat,
          status: data?.data?.status,
          accept_price_change_from_supplier:
            data?.data?.accept_price_change_from_supplier,
          creditNotices: data?.data?.creditNotices?.map((credit: any) => ({
            id: credit?.id,
            type: credit?.type,
            credit_amount: credit?.credit_amount,
            name: credit?.item?.name,
            note: credit?.note,
            status: credit?.status,
            item_id: credit?.item?.id,
            quantity: credit?.pivot?.quantity,
            invoice_quantity: credit?.pivot?.invoice_quantity,
            cost: credit?.pivot?.cost,
            old_cost: credit?.item?.cost,
          })),
          items: data?.data?.items?.map((item: any) => ({
            id: item?.id,
            name: item?.name,
            quantity: item?.pivot?.quantity,
            invoice_quantity: item?.pivot?.invoice_quantity,
            pack_unit: item?.pack_unit,
            unit: item?.unit,
            total_cost: item?.pivot?.total_cost,
            sub_total: item?.pivot?.sub_total,
            tax_group_id: item?.pivot?.tax_group_id,
            cost: item?.pivot?.cost,
            old_cost: item?.cost,

            tax_amount: item?.pivot?.tax_amount,
          })),
        };
        return newDataFormat;
      },

      enabled: !!invoiceId,
      onSuccess: (data) => {
        
        setInvoiceOne({
          invoice_number: data?.data?.invoice_number,
          supplier_name: data?.data?.supplier_name,
          business_date: data?.data?.business_date,
          invoice_date: data?.data?.invoice_date,
          sub_total: data?.data?.sub_total,
          total: data?.data?.total,
          total_vat: data?.data?.total_vat,
          status: data?.data?.status,
          accept_price_change_from_supplier:
            data?.data?.accept_price_change_from_supplier,
          creditNotices: data?.data?.creditNotices?.map((credit: any) => ({
            id: credit?.id,
            type: credit?.type,
            credit_amount: credit?.credit_amount,
            name: credit?.item?.name,
            note: credit?.note,
            status: credit?.status,
            item_id: credit?.item?.id,
            quantity: credit?.pivot?.quantity,
            invoice_quantity: credit?.pivot?.invoice_quantity,
            cost: credit?.pivot?.cost,
            old_cost: credit?.item?.cost,
          })),
          items: data?.data?.items?.map((item: any) => ({
            id: item?.id,
            name: item?.name,
            quantity: item?.pivot?.quantity,
            invoice_quantity: item?.pivot?.invoice_quantity,
            pack_unit: item?.pack_unit,
            unit: item?.unit,
            total_cost: item?.pivot?.total_cost,
            sub_total: item?.pivot?.sub_total,
            tax_group_id: item?.pivot?.tax_group_id,
            cost: item?.pivot?.cost,
            old_cost: item?.cost,

            tax_amount: item?.pivot?.tax_amount,
          })),
        });
      },
    }
  );
  // approve
  const { mutate: invoiceApprove, isPending: isPendingApprove } = useMutation({
    mutationKey: ["invoice/approve"],
    mutationFn: async (values: any) => {
      return axiosInstance.post("/forecast-console/invoice/approve-bulk", {
        invoices: values,
      });
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchInvoiceList();
      refetchInvoiceOne();
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

  // export
  const { mutate: invoiceExport, isPending: isPendingExport } = useMutation({
    mutationKey: ["invoice/export"],
    mutationFn: async () => {
      return axiosInstance.post("/forecast-console/invoice/export-bulk");
    },
    onSuccess: (data) => {
      toast({
        description: "The approved invoices exported successfully",
      });
      refetchInvoiceList();
      window.open(data?.data.url, "_blank");
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

  const { mutate: invoiceDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["invoice/delete", invoiceId],
    mutationFn: async () => {
      return axiosInstance.delete(`/forecast-console/invoice/${invoiceId}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchInvoiceList();
      handleCloseSheet();
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

  const { mutate: invoiceUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["invoice/update", invoiceId],
    mutationFn: async (values: any) => {
      return axiosInstance.put(
        `/forecast-console/invoice/${invoiceId}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchInvoiceList();
      refetchInvoiceOne();
      setModalName("");
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
  // recieve credit
  const { mutate: receiveCreditNotice, isPending: isLoadingReceive } =
    useMutation({
      mutationKey: ["forecast-console/credit-notice/receive"],
      mutationFn: async (creditIds: string[]) => {
        const response = await axiosInstance.post(
          "forecast-console/credit-notice/receive",
          {
            ids: creditIds,
          }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast({
          description: data?.message,
        });

        setCheck(0);
        refetchInvoiceOne();
      },
    });

  // Unrecieve credit

  const { mutate: UnreceiveCreditNotice, isPending: isLoadingUnReceive } =
    useMutation({
      mutationKey: ["forecast-console/credit-notice/undo-receive"],
      mutationFn: async (creditIds: string[]) => {
        const response = await axiosInstance.post(
          "forecast-console/credit-notice/undo-receive",
          {
            ids: creditIds,
          }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast({
          description: data?.message,
        });
        setCheck(0);
        refetchInvoiceOne();

        console.log(invoiceOne, "invoiceOne");
      },
    });
  return {
    invoiceData,
    isFetchingInvoice,
    invoiceOne,
    isFetchingInvoiceOne,
    isPendingInvoiceOne,
    invoiceApprove,
    isPendingApprove,
    invoiceExport,
    isPendingExport,
    invoiceDelete,
    isPendingDelete,
    invoiceUpdate,
    isPendingUpdate,
    receiveCreditNotice,
    isLoadingReceive,
    UnreceiveCreditNotice,
    isLoadingUnReceive,
    isLoadingOne
  };
};

export default useInvoiceHttp;
