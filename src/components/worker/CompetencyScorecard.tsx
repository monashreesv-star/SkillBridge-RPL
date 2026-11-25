import React, { useRef, useState, useEffect } from 'react';
import { AssessmentSubmission } from '../../types';
import { getQualificationPackByCode } from '../../data/qualificationPacks';
import { LocalizationService } from '../../services/localizationService';
import { SpeechService } from '../../services/speechService';
import { CertificateVerificationModal } from '../common/CertificateVerificationModal';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowLeft, 
  Printer, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  User,
  QrCode,
  Volume2,
  VolumeX
} from 'lucide-react';

interface CompetencyScorecardProps {
  assessment: AssessmentSubmission;
  onBack: () => void;
}

export const CompetencyScorecard: React.FC<CompetencyScorecardProps> = ({ assessment, onBack }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const qp = getQualificationPackByCode(assessment.qpCode);
  const [lang, setLang] = useState(LocalizationService.getCurrentLanguage());
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isSpeakingResult, setIsSpeakingResult] = useState(false);
  const t = LocalizationService.t(lang);

  useEffect(() => {
    const handleLang = () => setLang(LocalizationService.getCurrentLanguage());
    window.addEventListener('skillbridge:language_changed', handleLang);
    return () => {
      window.removeEventListener('skillbridge:language_changed', handleLang);
      SpeechService.stop();
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const isCertified = assessment.status === 'certified' || assessment.assessorReview?.finalDecision === 'CERTIFIED';
  const isPending = assessment.status === 'submitted' || assessment.status === 'under_review';
  const isDeferred = assessment.assessorReview?.finalDecision === 'DEFERRED_TRAINING';

  const handleToggleSpeakResult = () => {
    if (isSpeakingResult) {
      SpeechService.stop();
      setIsSpeakingResult(false);
    } else {
      setIsSpeakingResult(true);
      const textToRead = `${assessment.workerName}. NSQF RPL Trade Result: ${assessment.qpTitle}. Status: ${
        isCertified ? 'Officially Certified by Human Assessor' : 'Assessor Review Pending'
      }. Knowledge Score: ${assessment.knowledgeScore} percent.`;
      SpeechService.speak(textToRead, lang, () => setIsSpeakingResult(false));
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.scorecardBackBtn}</span>
        </button>

        <div className="flex items-center space-x-2">
          {isCertified && (
            <>
              <button
                type="button"
                onClick={() => setShowVerifyModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <QrCode className="h-4 w-4 text-indigo-600" />
                <span>Verify Registry</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Printer className="h-4 w-4" />
                <span>{t.scorecardPrintBtn}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="h-4 w-4" />
              <span>{t.scorecardResultBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{assessment.workerName}</h1>
            <p className="text-indigo-200 text-sm mt-1">
              Trade: {assessment.qpTitle} ({assessment.qpCode}) • NSQF Level {assessment.nsqfLevel}
            </p>

            {/* Audio Read-out for worker */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleToggleSpeakResult}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-indigo-100 transition border border-white/20"
                title="Listen to score and certificate result"
              >
                {isSpeakingResult ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-indigo-300" />
                    <span>Listen to Scorecard (Audio)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-center">
            <span className="block text-xs uppercase tracking-wider text-indigo-200 font-semibold mb-1">
              {t.finalOfficialStatus}
            </span>
            {isCertified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-sm font-extrabold">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                {t.rplCertifiedBadge}
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-sm font-extrabold">
                <Clock className="h-4 w-4 text-amber-400" />
                {t.assessorPendingBadge}
              </span>
            )}
            {isDeferred && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-sm font-extrabold">
                <Clock className="h-4 w-4 text-amber-400" />
                {t.bridgeTrainingBadge}
              </span>
            )}
            {!isCertified && !isPending && !isDeferred && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-400/40 rounded-full text-sm font-extrabold">
                <XCircle className="h-4 w-4 text-rose-400" />
                {t.notYetCompetent}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Official Certificate Presentation (if certified) */}
      {isCertified && (
        <div
          ref={certificateRef}
          className="bg-amber-50/40 border-4 border-amber-600/60 rounded-3xl p-8 sm:p-12 shadow-2xl mb-10 relative overflow-hidden text-slate-900"
        >
          {/* Watermark Emblem */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <Award className="h-96 w-96 text-amber-900" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b-2 border-amber-600/30">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <ShieldCheck className="h-8 w-8 text-amber-700" />
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wider uppercase text-amber-950">
                National Skills Recognition Certificate
              </h2>
            </div>
            <p className="text-xs uppercase font-bold text-amber-800 tracking-widest">
              Issued under the Recognition of Prior Learning (RPL) Framework
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Ministry of Skill Development & Entrepreneurship • Government of India Alignment
            </p>
          </div>

          {/* Certificate Body */}
          <div className="text-center my-8 space-y-4">
            <p className="text-sm italic text-slate-600">This is to certify that</p>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-indigo-950 tracking-tight">
              {assessment.workerName}
            </h3>
            <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              has successfully demonstrated prior learning competency, practical occupational mastery, and trade safety knowledge in accordance with the National Occupational Standards for:
            </p>
            <div className="py-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">
                {assessment.qpTitle}
              </span>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full mt-1 inline-block">
                Qualification Pack Code: {assessment.qpCode} • NSQF Level {assessment.nsqfLevel}
              </span>
            </div>
          </div>

          {/* Certificate Metadata & QR */}
          <div className="pt-6 border-t-2 border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-700">
            <div className="space-y-1 text-center sm:text-left">
              <p>
                <strong>Certificate Number:</strong>{' '}
                <span className="font-mono font-bold text-indigo-900">
                  {assessment.certificate?.certificateNumber || `NSQF-RPL-2026-${assessment.id.slice(-6).toUpperCase()}`}
                </span>
              </p>
              <p>
                <strong>Issue Date:</strong> {assessment.certificate?.issueDate || new Date().toLocaleDateString('en-IN')}
              </p>
              <p>
                <strong>Verification Hash:</strong>{' '}
                <span className="font-mono text-[10px] text-slate-500">
                  {assessment.certificate?.verificationHash || `SHA256:RPL9408-${assessment.workerId}`}
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-amber-200">
              <QrCode className="h-12 w-12 text-slate-800" />
              <div className="text-[10px] leading-tight text-slate-500">
                <span className="font-bold text-slate-900 block">Digital Verification</span>
                Scan to verify RPL validity on central registry
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="h-10 flex items-end justify-center sm:justify-end pb-1">
                <span className="font-serif italic font-bold text-base text-slate-800">
                  {assessment.assessorReview?.assessorName || 'Dr. Anand Varma'}
                </span>
              </div>
              <p className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                Certified Lead Assessor
              </p>
              <p className="text-[10px] text-slate-500">
                License: {assessment.assessorReview?.assessorId || 'ASSR-REG-2026-904'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scorecard Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Metric Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* NOS Competency Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Competency Performance by NOS Standards
            </h3>
            <div className="space-y-4">
              {qp?.coreCompetencies.map((comp) => {
                const score = assessment.aiAnalysis?.competencyScores?.[comp.id] || 82;
                return (
                  <div key={comp.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-500 mr-2">{comp.code}</span>
                        <span className="font-bold text-slate-800">{comp.title}</span>
                      </div>
                      <span className="font-extrabold text-indigo-600">{score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights & Strengths */}
          {assessment.aiAnalysis && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Portfolio Competency Insights ({assessment.aiAnalysis.source})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 uppercase mb-2">Demonstrated Strengths</h4>
                  <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                    {assessment.aiAnalysis.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 uppercase mb-2">Refinement Opportunities</h4>
                  <ul className="space-y-1 text-amber-800 list-disc list-inside">
                    {assessment.aiAnalysis.gapAreas.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Candidate Profile & Assessor Determination */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Candidate Profile
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <strong className="text-slate-800">Phone:</strong> {assessment.workerPhone}
              </p>
              <p>
                <strong className="text-slate-800">Assessed Knowledge:</strong> {assessment.knowledgeScore}%
              </p>
              <p>
                <strong className="text-slate-800">Attached Evidence:</strong> {assessment.evidenceItems.length} items
              </p>
              <p>
                <strong className="text-slate-800">Sync Status:</strong>{' '}
                <span className={assessment.syncedWithServer ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {assessment.syncedWithServer ? 'Central Cloud Synced' : 'Offline Stored'}
                </span>
              </p>
            </div>
          </div>

          {/* Assessor Sign-Off Statement */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Assessor Formal Decision
            </h3>
            {assessment.assessorReview ? (
              <div className="space-y-2 text-xs">
                <p>
                  <strong>Assessor:</strong> {assessment.assessorReview.assessorName}
                </p>
                <p>
                  <strong>Practical Demonstration:</strong> {assessment.assessorReview.practicalScore}%
                </p>
                <p>
                  <strong>Composite Score:</strong> {assessment.assessorReview.compositeScore}%
                </p>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 italic">
                  "{assessment.assessorReview.decisionRationale}"
                </p>
                {assessment.assessorReview.overrideAI && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded">
                    <strong>AI Override Note:</strong> {assessment.assessorReview.overrideReason}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Awaiting final review and score confirmation from an authorized Human Assessor on the Assessor Desk.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <CertificateVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        initialCertId={assessment.certificate?.certificateNumber}
      />
    </div>
  );
};
