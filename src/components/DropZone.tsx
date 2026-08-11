import { useState, useRef, useCallback, type DragEvent, type ReactNode } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: FileList) => void;
  children?: ReactNode;
  className?: string;
}

export function DropZone({ accept = 'image/*', multiple = false, onFiles, children, className = '' }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files);
    }
  }, [onFiles]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = () => {
    if (inputRef.current?.files && inputRef.current.files.length > 0) {
      onFiles(inputRef.current.files);
      inputRef.current.value = '';
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all ${
        isDragging
          ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100'
          : 'border-primary-200 bg-primary-50/50 hover:border-primary-400 hover:bg-primary-50'
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
      />

      {children ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <div className={`mb-3 rounded-full p-3 transition-colors ${isDragging ? 'bg-primary-200 text-primary-700' : 'bg-primary-100 text-primary-400'}`}>
            {isDragging ? <ImageIcon size={28} /> : <Upload size={28} />}
          </div>
          <p className="text-sm font-medium text-primary-700">
            {isDragging ? 'Lepaskan gambar di sini' : 'Seret & lepas gambar di sini'}
          </p>
          <p className="mt-1 text-xs text-primary-500">
            atau klik untuk memilih file {multiple ? '(bisa pilih beberapa)' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
