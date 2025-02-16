import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  setFiles: (files: File[]) => void;
}

export function FileUploader({ setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...acceptedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    noClick: false,
    noKeyboard: false,
    noDrag: true,
  });

  return (
    <button
      {...getRootProps()}
      className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
      title="Attach files"
    >
      <input {...getInputProps()} />
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
      </svg>
    </button>
  );
} 