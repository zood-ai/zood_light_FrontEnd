import { useToast } from '@/components/ui/use-toast'
import axiosInstance from '@/guards/axiosInstance'
import useCustomQuery from '@/hooks/useCustomQuery'
import useFilterQuery from '@/hooks/useFilterQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { MyFieldValues } from '../types/type'
import { FieldValues } from 'react-hook-form'

interface UsePurchaseOrderHttpProps {
  handleCloseSheet?: () => void
  branchId?: string
}

const usePurchaseOrderHttp = ({ handleCloseSheet, branchId }: UsePurchaseOrderHttpProps) => {
  const { filterObj } = useFilterQuery()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: SuppliersSelect, isFetching } = useCustomQuery(
    ['forecast-console/suppliers', branchId || ''],
    'forecast-console/suppliers',
    {
      // enabled: !!branchId,

      select: (data: {
        data: {
          name: string
          id: string
          accept_price_change: boolean
          has_cpu: boolean
        }[]
      }) => {
        return data?.data?.map(
          (supplier: {
            name: string
            id: string
            accept_price_change: boolean
            has_cpu: boolean
          }) => ({
            label: supplier.name,
            value: supplier.id,
            accept_price_change: supplier?.accept_price_change,
            has_cpu: supplier.has_cpu,
          })
        )
      },
    },
    { ['filter[branches][0]']: filterObj['filter[branch]'], type: 'all' }
  )

  // Save for later Purchase Order
  const { mutate: CreatePurchaseOrder, isPending: LoadingCreatePurchaseOrder } = useMutation({
    mutationKey: ['forecast-inventory/orders'],
    mutationFn: async (values: MyFieldValues) => {
      return axiosInstance.post('forecast-inventory/orders', values)
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      })

      handleCloseSheet?.()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        })
      } else {
        toast({
          description: error.message,
        })
      }
    },
  })

  const { mutate: UpdatePurchaseOrder, isPending: LoadingUpdatePurchaseOrder } = useMutation({
    mutationKey: ['forecast-inventory/orders'],
    mutationFn: async ({ values, orderId }: { values: FieldValues; orderId: string }) => {
      return axiosInstance.put(`forecast-inventory/orders/${orderId}`, values)
    },
    onSuccess: (data) => {
      handleCloseSheet?.()
      toast({
        description: 'Order updated successfully',
      })
      queryClient.invalidateQueries({
        queryKey: ['receive-order', filterObj],
      })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        })
      } else {
        toast({
          description: error.message,
        })
      }
    },
  })
  const { mutate: DeletePurchaseOrder, isPending: LoadingDeletePurchaseOrder } = useMutation({
    mutationKey: ['forecast-inventory/orders/delete'],
    mutationFn: async ({ orderId }: { orderId: string }) => {
      return axiosInstance.delete(`forecast-inventory/orders/${orderId}`)
    },
    onSuccess: (data) => {
      handleCloseSheet?.()
      toast({
        description: 'Order Deleted successfully',
      })
      queryClient.invalidateQueries({
        queryKey: ['receive-order', filterObj],
      })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        })
      } else {
        toast({
          description: error.message,
        })
      }
    },
  })

  return {
    SuppliersSelect,
    isFetching,
    LoadingCreatePurchaseOrder,
    CreatePurchaseOrder,
    LoadingUpdatePurchaseOrder,
    UpdatePurchaseOrder,
    DeletePurchaseOrder,
    LoadingDeletePurchaseOrder,
  }
}

export default usePurchaseOrderHttp
