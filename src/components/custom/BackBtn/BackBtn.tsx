import React from 'react';

import { BackBtnProps } from './BackBtn.types';

import './BackBtn.css';
import { useLocation, useNavigate } from 'react-router-dom';

export const BackBtn: React.FC<BackBtnProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      onClick={handleBack}
      className="mb-2 flex items-center justify-between space-y-2 cursor-pointer"
    >
      <div>
        <p className="text-muted-foreground">
          <div className="flex gap-1.5 text-base text-right text-black whitespace-nowrap items-center cursor-pointer">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/194d7b7e5ae3c591091d38a23f5ac39ac72e51ba1a02d111e0defffc4a86b681?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              alt="Back Icon"
              className="object-contain shrink-0 self-start mt-1 w-7 aspect-square"
            />
            <div className="grow">رجوع</div>
          </div>
        </p>
      </div>
    </div>
  );
};
