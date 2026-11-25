export type Role = 'worker' | 'assessor' | 'auditor';

export interface Competency {
  id: string;
  code: string;
  title: string;
  description: string;
  performanceCriteria: string[];
  maxMarks: number;
}

export interface KnowledgeQuestion {
  id: string;
  competencyId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  question_hi?: string;
  options_hi?: string[];
  question_ta?: string;
  options_ta?: string[];
  audio_ta?: string;
  audio_hi?: string;
}

export interface QualificationPack {
  id: string;
  code: string;
  title: string;
  title_hi?: string;
  title_ta?: string;
  sector: string;
  nsqfLevel: number;
  description: string;
  description_hi?: string;
  description_ta?: string;
  minimumExperienceMonths: number;
  coreCompetencies: Competency[];
  knowledgeQuestions: KnowledgeQuestion[];
  practicalRubric: {
    criteriaId: string;
    description: string;
    weightage: number;
  }[];
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  educationLevel: string;
  yearsExperience: number;
  sector: string;
  primaryTrade: string;
  selectedSkills: string[];
  recommendedQpCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceItem {
  id: string;
  competencyId: string;
  type: 'photo' | 'document' | 'supervisor_note' | 'work_log';
  title: string;
  notes: string;
  fileData?: string; // base64 or object url
  timestamp: string;
  verificationStatus?: 'verified' | 'flagged' | 'pending';
  assessorFeedback?: string;
}

export interface RPLCertificate {
  certificateNumber: string;
  workerName: string;
  qpTitle: string;
  qpCode: string;
  nsqfLevel: number;
  issueDate: string;
  assessorName: string;
  assessorId: string;
  verificationHash: string;
  compositeScore: number;
  status: 'VALID' | 'REVOKED';
}

export interface AssessmentSubmission {
  id: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  qpCode: string;
  qpTitle: string;
  nsqfLevel: number;
  status: 'draft' | 'submitted' | 'under_review' | 'certified' | 'not_yet_competent';
  knowledgeAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  knowledgeScore: number;
  evidenceItems: EvidenceItem[];
  aiAnalysis?: AIAnalysisResult;
  assessorReview?: AssessorReview;
  certificate?: RPLCertificate;
  submittedAt?: string;
  lastModifiedAt: string;
  syncedWithServer: boolean;
  syncTimestamp?: string;
}

export interface AIAnalysisResult {
  overallScore: number; // 0 - 100
  competencyScores: Record<string, number>; // competencyId -> score
  suggestedStatus: 'RECOMMEND_CERTIFICATION' | 'NEEDS_FURTHER_ASSESSMENT' | 'NOT_YET_COMPETENT';
  strengths: string[];
  gapAreas: string[];
  confidenceScore: number;
  suggestedTrainingModules: string[];
  generatedAt: string;
  source: 'gemini-1.5-flash' | 'local-deterministic-engine';
  disclaimer: string;
}

export interface AssessorReview {
  assessorId: string;
  assessorName: string;
  finalDecision: 'CERTIFIED' | 'NOT_YET_COMPETENT' | 'DEFERRED_TRAINING';
  practicalScore: number; // 0 - 100
  compositeScore: number; // 0 - 100
  decisionRationale: string;
  assessorNotes: string;
  overrideAI: boolean;
  overrideReason?: string;
  reviewedAt: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'WORKER_PROFILE' | 'ASSESSMENT_SUBMISSION' | 'ASSESSOR_DECISION';
  payload: any;
  queuedAt: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
}
