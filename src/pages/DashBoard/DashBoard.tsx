import { useState, useEffect, useCallback } from 'react';

import { DashBoardProps } from './DashBoard.types';

import './DashBoard.css';
import DashCards from '@/components/DashCards';
import DashSalesCard from '@/components/DashSalesCard';
import LineChartExample from '@/components/custom/LineChartExample';
import { RegisterForm } from '@/components/custom/RegisterForm';
import Loading from '../../components/loader';
import Cookies from 'js-cookie';
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

export const DashBoard: React.FC<DashBoardProps> = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const [activeFilter, setActiveFilter] = useState('week');

  // Call useGetAll directly here
  const { data: apiData, isLoading } = createCrudService<any>(
    `/reports/overview/light?groupby=${activeFilter}`
  ).useGetAll();

  const data = apiData?.data || [];
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
  const filterBtn = () => {};
  const { columns } = useOrderDataTableColumns();
  const allService = createCrudService<any>('/orders?sort=-status');
  const { useGetAll } = allService;
  const { data: lastOrderData, isLoading: isLoadingOrder } = useGetAll();
  const [searchedData, setSearchedData] = useState<any>(lastOrderData);
  useEffect(() => {
    setSearchedData(lastOrderData);
  }, [lastOrderData]);
  console.log({ lastOrderData, searchedData });

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const handleDebounce = useCallback(
    debounce((searchTerm: string) => {
      if (!searchTerm) {
        setSearchedData(lastOrderData); // Reset if search is cleared
        return;
      }

      const holder = lastOrderData?.data.filter((item: any) => {
        const referenceMatch = item?.reference
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase());
        const customerName = item?.customer?.name
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase());
        return referenceMatch || customerName;
      });
      console.log({ holder });

      setSearchedData({ ...lastOrderData, data: holder });
    }, 300), // 300ms debounce delay
    [lastOrderData]
  );

  const handleSearch = (e: string) => {
    console.log(e, searchedData);
    handleDebounce(e);
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
            />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8 bg-blacka">
              <LineChartExample data={data} />
              <DashSalesCard data={data} />
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
                  handleDel={handleOpenDeleteModal}
                  handleRowClick={handleOpenViewModal}
                  data={searchedData?.data || []}
                  columns={columns}
                  handleEdit={handleOpenEditModal}
                  meta={searchedData || {}}
                  filterBtn={filterBtn}
                  dashBoard={true}
                  actionText={'احدث الفواتير'}
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
