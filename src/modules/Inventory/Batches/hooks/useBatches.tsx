import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { formbatcheschema } from '../schema/Schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { IBatchesList } from '../types/type'
import useBatchesHttp from './useBatchesHttp'

const useBatches = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [modalName, setModalName] = useState('')
  const [rowData, setRowData] = useState<IBatchesList>()

  const defaultValues = {
    name: '',
    storage_to_ingredient: 0,
    storage_unit: '',
    costing_method: 0,
    suppliers: [],
    // cost: 0,
    ingredient: [
      {
        id: '',
      },
    ],
    branches: [],
    storage_areas: [],
    stock_counts: [
      {
        pack_unit: '',
        checked: 1,
        pack_size: 1,
        unit: '',
        count: 1,
        use_report: 1,
        show_as: '-',
        report_preview: '1',
      },
    ],
  }

  const handleCloseSheet = () => {
    setModalName('')
    setIsOpen(false)
    setIsEdit(false)
    setRowData(undefined)
    form.reset(defaultValues)
  }

  const {
    CreateBatche,
    batchesData,
    isPending,
    mutateEdit,
    mutateDelete,
    isPendingEdit,
    isLoadingbatches,
    isPendingBatche,
    isPendingDelete,
  } = useBatchesHttp({
    batchId: rowData?.id || '',
    handleCloseSheet,
    setFromBatch: (data: any) => {
      form.reset(data)
    },
  })

  const form = useForm<z.infer<typeof formbatcheschema>>({
    resolver: zodResolver(formbatcheschema),
    defaultValues,
  })

  const handleConfirm = () => {
    if (modalName === 'close edit') {
      handleCloseSheet()
    } else {
      // handle delete
      mutateDelete(rowData?.id || '')
    }
  }

  const onSubmit = (values: z.infer<typeof formbatcheschema>) => {
    if (isEdit) {
      mutateEdit({ id: rowData?.id || '', values })
      return
    }
    CreateBatche(values)
  }

  return {
    //state
    isOpen,
    isEdit,
    modalName,
    batchName: rowData?.name || '',
    setIsOpen,
    setIsEdit,
    setRowData,
    setModalName,

    // functions
    handleCloseSheet,
    handleConfirm,
    onSubmit,

    // query data
    batchesData,
    isPending,
    isPendingEdit,
    isLoadingbatches,
    isPendingBatche,
    isPendingDelete,

    // form
    form,
  }
}

export default useBatches
