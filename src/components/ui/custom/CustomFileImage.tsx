import FileImage from "@/assets/icons/FileImage";
import { useState, ChangeEvent, DragEvent, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const CustomFileImage = ({
  fileParam,
  defaultValue,
  title = "Drop your image here, or",
  description = " Supports: PNG, JPG, JPEG, WEBP",
  extenstion = "image/*",
  fileCheck = false,
  handleRest,
  className
}: {
  fileParam: string;
  defaultValue?: string;
  title?: string;
  description?: string;
  extenstion?: string;
  fileCheck?: boolean;
  handleRest?: () => void;
  className?: string;
}) => {
  const { setValue, getValues, watch } = useFormContext();
  const [file, setFile] = useState<any>("");
  const [name, setName] = useState<string>("");
  const [target, setTraget] = useState<string>("");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileCheck) {
      const selectedFile = event.target.files?.[0]; // Get the first file

      if (selectedFile) {
        setName(selectedFile.name); // Set file name
        setFile(selectedFile); // Store the file in state
        setValue(fileParam, selectedFile, { shouldValidate: true }); // Set the form value for this file
      }
    } else {
      const file = event.target.files?.[0];

      setName(event.target.files?.[0]?.name ?? "");
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setValue(`${fileParam}`, reader.result, { shouldValidate: true });
          setFile(reader.result as string);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (fileCheck) {
      const selectedFile = event.dataTransfer.files?.[0]; // Get the first file

      if (selectedFile) {
        setName(selectedFile.name); // Set file name
        setFile(selectedFile); // Store the file in state
        setValue(fileParam, selectedFile, { shouldValidate: true }); // Set the form value for this file
      }
    } else {
      const file = event.dataTransfer.files[0];
      setName(event.dataTransfer.files?.[0]?.name ?? "");
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setValue(`${fileParam}`, reader.result, { shouldValidate: true });
          setFile(reader.result as string);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    setFile(defaultValue);
    setValue('file', defaultValue);
  }, [defaultValue]);

  return (
    <div className={className}>
      <div>
        {name?.length || file?.length ? (
          <>
            <div className=" text-[#35393f] mb-5 flex justify-end">
              <div
                className="border-2 px-3 py-1  rounded-full cursor-pointer "
                onClick={() => {
                  setName("");
                  setFile(undefined);
                  handleRest?.();
                  setTraget("");
                }}
              >
                X
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <label
        id="file-input-label"
        htmlFor="file-input"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-full border-dashed border-[2px] border-[#D1D5D7] flex flex-col items-center justify-center rounded-[9px] cursor-pointer pt-5 mt-5">
          {name}

          {fileCheck ? (
            <>
              {file?.length ? (
                <div className="w-60 text-wrap text-ellipsis overflow-hidden whitespace-nowrap">
                  {file}
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {file?.length ? (
                <>
                  <img src={file} className="h-[8em] m-5" />
                </>
              ) : (
                <FileImage />
              )}
            </>
          )}

          <div>
            {title} <span className="text-primary">browse</span>
            <input
              defaultValue={target}
              type="file"
              id="file-input"
              name="file-input"
              className="hidden"
              accept={extenstion}
              value={target}
              onChange={(e) => {
                setTraget(e.target.value);
                handleImageChange(e);
              }}
            />
          </div>
          <p className="text-[8px] text-textPrimary mb-[16px]">{description}</p>
        </div>
      </label>
    </div>
  );
};

export default CustomFileImage;
