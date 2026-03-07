import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/custom/DataTableComp/data-table';
import axiosInstance from '@/api/interceptors';
import createCrudService from '@/api/services/crudService';

import { PaymentsReportProps } from './PaymentsReport.types';
import { useDataTableColumns } from './components/useDataTableColumns';

type ApiOrder = {
  id?: string;
  business_date?: string;
  created_at?: string;
  payments?: Array<{
    amount?: number;
    payment_method_id?: string;
    payment_method?: {
      id?: string;
      name?: string;
    };
  }>;
};

type GroupedPaymentRow = {
  id: string;
  payment_method_name: string;
  total_amount: number;
  payments_count: number;
  orders_count: number;
  last_payment_date: string;
};

const toTimestamp = (value?: string) => {
  const dateValue = value ? new Date(value).getTime() : 0;
  return Number.isFinite(dateValue) ? dateValue : 0;
};

const buildGroupedRows = (orders: ApiOrder[] = []) => {
  const groupedMap = new Map<
    string,
    GroupedPaymentRow & { orderIds: Set<string> }
  >();

  orders.forEach((order) => {
    const orderDate = order?.business_date || order?.created_at || '';
    const orderId = String(order?.id || '');

    (order?.payments || []).forEach((payment, paymentIndex) => {
      const paymentMethodName = payment?.payment_method?.name || '-';
      const paymentMethodId =
        payment?.payment_method?.id ||
        payment?.payment_method_id ||
        paymentMethodName ||
        `unknown-${paymentIndex}`;
      const amount = Number(payment?.amount || 0);
      const mapKey = String(paymentMethodId);
      const existing = groupedMap.get(mapKey);

      if (existing) {
        existing.total_amount += amount;
        existing.payments_count += 1;
        if (orderId) {
          existing.orderIds.add(orderId);
        }
        if (toTimestamp(orderDate) > toTimestamp(existing.last_payment_date)) {
          existing.last_payment_date = orderDate;
        }
        return;
      }

      groupedMap.set(mapKey, {
        id: mapKey,
        payment_method_name: paymentMethodName,
        total_amount: amount,
        payments_count: 1,
        orders_count: orderId ? 1 : 0,
        last_payment_date: orderDate,
        orderIds: orderId ? new Set([orderId]) : new Set<string>(),
      });
    });
  });

  const groupedRows = Array.from(groupedMap.values()).map((row) => ({
    id: row.id,
    payment_method_name: row.payment_method_name,
    total_amount: row.total_amount,
    payments_count: row.payments_count,
    orders_count: row.orderIds.size,
    last_payment_date: row.last_payment_date,
  }));

  groupedRows.sort((a, b) => b.total_amount - a.total_amount);
  return groupedRows;
};

const normalizeGroupedResponse = (apiResponse: any) => {
  const rows = buildGroupedRows(apiResponse?.data || []);
  return {
    data: rows,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: rows.length,
      total: rows.length,
    },
  };
};

export const PaymentsReport: React.FC<PaymentsReportProps> = () => {
  const { t } = useTranslation();
  const { columns } = useDataTableColumns();

  const [allUrl, setAllUrl] = useState('orders?filter[status]=4&sort=-created_at');
  const allService = createCrudService<any>(allUrl);
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();

  const [searchedData, setSearchedData] = useState<any>({
    data: [],
    meta: {},
  });

  useEffect(() => {
    setSearchedData(normalizeGroupedResponse(allData));
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
      const normalizedSearchTerm = searchTerm?.trim() || '';
      const dateQuery = date || '';

      if (!normalizedSearchTerm && !dateQuery) {
        setAllUrl('orders?filter[status]=4&sort=-created_at');
        setSearchedData(normalizeGroupedResponse(allData));
        return;
      }
      const nextUrl = `orders?filter[status]=4&sort=-created_at${dateQuery}`;
      setAllUrl(nextUrl);

      const res = await axiosInstance.get(`/${nextUrl}`);
      const groupedResponse = normalizeGroupedResponse(res?.data);
      const filteredRows = normalizedSearchTerm
        ? groupedResponse.data.filter((row: GroupedPaymentRow) =>
            row.payment_method_name
              ?.toLowerCase()
              .includes(normalizedSearchTerm.toLowerCase())
          )
        : groupedResponse.data;

      setSearchedData({
        data: filteredRows,
        meta: {
          ...groupedResponse.meta,
          per_page: filteredRows.length,
          total: filteredRows.length,
        },
      });
    }, 300),
    [allData]
  );

  const handleSearch = (searchTerm: string, date: string) => {
    handleDebounce(searchTerm, date);
  };

  return (
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
        searchPlaceholder={t('SEARCH_PAYMENT_REPORT_PLACEHOLDER')}
      />
    </div>
  );
};
