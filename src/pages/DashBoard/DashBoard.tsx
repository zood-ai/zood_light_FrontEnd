import { useState, useEffect } from 'react';

import { DashBoardProps } from './DashBoard.types';

import './DashBoard.css';
import DashCards from '@/components/DashCards';
import DashSalesCard from '@/components/DashSalesCard';
import LineChartExample from '@/components/custom/LineChartExample';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { RegisterForm } from '@/components/custom/RegisterForm';
import Loading from '../../components/loader';
import Cookies from 'js-cookie';

export const DashBoard: React.FC<DashBoardProps> = () => {
  const [activeFilter, setActiveFilter] = useState('week');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getStatics() {
      setLoading(true);
      const token = Cookies.get('accessToken');
      const res = await fetch(
        `http://zood.ai/api/v1/reports/overview/light?groupby=${activeFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      setData(data);
      setLoading(false);
    }
    getStatics();
  }, [activeFilter]);

  return (
    <>
      {/* {loading ? (
        <Loading />
      ) : ( */}
        <div>
          <DashCards
            data={data}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            loading={loading}
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
              //   actionBtn={()=>{}}
              filterBtn={() => {}}
            />
          </div>
        </div>
      {/* // )} */}
    </>
  );
};
