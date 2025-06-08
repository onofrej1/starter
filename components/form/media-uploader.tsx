import React, { useState } from "react";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  onChange: (files: File[]) => void;
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
}

export default function MediaUploader(props: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const {
    onChange,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
    maxFiles = 10,
  } = props;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(event.target.files);
    const uploaded = [...selectedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert("This file type is not supported !");
        return;
      }

      if (file.size > maxSize) {
        alert("Uploaded file is too big !");
        return;
      }
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length > maxFiles) {
          alert(`You can only add a maximum of ${maxFiles} files`);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) {
      setSelectedFiles(uploaded);
      onChange(uploaded);
    }
  };

  /*const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files as File[];
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
    }
  };*/

  const removeFile = (file: File) => {
    const files = selectedFiles.filter((f) => f.name !== file.name);
    setSelectedFiles(files);
    onChange(files);
  };

  /*const onFileUpload = () => {
    onChange(selectedFiles);
  }*/

  return (
    <div className="border border-gray p-3">
      <div
        className="flex items-center justify-center w-full mb-3"
        //onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {selectedFiles && selectedFiles.length > 0 && (
        <div>
          <div className="flex flex-wrap mb-2 gap-2">
            {selectedFiles.map((file) => (
              <div className="relative max-w-[150px]" key={file.name}>
                <Image
                  className="object-cover w-full h-full"
                  src={URL.createObjectURL(file)}
                  alt=""
                />
                <div className="bg-white rounded-full w-6 h-6 absolute top-3 right-3 flex items-center justify-center">
                  <XIcon onClick={() => removeFile(file)} className="size-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
