import React from 'react';

import { CardIconProps } from './CardIcon.types';

import { Link } from 'react-router-dom'

import './CardIcon.css';

export const CardIcon = ({ imgSrc, title, textClass, iconClass }) => (
    <div className="flex flex-col px-4 py-5 bg-white rounded-xl border border-gray-200 border-solid max-md:flex-grow md:w-[219px] md:h-[121px]">
      <div className="flex gap-5 justify-between text-xl font-semibold text-right whitespace-nowrap text-slate-700">
        <div className="my-auto whitespace-pre-line break-words">{title}</div>
        <img
          loading="lazy"
          src={imgSrc}
          className="object-contain shrink-0 aspect-square w-[60px]"
        />
      </div>
      <div
        className={`flex items-start self-start mt-1.5 text-sm font-medium text-center ${textClass}`}
      >
        <Link to="/zood-login" className="self-stretch pe-xs">رؤية المزيد</Link>
        {[
          'https://cdn.builder.io/api/v1/image/assets/TEMP/534d8309b19d0cb8a56175db53968c8d0ab8e88fcd1f55c10807c26ce58bb129?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e',
          'https://cdn.builder.io/api/v1/image/assets/TEMP/534d8309b19d0cb8a56175db53968c8d0ab8e88fcd1f55c10807c26ce58bb129?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e',
        ].map((icon, index) => (
          <img
            key={index}
            loading="lazy"
            src={icon}
            className={`object-contain shrink-0 mt-1.5 w-1.5 aspect-[0.6] ${iconClass}`}
          />
        ))}
      </div>
    </div>
  );
  
