import HeaderPage from '@/components/ui/custom/HeaderPage'
import HeaderTable from '@/components/ui/custom/HeaderTable'
import Card from '@/components/ui/custom/Card'
import useSalesReportHttp from './queriesHttp/useSalesReportHttp'
import useSalesReportColumns from './hooks/useSalesReportColumns'
import SalesBy from './components/SalesBy'

const SalesReport = () => {
  const {
    dataByTotal,
    isLoadingDataByTotal,

    dataByLocation,
    isLoadingDataByLocation,

    dataByItem,
    isLoadingDataByItem,

    dataByCategory,
    isLoadingDataByCategory,
  } = useSalesReportHttp()

  const { LocationColumns, ItemColumns, CategoryColumns } = useSalesReportColumns()
  return (
    <>
      <HeaderPage title='Sales Report' />
      <div className='flex items-center gap-3 mb-[24px]'>
        <Card
          className='w-[340px]'
          showChart={false}
          showBorder={false}
          textColor='text-[#69777D]'
          isLoading={isLoadingDataByTotal}
          data={{
            totalData: {
              headerText: 'Total ordered (excl. VAT)',
              mainValue: 'SAR ' + Number(dataByTotal?.data?.total_ordered).toLocaleString(),
              subValue: '',
            },
          }}
        />

        <Card
          className='w-[340px]'
          showChart={false}
          showBorder={false}
          tooltipContent='if the total don`t match, it could be due to changes in prices or differences in quantities'
          isLoading={isLoadingDataByTotal}
          textColor='text-[#69777D]'
          data={{
            totalData: {
              headerText: 'Total delivered (excl. VAT)',
              mainValue: 'SAR ' + Number(dataByTotal?.data?.total_delivered).toLocaleString(),
              subValue: '',
            },
          }}
        />
      </div>

      <HeaderTable
        isItems={true}
        isCategory={true}
        SearchInputkey='item_name'
        itemKey='items[0]'
        categorykey='categories[0]'
        onClickExport={() => {}}
      />
      <div className='grid grid-cols-12 gap-[24px]'>
        <div className='col-span-6'>
          <SalesBy
            title='location'
            data={dataByLocation?.data}
            isLoading={isLoadingDataByLocation}
            columns={LocationColumns}
          />
        </div>
        <div className='col-span-6'>
          <SalesBy
            title='Item'
            data={dataByItem?.data}
            isLoading={isLoadingDataByItem}
            columns={ItemColumns}
          />
        </div>
      </div>
      <div className='grid grid-cols-12 gap-[24px]'>
        <div className='col-span-6'>
          <SalesBy
            title='Category'
            data={dataByCategory?.data}
            isLoading={isLoadingDataByCategory}
            columns={CategoryColumns}
          />
        </div>
      </div>
    </>
  )
}

export default SalesReport
