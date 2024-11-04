import React from 'react';
import UploadArea from './UploadArea';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  return (
    <section className="flex flex-col text-sm font-medium text-right text-indigo-900 rounded-none max-w-[499px]">
      <UploadArea onFileSelect={onFileSelect} />
    </section>
  );
};

export default FileUpload;