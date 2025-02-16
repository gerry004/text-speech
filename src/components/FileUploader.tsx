import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export function FileUploader({ files, setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop PDF files here, or click to select files</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Uploaded files:</h3>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 