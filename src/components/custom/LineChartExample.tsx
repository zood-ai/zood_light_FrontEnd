import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LineChartExample = ({ data }) => {
  const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-black bg-opacity-70 text-white p-2 rounded-lg text-sm font-bold shadow-lg">
          <p>{`Sales Value: ${value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="col-span-1 md:col-span-2 w-[120%] md:w-[100%] h-[400px]">
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <BarChart
          data={data?.data?.sum_orders}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* Set X-axis to display 'date' */}
          <XAxis
            dataKey="date"
            padding={{ left: 10, right: 10 }}
            // label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
          />

          {/* Set Y-axis to display 'value' */}
          <YAxis
            // label={{ value: 'Sales Value', angle: 90, position: 'insideLeft' }}
            tickMargin={50}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Set Bar to use 'value' as dataKey for Y-axis values */}
          <Bar dataKey="value" fill="#312E81" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartExample;
