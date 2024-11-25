import React from 'react';

import { CustomersProps } from './Customers.types';

import './Customers.css';
import { tasks } from './data/tasks';
import { useState } from 'react';
import { DetailsModal } from './Modal/DetailsModal';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { ConfirmDelModal } from './Modal/ConfirmDelModal';
import AddEditModal from './Modal/AddEditModal';
import { useTranslation } from 'react-i18next';
import { useCustomersDataTable } from './useCustomersDataTable';
import useDirection from '@/hooks/useDirection';
import { useNavigate, useParams } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { toggleActionView } from '@/store/slices/toggleAction';
import { useDispatch, useSelector } from 'react-redux';

const Customer: React.FC<CustomersProps> = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const customerId = param?.id;
  console.log('LOCATION: ', param?.id);
  const handleCreateTask = () => {
    // setSelectedRow({});
    // setModalType('Add');
    // setIsAddEditOpen(true);
    navigate('/zood-dashboard/customers/add');
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
  const filterBtn = () => {
    console.log('filterBtn');
  };
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const { columns } = useCustomersDataTable();
  const allService = createCrudService<any>('manage/customers');
  const ordersData = createCrudService<any>('orders').useGetAll();
  console.log(ordersData?.data?.data);
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const toggleActionData = useSelector((state: any) => state?.toggleAction);
  console.log(
    ordersData?.data?.data?.filter((customer) => customer?.id == customerId)
  );
  console.log('THIS IS ORDER DATA: ', ordersData?.data?.data);
  console.log(
    'THIS IS ORDER DATA Filtred: ',
    ordersData?.data?.data?.filter(
      (customer) => customer?.customer?.id == customerId
    )
  );

  const filtredData = ordersData?.data?.data?.filter(
    (customer) => customer?.customer?.id == customerId
  );
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
          data={filtredData || []}
          columns={columns}
          handleEdit={handleOpenEditModal}
          actionBtn={handleCreateTask}
          filterBtn={filterBtn}
          meta={allData?.meta || {}}
          actionText={'عميل'}
          dashBoard={true}
          loading={isLoading}
        />
      </div>
    </>
  );
};

export default Customer;
