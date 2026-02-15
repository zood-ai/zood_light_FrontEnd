import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/custom/DataTableComp/data-table';
import axiosInstance from '@/api/interceptors';

import { ItemsReportProps } from './ItemsReport.types';
import { useDataTableColumns } from './components/useDataTableColumns';
import createCrudService from '@/api/services/crudService';
import { useSearchParams } from 'react-router-dom';

export const ItemsReport: React.FC<ItemsReportProps> = () => {
  const { t } = useTranslation();
  const { columns } = useDataTableColumns();
  const [searchParams] = useSearchParams();
  const BASE_URL = `menu/products?not_default=1&sort=-created_at&filter[category_id]=${searchParams.get('category_id')}`;
  const [allUrl, setAllUrl] = useState(BASE_URL);
  const allService = createCrudService<any>(allUrl);
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();

  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>({
    data: [],
    meta: {},
  });
  const [dateQuery, setDateQuery] = useState('');

  useEffect(() => {
    setSearchedData(allData);
  }, [allData]);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleDebounce = useCallback(
    debounce(async (searchTerm: string, date: string) => {
      const nextDateQuery = date || '';
      const normalizedSearchTerm = searchTerm?.trim() || '';

      if (nextDateQuery !== dateQuery) {
        setDateQuery(nextDateQuery);
        setAllUrl(
          `menu/products?not_default=1&sort=-created_at${nextDateQuery}`
        );
        const res = await axiosInstance.get(
          `/menu/products?not_default=1&sort=-created_at${nextDateQuery}`
        );
        setSearchedData({
          data: res?.data?.data,
          meta: res?.data?.meta,
        });
      }

      if (normalizedSearchTerm) {
        const encodedSearchTerm = encodeURIComponent(normalizedSearchTerm);
        const searchUrl = `menu/products?not_default=1&sort=-created_at&filter[name]=${encodedSearchTerm}${date}`;
        setAllUrl(searchUrl);

        const res = await axiosInstance.get(`/${searchUrl}`);
        setSearchedData({
          data: res?.data?.data,
          meta: res?.data?.meta,
        });
        return;
      }

      return;
    }, 300),
    [dateQuery]
  );

  const handleSearch = (searchTerm: string, date: string) => {
    handleDebounce(searchTerm, date);
  };

  return (
    <>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          allUrl={allUrl}
          handleDel={() => {}}
          handleRowClick={() => {}}
          data={searchedData?.data || []}
          columns={columns}
          handleEdit={() => {}}
          filterBtn={() => {}}
          meta={searchedData?.meta || {}}
          dashBoard={true}
          loading={isLoading}
          handleSearch={handleSearch}
          searchPlaceholder={t('SEARCH_SOLD_ITEMS_PLACEHOLDER')}
        />
      </div>
    </>
  );
};
