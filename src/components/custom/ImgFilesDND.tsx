import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import placeHolderImg from '/images/image.png';
import { Button } from './button';

interface FilePreview extends File {
  preview: string;
}

interface PreviewsProps {
  initialFile?: any; // Expect base64 string
  onFileChange?: any;
}

const Previews: React.FC<any> = ({ initialFile, onFileChange }:any) => {
  const [file, setFile] = useState<any>('');
  const [base64Image, setBase64Image] = useState<string | null>(
    initialFile || null
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1, // Only accept one file
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return; // No file selected

      const file = acceptedFiles[0];

      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onFileChange(base64String); // Pass base64 to parent
        setBase64Image(base64String); // Update state with the new image
        setFile(base64String);
      };
    },
  });

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.preview); // Clean up object URL
    };
  }, [file]);

  const handleRemoveFile = useCallback(() => {
    if (file) URL.revokeObjectURL(file.preview); // Revoke object URL
    setFile(null);
    setBase64Image(null); // Reset base64 image
    onFileChange(null);
  }, [file, onFileChange]);

  return (
    <section className="container cursor-pointer rounded-lg ">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            <img
              className="mx-auto h-[323px] w-[377px]"
              src={initialFile || base64Image || file?.preview || placeHolderImg} // Prioritize base64, then file, then placeholder
            />
          </h3>
          <Button type="button" className="w-full mt-lg" variant="outlineMain">
            Upload Image
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Previews;
