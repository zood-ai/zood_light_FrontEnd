import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { DetailsModal } from './Modal/DetailsModal';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { ConfirmDelModal } from './Modal/ConfirmDelModal';
import AddEditModal from './Modal/AddEditModal';
import { useTranslation } from 'react-i18next';
import { useUsersDataTable } from './useUsersDataTable';
import useDirection from '@/hooks/useDirection';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { toggleActionView } from '@/store/slices/toggleAction';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/api/interceptors';

const Users: React.FC = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateUser = () => {
    setModalType('Add');
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

  const filterBtn = () => {
    // Add filter logic here
  };

  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const { columns } = useUsersDataTable();

  const [allUrl, setAllUrl] = useState('auth/users');
  const allService = createCrudService<any>('auth/users');
  const { useGetAll } = allService;
  const { data: usersData, isLoading } = useGetAll();
  const toggleActionData = useSelector((state: any) => state?.toggleAction);

  const [searchedData, setSearchedData] = useState({});

  useEffect(() => {
    setSearchedData(usersData);
  }, [usersData]);

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
          setSearchedData(usersData);
          return;
        }
        setAllUrl(`auth/users?${date}`);
        const res = await axiosInstance.get(`auth/users?${date}`);
        setSearchedData(res.data);
        return;
      }

      setAllUrl(`auth/users?filter[name]=${searchTerm}${date}`);
      const res = await axiosInstance.get(`auth/users?filter[name]=${searchTerm}${date}`);
      setSearchedData(res.data);
    }, 300),
    [usersData]
  );

  const handleSearch = (e: string, date: string) => {
    handleDebounce(e, date);
  };

  return (
    <>
      <AddEditModal
        initialData={modalType === 'Add' ? {} : selectedTableRow}
        isOpen={isAddEditModalOpen}
        onClose={() => handleCloseModal()}
        modalType={modalType}
      />
      <DetailsModal
        initialData={selectedTableRow}
        isOpen={toggleActionData.value}
        onClose={handleCloseModal}
      />
      {/* <ConfirmDelModal
        initialData={selectedTableRow}
        isOpen={isDelModalOpen}
        onClose={handleCloseModal}
      /> */}

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          allUrl={allUrl}
          handleDel={handleOpenDeleteModal}
          handleRowClick={handleOpenViewModal}
          data={searchedData?.data || []}
          columns={columns}
          handleEdit={handleOpenEditModal}
          actionBtn={handleCreateUser}
          filterBtn={filterBtn}
          meta={searchedData?.meta || {}}
          actionText={'ADD_USER'}
          loading={isLoading}
          handleSearch={handleSearch}
        />
      </div>
    </>
  );
};

export default Users;
