import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '../../lib/cloudinary';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Also let the user paste/edit the URL directly. */
  allowUrlInput?: boolean;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default function ImageUpload({ value, onChange, allowUrlInput = true }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const inputClass = 'w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all';

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ? (
            <img src={value} alt="Logo preview" className="w-full h-full object-contain" />
          ) : (
            <Upload size={20} className="text-gray-300 dark:text-gray-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload logo'}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />
      </div>
      {allowUrlInput && (
        <input
          className={inputClass}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="…or paste an image URL"
        />
      )}
    </div>
  );
}
