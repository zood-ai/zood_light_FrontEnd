import { useLocation } from 'react-router-dom';

// Pages where branch select should be visible
const BRANCH_VISIBLE_ROUTES = [
  '/zood-dashboard', // Dashboard
  '/zood-dashboard/individual-invoices', // Point of Sale
  '/zood-dashboard/corporate-invoices', // Corporate
  '/zood-dashboard/purchase-invoices', // Purchase
  '/zood-dashboard/price-quote', // Price Quote
  '/zood-dashboard/normal-report', // Reports
  '/zood-dashboard/b2b-report',
  '/zood-dashboard/purchase-report',
];

// Pages where branch selection is required (user cannot access without selecting branch)
const BRANCH_REQUIRED_ROUTES = [
  '/zood-dashboard', // Dashboard
  '/zood-dashboard/individual-invoices', // Point of Sale
  '/zood-dashboard/corporate-invoices', // Corporate
  '/zood-dashboard/purchase-invoices', // Purchase
  '/zood-dashboard/price-quote', // Price Quote
];

export const useBranchVisibility = () => {
  const location = useLocation();

  const shouldShowBranchSelect = !!BRANCH_VISIBLE_ROUTES.find(
    (route) => location.pathname === route
  );

  const isBranchRequired = !!BRANCH_REQUIRED_ROUTES.find(
    (route) => location.pathname === route
  );

  return {
    shouldShowBranchSelect,
    isBranchRequired,
  };
};
