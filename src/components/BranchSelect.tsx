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
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';

const BranchSelect = () => {
  const { selectedBranch, branches, setSelectedBranch, isLoading } =
    useBranch();
  const { t } = useTranslation();
  const location = useLocation();
  const queryClient = useQueryClient();

  const reportRoutes = [
    '/zood-dashboard/normal-report',
    '/zood-dashboard/b2b-report',
    '/zood-dashboard/purchase-report',
    '/zood-dashboard/items-report',
    '/zood-dashboard/payment-report',
  ];
  const isReportRoute = reportRoutes.includes(location.pathname);
  const allReportsValue = '__all_reports_branches__';
  const isAllBranchesReports = Cookies.get('report_all_branches') === '1';
  const currentValue =
    isReportRoute && isAllBranchesReports
      ? allReportsValue
      : selectedBranch?.id || '';

  if (isLoading) {
    return <Skeleton className="h-10 w-48" />;
  }

  if (!branches || branches.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentValue}
        onValueChange={(value) => {
          if (isReportRoute && value === allReportsValue) {
            Cookies.set('report_all_branches', '1');
            queryClient.invalidateQueries();
            return;
          }

          Cookies.remove('report_all_branches');
          const branch = branches.find((b) => b.id === value);
          if (branch) {
            setSelectedBranch(branch);
          }
          queryClient.invalidateQueries();
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t('SELECT_BRANCH')} />
        </SelectTrigger>
        <SelectContent>
          {isReportRoute && (
            <SelectItem value={allReportsValue}>
              {t('ALL_BRANCHES')}
            </SelectItem>
          )}
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
