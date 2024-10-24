import React from 'react';

import { ResourcesProps } from './Resources.types';

import './Resources.css';
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

export const Resources: React.FC<ResourcesProps> = () => {
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
    navigate('/individual-invoices/add');
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
  };
  const filterBtn = () => {
    console.log('filterBtn');
  };
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const { columns } = useDataTableColumns();
  const allService = createCrudService<any>('inventory/suppliers');
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  console.log(allData, 'allData');

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
        isOpen={isViewModalOpen}
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
           data={allData?.data || []}
           columns={columns}
           handleEdit={handleOpenEditModal}
           actionBtn={handleCreateTask}
           filterBtn={filterBtn}
           meta={allData || {}}
           actionText={'مورد'}
           loading={isLoading}
        />
      </div>
    </>
  );
};
