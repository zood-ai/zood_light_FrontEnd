// import { useState, useEffect } from 'react';

// import { DashBoardProps } from './DashBoard.types';

// import './DashBoard.css';
// import DashCards from '@/components/DashCards';
// import DashSalesCard from '@/components/DashSalesCard';
// import LineChartExample from '@/components/custom/LineChartExample';
// import { DataTable } from '@/components/custom/DataTableComp/data-table';
// import { RegisterForm } from '@/components/custom/RegisterForm';
// import Loading from '../../components/loader';
// import Cookies from 'js-cookie';
// import createCrudService from '@/api/services/crudService';

// export const DashBoard: React.FC<DashBoardProps> = () => {
//   const [activeFilter, setActiveFilter] = useState('week');
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function getStatics() {
//       const { data: data, isLoading } = createCrudService<any>(
//         `/reports/overview/light?groupby=${activeFilter}`
//       ).useGetAll();
//       console.log(data);
//       setLoading(isLoading);
//       setData(data.data);
//     }
//     getStatics();
//   }, [activeFilter]);

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <>
//           <div>
//             <DashCards
//               data={data}
//               activeFilter={activeFilter}
//               setActiveFilter={setActiveFilter}
//               loading={loading}
//             />
//             <div className="grid grid-cols-1 md:grid-cols-3 mt-8 bg-blacka">
//               <LineChartExample data={data} />
//               <DashSalesCard data={data} />
//             </div>
//             <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
//               <DataTable
//                 handleDel={() => {}}
//                 handleRowClick={() => {}}
//                 data={[]}
//                 columns={[]}
//                 handleEdit={() => {}}
//                 //   actionBtn={()=>{}}
//                 filterBtn={() => {}}
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

import { useState } from 'react';

import { DashBoardProps } from './DashBoard.types';

import './DashBoard.css';
import DashCards from '@/components/DashCards';
import DashSalesCard from '@/components/DashSalesCard';
import LineChartExample from '@/components/custom/LineChartExample';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { RegisterForm } from '@/components/custom/RegisterForm';
import Loading from '../../components/loader';
import Cookies from 'js-cookie';
import createCrudService from '@/api/services/crudService';

export const DashBoard: React.FC<DashBoardProps> = () => {
  const [activeFilter, setActiveFilter] = useState('week');

  // Call useGetAll directly here
  const { data: apiData, isLoading } = createCrudService<any>(
    `/reports/overview/light?groupby=${activeFilter}`
  ).useGetAll();

  const data = apiData?.data || [];
  //console.log('DATA: ', data);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <DashCards
              data={data}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8 bg-blacka">
              <LineChartExample data={data} />
              <DashSalesCard data={data} />
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
              <DataTable
                handleDel={() => {}}
                handleRowClick={() => {}}
                data={[]}
                columns={[]}
                handleEdit={() => {}}
                filterBtn={() => {}}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};