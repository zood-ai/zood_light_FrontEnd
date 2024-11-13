import useDirection from '@/hooks/useDirection';

function DashSalesCard({ data }) {
  const isRtl = useDirection();
  console.log(data, 'a');
  const totalRevent = data?.data?.sum_orders.reduce(
    (sum, item) => sum + item.value,
    0
  );
  console.log(totalRevent);
  return (
    <>
      <div className={`flex flex-col rounded-none `}>
        <div
          className={`flex gap-5 justify-start py-6 ${
            isRtl ? 'pl-3.5 pr-10a' : 'pr-3.5 pl-10'
          } w-full bg-white rounded-lg border border-gray-200 border-solid relative bg-`}
        >
          <div className="absolute inset-0  right-[90%] top-auto bottom-auto ml-aauto">
            <div className=" flex flex-col max-w-[15px] rounded-[40px]">
              <div className="flex flex-col pt-9 w-full bg-violet-200 rounded-[40px]">
                <div className="flex w-full bg-indigo-900 min-h-[98px] rounded-[40px]" />
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col self-start pt-9 bg-violet-200 rounded-[40px]`}
          >
            <div className="flex shrink-0 bg-indigo-900 h-[98px] rounded-[40px]" />
          </div>
          <div className="flex flex-col relative">
            <div
              className={`flex flex-col ${
                isRtl ? 'pl-1.5 pr-0' : 'pr-1.5 pl-6'
              } mt-6`}
            >
              <div className="self-start text-base font-semibold text-zinc-800">
                اجمالي المبيعات
              </div>
              <div
                className={`self-start mt-2.5 text-2xl font-bold text-indigo-900 ${
                  isRtl ? 'text-left' : 'text-right'
                }`}
              >
                SR {totalRevent?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* المنتصف */}

        <div className="flex flex-col py-7 mt-4 w-full text-base bg-white rounded-lg border border-gray-200 border-solid text-zinc-800">
          <div
            className={`flex flex-col px-3.5 w-full ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            {data?.data?.sum_orders?.map((item) => (
              <>
                <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                  <div className="flex gap-3 font-medium whitespace-nowrap">
                    <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-indigo-900 rounded-full" />
                    <div>{item.date}</div>
                  </div>
                  <div className="font-semibold">
                    SR {item.value.toFixed(2)}
                  </div>
                </div>
                <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashSalesCard;
