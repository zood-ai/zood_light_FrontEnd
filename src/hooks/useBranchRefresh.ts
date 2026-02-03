import { useEffect } from 'react';
import { useBranch } from '@/context/BranchContext';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to refresh data when branch changes
 * This will invalidate all queries when the selected branch changes
 */
export const useBranchRefresh = () => {
  const { selectedBranch } = useBranch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedBranch) {
      // Invalidate all queries to refetch data for the new branch
      queryClient.invalidateQueries();
    }
  }, [selectedBranch?.id, queryClient]);

  return selectedBranch;
};