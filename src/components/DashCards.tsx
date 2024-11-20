function DashCards({ data, activeFilter, setActiveFilter }) {
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const buttonStyles = (filter) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: activeFilter === filter ? 'var(--main)' : '#F5F5F5',
    color: activeFilter === filter ? '#FFF' : '#888',
    cursor: 'pointer',
    border: 'none',
  });

  console.log('DATA FROM DASHCARDS: ', data);
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
                {data?.count_orders}
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
                {data?.count_purchases}
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
