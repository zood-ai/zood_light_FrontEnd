import React from 'react';

import { QRCodeCompProps } from './QRCodeComp.types';

import './QRCodeComp.css';

export const QRCodeComp: React.FC<QRCodeCompProps> = () => {
  return (
    <div className="flex flex-col rounded-none max-w-[80px]">
      <div className="flex flex-col justify-center px-3.5 py-2.5 w-full bg-white rounded-lg border border-gray-200 border-solid">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/83cf35b594a7c48cc0275f4169bf27502a5fdf4400f9a85d32861b04c3d6fda5?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
          className="object-contain aspect-square w-[84px]"
        />
      </div>
    </div>
  );
};
