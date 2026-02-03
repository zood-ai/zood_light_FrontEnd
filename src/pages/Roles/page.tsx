import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { DetailsModal } from './Modal/DetailsModal';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { ConfirmDelModal } from './Modal/ConfirmDelModal';
import AddEditModal from './Modal/AddEditModal';
import { useTranslation } from 'react-i18next';
import { useRolesDataTable } from './useRolesDataTable';
import useDirection from '@/hooks/useDirection';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { toggleActionView } from '@/store/slices/toggleAction';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/api/interceptors';

const Roles: React.FC = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateRole = () => {
    setModalType('Add');
    navigate('add');
  };

  const handleOpenViewModal = (row: any) => {
    setSelectedRow(row);
    dispatch(toggleActionView(true));
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
  const { columns } = useRolesDataTable();

  const [allUrl, setAllUrl] = useState('hr/roles');
  const allService = createCrudService<any>('hr/roles');
  const { useGetAll } = allService;
  const { data: rolesData, isLoading } = useGetAll();
  const toggleActionData = useSelector((state: any) => state?.toggleAction);

  const [searchedData, setSearchedData] = useState({});
  console.log({ hh: rolesData?.data });

  useEffect(() => {
    setSearchedData(rolesData?.data);
  }, [rolesData]);

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
          setSearchedData(rolesData?.data);
          return;
        }
        setAllUrl(`hr/roles?${date}`);
        const res = await axiosInstance.get(`hr/roles?${date}`);
        setSearchedData(res.data?.data);
        return;
      }

      setAllUrl(`hr/roles?filter[name]=${searchTerm}${date}`);
      const res = await axiosInstance.get(
        `hr/roles?filter[name]=${searchTerm}${date}`
      );
      setSearchedData(res.data?.data);
    }, 300),
    [rolesData]
  );

  const handleSearch = (e: string, date: string) => {
    handleDebounce(e, date);
  };

  console.log({ searchedData });
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
          actionBtn={handleCreateRole}
          filterBtn={filterBtn}
          meta={{
            current_page: searchedData?.current_page,
            last_page: searchedData?.last_page,
            per_page: searchedData?.per_page,
            total: searchedData?.total,
          }}
          actionText={'ADD_ROLE'}
          loading={isLoading}
          handleSearch={handleSearch}
        />
      </div>
    </>
  );
};

export default Roles;
