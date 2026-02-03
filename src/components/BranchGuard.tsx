import { ReactNode } from 'react';
import { useBranch } from '@/context/BranchContext';
import { useBranchVisibility } from '@/hooks/useBranchVisibility';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Store } from 'lucide-react';
import BranchSelect from './BranchSelect';

interface BranchGuardProps {
  children: ReactNode;
}

const BranchGuard = ({ children }: BranchGuardProps) => {
  const { selectedBranch, isLoading } = useBranch();
  const { isBranchRequired } = useBranchVisibility();
  const { t } = useTranslation();

  if (!isBranchRequired) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5951C8]"></div>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full shadow-lg border-t-4 border-t-[#5951C8]">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-[#5951C8]/30 p-3 rounded-full mb-4 w-fit">
              <Store className="h-8 w-8 text-[#5951C8]" />
            </div>
            <CardTitle className="text-xl text-[#5951C8]">
              {t('SELECT_BRANCH')}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t('PLEASE_SELECT_BRANCH_TO_CONTINUE')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-2 pb-8" />
        </Card>
      </div>
    );
  }
  return <>{children}</>;
};

export default BranchGuard;
