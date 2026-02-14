import { useState, useEffect, useCallback } from 'react';

import { DashBoardProps } from './DashBoard.types';

import DashCards from '@/components/DashCards';
import DashSalesCard from '@/components/DashSalesCard';
import LineChartExample from '@/components/custom/LineChartExample';
import Loading from '../../components/loader';
import createCrudService from '@/api/services/crudService';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
//import { useDataTableColumns } from '../../pages/tasks/components/useDataTableColumns';
import { useOrderDataTableColumns } from './useOrderDataTableColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { ConfirmDelModal } from '../../pages/tasks/Modal/ConfirmDelModal';
import AddEditModal from '../../pages/tasks/Modal/AddEditModal';
import { DetailsModal } from './Modal/DetailsModal';
import axiosInstance from '@/api/interceptors';
import { useQueryClient } from '@tanstack/react-query';

export const DashBoard: React.FC<DashBoardProps> = () => {
  type PeriodFilter = 'day' | 'week' | 'month';
  const queryClient = useQueryClient();
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const [activeFilter, setActiveFilter] = useState<PeriodFilter>('week');
  const [dashboardDateRange, setDashboardDateRange] = useState<{
    value: any;
    query: string;
    label: string;
  }>({
    value: null,
    query: '',
    label: '',
  });
  const isCustomRangeActive = Boolean(dashboardDateRange.query);
  const dashboardOverviewEndpoint = isCustomRangeActive
    ? `/reports/overview/light?${dashboardDateRange.query.replace(/^&/, '')}`
    : `/reports/overview/light?groupby=${activeFilter}`;

  // Call useGetAll directly here
  const { data: apiData, isLoading } = createCrudService<any>(
    dashboardOverviewEndpoint
  ).useGetAll();

  const data = apiData?.data || {};
  const handleOpenViewModal = (row: any) => {
    setSelectedRow(row);
    setIsViewModalOpen(true);
    dispatch(toggleActionViewData(row));
  };
  const handleOpenDeleteModal = (row: any) => {
    setSelectedRow(row);
    setIsDelModalOpen(true);
  };
  const handleOpenEditModal = (row: any) => {
    setModalType('Edit');
    setSelectedRow(row);
    setIsAddEditOpen(true);
  };
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setIsAddEditOpen(false);
    setIsViewModalOpen(false);
    setIsDelModalOpen(false);

    dispatch(toggleActionView(false));
  };
  const toggleActionData = useSelector((state: any) => state?.toggleAction);
  const filterBtn = () => undefined;
  const { columns } = useOrderDataTableColumns();
  const ordersBaseSort = '/orders?sort=-business_date';
  const allService = createCrudService<any>(ordersBaseSort);
  const [allUrl, setAllUrl] = useState(ordersBaseSort);
  const { useGetAll } = allService;
  const { data: lastOrderData, isLoading: isLoadingOrder } = useGetAll();
  const [searchedData, setSearchedData] = useState<any>(lastOrderData);
  useEffect(() => {
    setSearchedData(lastOrderData);
  }, [lastOrderData]);

  useEffect(() => {
    if (isCustomRangeActive) return;
    const periods: PeriodFilter[] = ['day', 'week', 'month'];
    const missingPeriods = periods.filter((period) => period !== activeFilter);

    missingPeriods.forEach((period) => {
      queryClient.prefetchQuery({
        queryKey: ['dashboard-overview', period, dashboardDateRange.query],
        queryFn: async () => {
          const response = await axiosInstance.get(
            `/reports/overview/light?groupby=${period}${dashboardDateRange.query}`
          );
          return response?.data?.data;
        },
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [activeFilter, dashboardDateRange.query, isCustomRangeActive, queryClient]);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const handleDebounce = useCallback(
    debounce(async (searchTerm: string, date: string) => {
      if (!searchTerm) {
        if (!date) {
          setSearchedData(lastOrderData); // Reset if search is cleared
          return;
        }
        setAllUrl(`${ordersBaseSort}${date}`);
        try {
          const res = await axiosInstance.get(`${ordersBaseSort}${date}`);
          setSearchedData(res.data);
        } catch {
          setSearchedData(lastOrderData);
        }
        return;
      }

      // const holder = lastOrderData?.data.filter((item: any) => {
      //   const referenceMatch = item?.reference
      //     ?.toLowerCase()
      //     ?.includes(searchTerm.toLowerCase());
      //   const customerName = item?.customer?.name
      //     ?.toLowerCase()
      //     ?.includes(searchTerm.toLowerCase());
      //   return referenceMatch || customerName;
      // });
      setAllUrl(`${ordersBaseSort}&search=${searchTerm}${date}`);
      try {
        const res = await axiosInstance.get(
          `${ordersBaseSort}&search=${searchTerm}${date}`
        );
        // setSearchedData({ ...allData, data: holder });
        setSearchedData(res.data);
      } catch {
        setSearchedData(lastOrderData);
      }

      // setSearchedData({ ...lastOrderData, data: holder });
    }, 300), // 300ms debounce delay
    [lastOrderData]
  );

  const handleSearch = (e: string, date: string) => {
    handleDebounce(e, date);
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <DashCards
              data={data}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              dashboardDateRange={dashboardDateRange}
              setDashboardDateRange={setDashboardDateRange}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8 bg-blacka">
              <LineChartExample data={data} />
              <DashSalesCard
                data={data}
                activeFilter={activeFilter}
                dashboardDateQuery={dashboardDateRange.query}
                isCustomRangeActive={isCustomRangeActive}
                customRangeLabel={dashboardDateRange.label}
              />
            </div>
            <>
              <AddEditModal
                initialData={modalType == 'Add' ? {} : selectedTableRow}
                isOpen={isAddEditModalOpen}
                onClose={() => handleCloseModal()}
                modalType={modalType}
              />
              <DetailsModal
                initialData={selectedTableRow}
                isOpen={toggleActionData.value}
                onClose={handleCloseModal}
              />
              <ConfirmDelModal
                initialData={selectedTableRow}
                isOpen={isDelModalOpen}
                onClose={handleCloseModal}
              />

              <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable
                  allUrl={allUrl}
                  handleDel={handleOpenDeleteModal}
                  handleRowClick={handleOpenViewModal}
                  data={searchedData?.data || []}
                  columns={columns}
                  handleEdit={handleOpenEditModal}
                  meta={searchedData || {}}
                  filterBtn={filterBtn}
                  dashBoard={true}
                  actionText={'LATEST_INVOICES'}
                  loading={isLoadingOrder}
                  handleSearch={handleSearch}
                />
              </div>
            </>
          </div>
        </>
      )}
    </>
  );
};
