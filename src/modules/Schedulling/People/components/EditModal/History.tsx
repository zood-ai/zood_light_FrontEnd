const History = () => {
  return (
    <>
      <p className="font-bold mb-[16px]">Employee history</p>

      <div className="flex items-center gap-5">
        <div className="bg-[#F0F5F9] p-3 rounded-full">
          <img src={"../../src/assets/money.png"} height={20} width={20} />
        </div>
        <div>
          <div className="text-[#777777]">
            Visa type change from to{" "}
            <span className="font-bold text-black">Pre-settled</span>
          </div>
          <div className="text-[#9A9FA6]">
            pavlo parfenuik on{" "}
            <span className="font-bold"> 09/04/2024, 15:24</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
