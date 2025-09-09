import React, { useState } from 'react';
import { Zap, Clock, AlertTriangle, DollarSign, Users, CheckSquare, Play, Loader2 } from 'lucide-react';
import { documentAnalyzer, DocumentAnalysis, AnalysisProgress } from '../lib/services/document-analyzer';

export const RFPAnalyzer = () => {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    status: 'idle',
    progress: 0
  });
  const [documentContent, setDocumentContent] = useState<string>('');

  // Mock analysis data - fallback when no real analysis is available
  const mockAnalysis: DocumentAnalysis = {
    criticalRequirementsMatrix: {
      mandatory: [
        { requirement: "Cloud-based CRM implementation", complianceMapping: "Demonstrate cloud infrastructure and CRM capabilities", confidence: 0.95 },
        { requirement: "Integration with existing ERP system", complianceMapping: "Show integration architecture and API capabilities", confidence: 0.90 },
        { requirement: "24/7 technical support", complianceMapping: "Provide support structure and SLAs", confidence: 0.85 }
      ],
      desired: [
        { requirement: "Mobile application development", weightScore: "High", confidence: 0.80 },
        { requirement: "Advanced analytics dashboard", weightScore: "Medium", confidence: 0.75 }
      ],
      optional: [
        { requirement: "AI-powered insights", confidence: 0.70 },
        { requirement: "Multi-language support", confidence: 0.65 }
      ],
      hidden: [
        { requirement: "Scalability for future growth", evidence: "Mentioned in business objectives section", confidence: 0.60 }
      ]
    },
    evaluationCriteria: {
      scoringMethodology: "Weighted scoring based on technical approach, experience, cost, and timeline",
      criteria: [
        { criterion: "Technical approach", weight: "30%", priority: "high", confidence: 0.90 },
        { criterion: "Team experience", weight: "25%", priority: "high", confidence: 0.85 },
        { criterion: "Cost effectiveness", weight: "20%", priority: "medium", confidence: 0.80 },
        { criterion: "Timeline feasibility", weight: "15%", priority: "medium", confidence: 0.75 },
        { criterion: "References", weight: "10%", priority: "low", confidence: 0.70 }
      ],
      budgetIndicators: "Budget range: $150,000 - $200,000 with moderate price sensitivity",
      riskFactors: [
        { factor: "Tight timeline for data migration", severity: "High", confidence: 0.85 },
        { factor: "Complex ERP integration requirements", severity: "Medium", confidence: 0.80 }
      ]
    },
    strategicIntelligence: {
      incumbentAdvantages: "Current vendor has 3-year relationship but limited cloud expertise",
      politicalLandscape: "IT department driving decision, CTO has final approval",
      timelinePressures: "Q2 implementation deadline creating urgency",
      competitiveOpportunities: "Strong cloud expertise and modern architecture approach",
      confidence: 0.75
    },
    winThemes: {
      primaryValueDrivers: ["Cost reduction", "Operational efficiency", "Modern technology"],
      painPoints: ["Legacy system limitations", "Manual processes", "Limited scalability"],
      keyDifferentiators: ["Cloud-native architecture", "AI-powered insights", "Proven integration track record"],
      requiredProofPoints: ["Similar enterprise implementations", "Integration case studies", "Performance benchmarks"],
      confidence: 0.85
    },
    redFlags: [
      { flag: "Unrealistic 6-month timeline for full implementation", severity: "High", impact: "May require phased approach", confidence: 0.90 },
      { flag: "Vague integration requirements", severity: "Medium", impact: "Need detailed technical specifications", confidence: 0.80 }
    ],
    deadlines: [
      { task: "Proposal submission", date: "2024-02-15", daysRemaining: 20, urgency: "High" },
      { task: "Project kickoff", date: "2024-03-01", daysRemaining: 34, urgency: "Medium" },
      { task: "Phase 1 delivery", date: "2024-05-15", daysRemaining: 108, urgency: "Low" }
    ],
    stakeholders: [
      { name: "John Smith", role: "Project Manager", department: "IT", influence: "High", priorities: ["Timeline", "Budget"] },
      { name: "Sarah Johnson", role: "Business Analyst", department: "Operations", influence: "Medium", priorities: ["User experience", "Process improvement"] },
      { name: "Mike Davis", role: "CTO", department: "Technology", influence: "High", priorities: ["Technical architecture", "Security"] }
    ]
  };

  const handleAnalyzeDocument = async () => {
    // Validate document content
    const validation = documentAnalyzer.validateDocumentContent(documentContent);
    if (!validation.isValid) {
      alert(validation.error || 'Please provide valid document content for analysis');
      return;
    }

    try {
      setProgress({
        status: 'analyzing',
        progress: 0,
        currentStep: 'Starting analysis...'
      });

      const result = await documentAnalyzer.analyzeDocument(
        documentContent,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      setAnalysis(result);
      setProgress({
        status: 'completed',
        progress: 100,
        currentStep: 'Analysis complete'
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setProgress({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Analysis failed'
      });
    }
  };

  const handleCancelAnalysis = () => {
    documentAnalyzer.cancelAnalysis();
    setProgress({
      status: 'idle',
      progress: 0
    });
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Use real analysis if available, otherwise fall back to mock data
  const displayAnalysis = analysis || mockAnalysis;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">AI Analysis Results</h2>
        <p className="text-slate-600">Comprehensive analysis of your RFP document using advanced AI.</p>
      </div>

      {/* Analysis Controls */}
      <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="documentContent" className="block text-sm font-medium text-slate-700 mb-2">
              Document Content for Analysis
            </label>
            <textarea
              id="documentContent"
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="Paste your RFP document content here for AI analysis..."
              className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={progress.status === 'analyzing'}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {progress.status === 'analyzing' ? (
              <>
                <button
                  onClick={handleCancelAnalysis}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Analysis
                </button>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-slate-600">
                    {progress.currentStep} ({progress.progress}%)
                  </span>
                </div>
              </>
            ) : (
              <button
                onClick={handleAnalyzeDocument}
                disabled={!documentContent.trim() || progress.status !== 'idle'}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Analyze Document</span>
              </button>
            )}
          </div>

          {progress.status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{progress.error}</p>
            </div>
          )}

          {analysis && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">✓ Analysis completed successfully!</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Requirements Matrix */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Critical Requirements Matrix</h3>
          </div>
          
          {/* Mandatory Requirements */}
          <div className="mb-4">
            <h4 className="font-medium text-red-700 mb-2">Mandatory (MUST have)</h4>
            <ul className="space-y-2">
              {displayAnalysis.criticalRequirementsMatrix.mandatory.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-slate-700">{req.requirement}</span>
                    <p className="text-xs text-slate-500 mt-1">{req.complianceMapping}</p>
                    <span className="text-xs text-blue-600">Confidence: {(req.confidence * 100).toFixed(0)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Desired Requirements */}
          <div className="mb-4">
            <h4 className="font-medium text-amber-700 mb-2">Desired (SHOULD have)</h4>
            <ul className="space-y-2">
              {displayAnalysis.criticalRequirementsMatrix.desired.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-slate-700">{req.requirement}</span>
                    <p className="text-xs text-slate-500 mt-1">Weight: {req.weightScore}</p>
                    <span className="text-xs text-blue-600">Confidence: {(req.confidence * 100).toFixed(0)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Important Deadlines</h3>
          </div>
          <div className="space-y-3">
            {displayAnalysis.deadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{deadline.task}</p>
                  <p className="text-sm text-slate-500">{deadline.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">
                    {deadline.daysRemaining} days
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deadline.urgency === 'High' ? 'bg-red-100 text-red-700' :
                    deadline.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {deadline.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Evaluation Criteria</h3>
          </div>
          <div className="space-y-3">
            {displayAnalysis.evaluationCriteria.criteria.map((criteria, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-slate-700">{criteria.criterion}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    criteria.priority === 'high' ? 'bg-red-100 text-red-700' :
                    criteria.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {criteria.priority}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-600">{criteria.weight}</span>
                  <p className="text-xs text-blue-600">{(criteria.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-700">{displayAnalysis.evaluationCriteria.budgetIndicators}</p>
          </div>
        </div>

        {/* Strategic Intelligence */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Strategic Intelligence</h3>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-slate-800">Budget Indicators</h4>
              <p className="text-sm text-slate-600">{displayAnalysis.evaluationCriteria.budgetIndicators}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Incumbent Advantages</h4>
              <p className="text-sm text-slate-600">{displayAnalysis.strategicIntelligence.incumbentAdvantages}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Timeline Pressures</h4>
              <p className="text-sm text-slate-600">{displayAnalysis.strategicIntelligence.timelinePressures}</p>
            </div>
            <div className="text-xs text-blue-600">
              Confidence: {(displayAnalysis.strategicIntelligence.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Risk Factors</h3>
          </div>
          <div className="space-y-3">
            {displayAnalysis.evaluationCriteria.riskFactors.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(risk.severity)}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-slate-700 text-sm">{risk.factor}</p>
                <span className="text-xs text-blue-600">Confidence: {(risk.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholders */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Key Stakeholders</h3>
          </div>
          <div className="space-y-3">
            {displayAnalysis.stakeholders.map((stakeholder, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{stakeholder.name}</p>
                  <p className="text-sm text-slate-500">{stakeholder.role} • {stakeholder.department}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stakeholder.influence === 'High' ? 'bg-red-100 text-red-700' :
                      stakeholder.influence === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {stakeholder.influence} Influence
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-slate-600 font-medium">Priorities:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stakeholder.priorities.map((priority, pIndex) => (
                        <span key={pIndex} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {priority}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Win Themes */}
      <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Win Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Primary Value Drivers</h4>
            <ul className="space-y-1">
              {displayAnalysis.winThemes.primaryValueDrivers.map((driver, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-slate-700 text-sm">{driver}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Pain Points to Address</h4>
            <ul className="space-y-1">
              {displayAnalysis.winThemes.painPoints.map((point, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-slate-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Key Differentiators</h4>
            <ul className="space-y-1">
              {displayAnalysis.winThemes.keyDifferentiators.map((diff, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-slate-700 text-sm">{diff}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Required Proof Points</h4>
            <ul className="space-y-1">
              {displayAnalysis.winThemes.requiredProofPoints.map((proof, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-slate-700 text-sm">{proof}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 text-xs text-blue-600">
          Confidence: {(displayAnalysis.winThemes.confidence * 100).toFixed(0)}%
        </div>
      </div>

      {/* Red Flags */}
      <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Red Flags & Risks</h3>
        <div className="space-y-4">
          {displayAnalysis.redFlags.map((flag, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(flag.severity)}`}>
                  {flag.severity}
                </span>
                <span className="text-xs text-blue-600">Confidence: {(flag.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-slate-700 text-sm font-medium">{flag.flag}</p>
              <p className="text-slate-500 text-xs mt-1">Impact: {flag.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
