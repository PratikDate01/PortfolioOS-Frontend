'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CloudinaryAsset } from '@/types';
import { API_BASE_URL } from '@/lib/config';
import { getAuthToken } from '@/lib/api-client';

interface CloudinaryUploadZoneProps {
  endpoint: 'profile' | 'project-image' | 'project-video' | 'resume' | 'certificate' | 'blog-cover';
  acceptType: 'image' | 'video' | 'pdf' | 'any';
  label: string;
  value?: CloudinaryAsset | string | null;
  onUploadSuccess: (asset: CloudinaryAsset) => void;
  onRemove: () => void;
  maxSizeMB?: number;
}

export default function CloudinaryUploadZone({
  endpoint,
  acceptType,
  label,
  value,
  onUploadSuccess,
  onRemove,
  maxSizeMB = 5
}: CloudinaryUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract URL/filename from value (supports CloudinaryAsset object or raw URL string)
  const getAssetDetails = () => {
    if (!value) return null;
    if (typeof value === 'string') {
      return {
        secureUrl: value,
        publicId: '',
        resourceType: acceptType === 'video' ? 'video' : acceptType === 'pdf' ? 'raw' : 'image',
        originalName: value.split('/').pop() || 'file'
      };
    }
    return {
      secureUrl: value.secureUrl,
      publicId: value.publicId,
      resourceType: value.resourceType,
      originalName: (value as unknown as Record<string, unknown>).originalName as string || 'Uploaded File'
    };
  };

  const asset = getAssetDetails();

  // Mime validation
  const validateFile = (file: File): boolean => {
    setError(null);

    // 1. Validate Size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size exceeds the limit of ${maxSizeMB}MB.`);
      return false;
    }

    // 2. Validate Type
    const mime = file.type.toLowerCase();
    if (acceptType === 'image') {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(mime)) {
        setError('Invalid image format. Allowed: jpg, jpeg, png, webp.');
        return false;
      }
    } else if (acceptType === 'video') {
      const allowed = ['video/mp4', 'video/webm'];
      if (!allowed.includes(mime)) {
        setError('Invalid video format. Allowed: mp4, webm.');
        return false;
      }
    } else if (acceptType === 'pdf') {
      if (mime !== 'application/pdf') {
        setError('Invalid document format. Only PDF allowed.');
        return false;
      }
    } else if (acceptType === 'any') {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];
      if (!allowed.includes(mime)) {
        setError('Allowed formats: jpg, jpeg, png, webp, mp4, webm, pdf.');
        return false;
      }
    }

    return true;
  };

  // Perform upload via XHR for progress bar tracking
  const uploadFile = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    const token = getAuthToken();

    xhr.open('POST', `${API_BASE_URL}/upload/${endpoint}`, true);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Progress Listener
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        setProgress(percentComplete);
      }
    };

    // Load Listener
    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.data) {
            onUploadSuccess(res.data);
          } else {
            setError('Upload succeeded but no metadata returned.');
          }
        } catch {
          setError('Failed to parse upload response.');
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          setError(res.error || 'Server upload failed.');
        } catch {
          setError('Server upload failed.');
        }
      }
    };

    // Error Listener
    xhr.onerror = () => {
      setIsUploading(false);
      setError('Network connection error.');
    };

    xhr.send(formData);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        uploadFile(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        uploadFile(file);
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Delete/Remove Asset Handler
  const handleRemove = async () => {
    // If it's a Cloudinary asset with a publicId, we can delete it from Cloudinary as well
    if (asset?.publicId) {
      const token = getAuthToken();
      
      // Perform delete asynchronously (optimistic UI update: remove preview instantly)
      fetch(`${API_BASE_URL}/upload/${encodeURIComponent(asset.publicId)}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }).catch(err => {
        console.error('Failed to delete asset from Cloudinary:', err);
      });
    }
    
    // Clear preview and notify parent form
    onRemove();
    setError(null);
    setProgress(0);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-zinc-500 font-mono">
          Max: {maxSizeMB}MB ({acceptType})
        </span>
      </div>

      {/* Main Drag & Drop Zone */}
      {!asset && !isUploading && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-teal-400 bg-teal-950/10'
              : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/10'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={
              acceptType === 'image'
                ? 'image/*'
                : acceptType === 'video'
                ? 'video/*'
                : acceptType === 'pdf'
                ? 'application/pdf'
                : 'image/*,video/*,application/pdf'
            }
          />
          <UploadCloud className={`h-8 w-8 mb-2 transition-transform duration-300 ${isDragActive ? 'scale-110 text-teal-400' : 'text-zinc-500'}`} />
          <p className="text-xs text-zinc-400 text-center font-sans">
            Drag & drop or <span className="text-teal-400 font-semibold">browse</span>
          </p>
          <p className="text-[10px] text-zinc-600 mt-1 font-mono uppercase">
            {acceptType === 'any' ? 'jpg, png, webp, mp4, pdf' : acceptType === 'pdf' ? 'PDF only' : acceptType}
          </p>
        </div>
      )}

      {/* Uploading Progress State */}
      {isUploading && (
        <div className="border border-zinc-850 bg-zinc-950/40 rounded-xl p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-7 w-7 text-teal-400 animate-spin mb-3" />
          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden max-w-xs mb-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-zinc-400">{progress}% Uploaded</span>
        </div>
      )}

      {/* Completed Upload / Preview State */}
      {asset && !isUploading && (
        <div className="relative border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/20 shadow-lg group">
          
          {/* Action Buttons */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-950/80 border border-red-500/20 text-red-400 hover:bg-red-900 hover:text-white transition-all shadow-md"
            title="Remove File"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Previews based on resourceType */}
          <div className="flex items-center justify-center p-2 bg-zinc-900/10">
            {asset.resourceType === 'image' && (
              <div className="relative w-full max-h-48 flex items-center justify-center overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.secureUrl}
                  alt={asset.originalName}
                  className="max-h-48 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            )}

            {asset.resourceType === 'video' && (
              <div className="w-full max-h-48 flex items-center justify-center overflow-hidden rounded-lg bg-black">
                <video
                  src={asset.secureUrl}
                  controls
                  className="max-h-48 object-contain w-full"
                />
              </div>
            )}

            {asset.resourceType === 'raw' && (
              <div className="w-full p-4 flex items-center space-x-3 bg-zinc-950/40 rounded-lg border border-zinc-900 font-sans">
                <div className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-500/20 text-teal-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate" title={asset.originalName}>
                    {asset.originalName}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">PDF Document</p>
                </div>
                <a
                  href={asset.secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono font-bold text-teal-400 hover:text-teal-300 border border-teal-500/20 rounded px-2.5 py-1 transition-colors shrink-0"
                >
                  View
                </a>
              </div>
            )}
          </div>

          {/* Upload Complete Footer */}
          <div className="border-t border-zinc-900 px-3.5 py-2 bg-zinc-950/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span className="flex items-center text-teal-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Ready</span>
            </span>
            {asset.publicId && (
              <span className="truncate max-w-[180px]" title={asset.publicId}>
                ID: {asset.publicId.split('/').pop()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center space-x-1.5 text-xs text-red-400 font-sans bg-red-950/10 border border-red-500/20 rounded-lg p-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
