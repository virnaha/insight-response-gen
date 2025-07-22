import React, { useState, useCallback } from 'react';
import { FileText, Edit3, Download, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { openAIService, GenerationContext, GenerationProgress, SectionTemplate, OpenAIService } from '../lib/services/openai-service';

export const ResponseGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [generationStep, setGenerationStep] = useState(0);
  const [sections, setSections] = useState([
    { id: 'executive-summary', title: 'Executive Summary', completed: false, content: '', generating: false, error: '' },
    { id: 'company-overview', title: 'Company Overview', completed: false, content: '', generating: false, error: '' },
    { id: 'technical-approach', title: 'Technical Approach', completed: false, content: '', generating: false, error: '' },
    { id: 'project-timeline', title: 'Project Timeline', completed: false, content: '', generating: false, error: '' },
    { id: 'team-structure', title: 'Team Structure', completed: false, content: '', generating: false, error: '' },
    { id: 'pricing', title: 'Pricing Framework', completed: false, content: '', generating: false, error: '' },
    { id: 'references', title: 'References & Case Studies', completed: false, content: '', generating: false, error: '' },
    { id: 'compliance', title: 'Compliance & Certifications', completed: false, content: '', generating: false, error: '' }
  ]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationContext, setGenerationContext] = useState<GenerationContext>({
    rfpContent: 'Sample RFP content for CRM implementation project...',
    companyProfile: 'TechSolutions Inc. - Leading enterprise software implementation company with 10+ years of experience...',
    requirements: ['Cloud-based CRM solution', 'Integration with existing ERP system', 'User training and support'],
    constraints: ['Budget limitations', '6-month implementation timeline', 'Compliance requirements'],
    targetAudience: 'Enterprise clients in manufacturing sector'
  });

  const templates = [
    { id: 'comprehensive', name: 'Comprehensive Response', description: 'Full RFP response with all sections' },
    { id: 'technical', name: 'Technical Focus', description: 'Emphasis on technical approach and methodology' },
    { id: 'cost-effective', name: 'Cost-Effective', description: 'Budget-conscious proposal template' },
    { id: 'custom', name: 'Custom Template', description: 'Build your own response structure' }
  ];

  const handleGenerateSection = useCallback(async (sectionId: string) => {
    const sectionTemplates = OpenAIService.getSectionTemplates();
    const template = sectionTemplates[sectionId];
    
    if (!template) {
      console.error(`No template found for section: ${sectionId}`);
      return;
    }

    // Update section state to generating
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, generating: true, error: '', completed: false }
        : section
    ));

    try {
      const content = await openAIService.generateSection(
        sectionId,
        generationContext,
        template,
        (progress: GenerationProgress) => {
          // Update progress
          setSections(prev => prev.map(section => 
            section.id === sectionId 
              ? { 
                  ...section, 
                  generating: progress.status === 'generating',
                  completed: progress.status === 'completed',
                  content: progress.content || section.content,
                  error: progress.error || ''
                }
              : section
          ));
        },
        (chunk: string) => {
          // Real-time content updates
          setSections(prev => prev.map(section => 
            section.id === sectionId 
              ? { ...section, content: (section.content || '') + chunk }
              : section
          ));
        }
      );

      // Final update
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, completed: true, generating: false, content, error: '' }
          : section
      ));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, generating: false, error: errorMessage, completed: false }
          : section
      ));
    }
  }, [generationContext]);

  const handleGenerateAllSections = useCallback(async () => {
    setIsGeneratingAll(true);
    const sectionTemplates = OpenAIService.getSectionTemplates();
    
    // Reset all sections
    setSections(prev => prev.map(section => ({
      ...section,
      completed: false,
      generating: false,
      content: '',
      error: ''
    })));

    try {
      const sectionsToGenerate = sections.map(section => ({
        sectionType: section.id,
        template: sectionTemplates[section.id]
      })).filter(item => item.template);

      const results = await openAIService.generateMultipleSections(
        sectionsToGenerate,
        generationContext,
        (progress: GenerationProgress) => {
          setSections(prev => prev.map(section => 
            section.id === progress.sectionId 
              ? { 
                  ...section, 
                  generating: progress.status === 'generating',
                  completed: progress.status === 'completed',
                  content: progress.content || section.content,
                  error: progress.error || ''
                }
              : section
          ));
        },
        (sectionId: string, chunk: string) => {
          setSections(prev => prev.map(section => 
            section.id === sectionId 
              ? { ...section, content: (section.content || '') + chunk }
              : section
          ));
        }
      );

      // Update sections with results
      setSections(prev => prev.map(section => ({
        ...section,
        completed: true,
        generating: false,
        content: results[section.id] || section.content,
        error: ''
      })));

    } catch (error) {
      console.error('Error generating all sections:', error);
    } finally {
      setIsGeneratingAll(false);
    }
  }, [sections, generationContext]);

  const handleCancelGeneration = useCallback(() => {
    openAIService.cancelGeneration();
    setSections(prev => prev.map(section => ({
      ...section,
      generating: false
    })));
    setIsGeneratingAll(false);
  }, []);

  const completedSections = sections.filter(s => s.completed).length;
  const generatingSections = sections.filter(s => s.generating).length;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Generate RFP Response</h2>
        <p className="text-slate-600">Create professional, AI-powered responses to your RFP documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Response Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white/50'
                  }`}
                >
                  <h4 className="font-medium text-slate-800">{template.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                </button>
              ))}
            </div>

            <button 
              onClick={isGeneratingAll ? handleCancelGeneration : handleGenerateAllSections}
              disabled={generatingSections > 0 && !isGeneratingAll}
              className={`w-full mt-4 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                isGeneratingAll
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
              } ${generatingSections > 0 && !isGeneratingAll ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cancel Generation</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Response</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Response Sections</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Edit3 className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-lg border transition-all ${
                    section.completed
                      ? 'border-green-200 bg-green-50/50'
                      : section.generating
                      ? 'border-blue-200 bg-blue-50/50'
                      : section.error
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-slate-200 bg-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        section.completed
                          ? 'bg-green-500 text-white'
                          : section.generating
                          ? 'bg-blue-500 text-white'
                          : section.error
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {section.completed ? '✓' : section.generating ? <Loader2 className="w-4 h-4 animate-spin" /> : section.error ? <AlertCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{section.title}</h4>
                        <p className="text-sm text-slate-500">
                          {section.completed 
                            ? 'Generated and ready' 
                            : section.generating 
                            ? 'Generating content...' 
                            : section.error 
                            ? `Error: ${section.error}` 
                            : 'Ready to generate'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {section.completed && (
                        <button className="p-2 rounded-lg hover:bg-white/70 transition-colors">
                          <Edit3 className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleGenerateSection(section.id)}
                        disabled={section.generating || isGeneratingAll}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          section.completed
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : section.generating
                            ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                            : section.error
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {section.completed ? 'Regenerate' : section.generating ? 'Generating...' : section.error ? 'Retry' : 'Generate'}
                      </button>
                    </div>
                  </div>

                  {(section.completed || section.generating) && section.content && (
                    <div className="mt-4 p-4 bg-white/70 rounded-lg">
                      <p className="text-sm text-slate-600">
                        {section.content}
                        {section.generating && (
                          <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                        )}
                      </p>
                    </div>
                  )}

                  {section.error && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-600">
                        Error: {section.error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="text-sm text-slate-500">
                {completedSections} of {sections.length} sections completed
                {generatingSections > 0 && ` • ${generatingSections} generating`}
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Export Response</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Response Preview</h3>
        <div className="bg-white rounded-lg p-6 border border-slate-200 min-h-[300px]">
          <div className="space-y-4">
            {sections.map((section) => (
              section.completed && section.content ? (
                <div key={section.id}>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{section.title}</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ) : null
            ))}
            {completedSections === 0 && (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>Generated sections will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
