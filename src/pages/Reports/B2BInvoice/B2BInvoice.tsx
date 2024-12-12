import React, { useEffect, useCallback } from 'react';

import { B2BInvoiceProps } from './B2BInvoice.types';

import './B2BInvoice.css';
import { tasks } from './data/tasks';
import { useState } from 'react';
import { DetailsModal } from './Modal/DetailsModal';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { ConfirmDelModal } from './Modal/ConfirmDelModal';
import AddEditModal from './Modal/AddEditModal';
import { useTranslation } from 'react-i18next';
import { useDataTableColumns } from './components/useDataTableColumns';
import useDirection from '@/hooks/useDirection';
import { useNavigate } from 'react-router-dom';
import { LoadingSkeleton } from '@/components/custom/LoadingSkeleton';
import createCrudService from '@/api/services/crudService';
import { useDispatch, useSelector } from 'react-redux';
import { resetCard } from '@/store/slices/cardItems';
import { resetOrder } from '@/store/slices/orderSchema';
import { toggleActionView } from '@/store/slices/toggleAction';
import axiosInstance from '@/api/interceptors';

export const B2BInvoice: React.FC<B2BInvoiceProps> = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const navigate = useNavigate();
  const handleCreateTask = () => {
    // setSelectedRow({});
    setModalType('Add');
    // setIsAddEditOpen(true);
    // navigate('/individual-invoices/add');
    navigate('add');
  };
  const handleOpenViewModal = (row: any) => {
    setSelectedRow(row);
    setIsViewModalOpen(true);
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

  const handleCloseModal = () => {
    setIsAddEditOpen(false);
    setIsViewModalOpen(false);
    setIsDelModalOpen(false);

    dispatch(toggleActionView(false));
  };
  const filterBtn = () => {};
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const { columns } = useDataTableColumns();
  const allService = createCrudService<any>(
    'orders?filter[type]=2&filter[status]=4'
  );
  const [allUrl, setAllUrl] = useState(
    'orders?filter[type]=2&filter[status]=4'
  );
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const [searchedData, setSearchedData] = useState({});
  useEffect(() => {
    setSearchedData(allData);
  }, [allData]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetCard());
    dispatch(resetOrder());
  }, [dispatch]);
  const toggleActionData = useSelector((state: any) => state?.toggleAction);

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
          setSearchedData(allData); // Reset if search is cleared
          return;
        }

        const res = await axiosInstance.get(
          `/orders?filter[type]=2&filter[status]=4${date}`
        );

        setSearchedData(res.data);
        return;
      }

      // const holder = allData?.data.filter((item: any) => {
      //   const referenceMatch = item?.reference
      //     ?.toLowerCase()
      //     ?.includes(searchTerm.toLowerCase());
      //   const customerName = item?.customer?.name
      //     ?.toLowerCase()
      //     ?.includes(searchTerm.toLowerCase());
      //   return referenceMatch || customerName;
      // });

      setAllUrl(
        `orders?filter[type]=2&filter[status]=4&filter[customer.name]=${searchTerm}${date}`
      );
      const res = await axiosInstance.get(
        `/orders?filter[type]=2&filter[status]=4&filter[customer.name]=${searchTerm}${date}`
      );

      // setSearchedData({ ...allData, data: holder });
      setSearchedData(res.data);

      // setSearchedData({ ...allData, data: holder });
    }, 300), // 300ms debounce delay
    [allData]
  );

  const handleSearch = (e: string, date: string) => {
    handleDebounce(e, date);
  };

  return (
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
          actionBtn={handleCreateTask}
          filterBtn={filterBtn}
          meta={searchedData || {}}
          actionText={'ADD_INVOICE'}
          loading={isLoading}
          handleSearch={handleSearch}
        />
      </div>
    </>
  );
};
