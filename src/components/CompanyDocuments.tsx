import React, { useState, useCallback } from 'react';
import { Upload, FileText, Search, Tag, Calendar, Trash2, Edit3, Eye, Download } from 'lucide-react';
import { companyDocuments, CompanyDocument, DocumentSearchResult } from '../lib/services/company-documents';

export const CompanyDocuments = () => {
  const [documents, setDocuments] = useState<CompanyDocument[]>(companyDocuments.getAllDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentSearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { id: 'all', name: 'All Documents', color: 'bg-slate-100 text-slate-700' },
    { id: 'company', name: 'Company', color: 'bg-blue-100 text-blue-700' },
    { id: 'pricing', name: 'Pricing', color: 'bg-green-100 text-green-700' },
    { id: 'product', name: 'Product', color: 'bg-purple-100 text-purple-700' },
    { id: 'technical', name: 'Technical', color: 'bg-orange-100 text-orange-700' },
    { id: 'case-studies', name: 'Case Studies', color: 'bg-pink-100 text-pink-700' }
  ];

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      const newDocuments: CompanyDocument[] = [];

      for (const file of fileArray) {
        try {
          const document = await companyDocuments.addDocument(file);
          newDocuments.push(document);
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          // You could show a toast notification here
        }
      }

      setDocuments(companyDocuments.getAllDocuments());
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const results = companyDocuments.searchDocuments(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory as any);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleDeleteDocument = useCallback((id: string) => {
    if (companyDocuments.deleteDocument(id)) {
      setDocuments(companyDocuments.getAllDocuments());
      setSearchResults([]);
    }
  }, []);

  const filteredDocuments = documents.filter(doc => 
    selectedCategory === 'all' || doc.metadata.category === selectedCategory
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'powerpoint': return '📊';
      default: return '📄';
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Company Documents</h2>
        <p className="text-slate-600">Upload and manage your Zenloop documents for RFP response generation.</p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
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
            accept=".pdf,.docx,.pptx,.txt"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
              dragActive ? 'bg-blue-100' : 'bg-slate-100'
            }`}>
              {isUploading ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-slate-500'}`} />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {isUploading ? 'Uploading...' : dragActive ? 'Drop files here' : 'Upload Company Documents'}
              </h3>
              <p className="text-slate-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <div className="text-sm text-slate-500 space-y-1">
                <p>Supported formats: PDF, DOCX, PPTX, TXT</p>
                <p>Maximum file size: 10MB per file</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.document.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(result.document.type)}</span>
                    <div>
                      <h4 className="font-medium text-slate-800">{result.document.name}</h4>
                      <p className="text-sm text-slate-500">{result.document.metadata.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-600">Relevance: {result.relevance}</span>
                    <button
                      onClick={() => handleDeleteDocument(result.document.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {result.matchedSections.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">Matched Content:</p>
                    <div className="bg-slate-50 rounded p-3 max-h-32 overflow-y-auto">
                      {result.matchedSections.slice(0, 3).map((section, index) => (
                        <p key={index} className="text-sm text-slate-600 mb-1">
                          "{section}..."
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {selectedCategory === 'all' ? 'All Documents' : `${categories.find(c => c.id === selectedCategory)?.name}`}
        </h3>
        
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No documents found. Upload your Zenloop documents to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(document.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 text-sm">{document.name}</h4>
                      <p className="text-xs text-slate-500">{formatFileSize(document.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{document.metadata.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {document.metadata.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {document.metadata.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                      +{document.metadata.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(document.metadata.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    categories.find(c => c.id === document.metadata.category)?.color || 'bg-slate-100 text-slate-700'
                  }`}>
                    {categories.find(c => c.id === document.metadata.category)?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 