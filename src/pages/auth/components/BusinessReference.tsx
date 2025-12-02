export default function BusinessReference({ handleLogIn, number }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md transform animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-[#26262F]">
          تم إنشاء حسابك بنجاح! 🎉
        </h2>

        <p className="text-center text-gray-600 mb-6">
          احتفظ بالرقم التعريفي الخاص بك
        </p>

        {/* Reference Number */}
        <div className="bg-gradient-to-br from-[#7272F6]/10 to-[#5656E8]/10 rounded-xl p-6 mb-6 border-2 border-[#7272F6]/20">
          <label className="block text-sm font-semibold text-gray-600 mb-2 text-center">
            الرقم التعريفي
          </label>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-[#7272F6] tracking-wider font-mono">
              {number}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            سوف تحتاج هذا الرقم عند تسجيل الدخول
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLogIn}
          className="w-full bg-gradient-to-r from-[#7272F6] to-[#5656E8] hover:from-[#5656E8] hover:to-[#7272F6] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>الذهاب لتسجيل الدخول</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
