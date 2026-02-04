import { useBranch } from '@/context/BranchContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

const BranchSelect = () => {
  const { selectedBranch, branches, setSelectedBranch, isLoading } =
    useBranch();
  const { t } = useTranslation();

  if (isLoading) {
    return <Skeleton className="h-10 w-48" />;
  }

  if (!branches || branches.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedBranch?.id || ''}
        onValueChange={(value) => {
          const branch = branches.find((b) => b.id === value);
          if (branch) {
            setSelectedBranch(branch);
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t('SELECT_BRANCH')} />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelect;
