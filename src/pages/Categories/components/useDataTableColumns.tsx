// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleActionView } from '@/store/slices/toggleAction';
import placeHolderImg from '/images/image.png';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const crudService = createCrudService<any>('menu/categories');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  let dispatch = useDispatch();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم المنتج'} />
      ),
      cell: ({ row }:any) => {
         

        return (
          <div className="  flex justify-start items-center py-[11.5px] w-[500px]  ">
            <div className="flex justify-start items-center max-w-[79px]">
              <img
                loading="lazy"
                src={row.original.image ||placeHolderImg}
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
      accessorKey: 'products',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'مجموع الاصناف'} />
      ),
      cell: ({ row }) => {
         

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('products') || '-'}
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
