import React, { useEffect, useCallback } from 'react';

import { IndividualInvoicesProps } from './IndividualInvoices.types';

import './IndividualInvoices.css';
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
import createCrudService from '@/api/services/crudService';
import { LoadingSkeleton } from '@/components/custom/LoadingSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { resetOrder } from '@/store/slices/orderSchema';
import { resetCard } from '@/store/slices/cardItems';
import { toggleActionView } from '@/store/slices/toggleAction';

export const IndividualInvoices: React.FC<IndividualInvoicesProps> = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const filter = {
    type: 2,
    status: 8,
  };
  const allService = createCrudService<any>('orders', {
    filter,
  });
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const [searchedData, setSearchedData] = useState({});
  useEffect(() => {
    setSearchedData(allData);
  }, [allData]);

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
    debounce((searchTerm: string) => {
      if (!searchTerm) {
        setSearchedData(allData); // Reset if search is cleared
        return;
      }

      const holder = allData?.data.filter((item: any) => {
        const referenceMatch = item?.reference
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase());
        const customerName = item?.customer?.name
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase());
        return referenceMatch || customerName;
      });

      setSearchedData({ ...allData, data: holder });
    }, 300), // 300ms debounce delay
    [allData]
  );

  const handleSearch = (e: string) => {
    console.log(e, allData);
    handleDebounce(e);
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
