import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { QRCodeCompProps } from './QRCodeComp.types';

import './QRCodeComp.css';
import { Buffer } from 'buffer';
import QRCode from 'qrcode';

const encodeZATCA = (
  sellerName,
  vatNumber,
  invoiceDate,
  totalAmount,
  vatAmount
) => {
  const encodeField = (tag, value) => {
    const valueBytes = Buffer.from(value, 'utf-8');
    return Buffer.concat([
      Buffer.from([tag]),
      Buffer.from([valueBytes.byteLength]), // Use byteLength
      valueBytes,
    ]);
  };

  const sellerNameField = encodeField(1, sellerName);
  const vatNumberField = encodeField(2, vatNumber);
  const invoiceDateField = encodeField(3, invoiceDate);
  const totalAmountField = encodeField(4, totalAmount);
  const vatAmountField = encodeField(5, vatAmount);

  // Combine all fields
  const encodedData = Buffer.concat([
    sellerNameField,
    vatNumberField,
    invoiceDateField,
    totalAmountField,
    vatAmountField,
  ]);

  return encodedData.toString('base64');
};

export const QRCodeComp: React.FC<QRCodeCompProps> = ({
  settings,
  Data,
}: any) => {
  const data = useSelector((state: any) => state.toggleAction.data);
  const sellerName = String(settings?.data?.business_name || '');
  const vatNumber = String(settings?.data?.business_tax_number || '');
  const invoiceDate = String(data?.business_date || new Date().toISOString()); // Use ISO 8601 formatx
  const totalAmount = String(
    `${
      (data?.type === 'Purchasing'
        ? Data?.data?.items
            ?.reduce((sum, item) => sum + item?.pivot?.total_cost, 0)
            ?.toFixed(2)
        : Data?.data?.total_price?.toFixed(2)) || '0.00'
    }`
  );
  const vatAmount = String(
    `${data?.tax_exclusive_discount_amount?.toFixed(2) || '0.00'}`
  );
  const [qrCodeData, setQRCodeData] = useState('/icons/ParCode.webp');
  const [backednQrCodeData, setBackednQRCodeData] = useState('');

  useEffect(() => {
    const encodedData = encodeZATCA(
      sellerName,
      vatNumber,
      invoiceDate,
      totalAmount,
      vatAmount
    );

    if (Data?.data?.qrcode)
      QRCode.toDataURL(Data?.data?.qrcode)
        .then((url) => setBackednQRCodeData(url))
        .catch((err) => console.error(err));
    QRCode.toDataURL(encodedData)
      .then((url) => setQRCodeData(url))
      .catch((err) => console.error(err));
  }, [settings, data, Data]);
  return Data?.data?.qrcode ? (
    <img
      loading="lazy"
      src={backednQrCodeData}
      alt="ZATCA QR Code"
      className="object-contain aspect-square w-[100px] h-[100px]"
    />
  ) : (
    <img
      loading="lazy"
      src={qrCodeData}
      alt="ZATCA QR Code"
      className="object-contain aspect-square w-[100px] h-[100px]"
    />
  );
};
