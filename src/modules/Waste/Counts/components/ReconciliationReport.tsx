import RightIcon from '@/assets/icons/Right'
import { CustomTable } from '@/components/ui/custom/CustomTable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { IReconciliationReport } from '../types/types'
import { sumData } from '@/utils/function'
import { Badge } from '@/components/ui/badge'
import { handleStatusShap } from '@/modules/purchases/ReceiveOrders/helpers/helpers'
import CustomModal from '@/components/ui/custom/CustomModal'

const ReconciliationReport = ({
  reportData,
  isPendingGenerateReport,
  modalName,
  type,
  status,
  isPendingDelete,
  setModalName,
  handleConfirm,
}: {
  reportData: any
  isPendingGenerateReport: boolean
  modalName: string
  type: string
  status: string
  isPendingDelete: boolean
  setModalName: React.Dispatch<React.SetStateAction<string>>
  handleConfirm: () => void
}) => {
  const [option, setOption] = useState(0)
  const [filteredOptions, setFilteredOptions] = useState<{
    name: string
    variance_value: number | null
    is_estimated: number | null
  }>({
    name: '',
    variance_value: null,
    is_estimated: null,
  })
  let ReportData = Object.entries(reportData || {}).flatMap(([key, values]: [string, any]) => [
    sumData(key, values),
    ...values,
  ])

  const filterdReportData = useMemo(() => {
    if (
      filteredOptions.name === '' &&
      filteredOptions.variance_value === null &&
      filteredOptions.is_estimated === null
    ) {
      return ReportData
    }
    return ReportData.filter(
      (item: any) =>
        !item.is_main &&
        item.name.toLowerCase().includes(filteredOptions.name.toLowerCase()) &&
        (filteredOptions.is_estimated === null
          ? true
          : item.is_estimated === filteredOptions.is_estimated) &&
        (filteredOptions.variance_value === null
          ? true
          : item.variance_value >= filteredOptions.variance_value)
    )
  }, [ReportData, filteredOptions])

  const columns: ColumnDef<IReconciliationReport>[] = [
    {
      accessorKey: 'name',
      header: () => <div className='w-[320px]'>item name</div>,
      cell: ({ row }: any) => (
        <div className='flex flex-col'>
          <div className='flex gap-2'>
            {row.getValue('name')}{' '}
            <span className='text-gray text-[14px]'>
              {row.original?.itemCount ? `${row.original?.itemCount} item` : ''}
            </span>
          </div>
          {row?.original?.includedGb > 0 && (
            <span className='text-[12px] mt-1'>*Not included in GP% calculation</span>
          )}

          <span className='text-gray'>{row.original?.unit && row.original?.unit}</span>
        </div>
      ),
    },
    {
      accessorKey: 'opining_count',
      header: () => <div className='w-[150px]'>Opening count</div>,
      cell: ({ row }: any) => {
        return <div className=''>{row.getValue('opining_count')}</div>
      },
    },
    {
      accessorKey: 'opining_value',
      header: () => <div className='w-[150px]'>Opening value</div>,
      cell: ({ row }: any) => <>SAR {row.getValue('opining_value')}</>,
    },
    {
      accessorKey: 'delivers_count',
      header: () => <div className='w-[150px]'>Deliveries</div>,
      cell: ({ row }: any) => {
        return <div className=''> {row.getValue('delivers_count')}</div>
      },
    },
    {
      accessorKey: 'delivers_value',
      header: () => <div className='w-[150px]'>Deliveries Value</div>,
      cell: ({ row }: any) => {
        return <div className=''> SAR {row.getValue('delivers_value')}</div>
      },
    },
    {
      accessorKey: 'transfer_count',
      header: () => <div className='w-[150px]'>Transfers</div>,
      cell: ({ row }: any) => {
        return <div className=''> {row.getValue('transfer_count')}</div>
      },
    },
    {
      accessorKey: 'transfer_value',
      header: () => <div className='w-[150px]'>Transfers Value</div>,
      cell: ({ row }: any) => {
        return <div className=''> SAR {row.getValue('transfer_value')}</div>
      },
    },
    {
      accessorKey: 'waste_count',
      header: () => <div className='w-[200px]'>Waste</div>,
      cell: ({ row }: any) => {
        return <div className=''> {row.getValue('waste_count')}</div>
      },
    },
    {
      accessorKey: 'waste_value',
      header: () => <div className='w-[200px]'>Waste Value</div>,
      cell: ({ row }: any) => {
        return <div className=''> SAR {row.getValue('waste_value')}</div>
      },
    },
    {
      accessorKey: 'batching_count',
      header: () => <div className='w-[150px]'>Batch created</div>,
      cell: ({ row }: any) => {
        return <div className=''> {row.getValue('batching_count')}</div>
      },
    },
    {
      accessorKey: 'batching_value',
      header: () => <div className='w-[150px]'>Batch Value</div>,
      cell: ({ row }: any) => {
        return <div className=''> SAR {row.getValue('batching_value')}</div>
      },
    },

    {
      accessorKey: 'closing_count',
      header: () => <div className='w-[150px]'>Closing Count</div>,
      cell: ({ row }: any) => {
        return <div className=''> {row.getValue('closing_count')}</div>
      },
    },
    {
      accessorKey: 'closing_value',
      header: () => <div className='w-[150px]'>Closing value</div>,
      cell: ({ row }: any) => {
        return <div className=''>SAR {row.getValue('closing_value')}</div>
      },
    },
    {
      accessorKey: 'used_count',
      header: () => <div className='w-[150px]'>Used qty</div>,
      cell: ({ row }: any) => {
        return <div className=''>{row.getValue('used_count') || 0}</div>
      },
    },
    {
      accessorKey: 'pos_count',
      header: () => <div className='w-[150px]'>POS sales</div>,
      cell: ({ row }: any) => {
        const isEstimated = row.original?.is_estimated === 1
        return (
          <div className='flex gap-2'>
            {row.original.is_main ? `SAR ${row.original.pos_value}` : row.getValue('pos_count')}
            {isEstimated && <Badge variant={handleStatusShap('4')}>Estimated</Badge>}
          </div>
        )
      },
    },
    {
      accessorKey: 'variance_count',
      header: () => <div className='w-[150px]'>Variance qty</div>,
      cell: ({ row }: any) => {
        return (
          <div className={row.getValue('variance_count') ? 'text-warn' : ''}>
            {row.getValue('variance_count')}
          </div>
        )
      },
    },
    {
      accessorKey: 'variance_value',
      header: () => <div className='w-[150px]'>Variance value</div>,
      cell: ({ row }: any) => {
        return (
          <div className={row.getValue('variance_value') ? 'text-warn' : ''}>
            SAR {row.getValue('variance_value')}
          </div>
        )
      },
    },
  ]

  return (
    <>
      {/* header */}
      <div className='flex justify-between items-center mb-[26px]'>
        {/* left */}
        <div className='flex gap-6 items-center'>
          <Input
            searchIcon
            className='w-[138px] h-[32px] ps-6 pe-0 pt-1  rounded-sm placeholder:text-[12px] placeholder:font-medium tracking-wide '
            placeholder='Search by name'
            onChange={(e) => {
              setFilteredOptions({
                ...filteredOptions,
                name: e.target.value,
              })
            }}
          />
          <div className='flex gap-2 items-center'>
            <Label className='text-[16px] text-textPrimary font-medium '>Variance is over</Label>
            <Input
              type='number'
              className='w-[116px] h-[32px] pt-1  rounded-sm'
              textLeft='SAR'
              onChange={(e) => {
                setFilteredOptions({
                  ...filteredOptions,
                  variance_value: +e.target.value || null,
                })
              }}
            />
          </div>
        </div>
        {/* right */}
        <div className=' text-gray-500 flex items-center justify-around h-[32px] border-[#E1E9ED] border rounded-sm'>
          {['Show all', 'Show counted'].map((op, index) => (
            <button
              key={op}
              className={`${
                option === index && 'bg-popover gap-1 '
              } cursor-pointer gap-1  h-full px-2 flex items-center justify-center  ${
                index === 0 && 'w-[92px]'
              }`}
              onClick={() => {
                setFilteredOptions({
                  ...filteredOptions,
                  is_estimated: index === 0 ? null : 0,
                })
                setOption(index)
              }}
            >
              {option === index && <RightIcon color='var(--secondary-foreground)' />}
              {op}
            </button>
          ))}
        </div>
      </div>

      {/* body */}

      <CustomTable
        rowStyle={(condition: boolean) => (condition ? 'h-[32px] py-0' : 'h-[55px] py-0')}
        conditionProp='is_main'
        columns={columns}
        pagination={false}
        countReport
        data={filterdReportData}
        loading={isPendingGenerateReport}
      />

      <CustomModal
        descriptionModal={
          modalName === 'delete' ? (
            <div className='flex flex-col gap-2'>
              <span>This count will be deleted</span>
              <span>Count type: {type}</span>
              <span>Count status: {status}</span>
            </div>
          ) : (
            "You should save your count first. If you exit now, you'll lose what you've counted so far."
          )
        }
        headerModal={
          modalName === 'delete' ? 'Delete count' : 'Are you sure you want to stop counting'
        }
        modalName={modalName}
        modalWidth='w-[466px]'
        isPending={isPendingDelete}
        setModalName={setModalName}
        confirmbtnText={modalName === 'delete' ? 'Delete count' : 'Stop counting'}
        handleConfirm={handleConfirm}
      />
    </>
  )
}

export default ReconciliationReport
