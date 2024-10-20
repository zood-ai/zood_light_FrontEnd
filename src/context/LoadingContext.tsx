import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

let setLoadingGlobal: (loading: boolean) => void;

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  
  // Assign the setLoading function globally
  setLoadingGlobal = setLoading;

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Function to be used outside of components (e.g., Axios interceptors)
export const setGlobalLoading = (loading: boolean) => {
  if (setLoadingGlobal) {
    setLoadingGlobal(loading);
  }
};
