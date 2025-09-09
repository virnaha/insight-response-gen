
import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export const RFPUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      
      if (!validTypes.includes(file.type)) {
        setUploadedFiles(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          progress: 0,
          error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.'
        }]);
        return;
      }

      if (file.size > maxSize) {
        setUploadedFiles(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          progress: 0,
          error: 'File size exceeds 10MB limit.'
        }]);
        return;
      }

      // Simulate file upload and processing
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileId && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            if (newProgress >= 100) {
              clearInterval(uploadInterval);
              setTimeout(() => {
                setUploadedFiles(prev => prev.map(f => 
                  f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
                ));
                
                // Simulate processing
                const processInterval = setInterval(() => {
                  setUploadedFiles(prev => prev.map(f => {
                    if (f.id === fileId && f.status === 'processing') {
                      const newProgress = Math.min(f.progress + Math.random() * 25, 100);
                      if (newProgress >= 100) {
                        clearInterval(processInterval);
                        return { ...f, status: 'completed', progress: 100 };
                      }
                      return { ...f, progress: newProgress };
                    }
                    return f;
                  }));
                }, 500);
              }, 500);
              
              return { ...f, status: 'uploading', progress: 100 };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 300);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'processing': return 'text-amber-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload RFP Documents</h2>
        <p className="text-slate-600">Upload your RFP documents for AI-powered analysis and response generation.</p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
            dragActive ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-slate-500'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {dragActive ? 'Drop files here' : 'Upload RFP Documents'}
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="text-sm text-slate-500 space-y-1">
              <p>Supported formats: PDF, DOCX, TXT</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(file.status)}
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className={getStatusColor(file.status)}>
                          {file.status === 'uploading' ? 'Uploading...' :
                           file.status === 'processing' ? 'Processing...' :
                           file.status === 'completed' ? 'Completed' : 'Error'}
                        </span>
                      </div>
                      {file.error && (
                        <p className="text-sm text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          file.status === 'uploading' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
