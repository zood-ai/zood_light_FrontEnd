import AttachmenttIcon from "@/assets/icons/Attachment";
import CloseIcon from "@/assets/icons/Close";
import React, { useEffect, useState } from "react";

function FileUpload({setValue,setFiles,files}:{
  setValue:any,
  setFiles:any,
  files:any
}) {

const [traget,setTraget]=useState<string>("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTraget(event.target.value);
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles((prev) => [...prev, ...selectedFiles]);
     
    }
  };
  useEffect(()=>{
    setValue('attachment',files)
  },[files])


  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 w-[500px] overflow-scroll">
        {files.map((file, index) => (
          <div
            key={index}
            className="bg-gray-200 p-2 rounded-md flex  items-center gap-2 "
          >
            <p className="h-[15px] overflow-hidden text-ellipsis text-[10px]">
              {file.name}
            </p>
            <CloseIcon
              width="8px"
              height="8px"
              color="var(--gray-300)"
              className="cursor-pointer"
              onClick={() =>{ 
                setFiles(files.filter((item, i) => i !== index))
                setTraget("")
              }}
            />
          </div>
        ))}
      </div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="fileInput"
        value={traget}
      
      />
      <label htmlFor="fileInput" className="cursor-pointer p-1 bg-gray-200 rounded-md">
        <AttachmenttIcon />
      </label>
    </div>
  );
}

export default FileUpload;
