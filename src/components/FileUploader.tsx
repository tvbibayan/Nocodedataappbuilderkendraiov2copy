/**
 * File Uploader Component
 * Handles file uploads with drag-and-drop support
 */

import { useState, useRef } from 'react';
import { Upload, X, File, FileText, Image, Video, Music, Archive, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
}

interface FileUploaderProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
}

export function FileUploader({ 
  onFilesUploaded, 
  maxSize = 10, 
  acceptedTypes = ['*'],
  multiple = true 
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.startsWith('text/')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }));

    // Check file sizes
    const oversizedFiles = newFiles.filter(f => f.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed ${maxSize}MB limit`);
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress (replace with actual upload logic)
    newFiles.forEach(async (file, index) => {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
        }

        // Mark as completed
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed', progress: 100, url: `uploaded/${file.name}` } 
            : f
        ));

        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        ));
        toast.error(`Failed to upload ${file.name}`);
      }
    });

    if (onFilesUploaded) {
      setTimeout(() => {
        const completedFiles = files.filter(f => f.status === 'completed');
        onFilesUploaded(completedFiles);
      }, newFiles.length * 1000 + 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.info('File removed');
  };

  const clearAll = () => {
    setFiles([]);
    toast.info('All files cleared');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]' 
            : 'border-cyan-500/30 bg-[#1a1b2e] hover:border-cyan-500/50 hover:bg-[#1e2039]'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          accept={acceptedTypes.join(',')}
        />

        <motion.div
          animate={{ y: isDragging ? -10 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-cyan-400' : 'text-cyan-500'} group-hover:text-cyan-400`} />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            {isDragging ? 'Drop files here' : 'Upload Files'}
          </h3>
          
          <p className="text-cyan-300/70 text-sm mb-4">
            Drag and drop files here, or click to browse
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-cyan-300/50">
            <span>Max size: {maxSize}MB</span>
            <span>•</span>
            <span>{multiple ? 'Multiple files' : 'Single file'}</span>
          </div>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                Uploaded Files ({files.length})
              </h4>
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-cyan-300 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map(file => {
                const Icon = getFileIcon(file.type);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-[#1a1b2e] border border-cyan-500/20 rounded-xl"
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${file.status === 'completed' ? 'bg-emerald-500/20' : 
                        file.status === 'error' ? 'bg-red-500/20' : 'bg-cyan-500/20'}
                    `}>
                      <Icon className={`w-5 h-5 ${
                        file.status === 'completed' ? 'text-emerald-400' :
                        file.status === 'error' ? 'text-red-400' : 'text-cyan-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <span className="text-xs text-cyan-300/70 ml-2">{formatFileSize(file.size)}</span>
                      </div>

                      {file.status === 'uploading' && (
                        <div className="w-full h-1.5 bg-[#0f0f23] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}

                      {file.status === 'completed' && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Upload complete</span>
                        </div>
                      )}

                      {file.status === 'error' && (
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <AlertCircle className="w-3 h-3" />
                          <span>Upload failed</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-cyan-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
