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
import { toggleActionView } from '@/store/slices/toggleAction';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const crudService = createCrudService<any>('menu/products');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  let dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم المنتج'} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="  flex justify-start items-center py-[11.5px] w-[500px]  ">
            <div className="flex justify-start items-center max-w-[79px]">
              <img
                loading="lazy"
                src={row.original.image || placeHolderImg}
                className="object-cover"
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
        <DataTableColumnHeader column={column} title={'السعر'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('price') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'كمية'} />
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
      accessorKey: 'barcode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'الباركود'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('barcode')}
            </span>
          </div>
        );
      },
    },

    // {
    //   accessorKey: 'id',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={'تنفيذ'} />
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
