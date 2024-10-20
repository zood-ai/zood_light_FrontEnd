import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import addImg from '/images/image.png';
import pdfImg from '/images/pdfImg.png';
import { Button } from './button';

// Define the type for files with preview URL
interface FilePreview extends File {
  preview: string;
}

// Define styles for the preview component
const styles = {
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto', // Enable horizontal scrolling
    whiteSpace: 'nowrap', // Prevent wrapping
    marginTop: 16,
    padding: '0 8px', // Optional: add some padding
    // height: 120, // Set a fixed height to control the container height
  } as React.CSSProperties,
  thumb: {
    position: 'relative', // Add relative position to the thumb for positioning the delete button
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    minWidth: 100, // Fixed width for each image
    maxWidth: 100,
    height: 100, // Fixed height for each image
    padding: 4,
    boxSizing: 'border-box', // Ensure correct type for boxSizing
    overflow: 'hidden', // Hide overflow to prevent content spilling out
  } as React.CSSProperties,
  thumbInner: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: 0,
    overflow: 'hidden',
  } as React.CSSProperties,
  img: {
    display: 'block',
    width: '100%', // Make image fill the container
    height: '100%', // Make image fill the container
    objectFit: 'fill', // Maintain aspect ratio while covering the container
  } as React.CSSProperties,
  deleteButton: {
    position: 'absolute', // Position the delete button in the top-right corner
    top: -5,
    right: -5,
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: 20,
    height: 20,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
};

// Define the props for the Previews component
interface PreviewsProps {
  initialFiles?: (FilePreview | { preview: string })[];
  onFilesChange: (files: FilePreview[]) => void;
}

const Previews: React.FC<PreviewsProps> = ({
  initialFiles = [],
  onFilesChange,
}) => {
  const [files, setFiles] = useState<FilePreview[]>(
    initialFiles as FilePreview[]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map(
        (file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }) as FilePreview
      );
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    },
  });

  // Update files when initialFiles prop changes (for edit mode)
  useEffect(() => {
    setFiles(initialFiles as FilePreview[]);
  }, [initialFiles]);

  // Clean up object URLs when files change or component unmounts
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  // Handle removing a file
  const handleRemoveFile = useCallback(
    (index: number) => {
      // Revoke the object URL of the file being removed
      URL.revokeObjectURL(files[index].preview);

      // Remove the file from the array
      const updatedFiles = files.filter((_, i) => i !== index);

      // Update the state with the remaining files
      setFiles(updatedFiles);

      // Trigger the onFilesChange callback with the updated files
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  // const thumbs = useMemo(
  //   () =>
  //     files.map((file, index) => (
  //       <div style={styles.thumb} key={file.name || index}>
  //         <button
  //           style={styles.deleteButton}
  //           type='button' // Ensure the button doesn't trigger form submission
  //           onClick={(e) => {
  //             e.stopPropagation()
  //             handleRemoveFile(index)
  //           }}
  //         >
  //           ×
  //         </button>
  //         <div style={styles.thumbInner}>
  //           <img
  //             src={file.preview || String(file)}
  //             style={styles.img}
  //             alt={file.name}
  //             onLoad={() => URL.revokeObjectURL(file.preview)} // Revoke the URL after it's loaded
  //           />
  //         </div>
  //       </div>
  //     )),
  //   [files, handleRemoveFile]
  // )
  const thumbs = useMemo(
    () =>
      files.map((file, index) => (
        <div style={styles.thumb} key={file.name || index}>
          <button
            style={styles.deleteButton}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile(index);
            }}
          >
            ×
          </button>
          <div style={styles.thumbInner}>
            {file.type === 'application/pdf' ? (
              // Render PDF preview
              <img
                src={pdfImg}
                style={styles.img}
                alt={file.name}
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
            ) : (
              <img
                src={file.preview || String(file)}
                style={styles.img}
                alt={file.name}
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
            )}
          </div>
        </div>
      )),
    [files, handleRemoveFile]
  );

  return (
    <section className="container cursor-pointer rounded-lg border-2a border-dasheda border-gray-300a">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="text-center ">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            <img className="mx-auto h-[323px] w-[377px] " src={addImg} />
            {/* <label htmlFor='file-upload' className='relative cursor-pointer'>
              <span className='text-muted-foreground'>Drag and drop</span>
              <span className='text-indigo-600'> or browse </span>
              <span className='text-muted-foreground'>to upload</span>
            </label> */}
          </h3>
          {/* <p className='mt-1 text-xs text-muted-foreground'>
            PNG, JPG, GIF up to 10MB
          </p> */}
          <Button className='w-full mt-lg' variant={'outline'}>

            upload Image
          </Button>
        </div>
      </div>
      <aside
        style={styles.thumbsContainer}
        className={`${thumbs.length > 0 ? 'flex h-[120px]' : 'hidden h-0'}`}
      >
        {thumbs}
      </aside>
    </section>
  );
};

export default Previews;
