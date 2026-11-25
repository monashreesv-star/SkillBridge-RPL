import React, { useState, useEffect } from 'react';
import { AssessmentSubmission, AssessorReview } from '../../types';
import { StorageService, STORAGE_EVENT } from '../../services/storageService';
import { getQualificationPackByCode, QUALIFICATION_PACKS } from '../../data/qualificationPacks';
import { LocalizationService, Language } from '../../services/localizationService';
import { GeminiService } from '../../services/geminiService';
import { SecurityService } from '../../services/securityService';
import { 
  Clock, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckSquare, 
  User, 
  ShieldAlert,
  Search,
  Filter,
  Check,
  XCircle,
  BarChart3
} from 'lucide-react';

export const AssessorDashboard: React.FC = () => {
  const [lang, setLang] = useState<Language>(LocalizationService.getCurrentLanguage());
  const t = LocalizationService.t(lang);

  const [assessments, setAssessments] = useState<AssessmentSubmission[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);

  // Assessor Review Form State
  const [assessorName, setAssessorName] = useState('Dr. Anand Varma (NSQF Certified Assessor)');
  const [practicalScore, setPracticalScore] = useState<number>(85);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionAction, setDecisionAction] = useState<'CERTIFIED' | 'NOT_YET_COMPETENT' | 'DEFERRED_TRAINING'>('CERTIFIED');
  const [overrideReason, setOverrideReason] = useState('');
  const [reviewSavedSuccess, setReviewSavedSuccess] = useState<string | null>(null);
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null);

  const loadData = () => {
    const list = StorageService.getAssessments();
    setAssessments(list);
    if (list.length > 0 && !selectedAssessment) {
      setSelectedAssessment(list[0]);
    } else if (selectedAssessment) {
      // Refresh current selected assessment
      const updated = list.find((a) => a.id === selectedAssessment.id);
      if (updated) setSelectedAssessment(updated);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener(STORAGE_EVENT, loadData);
    const handleLangChange = () => setLang(LocalizationService.getCurrentLanguage());
    window.addEventListener('skillbridge:language_changed', handleLangChange);

    return () => {
      window.removeEventListener(STORAGE_EVENT, loadData);
      window.removeEventListener('skillbridge:language_changed', handleLangChange);
    };
  }, []);

  const handleReanalyzeWithAI = async () => {
    if (!selectedAssessment) return;
    setIsReanalyzing(true);
    const qp = getQualificationPackByCode(selectedAssessment.qpCode) || QUALIFICATION_PACKS[0];
    const aiResult = await GeminiService.analyzeAssessment({
      workerProfile: {
        id: selectedAssessment.workerId,
        fullName: selectedAssessment.workerName,
        phone: selectedAssessment.workerPhone,
        location: 'Field Assessment Location',
        educationLevel: 'Secondary',
        yearsExperience: 4,
        sector: qp.sector,
        primaryTrade: qp.title,
        selectedSkills: qp.coreCompetencies.map((c) => c.title),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      qualificationPack: qp,
      knowledgeAnswers: selectedAssessment.knowledgeAnswers,
      evidenceCount: selectedAssessment.evidenceItems.length,
    });

    selectedAssessment.aiAnalysis = aiResult;
    StorageService.saveAssessment(selectedAssessment);
    setPracticalScore(aiResult.overallScore);
    setIsReanalyzing(false);
  };

  useEffect(() => {
    if (selectedAssessment) {
      if (selectedAssessment.assessorReview) {
        setPracticalScore(selectedAssessment.assessorReview.practicalScore);
        setDecisionNotes(selectedAssessment.assessorReview.decisionRationale);
        setDecisionAction(selectedAssessment.assessorReview.finalDecision);
        setOverrideReason(selectedAssessment.assessorReview.overrideReason || '');
      } else {
        setPracticalScore(selectedAssessment.aiAnalysis?.overallScore || 80);
        setDecisionNotes('Candidate verified through practical trade demonstration and theoretical knowledge evaluation.');
        setDecisionAction('CERTIFIED');
        setOverrideReason('');
      }
    }
  }, [selectedAssessment]);

  const handleSaveDecision = () => {
    if (!selectedAssessment) return;

    const cleanAssessorName = SecurityService.sanitizeText(assessorName) || 'Authorized NSQF Assessor';
    const cleanNotes = SecurityService.sanitizeText(decisionNotes) || 'Assessor verified competency against NSQF standards.';
    const cleanOverride = SecurityService.sanitizeText(overrideReason);

    const compositeScore = Math.round((selectedAssessment.knowledgeScore * 0.4) + (practicalScore * 0.6));
    const isOverriding = selectedAssessment.aiAnalysis 
      ? (decisionAction === 'CERTIFIED' && selectedAssessment.aiAnalysis.suggestedStatus !== 'RECOMMEND_CERTIFICATION') ||
        (decisionAction !== 'CERTIFIED' && selectedAssessment.aiAnalysis.suggestedStatus === 'RECOMMEND_CERTIFICATION')
      : false;

    const review: AssessorReview = {
      assessorId: 'assessor-official-001',
      assessorName: cleanAssessorName,
      finalDecision: decisionAction,
      practicalScore,
      compositeScore,
      decisionRationale: cleanNotes,
      assessorNotes: cleanNotes,
      overrideAI: isOverriding,
      overrideReason: isOverriding ? cleanOverride : undefined,
      reviewedAt: new Date().toISOString(),
    };

    const finalStatus: AssessmentSubmission['status'] = 
      decisionAction === 'CERTIFIED' ? 'certified' : 'not_yet_competent';

    StorageService.updateAssessorDecision(selectedAssessment.id, review, finalStatus);
    
    // Refresh assessments and actively update selected assessment reference in component state
    const refreshed = StorageService.getAssessments();
    setAssessments(refreshed);
    const updatedCandidate = refreshed.find((a) => a.id === selectedAssessment.id);
    if (updatedCandidate) {
      setSelectedAssessment(updatedCandidate);
    }

    const successMsg = `Assessment decision for ${selectedAssessment.workerName} finalized as ${decisionAction}!`;
    setReviewSavedSuccess(successMsg);
    setInlineSuccess(successMsg);
    setTimeout(() => {
      setReviewSavedSuccess(null);
      setInlineSuccess(null);
    }, 4000);
  };

  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch = 
      a.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.qpCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.qpTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedQP = selectedAssessment ? getQualificationPackByCode(selectedAssessment.qpCode) : null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t.assessorTitle}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {t.assessorSubtitle}
        </p>
      </div>

      {reviewSavedSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-emerald-600" />
            <span>{reviewSavedSuccess}</span>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Saved to Audit Trail</span>
        </div>
      )}

      {/* Main Grid: Left Roster, Right Inspection Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate Roster (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-600" />
              {t.candidateSubmissions} ({assessments.length})
            </h2>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
              >
                <option value="all">{t.allStatuses}</option>
                <option value="submitted">Submitted / Pending Review</option>
                <option value="certified">Certified</option>
                <option value="not_yet_competent">Not Yet Competent</option>
              </select>
            </div>
          </div>

          {/* List of Candidates */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredAssessments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No assessments match filter criteria.
              </div>
            ) : (
              filteredAssessments.map((item) => {
                const isSelected = selectedAssessment?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedAssessment(item);
                      setInlineSuccess(null);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{item.workerName}</h3>
                        <p className="text-xs text-slate-500">{item.qpTitle}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'certified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'not_yet_competent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Quiz: {item.knowledgeScore}%</span>
                      {item.syncedWithServer ? (
                        <span className="text-emerald-600 font-semibold text-[10px]">Synced</span>
                      ) : (
                        <span className="text-amber-600 font-semibold text-[10px]">Offline Queue</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Assessment Detail & Evaluation Console (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedAssessment ? (
            <>
              {/* Worker Profile Overview Header */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-indigo-600" />
                      <h2 className="text-xl font-extrabold text-slate-900">{selectedAssessment.workerName}</h2>
                      <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                        {selectedAssessment.qpCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedAssessment.qpTitle} (NSQF Level {selectedAssessment.nsqfLevel}) | Phone: {selectedAssessment.workerPhone}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Current Status:</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center ${
                        selectedAssessment.status === 'certified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : selectedAssessment.status === 'not_yet_competent'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {selectedAssessment.status === 'certified' && <Check className="h-3.5 w-3.5 text-emerald-600 mr-1 flex-shrink-0" />}
                      <span>{selectedAssessment.status.replace('_', ' ').toUpperCase()}</span>
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase">{t.knowledgeScore}</span>
                    <span className="text-xl font-extrabold text-slate-900">{selectedAssessment.knowledgeScore}%</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase">{t.aiSuggestedScore}</span>
                    <span className="text-xl font-extrabold text-indigo-600">
                      {selectedAssessment.aiAnalysis?.overallScore || 'N/A'}%
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase">{t.evidenceCount}</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {selectedAssessment.evidenceItems.length} items
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase">{t.syncStatus}</span>
                    <span
                      className={`text-sm font-bold block mt-1 ${
                        selectedAssessment.syncedWithServer ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {selectedAssessment.syncedWithServer ? t.synchronized : t.offlineQueue}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Insights Card (with human-in-the-loop notice & dynamic re-analysis) */}
              {selectedAssessment.aiAnalysis && (
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      AI Evaluation Insights ({selectedAssessment.aiAnalysis.source})
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleReanalyzeWithAI}
                        disabled={isReanalyzing}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
                      >
                        <Sparkles className={`h-3.5 w-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
                        <span>{isReanalyzing ? 'Analyzing with Gemini...' : t.reanalyzeAI}</span>
                      </button>
                      <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                        Confidence: {Math.round(selectedAssessment.aiAnalysis.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-900 mb-4 bg-indigo-100/50 p-2.5 rounded-lg border border-indigo-200">
                    <strong>Mandatory NSQF Safeguard:</strong> {selectedAssessment.aiAnalysis.disclaimer}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-emerald-800 uppercase mb-2 flex items-center gap-1">
                        <Check className="h-4 w-4 text-emerald-600" />
                        Identified Candidate Strengths
                      </h4>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside">
                        {selectedAssessment.aiAnalysis.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-800 uppercase mb-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Identified Competency Gaps
                      </h4>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside">
                        {selectedAssessment.aiAnalysis.gapAreas.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Evidence Review Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Practical Evidence & Workplace Proof ({selectedAssessment.evidenceItems.length})
                </h3>
                <div className="space-y-3">
                  {selectedAssessment.evidenceItems.map((ev) => (
                    <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                      {ev.fileData ? (
                        <img
                          src={ev.fileData}
                          alt={ev.title}
                          className="h-14 w-14 object-cover rounded-lg border border-slate-300 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(ev.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{ev.notes}</p>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            ev.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.verificationStatus === 'flagged'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {ev.verificationStatus === 'verified'
                              ? '✓ Evidence Verified'
                              : ev.verificationStatus === 'flagged'
                              ? '⚠ Clarification Requested'
                              : 'Pending Verification'}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                StorageService.updateEvidenceStatus(selectedAssessment.id, ev.id, 'verified');
                                loadData();
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition shadow-2xs"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                StorageService.updateEvidenceStatus(selectedAssessment.id, ev.id, 'flagged');
                                loadData();
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 rounded-lg transition shadow-2xs"
                            >
                              Flag
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessor Decision Console */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-indigo-500 shadow-md">
                <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-600" />
                  Official Human Assessor Final Determination
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Review practical demonstration, adjust score if necessary, and record official certification decision under NSQF RPL standards.
                </p>

                <div className="space-y-5">
                  {/* Assessor Identity */}
                  <div>
                    <label htmlFor="assessorNameInput" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Authorized Assessor Credential & Sign-Off Name *
                    </label>
                    <input
                      id="assessorNameInput"
                      type="text"
                      value={assessorName}
                      onChange={(e) => setAssessorName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Assessor Practical Score Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="practicalScoreSlider" className="text-xs font-bold text-slate-700 uppercase">
                        {t.practicalScoreLabel}
                      </label>
                      <span className="text-sm font-extrabold text-indigo-600">{practicalScore}%</span>
                    </div>
                    <input
                      id="practicalScoreSlider"
                      type="range"
                      min="0"
                      max="100"
                      value={practicalScore}
                      onChange={(e) => setPracticalScore(parseInt(e.target.value) || 0)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    {selectedQP && (
                      <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800 block mb-1">NSQF Practical Criteria Rubric ({selectedQP.code}):</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {selectedQP.practicalRubric.map((r) => (
                            <li key={r.criteriaId}>
                              {r.description} ({r.weightage}% weight)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Real-time Weighted RPL Certification Metric */}
                    <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
                          NSQF Weighted RPL Composite Score:
                        </span>
                        <span className="font-extrabold text-sm text-indigo-700">
                          {Math.round((selectedAssessment.knowledgeScore * 0.4) + (practicalScore * 0.6))}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            Math.round((selectedAssessment.knowledgeScore * 0.4) + (practicalScore * 0.6)) >= 70
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.round((selectedAssessment.knowledgeScore * 0.4) + (practicalScore * 0.6)))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>40% Knowledge ({selectedAssessment.knowledgeScore}%) + 60% Practical ({practicalScore}%)</span>
                        <span className={Math.round((selectedAssessment.knowledgeScore * 0.4) + (practicalScore * 0.6)) >= 70 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                          {Math.round((selectedAssessment.knowledgeScore * 0.4) + (practicalScore * 0.6)) >= 70 ? '✓ Exceeds 70% NSQF Pass Mark' : '⚠ Below 70% Pass Mark'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decision Options */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      {t.finalDecisionLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setDecisionAction('CERTIFIED')}
                        className={`p-3 rounded-xl border text-left font-bold text-xs flex items-center space-x-2 transition-all ${
                          decisionAction === 'CERTIFIED'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>{t.awardCert}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecisionAction('DEFERRED_TRAINING')}
                        className={`p-3 rounded-xl border text-left font-bold text-xs flex items-center space-x-2 transition-all ${
                          decisionAction === 'DEFERRED_TRAINING'
                            ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span>{t.bridgeTraining}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecisionAction('NOT_YET_COMPETENT')}
                        className={`p-3 rounded-xl border text-left font-bold text-xs flex items-center space-x-2 transition-all ${
                          decisionAction === 'NOT_YET_COMPETENT'
                            ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <XCircle className="h-4 w-4 text-rose-600" />
                        <span>{t.notYetCompetent}</span>
                      </button>
                    </div>
                  </div>

                  {/* Assessor Rationale */}
                  <div>
                    <label htmlFor="decisionNotes" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.assessorRationaleLabel}
                    </label>
                    <textarea
                      id="decisionNotes"
                      rows={3}
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      placeholder="Detail physical observation of candidate during practical wiring/testing demonstration..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* AI Override Rationale (if applicable) */}
                  <div>
                    <label htmlFor="overrideReason" className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      {t.overrideLabel}
                    </label>
                    <input
                      id="overrideReason"
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. Candidate demonstrated superior on-site safety protocol despite lower initial quiz score."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Inline Success Notice */}
                  {inlineSuccess && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span>{inlineSuccess}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono">
                        NSQF VERIFIED
                      </span>
                    </div>
                  )}

                  {/* Submit Assessor Decision */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 italic">
                      Mandatory Human-in-the-Loop: AI output cannot grant certification independently.
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveDecision}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t.confirmSignOff}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              Select a candidate from the roster to inspect their RPL portfolio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
