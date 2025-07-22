
import React, { useState } from 'react';
import { Upload, FileText, Zap, Settings, BarChart3, Menu, X, FolderOpen } from 'lucide-react';
import { RFPUploader } from './RFPUploader';
import { RFPAnalyzer } from './RFPAnalyzer';
import { ResponseGenerator } from './ResponseGenerator';
import { ManagementPanel } from './ManagementPanel';
import { CompanyDocuments } from './CompanyDocuments';

type TabType = 'upload' | 'analyze' | 'generate' | 'manage' | 'documents';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tabs = [
    { id: 'upload' as TabType, label: 'Upload RFP', icon: Upload, description: 'Upload and process RFP documents' },
    { id: 'analyze' as TabType, label: 'AI Analysis', icon: Zap, description: 'AI-powered document analysis' },
    { id: 'generate' as TabType, label: 'Generate Response', icon: FileText, description: 'Create professional responses' },
    { id: 'documents' as TabType, label: 'Company Documents', icon: FolderOpen, description: 'Manage Zenloop documents and materials' },
    { id: 'manage' as TabType, label: 'Manage', icon: BarChart3, description: 'Manage RFPs and templates' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <RFPUploader />;
      case 'analyze':
        return <RFPAnalyzer />;
      case 'generate':
        return <ResponseGenerator />;
      case 'documents':
        return <CompanyDocuments />;
      case 'manage':
        return <ManagementPanel />;
      default:
        return <RFPUploader />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    RFP Analyzer Pro
                  </h1>
                  <p className="text-sm text-slate-500">AI-Powered Proposal Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 inset-y-0 left-0 w-72 bg-white/70 backdrop-blur-md border-r border-slate-200/60 transition-transform duration-300 ease-in-out z-40 mt-[73px] lg:mt-0`}>
          <div className="p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    <div>
                      <div className={`font-medium ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        {tab.label}
                      </div>
                      <div className={`text-sm ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
