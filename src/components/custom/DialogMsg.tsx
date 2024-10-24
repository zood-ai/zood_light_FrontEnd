const DialogMsg = () => {
  return (
    <>
      <div className="flex flex-col px-2 pt-10 pb-4 bg-white rounded-lg border border-gray-200 border-solid w-[458px] shadow-[0px_4px_19px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col w-full min-h-[193px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2307b5bde0fd2da47cdb66d2b720e54cd356e51edc5f5e3aaa400f66fbcb1e9c?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
            className="object-contain self-center aspect-square w-[78px]"
          />
          <div className="flex flex-col mt-5 w-full">
            <div className="text-base font-medium text-center text-zinc-800">
              تم اضافة الفاتورة بنجاح
            </div>
            <div className="flex flex-col mt-6 w-full text-sm font-semibold text-right text-white whitespace-nowrap rounded">
              <div className="px-16 py-2 bg-green-500 rounded">حسنا!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DialogMsg;
