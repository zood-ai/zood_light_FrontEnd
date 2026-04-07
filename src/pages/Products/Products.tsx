import React from 'react';

import { ProductsProps } from './Products.types';

import './Products.css';
import { tasks } from './data/tasks';
import { useState, useEffect, useCallback } from 'react';
import { DetailsModal } from './Modal/DetailsModal';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { ConfirmDelModal } from './Modal/ConfirmDelModal';
import AddEditModal from './Modal/AddEditModal';
import { useTranslation } from 'react-i18next';
import { useDataTableColumns } from './components/useDataTableColumns';
import useDirection from '@/hooks/useDirection';
import { useNavigate, useSearchParams } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { toggleActionView } from '@/store/slices/toggleAction';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/api/interceptors';

export const Products: React.FC<ProductsProps> = () => {
  const [isAddEditModalOpen, setIsAddEditOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedTableRow, setSelectedRow] = useState({});
  const [modalType, setModalType] = useState('Add');
  const navigate = useNavigate();
  let dispatch = useDispatch();
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
  const [searchParams] = useSearchParams();
  const isRtl = useDirection();
  const { columns } = useDataTableColumns();
  const allService = createCrudService<any>(
    searchParams.get('category_id')
      ? `menu/products?not_default=1&sort=-created_at&filter[category_id]=${searchParams.get('category_id')}`
      : 'menu/products?not_default=1&sort=-created_at'
  );
  const [allUrl, setAllUrl] = useState(
    searchParams.get('category_id')
      ? `menu/products?not_default=1&sort=-created_at&filter[category_id]=${searchParams.get('category_id')}`
      : 'menu/products?not_default=1&sort=-created_at'
  );

  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const toggleActionData = useSelector((state: any) => state?.toggleAction);
  const [searchedData, setSearchedData] = useState({});
  useEffect(() => {
    setSearchedData(allData);
  }, [allData]);

  const mergeProductsById = (a: any[] = [], b: any[] = []) => {
    const map = new Map<string | number, any>();
    for (const item of a) {
      if (item?.id != null) map.set(item.id, item);
    }
    for (const item of b) {
      if (item?.id != null) map.set(item.id, item);
    }
    return [...map.values()];
  };

  const filterProductsLocal = (products: any[] = [], keyword: string) => {
    const k = keyword.toLowerCase();
    return products.filter((item: any) => {
      const name = String(item?.name || '').toLowerCase();
      const nameLoc = String(item?.name_localized || '').toLowerCase();
      const sku = String(item?.sku || '').toLowerCase();
      return name.includes(k) || nameLoc.includes(k) || sku.includes(k);
    });
  };

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const handleDebounce = useCallback(
    debounce(async (searchTerm: string, date: string) => {
      const normalizedSearchTerm = searchTerm?.trim();

      if (!normalizedSearchTerm) {
        if (!date) {
          setSearchedData(allData); // Reset if search is cleared
          return;
        }

        setAllUrl(
          searchParams.get('category_id')
            ? `menu/products?not_default=1&sort=-created_at&filter[category_id]=${searchParams.get('category_id')}${date}`
            : `menu/products?not_default=1&sort=-created_at${date}`
        );
        const res = await axiosInstance.get(
          searchParams.get('category_id')
            ? `menu/products?not_default=1&sort=-created_at&filter[category_id]=${searchParams.get('category_id')}${date}`
            : `menu/products?not_default=1&sort=-created_at${date}`
        );

        setSearchedData(res.data);
        return;
      }

      const encodedSearchTerm = encodeURIComponent(normalizedSearchTerm);
      const categoryId = searchParams.get('category_id');
      const base =
        categoryId != null
          ? `menu/products?not_default=1&sort=-created_at&filter[category_id]=${categoryId}${date}`
          : `menu/products?not_default=1&sort=-created_at${date}`;
      const nameUrl = `${base}&filter[name]=${encodedSearchTerm}`;
      const skuUrl = `${base}&filter[sku]=${encodedSearchTerm}`;
      setAllUrl(nameUrl);

      try {
        const [nameSettled, skuSettled] = await Promise.allSettled([
          axiosInstance.get(`/${nameUrl}`),
          axiosInstance.get(`/${skuUrl}`),
        ]);
        const namePayload =
          nameSettled.status === 'fulfilled'
            ? nameSettled.value.data
            : { data: [], meta: {} };
        const skuPayload =
          skuSettled.status === 'fulfilled'
            ? skuSettled.value.data
            : { data: [], meta: {} };
        const merged = mergeProductsById(
          namePayload?.data || [],
          skuPayload?.data || []
        );
        const basePayload =
          (namePayload?.data?.length ?? 0) > 0 ? namePayload : skuPayload;
        setSearchedData({
          ...basePayload,
          data: merged,
          meta: namePayload?.meta || skuPayload?.meta || {},
        });
      } catch {
        const holder = filterProductsLocal(
          allData?.data || [],
          normalizedSearchTerm
        );
        setSearchedData({ ...allData, data: holder });
      }
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
          meta={searchedData?.meta || {}}
          actionText={'ADD_PRODUCT'}
          loading={isLoading}
          handleSearch={handleSearch}
          searchPlaceholder={t('PRODUCTS_SEARCH_PLACEHOLDER')}
        />
      </div>
    </>
  );
};
