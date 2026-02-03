import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';

import { Permissions, rolePermissions } from '@/config/roles.ts';
import React, { lazy } from 'react';
import ProtectedRoute from './config/ProtectedRoute.tsx';
import { Roles } from './config/roles.ts';
import DashCards from './components/DashCards.tsx';
import { IndividualInvoicesReport } from './pages/Reports/PurchaseInvoices/index.ts';
import { PaymentMethods } from './pages/PaymentMethods/index.ts';
import { PaymentMethodsAdd } from './pages/PaymentMethods/ResourcesAdd/index.ts';
import { FastInvoiceAdd } from './pages/FastInvoice/ShopCard/index.ts';
import { FastInvoice } from './pages/FastInvoice/index.ts';
import Plans from './pages/Plans/Plans.tsx';
import UserProfile from './pages/UserProfile/UserProfile.tsx';
import { ShopCardEdit } from './pages/IndividualInvoices/ShopCard/ShopCardEdit.tsx';
import { CorporateInvoices } from './pages/CorporateInvoices/index.ts';
import { ShopCardCo } from './pages/CorporateInvoices/ShopCard/index.ts';
import { ShopCardEditCo } from './pages/CorporateInvoices/ShopCard/ShopCardEdit.tsx';
import { CorporateInvoicesAdd } from './pages/FastInvoice/CorporateInvoicesAdd/CorporateInvoicesAdd.tsx';
import { PriceQuote } from './pages/PriceQuote/index.ts';
import { PriceQuoteAdd } from './pages/PriceQuote/IndividualInvoicesAdd/index.ts';
import { ShopCardPQ } from './pages/PriceQuote/ShopCard/ShopCard.tsx';
import { ShopCardEditPQ } from './pages/PriceQuote/ShopCard/ShopCardEdit.tsx';
import Customer from './pages/Customers/Customer.tsx';
import Users from './pages/users/page.tsx';
import UsersAdd from './pages/users/Add/page.tsx';
import Branches from './pages/Branches/page.tsx';
import BranchesAdd from './pages/Branches/Add/page.tsx';
import RolesAndPermissions from './pages/Roles/page.tsx';
import RolesAndPermissionsAdd from './pages/Roles/Add/page.tsx';

const MaintenanceError = lazy(() => import('./pages/errors/maintenance-error'));
const UnauthorisedError = lazy(
  () => import('./pages/errors/unauthorised-error.tsx')
);
const SignIn2 = lazy(() => import('./pages/auth/sign-in-2.tsx'));
const SignUp = lazy(() => import('./pages/auth/sign-up.tsx'));
const DashBoard = lazy(() =>
  import('./pages/DashBoard/DashBoard.tsx').then((module) => ({
    default: module.DashBoard,
  }))
);
const B2BInvoice = lazy(() =>
  import('./pages/Reports/B2BInvoice/B2BInvoice.tsx').then((module) => ({
    default: module.B2BInvoice,
  }))
);
const IndividualInvoices = lazy(() =>
  import('./pages/IndividualInvoices/IndividualInvoices.tsx').then(
    (module) => ({ default: module.IndividualInvoices })
  )
);
const IndividualInvoicesAdd = lazy(() =>
  import(
    './pages/IndividualInvoices/IndividualInvoicesAdd/IndividualInvoicesAdd.tsx'
  ).then((module) => ({ default: module.IndividualInvoicesAdd }))
);

const PurchaseInvoices = lazy(() =>
  import('./pages/PurchaseInvoices/PurchaseInvoices.tsx').then((module) => ({
    default: module.PurchaseInvoices,
  }))
);
const PurchaseInvoicesAdd = lazy(() =>
  import(
    './pages/PurchaseInvoices/PurchaseInvoicesAdd/PurchaseInvoicesAdd.tsx'
  ).then((module) => ({ default: module.PurchaseInvoicesAdd }))
);

const Products = lazy(() =>
  import('./pages/Products/Products.tsx').then((module) => ({
    default: module.Products,
  }))
);
const Categories = lazy(() =>
  import('./pages/Categories/Categories.tsx').then((module) => ({
    default: module.Categories,
  }))
);
const Customers = lazy(() =>
  import('./pages/Customers/Customers.tsx').then((module) => ({
    default: module.Customers,
  }))
);
// const Customer = lazy(() =>
//   import('./pages/Customers/Customer.tsx').then((module) => ({
//     default: module.Customer,
//   }))
// );
const Resources = lazy(() =>
  import('./pages/Resources/Resources.tsx').then((module) => ({
    default: module.Resources,
  }))
);
const ResourcesAdd = lazy(() =>
  import('./pages/Resources/ResourcesAdd/ResourcesAdd.tsx').then((module) => ({
    default: module.ResourcesAdd,
  }))
);
const CustomersAdd = lazy(() =>
  import('./pages/Customers/CustomersAdd/CustomersAdd.tsx').then((module) => ({
    default: module.CustomersAdd,
  }))
);
const CategoriesAdd = lazy(() =>
  import('./pages/Categories/CategoriesAdd/CategoriesAdd.tsx').then(
    (module) => ({ default: module.CategoriesAdd })
  )
);
const ProductsAdd = lazy(() =>
  import('./pages/Products/ProductsAdd/ProductsAdd.tsx').then((module) => ({
    default: module.ProductsAdd,
  }))
);
const RegisterForm = lazy(() =>
  import('./components/custom/RegisterForm/RegisterForm.tsx').then(
    (module) => ({ default: module.RegisterForm })
  )
);
const LoginForm = lazy(() =>
  import('./components/custom/LoginForm/LoginForm.tsx').then((module) => ({
    default: module.LoginForm,
  }))
);
const ShopCard = lazy(() =>
  import('./pages/IndividualInvoices/ShopCard/ShopCard.tsx').then((module) => ({
    default: module.ShopCard,
  }))
);

const NormalVoiceReport = lazy(() =>
  import('./pages/NormalVoice/NormalVoice.tsx').then((module) => ({
    default: module.NormalVoiceReport,
  }))
);

const SignIn = React.lazy(() => import('./pages/auth/sign-in'));
const AppShell = React.lazy(() => import('./components/app-shell'));
const Tasks = React.lazy(() => import('./pages/tasks/index.tsx'));

const ComingSoon = React.lazy(() => import('@/components/coming-soon'));

const Settings = React.lazy(() => import('./pages/settings'));
const Profile = React.lazy(() => import('./pages/settings/profile'));
const Account = React.lazy(() => import('./pages/settings/account'));
const Appearance = React.lazy(() => import('./pages/settings/appearance'));
const Notifications = React.lazy(
  () => import('./pages/settings/notifications')
);
const Display = React.lazy(() => import('./pages/settings/display'));
const ErrorExample = React.lazy(() => import('./pages/settings/error-example'));

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/active-account-asdahkljasldmaskldjaklsjdlajskldjaaksdasdasdsmdkasjdk',
    lazy: async () => ({
      Component: (await import('./pages/ActiveAccount/ActiveAccount.tsx'))
        .default,
    }),
  },
  {
    path: '/reset-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/reset-password.tsx')).default,
    }),
  },
  // {
  //   path: '/sign-in-2',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-in-2')).default,
  //   }),
  // },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password.tsx')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/',
    element: (
      <React.Suspense fallback={<div>Loading register...</div>}>
        <RegisterForm />
      </React.Suspense>
    ),
  },
  {
    path: 'zood-login',
    element: (
      <React.Suspense fallback={<div>Loading register...</div>}>
        <SignIn2 />
      </React.Suspense>
    ),
  },
  {
    path: 'zood-signup',
    element: (
      <React.Suspense fallback={<div>Loading register...</div>}>
        <SignUp />
      </React.Suspense>
    ),
  },
  // {
  //   path: 'zood-reset-password',
  //   element: (
  //     <React.Suspense fallback={<div>Loading register...</div>}>
  //       <SignUp />
  //     </React.Suspense>
  //   ),
  // },
  // Main routes
  {
    path: '/zood-dashboard',
    element: (
      <ProtectedRoute requiredPermissions={[]}>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading Dashboard...</div>}>
            <ProtectedRoute requiredPermissions={[]}>
              <DashBoard />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <React.Suspense
            fallback={
              <div className="invoice-loader">
                <div className="loaderFallBk"></div>
              </div>
            }
          >
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.USERS]}>
              <Users />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'users/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.USERS]}>
              <UsersAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'branches',
        element: (
          <React.Suspense
            fallback={
              <div className="invoice-loader">
                <div className="loaderFallBk"></div>
              </div>
            }
          >
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.BRANCHES]}
            >
              <Branches />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'branches/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.BRANCHES]}
            >
              <BranchesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'roles-and-permissions',
        element: (
          <React.Suspense
            fallback={
              <div className="invoice-loader">
                <div className="loaderFallBk"></div>
              </div>
            }
          >
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.SETTINGS]}
            >
              <RolesAndPermissions />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'roles-and-permissions/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.SETTINGS]}
            >
              <RolesAndPermissionsAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'individual-invoices',
        element: (
          <React.Suspense
            fallback={
              <div className="invoice-loader">
                <div className="loaderFallBk"></div>
              </div>
            }
          >
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <IndividualInvoices />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'individual-invoices/add',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <IndividualInvoicesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'individual-invoices/add/shop-card',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCard />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'individual-invoices/edit/:id',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCardEdit />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <CorporateInvoices />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices/add',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCardCo />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices/add/shop-card',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCardCo />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices/edit/:id',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCardEditCo />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'my-plan',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.SETTINGS]}
            >
              <Plans />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.SETTINGS]}
            >
              <UserProfile />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },

      {
        path: 'purchase-invoices',
        element: (
          <React.Suspense fallback={<div>Loading Purchase Invoices...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.PURCHASING]}
            >
              <PurchaseInvoices />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'purchase-invoices/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading Purchase Invoices...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.PURCHASING]}
            >
              <PurchaseInvoicesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'price-quote',
        element: (
          <React.Suspense fallback={<div>Loading Price Quote...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <PriceQuote />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'price-quote/add',
        element: (
          <React.Suspense fallback={<div>Loading Price Quote...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCardPQ />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'customer-profile/:id',
        element: (
          <React.Suspense fallback={<div>Loading Customers...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.CUSTOMERS]}
            >
              <Customer />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'price-quote/edit/:id',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <ShopCardEditPQ />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <React.Suspense fallback={<div>Loading Products...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.INVENTORY]}
            >
              <Products />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'products/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading Products...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.INVENTORY]}
            >
              <ProductsAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <React.Suspense fallback={<div>Loading Categories...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.INVENTORY]}
            >
              <Categories />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'categories/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading Categories...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.INVENTORY]}
            >
              <CategoriesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'customers',
        element: (
          <React.Suspense fallback={<div>Loading Customers...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.CUSTOMERS]}
            >
              <Customers />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },

      {
        path: 'customers/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading Customers...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.CUSTOMERS]}
            >
              <CustomersAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'resources',
        element: (
          <React.Suspense fallback={<div>Loading Resources...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.INVENTORY]}
            >
              <Resources />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'resources/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading Resources...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.INVENTORY]}
            >
              <ResourcesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },

      {
        path: 'normal-report',
        element: (
          <React.Suspense fallback={<div>Loading My Plan...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <NormalVoiceReport />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'b2b-report',
        element: (
          <React.Suspense fallback={<div>Loading My Plan...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <B2BInvoice />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'purchase-report',
        element: (
          <React.Suspense fallback={<div>Loading My Plan...</div>}>
            <ProtectedRoute requiredPermissions={rolePermissions[Roles.ORDERS]}>
              <IndividualInvoicesReport />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'payment-methods',
        element: (
          <React.Suspense fallback={<div>Loading Payment Methods...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.PAYMENT_METHODS]}
            >
              <PaymentMethods />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'payment-methods/:id/:objId?',
        element: (
          <React.Suspense fallback={<div>Loading Payment Methods...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.PAYMENT_METHODS]}
            >
              <PaymentMethodsAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <React.Suspense fallback={<div>Loading Settings...</div>}>
            <ProtectedRoute
              requiredPermissions={rolePermissions[Roles.SETTINGS]}
            >
              <Settings />
            </ProtectedRoute>
          </React.Suspense>
        ),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>Loading Profile...</div>}>
                <Profile />
              </React.Suspense>
            ),
          },
          {
            path: 'account',
            element: (
              <React.Suspense fallback={<div>Loading Account...</div>}>
                <Account />
              </React.Suspense>
            ),
          },
          {
            path: 'appearance',
            element: (
              <React.Suspense fallback={<div>Loading Appearance...</div>}>
                <Appearance />
              </React.Suspense>
            ),
          },
          {
            path: 'notifications',
            element: (
              <React.Suspense fallback={<div>Loading Notifications...</div>}>
                <Notifications />
              </React.Suspense>
            ),
          },
          {
            path: 'display',
            element: (
              <React.Suspense fallback={<div>Loading Display...</div>}>
                <Display />
              </React.Suspense>
            ),
          },
          {
            path: 'error-example',
            element: (
              <React.Suspense fallback={<div>Loading Error Example...</div>}>
                <ErrorExample />
              </React.Suspense>
            ),
            errorElement: <GeneralError className="h-[50svh]" minimal />,
          },
        ],
      },
      {
        path: 'contact-whatsapp',
        element: (
          <React.Suspense fallback={<div>Loading WhatsApp Contact...</div>}>
            <ProtectedRoute requiredPermissions={[]}>
              <ComingSoon />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'logout',
        element: <ComingSoon />,
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
]);

export default router;
