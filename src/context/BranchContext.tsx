import {
  useContext,
  useState,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { updateField } from '@/store/slices/orderSchema';
import axiosInstance from '@/api/interceptors';

interface Branch {
  id: string;
  name: string;
}

interface BranchContextType {
  selectedBranch: Branch | null;
  branches: Branch[];
  setSelectedBranch: (branch: Branch) => void;
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(
    null
  );
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('manage/branches');
        const branchData = response.data;

        if (branchData?.data) {
          setBranches(branchData.data);

           const savedBranchId = Cookies.get('branch_id');
          
          if (savedBranchId) {
            const savedBranch = branchData.data.find(
              (branch: Branch) => branch.id === savedBranchId
            );
            if (savedBranch) {
              setSelectedBranchState(savedBranch);
              dispatch(
                updateField({
                  field: 'branch_id',
                  value: savedBranch.id,
                })
              );
            }
          }
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBranches();
  }, [dispatch]);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    Cookies.set('branch_id', branch.id);

     dispatch(
      updateField({
        field: 'branch_id',
        value: branch.id,
      })
    );
  };

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        branches,
        setSelectedBranch,
        isLoading,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
