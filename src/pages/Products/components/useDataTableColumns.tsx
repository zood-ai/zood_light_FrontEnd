// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import placeHolderImg from '/images/image.png';
import createCrudService from '@/api/services/crudService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { currencyFormated } from '../../../utils/currencyFormated';
import Barcode from 'react-barcode';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const crudService = createCrudService<any>('menu/products?not_default=1');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  let dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PRODUCT_NAME')} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="  flex justify-start items-center py-[11.5px] w-[500px]  ">
            <div className="flex justify-start items-center max-w-[79px]">
              <img
                loading="lazy"
                src={row.original.image || placeHolderImg}
                className="size-[50px]"
                alt="placeholder"
              />
            </div>
            <div className="ms-[20px]">{row.getValue('name')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PRICE')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {currencyFormated(row.getValue('price')) || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('CURRENT_QUANTITY')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('quantity') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('CATEGORY_NAME')} />
      ),
      cell: ({ row }: any) => {
        const categoryName =
          row?.original?.category?.name_localized ||
          row?.original?.category?.name ||
          '-';

        return (
          <div className="flex items-center">
            <span className="max-w-[170px] truncate font-medium">
              {categoryName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'sku',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('BARCODE')} />
      ),
      cell: ({ row }) => {
        const sku = row.getValue('sku') as string;
        const barcodeValue = String(sku || '').trim();
        const barcodeWidth = Math.max(
          0.45,
          Math.min(1.2, 16 / Math.max(barcodeValue.length, 1))
        );

        return (
          <div className="flex min-h-[44px] w-[280px] items-center py-1">
            {barcodeValue ? (
              <div className="flex h-[92px] w-[250px] flex-col items-center justify-center gap-1 overflow-hidden rounded-md border bg-white px-3 py-2 shadow-sm">
                <Barcode
                  value={barcodeValue}
                  format="CODE128"
                  height={36}
                  width={barcodeWidth}
                  margin={0}
                  displayValue={false}
                  background="transparent"
                />
                <span className="max-w-[220px] truncate text-[11px] font-semibold tracking-[0.1em] text-muted-foreground">
                  {barcodeValue}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium">-</span>
            )}
          </div>
        );
      },
    },

    // {
    //   accessorKey: 'id',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('INVOICE')} />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex space-x-2 w-[180px] md:w-auto">
    //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
    //         <div className="flex gap-4 text-sm font-bold text-right ">
    //           {' '}
    //           <Button
    //             type="button"
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               dispatch(toggleActionView(true));
    // dispatch(toggleActionViewData(row.original));
    //             }}
    //             className="ps-0"
    //             variant={'linkHover'}
    //           >
    //             رؤية الفاتورة
    //           </Button>
    //         </div>
    //       </div>
    //     );
    //   },
    // },
  ];

  return { columns };
};
