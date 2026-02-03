import { ReactNode } from 'react';
import { useBranch } from '@/context/BranchContext';
import { useBranchVisibility } from '@/hooks/useBranchVisibility';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface BranchGuardProps {
  children: ReactNode;
}

const BranchGuard = ({ children }: BranchGuardProps) => {
  const { selectedBranch, isLoading } = useBranch();
  const { isBranchRequired } = useBranchVisibility();
  const { t } = useTranslation();

  // If branch is not required for this route, render children
  if (!isBranchRequired) {
    return <>{children}</>;
  }

  // If still loading branches, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no branch is selected, show warning
  if (!selectedBranch) {
    return (
      <div className="p-6">
        <Alert className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-center">
            {t('PLEASE_SELECT_BRANCH_TO_CONTINUE')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Branch is selected, render children
  return <>{children}</>;
};

export default BranchGuard;