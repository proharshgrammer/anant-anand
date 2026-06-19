'use client';

import { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from 'lucide-react';
import { uploadImageAction } from '@/app/actions/storage';
import Image from 'next/image';

export interface ImageUploaderProps {
  bucket: string;
  folder?: string;
  value?: string;
  onChange: (url: string) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export default function ImageUploader({
  bucket,
  folder,
  value,
  onChange,
  altText = '',
  onAltChange,
  label = 'Image',
  accept = 'image/*',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setErrorMsg('');

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File too large. Maximum size is ${maxSizeMB}MB.`);
      setUploadState('error');
      return;
    }

    // Type check
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPG, PNG, WebP, etc.).');
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    try {
      const formData = new FormData();
      formData.append('bucket', bucket);
      formData.append('folder', folder ?? '');
      formData.append('file', file);
      const { url } = await uploadImageAction(formData);
      onChange(url);
      setUploadState('success');
      setTimeout(() => setUploadState('idle'), 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setUploadState('error');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleRemove = () => {
    onChange('');
    setUploadState('idle');
    setErrorMsg('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <p className="label">{label}</p>
      )}

      {/* Drop zone / preview */}
      {value ? (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-teal-200 bg-gray-50">
            <Image
              src={value}
              alt={altText || 'Uploaded image'}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
            aria-label="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
          {/* Re-upload button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-xs text-teal-600 hover:text-teal-800 underline block"
          >
            Change image
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image drop zone"
          onClick={() => uploadState !== 'uploading' && inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[120px]
            ${isDragging
              ? 'border-teal-500 bg-teal-50'
              : uploadState === 'error'
                ? 'border-red-300 bg-red-50'
                : uploadState === 'success'
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'
            }
          `}
        >
          {uploadState === 'uploading' ? (
            <>
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-sm text-teal-700 font-medium">Uploading…</p>
            </>
          ) : uploadState === 'success' ? (
            <>
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="text-sm text-green-700 font-medium">Uploaded!</p>
            </>
          ) : uploadState === 'error' ? (
            <>
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-red-600">{errorMsg}</p>
              <p className="text-xs text-gray-500">Click to try again</p>
            </>
          ) : (
            <>
              {isDragging ? (
                <Upload className="w-8 h-8 text-teal-500" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drop image here or{' '}
                  <span className="text-teal-600 underline">click to browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {accept.replace('image/', '').replace('*', 'JPG, PNG, WebP')} — max {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        aria-hidden="true"
      />

      {/* Alt text input */}
      {onAltChange && (
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Alt text <span className="text-red-400">*</span>{' '}
            <span className="text-gray-400">(required for accessibility & SEO)</span>
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe this image for screen readers"
            className="input-field text-sm"
          />
        </div>
      )}
    </div>
  );
}
