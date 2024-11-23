export default function BusinessReference({ handleLogIn,number }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-400/20 backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-bold text-center mb-4">الرقم التعريفي</h2>
        <p className="text-center text-gray-700 text-xl">{number}</p>
        <button onClick={handleLogIn} className="mt-6 w-full bg-[#7f7ff0] hover:bg-[#4d4df0] text-white py-2 rounded-md">
          الذهاب لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}
