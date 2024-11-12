import React from 'react';
import UploadIcon from './UploadIcon';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      onFileSelect(files[0]);
      console.log(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      onFileSelect(files[0]);
      console.log(files[0]);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center px-20 py-6 w-full bg-violet-50 rounded border-2 border-dashed border-neutral-200 max-md:px-5 max-md:max-w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col max-w-full w-[214px]">
        <UploadIcon />
        <label htmlFor="fileInput" className="mt-5 cursor-pointer">
          <span className="text-zinc-800">اسحب وضع ملفك هنا</span>
          <span className="text-zinc-800"> او</span> اختر ملف
        </label>
        <input
          id="fileInput"
          type="file"
          className="sr-only hidden"
          onChange={handleFileInput}
          aria-label="اختر ملف للتحميل"
        />
      </div>
    </div>
  );
};

export default UploadArea;