import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx",
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-blue-500 bg-blue-50 scale-[1.02]"
          : fileName
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-2">
        <Upload
          className={`w-10 h-10 ${fileName ? "text-green-600" : "text-gray-400"}`}
        />
        {fileName ? (
          <div className="text-sm">
            <p className="font-medium text-gray-900">{fileName}</p>
            <p className="text-gray-500">Click to change file</p>
          </div>
        ) : (
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              Drop your resume here or click to upload
            </p>
            <p className="text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
