import { useEffect } from 'react';
import { useBranch } from '@/context/BranchContext';
import { useQueryClient } from '@tanstack/react-query';

export const useBranchRefresh = () => {
  const { selectedBranch } = useBranch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedBranch) {
      queryClient.invalidateQueries();
    }
  }, [selectedBranch?.id, queryClient]);

  return selectedBranch;
};