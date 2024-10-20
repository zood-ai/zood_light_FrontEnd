import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { taskSchema } from '@/pages/tasks/data/schema';
import { IconEdit } from '@tabler/icons-react';
import useDirection from '@/hooks/useDirection';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  handleEdit: any;
  handleDel: any;
}

export function DataTableRowActions<TData>({
  row,
  handleEdit,
  handleDel,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);
  const isRtl = useDirection();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isRtl ? 'start' : 'end'}
        className="w-[160px]"
      >
        <DropdownMenuItem
          style={{
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <IconEdit size={14} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem> */}
        {/* <DropdownMenuItem>Favorite</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          style={{
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleDel();
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <TrashIcon />{' '}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
