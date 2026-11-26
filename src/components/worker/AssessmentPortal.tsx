import React, { useState, useEffect } from 'react';
import { WorkerProfile, QualificationPack, AssessmentSubmission, EvidenceItem } from '../../types';
import { StorageService } from '../../services/storageService';
import { GeminiService } from '../../services/geminiService';
import { LocalizationService, Language } from '../../services/localizationService';
import { SpeechService } from '../../services/speechService';
import { SecurityService } from '../../services/securityService';
import { 
  CheckCircle, 
  HelpCircle, 
  Camera, 
  UploadCloud, 
  Sparkles, 
  AlertTriangle, 
  ArrowLeft,
  FileCheck2,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface AssessmentPortalProps {
  workerProfile: WorkerProfile;
  qualificationPack: QualificationPack;
  onBackToProfile: () => void;
  onAssessmentCompleted: (submission: AssessmentSubmission) => void;
  onViewScorecard?: (submission: AssessmentSubmission) => void;
}

export const AssessmentPortal: React.FC<AssessmentPortalProps> = ({
  workerProfile,
  qualificationPack,
  onBackToProfile,
  onAssessmentCompleted,
  onViewScorecard,
}) => {
  const [lang, setLang] = useState<Language>(LocalizationService.getCurrentLanguage());
  const t = LocalizationService.t(lang);

  useEffect(() => {
    const handleLangChange = () => setLang(LocalizationService.getCurrentLanguage());
    window.addEventListener('skillbridge:language_changed', handleLangChange);
    return () => {
      window.removeEventListener('skillbridge:language_changed', handleLangChange);
      SpeechService.stop();
    };
  }, []);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [speakingQuestionId, setSpeakingQuestionId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([
    {
      id: `ev-${Date.now()}-1`,
      competencyId: qualificationPack.coreCompetencies[0]?.id || 'comp-1',
      type: 'photo',
      title: 'Workplace installation demonstration',
      notes: 'Demonstrated correct circuit hookup and safety clearance during field service.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceNotes, setNewEvidenceNotes] = useState('');
  const [newEvidenceCompetency, setNewEvidenceCompetency] = useState(
    qualificationPack.coreCompetencies[0]?.id || ''
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<AssessmentSubmission | null>(null);
  const [evidenceSuccessMsg, setEvidenceSuccessMsg] = useState<string | null>(null);

  const handleToggleSpeak = (
    qId: string,
    primaryText: string,
    captionText?: string,
    fallbackPhoneticText?: string
  ) => {
    if (speakingQuestionId === qId) {
      SpeechService.stop();
      setSpeakingQuestionId(null);
    } else {
      setSpeakingQuestionId(qId);
      SpeechService.speak(
        primaryText,
        lang,
        () => {
          setSpeakingQuestionId(null);
        },
        captionText,
        fallbackPhoneticText
      );
    }
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Security & file constraint verification
    const validation = SecurityService.validateEvidenceFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNotes = SecurityService.sanitizeText(newEvidenceNotes);
    let cleanTitle = SecurityService.sanitizeText(newEvidenceTitle);

    // If title was omitted, auto-generate meaningful descriptive title from competency
    if (!cleanTitle.trim()) {
      const comp = qualificationPack.coreCompetencies.find((c) => c.id === newEvidenceCompetency);
      cleanTitle = comp ? `${comp.title} - Practical Demonstration` : 'Workplace Demonstration Log';
    }

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      competencyId: newEvidenceCompetency,
      type: 'photo',
      title: cleanTitle,
      notes: cleanNotes || 'Practical workplace demonstration logbook record.',
      fileData: photoPreview || undefined,
      timestamp: new Date().toISOString(),
    };

    setEvidenceList([...evidenceList, newItem]);
    setNewEvidenceTitle('');
    setNewEvidenceNotes('');
    setPhotoPreview(null);
    setUploadError(null);
    setEvidenceSuccessMsg('Evidence item successfully added to portfolio!');
    setTimeout(() => setEvidenceSuccessMsg(null), 3000);
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList(evidenceList.filter((ev) => ev.id !== id));
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    // Calculate knowledge score
    let correct = 0;
    const totalQ = qualificationPack.knowledgeQuestions.length;
    qualificationPack.knowledgeQuestions.forEach((q) => {
      if (answers[q.id] === q.correctOptionIndex) {
        correct += 1;
      }
    });
    const knowledgeScore = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 100;

    // Call GeminiService (Gemini API with fallback to deterministic engine)
    const aiResult = await GeminiService.analyzeAssessment({
      workerProfile,
      qualificationPack,
      knowledgeAnswers: answers,
      evidenceCount: evidenceList.length,
    });

    const isOnline = StorageService.isOnline();
    const submission: AssessmentSubmission = {
      id: `sub-${Date.now()}`,
      workerId: workerProfile.id,
      workerName: workerProfile.fullName,
      workerPhone: workerProfile.phone,
      qpCode: qualificationPack.code,
      qpTitle: qualificationPack.title,
      nsqfLevel: qualificationPack.nsqfLevel,
      status: 'submitted',
      knowledgeAnswers: answers,
      knowledgeScore,
      evidenceItems: evidenceList,
      aiAnalysis: aiResult,
      submittedAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: isOnline,
      syncTimestamp: isOnline ? new Date().toISOString() : undefined,
    };

    // Save locally & queue for sync if offline
    StorageService.saveAssessment(submission);

    setIsSubmitting(false);
    setSubmissionSuccess(submission);
    onAssessmentCompleted(submission);
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = qualificationPack.knowledgeQuestions.length;
  const qpTitle = lang === 'hi' && qualificationPack.title_hi ? qualificationPack.title_hi : lang === 'ta' && qualificationPack.title_ta ? qualificationPack.title_ta : qualificationPack.title;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToProfile}
          className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Self-Declaration</span>
        </button>
        <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-3 py-1 rounded-full">
          Candidate: {workerProfile.fullName}
        </span>
      </div>

      <div className="bg-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck2 className="h-4 w-4" />
              <span>Step 2 of 3: Formal Competency Evaluation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{qpTitle}</h1>
            <p className="text-indigo-200 text-sm mt-1">
              QP Code: {qualificationPack.code} | NSQF Level {qualificationPack.nsqfLevel} | {qualificationPack.sector}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center">
            <span className="block text-xs text-indigo-200 uppercase font-semibold">Questions Answered</span>
            <span className="text-2xl font-bold text-white">
              {answeredCount} / {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Submission Success Banner */}
      {submissionSuccess && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-sm animate-fadeIn">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                {t.assessmentSubmittedTitle}
              </h3>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                {t.assessmentSubmittedDesc}{' '}
                {submissionSuccess.syncedWithServer ? (
                  <span className="font-semibold text-emerald-700"> {t.syncedServer}</span>
                ) : (
                  <span className="font-semibold text-amber-700"> {t.storedOffline}</span>
                )}
              </p>
              <div className="mt-4 p-4 bg-white rounded-xl border border-emerald-200">
                <span className="text-xs uppercase font-bold text-slate-500 block mb-1">
                  {t.aiPreliminaryRec} ({submissionSuccess.aiAnalysis?.source}):
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  Calculated Score: {submissionSuccess.aiAnalysis?.overallScore}% — Status: {submissionSuccess.aiAnalysis?.suggestedStatus}
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {t.humanSafeguardNotice}
                </p>
              </div>

              {onViewScorecard && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => onViewScorecard(submissionSuccess)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-2"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>{t.viewScorecardBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section A: Technical Knowledge Quiz */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              {t.partATitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.partADesc}
            </p>
          </div>
        </div>

        {qualificationPack.knowledgeQuestions.map((q, qIndex) => {
          const selectedOption = answers[q.id];
          const isSpeakingThis = speakingQuestionId === q.id;
          const qText = lang === 'hi' && q.question_hi ? q.question_hi : lang === 'ta' && q.question_ta ? q.question_ta : q.question;
          const qOptions = lang === 'hi' && q.options_hi ? q.options_hi : lang === 'ta' && q.options_ta ? q.options_ta : q.options;

          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between space-x-3 mb-4">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {qText}
                  </h3>
                </div>

                {/* Voice Read-Aloud Accessibility Button */}
                <button
                  type="button"
                  onClick={() => {
                    const numTamil = ['ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து'][qIndex] || `${qIndex + 1}`;
                    const optPrefixesTamil = ['விருப்பம் ஒன்று', 'விருப்பம் இரண்டு', 'விருப்பம் மூன்று', 'விருப்பம் நான்கு'];
                    const spokenTamil =
                      q.audio_script_ta ||
                      `கேள்வி ${numTamil}: ${qText}. ${qOptions.map((opt, i) => `${optPrefixesTamil[i] || `விருப்பம் ${i + 1}`}: ${opt}`).join('. ')}.`;

                    const numHindi = ['एक', 'दो', 'तीन', 'चार', 'पाँच'][qIndex] || `${qIndex + 1}`;
                    const optPrefixesHindi = ['विकल्प एक', 'विकल्प दो', 'विकल्प तीन', 'विकल्प चार'];
                    const spokenHindi =
                      q.audio_script_hi ||
                      `प्रश्न ${numHindi}: ${qText}. ${qOptions.map((opt, i) => `${optPrefixesHindi[i] || `विकल्प ${i + 1}`}: ${opt}`).join('. ')}.`;

                    const spokenEnglish = `Question ${qIndex + 1}: ${q.question}. ${q.options.map((opt, i) => `Option ${i + 1}: ${opt}`).join('. ')}.`;

                    const primaryText = lang === 'ta' ? spokenTamil : lang === 'hi' ? spokenHindi : spokenEnglish;
                    const captionText = `${qText} — (${qOptions.map((opt, i) => `${i + 1}: ${opt}`).join(', ')})`;
                    const fallbackPhonetic = lang === 'ta' ? q.audio_ta : lang === 'hi' ? q.audio_hi : undefined;

                    handleToggleSpeak(q.id, primaryText, captionText, fallbackPhonetic);
                  }}
                  className={`flex-shrink-0 p-1.5 rounded-lg border transition-all flex items-center space-x-1 text-xs font-semibold ${
                    isSpeakingThis
                      ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                      : 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                  }`}
                  title="Listen to question aloud (Audio Accessibility for low literacy)"
                  aria-label={`Listen to question ${qIndex + 1} aloud`}
                >
                  {isSpeakingThis ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span className="hidden sm:inline">Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Audio</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2.5 ml-9">
                {qOptions.map((option, optIdx) => {
                  const isChecked = selectedOption === optIdx;
                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-medium'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={isChecked}
                        onChange={() => handleSelectAnswer(q.id, optIdx)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section B: Practical Evidence Upload */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="pb-4 border-b border-slate-100 mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Camera className="h-5 w-5 text-indigo-600" />
            {t.partBTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.partBDesc}
          </p>
        </div>

        {/* Existing Evidence List */}
        {evidenceList.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase">
              {t.attachedEvidence} ({evidenceList.length})
            </h3>
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {ev.fileData ? (
                    <img
                      src={ev.fileData}
                      alt={ev.title}
                      className="h-10 w-10 object-cover rounded-lg border border-slate-300 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-500">{ev.notes}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEvidence(ev.id)}
                  className="text-slate-400 hover:text-rose-600 transition p-1"
                  title="Remove Evidence"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Evidence Form */}
        <form onSubmit={handleAddEvidence} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">{t.addEvidenceTitle}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="evidenceTitle" className="block text-xs font-medium text-slate-700 mb-1">
                {t.taskTitleLabel}
              </label>
              <input
                id="evidenceTitle"
                type="text"
                placeholder="e.g. Inverter Earth Resistance Measurement"
                value={newEvidenceTitle}
                onChange={(e) => setNewEvidenceTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="evidenceComp" className="block text-xs font-medium text-slate-700 mb-1">
                {t.targetCompetencyLabel}
              </label>
              <select
                id="evidenceComp"
                value={newEvidenceCompetency}
                onChange={(e) => setNewEvidenceCompetency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {qualificationPack.coreCompetencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="evidenceNotes" className="block text-xs font-medium text-slate-700 mb-1">
                {t.fieldNotesLabel}
              </label>
              <input
                id="evidenceNotes"
                type="text"
                placeholder="e.g. Conducted test under supervisor inspection using calibrated 4-terminal earth tester."
                value={newEvidenceNotes}
                onChange={(e) => setNewEvidenceNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="evidencePhoto" className="block text-xs font-medium text-slate-700 mb-1">
                {t.attachPhotoLabel}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="evidencePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Uploaded preview"
                    className="h-8 w-8 object-cover rounded border border-slate-300 flex-shrink-0"
                  />
                )}
              </div>
              {uploadError && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{uploadError}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{t.attachEvidenceBtn}</span>
            </button>
            {evidenceSuccessMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                {evidenceSuccessMsg}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Submission Safeguard Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>NSQF Human-in-the-Loop Policy:</strong> SkillBridge RPL utilizes Google Gemini 1.5 Flash to prepare preliminary portfolio scores and identify competency strengths and gaps. However, AI cannot issue a certificate independently. Final certification strictly requires evaluation and sign-off by a certified Human Assessor.
        </div>
      </div>

      {/* Final Submit Action */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmitAssessment}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>{t.analyzingWithAI}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>{t.submitAssessmentBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
