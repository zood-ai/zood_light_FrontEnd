import React, { useState } from 'react';

import { BackBtnProps } from './BackBtn.types';

import './BackBtn.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetOrder } from '@/store/slices/orderSchema';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';

export const BackBtn: React.FC<BackBtnProps> = ({ bkAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isRtl = useDirection();

  const handleBack = () => {
    navigate(-1);
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mb-2 flex items-center justify-between space-y-2 cursor-pointer w-max">
      <div>
        <p className="text-muted-foreground">
          <div
            onClick={(e) => {
              e.stopPropagation();
              bkAction ? bkAction() : handleBack();
            }}
            className="flex   gap-1.5 text-base text-right text-black whitespace-nowrap items-center cursor-pointer"
          >
            <div
            style={{
              rotate: !isRtl ? '180deg' : '0deg',
            }}
              // className="bg-black p-1.5 rounded-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {!isHovered ? (
                <>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.0002 25.6666C20.4435 25.6666 25.6668 20.4432 25.6668 13.9999C25.6668 7.5566 20.4435 2.33325 14.0002 2.33325C7.55684 2.33325 2.3335 7.5566 2.3335 13.9999C2.3335 20.4432 7.55684 25.6666 14.0002 25.6666Z"
                      stroke="#363088"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 18.6666L18.6667 13.9999L14 9.33325"
                      stroke="#363088"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.3335 14H18.6668"
                      stroke="#363088"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.0002 25.6666C20.4435 25.6666 25.6668 20.4432 25.6668 13.9999C25.6668 7.5566 20.4435 2.33325 14.0002 2.33325C7.55684 2.33325 2.3335 7.5566 2.3335 13.9999C2.3335 20.4432 7.55684 25.6666 14.0002 25.6666Z"
                      fill="#363088"
                      stroke="#363088"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 18.6666L18.6667 13.9999L14 9.33325"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.3335 14H18.6668"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </>
              )}
            </div>

            <div className="grow">{t('RETURN')}</div>
          </div>
        </p>
      </div>
    </div>
  );
};
