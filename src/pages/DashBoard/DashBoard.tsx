import React from 'react';

import { DashBoardProps } from './DashBoard.types';

import './DashBoard.css';
import DashCards from '@/components/DashCards';
import DashSalesCard from '@/components/DashSalesCard';
import LineChartExample from '@/components/custom/LineChartExample';
import { DataTable } from '@/components/custom/DataTableComp/data-table';
import { RegisterForm } from '@/components/custom/RegisterForm';


export const DashBoard: React.FC<DashBoardProps> = () => {
  return (
    <div>
      <DashCards />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8 bg-blacka">
        <LineChartExample />
        <DashSalesCard />
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
  );
};
