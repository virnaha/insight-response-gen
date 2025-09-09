import { createAPIConfig, APIConfiguration } from '../config/api-config';

export interface DocumentAnalysis {
  criticalRequirementsMatrix: {
    mandatory: Array<{
      requirement: string;
      complianceMapping: string;
      confidence: number;
    }>;
    desired: Array<{
      requirement: string;
      weightScore: string;
      confidence: number;
    }>;
    optional: Array<{
      requirement: string;
      confidence: number;
    }>;
    hidden: Array<{
      requirement: string;
      evidence: string;
      confidence: number;
    }>;
  };
  evaluationCriteria: {
    scoringMethodology: string;
    criteria: Array<{
      criterion: string;
      weight: string;
      priority: 'high' | 'medium' | 'low';
      confidence: number;
    }>;
    budgetIndicators: string;
    riskFactors: Array<{
      factor: string;
      severity: 'High' | 'Medium' | 'Low';
      confidence: number;
    }>;
  };
  strategicIntelligence: {
    incumbentAdvantages: string;
    politicalLandscape: string;
    timelinePressures: string;
    competitiveOpportunities: string;
    confidence: number;
  };
  winThemes: {
    primaryValueDrivers: string[];
    painPoints: string[];
    keyDifferentiators: string[];
    requiredProofPoints: string[];
    confidence: number;
  };
  redFlags: Array<{
    flag: string;
    severity: 'High' | 'Medium' | 'Low';
    impact: string;
    confidence: number;
  }>;
  deadlines: Array<{
    task: string;
    date: string;
    daysRemaining: number;
    urgency: 'High' | 'Medium' | 'Low';
  }>;
  stakeholders: Array<{
    name: string;
    role: string;
    department: string;
    influence: 'High' | 'Medium' | 'Low';
    priorities: string[];
  }>;
}

export interface AnalysisProgress {
  status: 'idle' | 'analyzing' | 'completed' | 'error';
  progress: number; // 0-100
  currentStep?: string;
  error?: string;
}

class DocumentAnalyzerService {
  private config: APIConfiguration;
  private abortController?: AbortController;

  constructor() {
    this.config = createAPIConfig();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.openai.apiKey}`,
    };

    if (this.config.openai.organization) {
      headers['OpenAI-Organization'] = this.config.openai.organization;
    }

    return headers;
  }

  private buildAnalysisPrompt(documentContent: string): string {
    return `You are an expert RFP analyst with 20+ years of experience in enterprise software procurement. Your task is to analyze RFP documents with the precision of top consulting firms like McKinsey and Accenture.

Extract and structure the following:

1. **Critical Requirements Matrix**
   - Mandatory requirements (MUST have) with compliance mapping
   - Desired requirements (SHOULD have) with weight scores
   - Optional requirements (NICE to have)
   - Hidden requirements (implied but not stated)

2. **Evaluation Criteria Decoder**
   - Scoring methodology and weights
   - Decision-maker priorities (read between the lines)
   - Budget indicators and price sensitivity
   - Risk factors and compliance requirements

3. **Strategic Intelligence**
   - Incumbent vendor advantages (if any)
   - Political landscape and stakeholder dynamics
   - Timeline pressures and urgency indicators
   - Competitive positioning opportunities

4. **Win Theme Identification**
   - Primary value drivers for this customer
   - Pain points to address
   - Differentiators that matter most
   - Proof points needed

5. **Red Flags & Risks**
   - Unrealistic requirements
   - Conflicting specifications
   - Missing information gaps
   - Potential deal breakers

Document Content:
${documentContent}

Please respond with a valid JSON object containing these fields with confidence scores for each finding:
{
  "criticalRequirementsMatrix": {
    "mandatory": [
      {
        "requirement": "requirement description",
        "complianceMapping": "how to demonstrate compliance",
        "confidence": 0.95
      }
    ],
    "desired": [
      {
        "requirement": "requirement description",
        "weightScore": "percentage or importance level",
        "confidence": 0.85
      }
    ],
    "optional": [
      {
        "requirement": "requirement description",
        "confidence": 0.75
      }
    ],
    "hidden": [
      {
        "requirement": "implied requirement",
        "evidence": "why this is implied",
        "confidence": 0.70
      }
    ]
  },
  "evaluationCriteria": {
    "scoringMethodology": "description of how evaluation will be conducted",
    "criteria": [
      {
        "criterion": "criteria name",
        "weight": "percentage",
        "priority": "high/medium/low",
        "confidence": 0.90
      }
    ],
    "budgetIndicators": "budget range and price sensitivity analysis",
    "riskFactors": [
      {
        "factor": "risk description",
        "severity": "High|Medium|Low",
        "confidence": 0.80
      }
    ]
  },
  "strategicIntelligence": {
    "incumbentAdvantages": "analysis of current vendor advantages",
    "politicalLandscape": "stakeholder dynamics and decision-making process",
    "timelinePressures": "urgency indicators and timeline analysis",
    "competitiveOpportunities": "positioning opportunities for new vendors",
    "confidence": 0.75
  },
  "winThemes": {
    "primaryValueDrivers": ["driver1", "driver2"],
    "painPoints": ["pain point 1", "pain point 2"],
    "keyDifferentiators": ["differentiator 1", "differentiator 2"],
    "requiredProofPoints": ["proof point 1", "proof point 2"],
    "confidence": 0.85
  },
  "redFlags": [
    {
      "flag": "red flag description",
      "severity": "High|Medium|Low",
      "impact": "potential impact on proposal",
      "confidence": 0.90
    }
  ],
  "deadlines": [
    {
      "task": "task description",
      "date": "YYYY-MM-DD",
      "daysRemaining": number,
      "urgency": "High|Medium|Low"
    }
  ],
  "stakeholders": [
    {
      "name": "person name",
      "role": "job title",
      "department": "department name",
      "influence": "High|Medium|Low",
      "priorities": ["priority1", "priority2"]
    }
  ]
}

Ensure all dates are in YYYY-MM-DD format and calculate days remaining from today's date. Provide confidence scores (0.0-1.0) for each finding based on the clarity and specificity of the information in the document.`;
  }

  async analyzeDocument(
    documentContent: string,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<DocumentAnalysis> {
    if (!this.config.features.enableAIGeneration) {
      throw new Error('AI generation is disabled in configuration');
    }

    // Cancel any ongoing request
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    try {
      // Update progress to analyzing
      onProgress?.({
        status: 'analyzing',
        progress: 0,
        currentStep: 'Preparing analysis...'
      });

      const prompt = this.buildAnalysisPrompt(documentContent);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.config.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert RFP analyst with 20+ years of experience in enterprise software procurement. Your task is to analyze RFP documents with the precision of top consulting firms like McKinsey and Accenture. Extract and structure critical requirements, evaluation criteria, strategic intelligence, win themes, and red flags. Output in structured JSON with confidence scores for each finding.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.openai.maxTokens,
          temperature: 0.3, // Lower temperature for more consistent analysis
          stream: false, // Use non-streaming for structured analysis
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      onProgress?.({
        status: 'analyzing',
        progress: 50,
        currentStep: 'Processing analysis results...'
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No analysis content received from OpenAI');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from analysis');
      }

      onProgress?.({
        status: 'analyzing',
        progress: 90,
        currentStep: 'Finalizing results...'
      });

      const analysis: DocumentAnalysis = JSON.parse(jsonMatch[0]);

      // Validate and process the analysis
      const processedAnalysis = this.processAnalysis(analysis);

      onProgress?.({
        status: 'completed',
        progress: 100,
        currentStep: 'Analysis complete'
      });

      return processedAnalysis;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      onProgress?.({
        status: 'error',
        progress: 0,
        error: errorMessage
      });

      throw new Error(`Document analysis failed: ${errorMessage}`);
    }
  }

  private processAnalysis(analysis: DocumentAnalysis): DocumentAnalysis {
    // Ensure all required fields exist with defaults
    return {
      criticalRequirementsMatrix: {
        mandatory: analysis.criticalRequirementsMatrix?.mandatory || [],
        desired: analysis.criticalRequirementsMatrix?.desired || [],
        optional: analysis.criticalRequirementsMatrix?.optional || [],
        hidden: analysis.criticalRequirementsMatrix?.hidden || []
      },
      evaluationCriteria: {
        scoringMethodology: analysis.evaluationCriteria?.scoringMethodology || 'Not specified',
        criteria: analysis.evaluationCriteria?.criteria || [],
        budgetIndicators: analysis.evaluationCriteria?.budgetIndicators || 'Not specified',
        riskFactors: analysis.evaluationCriteria?.riskFactors || []
      },
      strategicIntelligence: {
        incumbentAdvantages: analysis.strategicIntelligence?.incumbentAdvantages || 'Not specified',
        politicalLandscape: analysis.strategicIntelligence?.politicalLandscape || 'Not specified',
        timelinePressures: analysis.strategicIntelligence?.timelinePressures || 'Not specified',
        competitiveOpportunities: analysis.strategicIntelligence?.competitiveOpportunities || 'Not specified',
        confidence: analysis.strategicIntelligence?.confidence || 0.5
      },
      winThemes: {
        primaryValueDrivers: analysis.winThemes?.primaryValueDrivers || [],
        painPoints: analysis.winThemes?.painPoints || [],
        keyDifferentiators: analysis.winThemes?.keyDifferentiators || [],
        requiredProofPoints: analysis.winThemes?.requiredProofPoints || [],
        confidence: analysis.winThemes?.confidence || 0.5
      },
      redFlags: analysis.redFlags || [],
      deadlines: analysis.deadlines || [],
      stakeholders: analysis.stakeholders || []
    };
  }

  cancelAnalysis(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  // Helper method to extract text from uploaded files
  async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll need to implement PDF text extraction
        // For now, return a placeholder - in a real implementation, you'd use a PDF parsing library
        reject(new Error('PDF text extraction not implemented yet'));
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOCX files, we'll need to implement DOCX text extraction
        // For now, return a placeholder - in a real implementation, you'd use a DOCX parsing library
        reject(new Error('DOCX text extraction not implemented yet'));
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  }

  // Method to analyze document from file
  async analyzeDocumentFromFile(
    file: File,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<DocumentAnalysis> {
    try {
      onProgress?.({
        status: 'analyzing',
        progress: 0,
        currentStep: 'Extracting text from file...'
      });

      const documentContent = await this.extractTextFromFile(file);
      
      onProgress?.({
        status: 'analyzing',
        progress: 10,
        currentStep: 'Text extraction complete, starting analysis...'
      });

      return await this.analyzeDocument(documentContent, (progressUpdate) => {
        // Adjust progress to account for file processing
        const adjustedProgress = 10 + (progressUpdate.progress * 0.9);
        onProgress?.({
          ...progressUpdate,
          progress: Math.round(adjustedProgress)
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onProgress?.({
        status: 'error',
        progress: 0,
        error: errorMessage
      });
      throw error;
    }
  }

  // Method to validate document content before analysis
  validateDocumentContent(content: string): { isValid: boolean; error?: string } {
    if (!content || content.trim().length === 0) {
      return { isValid: false, error: 'Document content is empty' };
    }
    
    if (content.trim().length < 50) {
      return { isValid: false, error: 'Document content is too short for meaningful analysis' };
    }
    
    return { isValid: true };
  }
}

// Export singleton instance
export const documentAnalyzer = new DocumentAnalyzerService(); 