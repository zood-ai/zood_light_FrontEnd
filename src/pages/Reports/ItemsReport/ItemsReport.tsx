import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/custom/DataTableComp/data-table';
import axiosInstance from '@/api/interceptors';

import { ItemsReportProps } from './ItemsReport.types';
import { useDataTableColumns } from './components/useDataTableColumns';

export const ItemsReport: React.FC<ItemsReportProps> = () => {
  const { t } = useTranslation();
  const { columns } = useDataTableColumns();

  const BASE_URL = 'orders?per_page=100000&sort=-business_date';
  const [allUrl, setAllUrl] = useState(BASE_URL);
  const [loading, setLoading] = useState(false);
  const [allSoldItems, setAllSoldItems] = useState<any[]>([]);
  const [searchedData, setSearchedData] = useState<any>({
    data: [],
    meta: {},
  });
  const [dateQuery, setDateQuery] = useState('');

  const filterItems = (items: any[] = [], keyword: string) => {
    if (!keyword?.trim()) return items;
    const normalizedLower = keyword.toLowerCase();
    return items.filter((item: any) => {
      const skuMatch = String(item?.sku || '')
        .toLowerCase()
        .includes(normalizedLower);
      const nameMatch = String(item?.name || '')
        .toLowerCase()
        .includes(normalizedLower);
      return skuMatch || nameMatch;
    });
  };

  const buildMeta = (count: number) => ({
    current_page: 1,
    last_page: 1,
    per_page: count,
    total: count,
  });

  const aggregateSoldItems = (orders: any[] = []) => {
    const soldMap = new Map<string, any>();

    orders.forEach((order: any) => {
      const orderItems = Array.isArray(order?.items)
        ? order.items
        : Array.isArray(order?.order_items)
          ? order.order_items
          : [];

      orderItems.forEach((item: any) => {
        const key = String(
          item?.product_id ||
            item?.menu_product_id ||
            item?.id ||
            item?.sku ||
            item?.name ||
            Math.random()
        );
        const quantity = Number(item?.quantity || item?.qty || 0);
        const unitPrice = Number(item?.price || item?.unit_price || 0);
        const lineTotal = Number(item?.total_price || item?.total || quantity * unitPrice);
        const current = soldMap.get(key);

        if (current) {
          current.quantity_sold += quantity;
          current.total_sales += lineTotal;
          return;
        }

        soldMap.set(key, {
          id: key,
          name: item?.name || item?.product?.name || '-',
          sku: item?.sku || item?.product?.sku || '-',
          quantity_sold: quantity,
          total_sales: lineTotal,
        });
      });
    });

    return Array.from(soldMap.values()).sort(
      (a: any, b: any) => b.quantity_sold - a.quantity_sold
    );
  };

  const fetchSoldItems = async (nextDateQuery = '') => {
    setLoading(true);
    const candidateUrls = [
      `orders?filter[status]=4&per_page=100000&sort=-business_date${nextDateQuery}`,
      `orders?filter[type]=1&per_page=100000&sort=-business_date${nextDateQuery}`,
      `orders?filter[type]=2&per_page=100000&sort=-business_date${nextDateQuery}`,
      `${BASE_URL}${nextDateQuery}`,
    ];

    let lastUsedUrl = candidateUrls[candidateUrls.length - 1];
    try {
      let aggregated: any[] = [];

      for (const candidateUrl of candidateUrls) {
        lastUsedUrl = candidateUrl;
        const res = await axiosInstance.get(`/${candidateUrl}`);
        const orders = Array.isArray(res?.data?.data) ? res.data.data : [];
        aggregated = aggregateSoldItems(orders);
        if (aggregated.length > 0) break;
      }

      setAllUrl(lastUsedUrl);
      setAllSoldItems(aggregated);
      setSearchedData({
        data: aggregated,
        meta: buildMeta(aggregated.length),
      });
      return aggregated;
    } catch {
      setAllSoldItems([]);
      setSearchedData({
        data: [],
        meta: buildMeta(0),
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldItems();
  }, []);

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
        const nextItems = await fetchSoldItems(nextDateQuery);
        const filteredAfterFetch = filterItems(nextItems, normalizedSearchTerm);
        setSearchedData({
          data: filteredAfterFetch,
          meta: buildMeta(filteredAfterFetch.length),
        });
        return;
      }

      const filtered = filterItems(allSoldItems, normalizedSearchTerm);
      setSearchedData({
        data: filtered,
        meta: buildMeta(filtered.length),
      });
    }, 300),
    [allSoldItems, dateQuery]
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
          loading={loading}
          handleSearch={handleSearch}
          searchPlaceholder={t('SEARCH_SOLD_ITEMS_PLACEHOLDER')}
        />
      </div>
    </>
  );
};
