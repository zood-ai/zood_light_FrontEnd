import { ColumnDef } from '@tanstack/react-table'

// UI components
import { CustomSheet } from '@/components/ui/custom/CustomSheet'
import { CustomTable } from '@/components/ui/custom/CustomTable'
import HeaderPage from '@/components/ui/custom/HeaderPage'
import HeaderTable from '@/components/ui/custom/HeaderTable'
import LocationForm from '@/components/LocationForm'
import BatchesDetailsForm from './components/BatchesDetailsForm'

// types
import { IBatchesList } from './types/type'

// hooks
import useBatches from './hooks/useBatches'
import CustomModal from '@/components/ui/custom/CustomModal'
import { PERMISSIONS } from '@/constants/constants'

const Batches = () => {
  const {
    //state
    isOpen,
    isEdit,
    modalName,
    batchName,
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
  } = useBatches()

  const columns: ColumnDef<IBatchesList>[] = [
    {
      accessorKey: 'name',
      header: () => <div>Name</div>,
      cell: ({ row }) => <div className='w-[200px]'>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'storage_to_ingredient',
      header: () => <div>Yeild</div>,
      cell: ({ row }) => {
        return (
          <div className=''>
            {row.getValue('storage_to_ingredient')}
            {row?.original?.storage_unit}{' '}
          </div>
        )
      },
    },
    {
      accessorKey: 'cost',
      header: () => <div>Food cost</div>,
      cell: ({ row }) => {
        return <div className=''>SAR {row.getValue('cost')}</div>
      },
    },
  ]

  return (
    <>
      <HeaderPage
        title='Batch recipes'
        textButton='Add recipe'
        exportButton={true}
        modalName={'batches'}
        onClickAdd={() => {
          setIsOpen(true)
        }}
                permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}
        
      />
      <HeaderTable />
      <CustomTable
        columns={columns}
        data={batchesData?.data || []}
        pagination
        loading={isLoadingbatches}
        paginationData={batchesData?.meta}
        onRowClick={(row: IBatchesList) => {
          setRowData(row)
          setIsOpen(true)
          setIsEdit(true)
        }}
      />

      <CustomSheet
        isOpen={isOpen}
        isDirty={form.formState.isDirty}
        tabs={[
          { name: 'Batches details', content: <BatchesDetailsForm isEdit={isEdit} /> },
          { name: 'Branches', content: <LocationForm /> },
        ]}
        form={form}
        isLoadingForm={isPendingBatche}
        isEdit={isEdit}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={batchName || form.watch('name')}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoading={isPending || isPendingEdit || isPendingDelete}
      />

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={batchName}
        isPending={isPendingDelete}
      />
    </>
  )
}

export default Batches
