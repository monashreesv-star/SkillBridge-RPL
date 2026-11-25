import React, { useState } from 'react';
import { Role, WorkerProfile, QualificationPack, AssessmentSubmission } from './types';
import { Header } from './components/common/Header';
import { AccessibleSpeechCaption } from './components/common/AccessibleSpeechCaption';
import { WorkerSelfDeclaration } from './components/worker/WorkerSelfDeclaration';
import { AssessmentPortal } from './components/worker/AssessmentPortal';
import { CompetencyScorecard } from './components/worker/CompetencyScorecard';
import { AssessorDashboard } from './components/assessor/AssessorDashboard';
import { AuditorReview } from './components/auditor/AuditorReview';
import { QUALIFICATION_PACKS } from './data/qualificationPacks';
import { StorageService } from './services/storageService';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>('worker');
  const [workerStep, setWorkerStep] = useState<'self-declaration' | 'assessment' | 'scorecard'>('self-declaration');
  const [activeSubmission, setActiveSubmission] = useState<AssessmentSubmission | null>(null);

  // Current active worker profile & QP in session
  const [activeProfile, setActiveProfile] = useState<WorkerProfile>(() => {
    return StorageService.getCurrentWorkerProfile() || {
      id: 'worker-initial',
      fullName: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      location: 'Jaipur, Rajasthan',
      educationLevel: 'Secondary (Class 10)',
      yearsExperience: 4,
      sector: 'Electrical & Power',
      primaryTrade: 'Domestic Electrician',
      selectedSkills: ['Domestic Wiring & Circuit Boards', 'RCCB & Earth Leakage Testing'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [activeQP, setActiveQP] = useState<QualificationPack>(QUALIFICATION_PACKS[0]);

  const handleStartAssessment = (profile: WorkerProfile, qp: QualificationPack) => {
    setActiveProfile(profile);
    setActiveQP(qp);
    setWorkerStep('assessment');
  };

  const handleAssessmentCompleted = (submission: AssessmentSubmission) => {
    setActiveSubmission(submission);
  };

  const handleViewScorecard = (submission: AssessmentSubmission) => {
    setActiveSubmission(submission);
    setWorkerStep('scorecard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header currentRole={currentRole} onSelectRole={setCurrentRole} />

      <main className="flex-1 pb-16">
        {currentRole === 'worker' && (
          <>
            {workerStep === 'self-declaration' && (
              <WorkerSelfDeclaration onStartAssessment={handleStartAssessment} />
            )}
            {workerStep === 'assessment' && (
              <AssessmentPortal
                workerProfile={activeProfile}
                qualificationPack={activeQP}
                onBackToProfile={() => setWorkerStep('self-declaration')}
                onAssessmentCompleted={handleAssessmentCompleted}
                onViewScorecard={handleViewScorecard}
              />
            )}
            {workerStep === 'scorecard' && activeSubmission && (
              <CompetencyScorecard
                assessment={activeSubmission}
                onBack={() => setWorkerStep('assessment')}
              />
            )}
          </>
        )}

        {currentRole === 'assessor' && <AssessorDashboard />}

        {currentRole === 'auditor' && <AuditorReview />}
      </main>

      <AccessibleSpeechCaption />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SkillBridge RPL — National Skills Qualifications Framework Prior Learning Evaluator</span>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Offline-First PWA</span>
            <span>•</span>
            <span>Gemini 1.5 Flash Enabled</span>
            <span>•</span>
            <span>Human-in-the-Loop Enforced</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
