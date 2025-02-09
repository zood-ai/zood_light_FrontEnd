// routing
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

// helpers
import { changeDocumentDirection } from '@/utils/change-direction'
import moment from '@/moment-config'

// pages
import Login from '@/modules/Auth/Login/Login'
import SignUp from '@/modules/Auth/SignUp/SignUp'

// guardss
import { AuthRoute, AuthRouteLogin, UnAuthRoute } from '@/modules/Auth/ProtectRoute/ProtectRoute'
import InventoryRouters from '@/modules/Inventory/InventoryRoutes'
import InsightsRouters from '@/modules/Insights/InsightsRoutes'
import PurchasesRouters from '@/modules/purchases/PurchaseRoutes'
import TransferRouters from '@/modules/Transfer/TransferRoutes'
import WasteRouters from '@/modules/Waste/WasteRoutes'
import MenuRouters from '@/modules/Menu/MenuRouters'
import POSRouters from '@/modules/POS/POSRoutes'
import SettingsRouters from '@/modules/Settings/SettingsRouter'
import { DEFAULT_INSIGHTS_DATE } from '@/constants/constants'
import SchedullingRouters from '@/modules/Schedulling/SchedullingRouter'
import CentralKitchenRouters from '@/modules/CentralKitchen/CentralKitchenRoutes'
import SetPassword from '@/modules/Auth/SetPassword/SetPassword'
import NotFound from './NotFound'
import MySchedule from '@/modules/Schedulling/mySchedule/MySchedule'

const AppRouter = () => {
  // change to context
  //   const language = useSelector(selectAppLanguage);

  const language = 'en'

  moment.locale(language)
  changeDocumentDirection(language)

  const routerConfig = [
    {
      path: '/',
      element: <AuthRoute />,
      errorElement: <>error</>,
      children: [
        {
          index: true,
          element: <MySchedule/>,
        },
        {
          element: <Navigate to={`/insights/sales?${DEFAULT_INSIGHTS_DATE}`}  />,
        }
        ,
        { path: 'insights', children: InsightsRouters },
        { path: 'schedulling', children: SchedullingRouters },
        { path: 'inventory', children: InventoryRouters },
        { path: 'purchase', children: PurchasesRouters },
        { path: 'waste', children: WasteRouters },
        { path: 'transfer', children: TransferRouters },
        { path: 'menu', children: MenuRouters },
        { path: 'central-kitchen', children: CentralKitchenRouters },
        { path: 'POS', children: POSRouters },
        { path: 'settings', children: SettingsRouters },
      ],
    },
    {
      path: '/login',
      element: <AuthRouteLogin />,
      children: [{ index: true, element: <Login /> }],
    },
    {
      path: '/set-password',
      element: <UnAuthRoute />,
      children: [{ index: true, element: <SetPassword /> }],
    },
    {
      path: '/sign-up',
      element: <UnAuthRoute />,
      children: [{ index: true, element: <SignUp /> }],
    },
    {
      path: '/not-found',
      element: <NotFound/>,
    }
  ]

  const router = createBrowserRouter(routerConfig)

  return <RouterProvider router={router} />
}

export default AppRouter
