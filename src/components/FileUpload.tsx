import { Upload, FileText } from 'lucide-react';
import { useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  fileName?: string;
}

const FileUpload = ({ onFileSelect, isLoading, fileName }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 cursor-pointer 
                 hover:border-primary/50 hover:bg-secondary/30 transition-all duration-300
                 flex flex-col items-center justify-center gap-4 text-center"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleChange}
        className="hidden"
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-body text-sm">Extracting text...</p>
        </div>
      ) : fileName ? (
        <div className="flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 text-primary" />
          <p className="text-foreground font-body font-medium">{fileName}</p>
          <p className="text-muted-foreground text-sm">Tap to change file</p>
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-muted-foreground" />
          <div>
            <p className="text-foreground font-body font-medium text-lg">Drop your file here</p>
            <p className="text-muted-foreground text-sm mt-1">PDF, DOCX, or TXT</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
