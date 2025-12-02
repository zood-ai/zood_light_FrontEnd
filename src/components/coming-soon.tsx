// import { IconPlanet } from '@tabler/icons-react';

// export default function ComingSoon() {
//   return (
//     // <div className='h-svh'>
//     //   <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
//     //     <IconPlanet size={72} />
//     //     <h1 className='text-4xl font-bold leading-tight'>Coming Soon 👀</h1>
//     //     <p className='text-center text-muted-foreground'>
//     //       This page has not been created yet. <br />
//     //       Stay tuned though!
//     //     </p>
//     //   </div>
//     // </div>
//     <div>
//       <a
//         href={https://wa.me/+201080925119}
//         target="_blank"
//         className="flex gap-2 cursor-pointer w-[20%] px-5 py-3 bg-green-500 rounded-lg"
//       >
//         <div className="grow my-auto text-white text-xl">تواصل عبر الواتس</div>
//         <img
//           loading="lazy"
//           src="https://cdn.builder.io/api/v1/image/assets/TEMP/3769057990693e0194a9bacc9caa2588cf42c25f2fe1a813eeab42095ea7745e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
//           className="object-contain shrink-0 w-6 aspect-square"
//         />
//       </a>
//     </div>
//   );
// }

import { IconPlanet } from '@tabler/icons-react';

export default function ComingSoon() {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-2xl max-w-lg">
        <IconPlanet size={72} className="text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl lg:text-2xl font-extrabold leading-tight mb-5 text-gray-800">
          لو عندك اي استفسار او سؤال
          <br></br>
          <br></br>
          تواصل معنا
        </h1>

        <a
          href={`https://wa.me/+966551164271`}
          target="_blank"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 rounded-full text-white text-xl hover:bg-green-600 transition duration-300"
        >
          <span>تواصل عبر الواتس</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3769057990693e0194a9bacc9caa2588cf42c25f2fe1a813eeab42095ea7745e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
            className="object-contain w-6 h-6"
            alt="WhatsApp"
          />
        </a>
      </div>
    </div>
  );
}
