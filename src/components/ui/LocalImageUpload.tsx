import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface LocalImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

// Reads an image entirely in the browser and returns it as a data URL — no upload
// or account needed. Used by the public invoice generator so the logo embeds
// directly into the preview and the exported PDF.
export default function LocalImageUpload({ value, onChange }: LocalImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Image must be smaller than 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.onerror = () => toast.error('Could not read the image');
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
        {value ? (
          <img src={value} alt="Logo preview" className="w-full h-full object-contain" />
        ) : (
          <Upload size={18} className="text-gray-300 dark:text-gray-600" />
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {value ? 'Replace logo' : 'Upload logo'}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={15} /> Remove
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          handleFile(e.target.files?.[0]);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />
    </div>
  );
}
