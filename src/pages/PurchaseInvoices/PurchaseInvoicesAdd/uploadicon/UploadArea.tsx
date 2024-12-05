import React, { useRef } from 'react';
import UploadIcon from './UploadIcon';
import { useTranslation } from 'react-i18next';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onClick={() => ref.current?.click()}
      className="cursor-pointer flex flex-col justify-center items-center px-20 py-6 w-full bg-violet-50 rounded border-2 border-dashed border-neutral-200 max-md:px-5 max-md:max-w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col max-w-full w-fit">
        <UploadIcon />
        <label htmlFor="fileInput" className="mt-5 cursor-pointer">
          <span className="text-zinc-800">{t('DRAG_AND_DROP')}</span>
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="sr-only hidden"
          onChange={handleFileInput}
          ref={ref}
          aria-label="اختر ملف للتحميل"
        />
      </div>
    </div>
  );
};

export default UploadArea;
