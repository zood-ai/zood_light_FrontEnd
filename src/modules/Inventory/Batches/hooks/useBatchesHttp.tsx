import useCustomQuery from '@/hooks/useCustomQuery'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { formbatcheschema } from '../schema/Schema'
import axiosInstance from '@/guards/axiosInstance'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import useFilterQuery from '@/hooks/useFilterQuery'
import { useDefaultBranch } from '@/hooks/useBranch'

interface IUseBatchesHttp {
  batchId?: string
  handleCloseSheet: () => void
  setFromBatch: (data: any) => void
}
const useBatchesHttp = ({ batchId, handleCloseSheet, setFromBatch }: IUseBatchesHttp) => {
  const { toast } = useToast()
  const { filterObj } = useFilterQuery()

  // get all batches
  const {
    data: batchesData,
    refetch: refetchbatches,
    isFetching: isLoadingbatches,
  } = useCustomQuery(
    ['batches', filterObj],
    'forecast-console/batch',
    {},
    {
      ...useDefaultBranch(),
      ...(() => {
        const newFilterObj = { ...filterObj }
        delete newFilterObj['filter[branch]']
        return newFilterObj
      })(),
    }
  )

  // get single batch
  const { data: batche, isFetching: isPendingBatche } = useCustomQuery(
    ['batches', batchId || ''],
    `forecast-console/batch/${batchId || ''}`,
    {
      enabled: !!batchId,
      onSuccess: (data) => {
        setFromBatch({
          name: data?.data?.name,
          cost: +data?.data?.cost,
          storage_to_ingredient: data?.data?.storage_to_ingredient,
          storage_unit: data?.data?.storage_unit,
          storage_areas: data?.data?.storage_areas?.map((s: any) => +s?.id),
          stock_counts: data?.data?.stock_counts,
          suppliers: data?.data?.suppliers?.map((s: any) => ({
            id: s?.id,
            item_supplier_code: s?.pivot?.item_supplier_code,
            specific_name: s?.pivot?.specific_name,
            pack_size: s?.pivot?.pack_size,
            pack_unit: s?.pivot?.pack_unit,
            pack_per_case: s?.pivot?.pack_per_case,
            cost: s?.pivot?.cost,
            tax_group_id: s?.pivot?.tax_group_id,
            is_main: s?.pivot?.is_main,
          })),

          ingredient: data?.data?.ingredient?.map((s: any) => ({
            id: s?.id,
            quantity: s?.pivot?.quantity,
            cost: s?.unit_cost * s?.pivot?.quantity,
          })),
          branches: data?.data?.branches?.map((b: any) => ({
            id: b?.id,
          })),
        })
      },
    }
  )

  // creeate batche
  const { mutate: CreateBatche, isPending } = useMutation({
    mutationKey: ['batches/create'],
    mutationFn: async (values: z.infer<typeof formbatcheschema>) => {
      return axiosInstance.post('forecast-console/batch', values)
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message || 'Batch created successfully',
      })
      refetchbatches()
      handleCloseSheet()
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        })
      } else {
        toast({
          description: error?.data?.message,
        })
      }
    },
  })

  // delete batche
  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['batches/delete'],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`forecast-console/batch/${id}`)
    },
    onSuccess: (data) => {
      toast({
        description: 'Batch deleted successfully',
      })
      refetchbatches()
      handleCloseSheet()
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        })
      } else {
        toast({
          description: error?.data?.message,
        })
      }
    },
  })

  // edit batche
  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationKey: ['batches/edit'],
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: z.infer<typeof formbatcheschema>
    }) => {
      return axiosInstance.put(`forecast-console/batch/${id}`, values)
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message || 'Batch updated successfully',
      })
      refetchbatches()
      handleCloseSheet()
    },
  })

  return {
    CreateBatche,
    mutateDelete,
    mutateEdit,
    batche,
    batchesData,
    isPending,
    isPendingDelete,
    isPendingEdit,
    isLoadingbatches,
    isPendingBatche,
  }
}

export default useBatchesHttp
