import { useState, useEffect } from 'react';
//data={data} activeFilter={activeFilter} setActiveFilter={setActiveFilter} loading={loading}
function DashCards({ data, activeFilter, setActiveFilter, loading }) {
  // const [activeFilter, setActiveFilter] = useState('week');
  // const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]);
  // useEffect(
  //   function () {
  //     async function getStatics() {
  //       setLoading(true);
  //       const res = await fetch(
  //         `http://zood.ai/api/v1/reports/overview/light?groupby=${activeFilter}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vem9vZC5haS9hcGkvdjEvYXV0aC9Mb2dpbiIsImlhdCI6MTcyOTY4MTI4MiwiZXhwIjo2OTEzNjgxMjgyLCJuYmYiOjE3Mjk2ODEyODIsImp0aSI6ImpCZ2M1bmVKazM3STJaRWwiLCJzdWIiOiJiZjIwNGU3ZS0zMWUwLTQwZjEtYWFjMy0xN2ZmZGNhZjNhNWIiLCJwcnYiOiIwOWNmNDk1YzM0NzRhMDIwNjExZDA0YWEwMjJiZDM1MWMxYmIwY2NhIn0.LcA4qkfXknBRPjxe04gzJ9kBpew5LMlFSdgr66AUVEo`, // تأكد من استبدال YOUR_TOKEN_HERE بالتوكن الفعلي
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       setData(data);
  //       setLoading(false);
  //     }
  //     getStatics();
  //   },
  //   [activeFilter]
  // );
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const buttonStyles = (filter) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: activeFilter === filter ? '#7D3C98' : '#F5F5F5', // بنفسجي عند التفعيل، وأبيض غامق عند عدم التفعيل
    color: activeFilter === filter ? '#FFF' : '#888', // لون الكلام جراي عند عدم التفعيل
    cursor: 'pointer',
    border: 'none',
  });
  return (
    <>
      <div className="flex gap-4">
        <button
          style={buttonStyles('day')}
          onClick={() => handleFilterClick('day')}
        >
          يوم
        </button>
        <button
          style={buttonStyles('week')}
          onClick={() => handleFilterClick('week')}
        >
          اسبوع
        </button>
        <button
          style={buttonStyles('month')}
          onClick={() => handleFilterClick('month')}
        >
          شهر
        </button>
      </div>
      <div className="flex flex-wrap gap-4 rounded-none text-slate-600 mt-4">
        <div className="flex flex-col whitespace-nowrap rounded-none max-w-[245px] text-slate-600 w-[245px] h-[98px]">
          <div className="flex gap-5 justify-between p-4 w-full bg-white rounded-lg border border-gray-200 border-solid">
            <div className="flex flex-col">
              <div className="self-start ml-3 text-base font-medium text-right">
                الفواتير
              </div>
              <div className="mt-2 text-3xl font-semibold">
                {data?.data?.count_orders}
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e7e756ba344c37862f6dfc6cd6af50f4759d5c464b6ef634ddb32fc8a54c2d0?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 my-auto aspect-[0.74] w-[35px]"
            />
          </div>
        </div>
        <div className="flex flex-col whitespace-nowrap rounded-none max-w-[245px] text-slate-600 w-[245px] h-[98px]">
          <div className="flex gap-5 justify-between p-4 w-full bg-white rounded-lg border border-gray-200 border-solid">
            <div className="flex flex-col">
              <div className="self-start ml-3 text-base font-medium text-right">
                المشتريات
              </div>
              <div className="mt-2 text-3xl font-semibold">
                {data?.data?.count_purchases}
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e7e756ba344c37862f6dfc6cd6af50f4759d5c464b6ef634ddb32fc8a54c2d0?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 my-auto aspect-[0.74] w-[35px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashCards;
