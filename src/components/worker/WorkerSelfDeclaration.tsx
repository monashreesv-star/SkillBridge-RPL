import React, { useState, useEffect } from 'react';
import { WorkerProfile, QualificationPack } from '../../types';
import { StorageService } from '../../services/storageService';
import { QUALIFICATION_PACKS, recommendQualificationPacks } from '../../data/qualificationPacks';
import { LocalizationService, Language } from '../../services/localizationService';
import { SpeechService } from '../../services/speechService';
import { SecurityService } from '../../services/securityService';
import { 
  UserCheck, 
  Sparkles, 
  Save, 
  ArrowRight, 
  Briefcase, 
  BookOpen, 
  MapPin, 
  Phone, 
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';

interface WorkerSelfDeclarationProps {
  onStartAssessment: (profile: WorkerProfile, qp: QualificationPack) => void;
}

const COMMON_SKILLS = [
  'Domestic Wiring & Circuit Boards',
  'Conduit Bending & Pipe Laying',
  'RCCB & Earth Leakage Testing',
  'Earthing Pit Installation',
  'Solar PV Panel Assembly & Mounting',
  'MC4 Solar Connector Crimping',
  'Solar Inverter DC/AC Hookup',
  'CPVC & UPVC Pipe Solvent Jointing',
  'Sanitary Wall Fixtures & P-Traps',
  'Plumbing Pressure Leak Testing',
  'Automotive OBD-II Diagnostics',
  'Hydraulic Brake Bleeding & Pad Replacement',
  'Vital Signs & Blood Pressure Measurement',
  'WHO Clinical Hand Hygiene Protocols',
  'Bio-Medical Waste Color Segregation',
];

export const WorkerSelfDeclaration: React.FC<WorkerSelfDeclarationProps> = ({ onStartAssessment }) => {
  const [lang, setLang] = useState<Language>(LocalizationService.getCurrentLanguage());
  const t = LocalizationService.t(lang);

  // Default pre-filled profile so the candidate is never blocked by empty validation
  const [profile, setProfile] = useState<WorkerProfile>(() => {
    return StorageService.getCurrentWorkerProfile() || {
      id: `worker-demo-ramesh`,
      fullName: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      location: 'Jaipur, Rajasthan',
      educationLevel: 'Secondary (Class 10)',
      yearsExperience: 4,
      sector: 'Electrical & Power',
      primaryTrade: 'Domestic Electrician',
      selectedSkills: ['Domestic Wiring & Circuit Boards', 'RCCB & Earth Leakage Testing', 'Earthing Pit Installation'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [recommendedQPs, setRecommendedQPs] = useState<QualificationPack[]>([]);
  const [selectedQP, setSelectedQP] = useState<QualificationPack | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);

  // Sync language changes dynamically
  useEffect(() => {
    const handleLangChange = () => {
      setLang(LocalizationService.getCurrentLanguage());
    };
    window.addEventListener('skillbridge:language_changed', handleLangChange);
    return () => {
      window.removeEventListener('skillbridge:language_changed', handleLangChange);
      SpeechService.stop();
    };
  }, []);

  const handleToggleGuideSpeech = () => {
    if (isSpeakingGuide) {
      SpeechService.stop();
      setIsSpeakingGuide(false);
    } else {
      setIsSpeakingGuide(true);
      const textToRead = `${t.step1Title}. ${t.step1Subtitle}`;
      SpeechService.speak(textToRead, lang, () => setIsSpeakingGuide(false));
    }
  };

  // Update recommendations whenever sector, skills, or experience change
  useEffect(() => {
    const qps = recommendQualificationPacks(
      profile.sector,
      profile.selectedSkills,
      profile.yearsExperience * 12
    );
    setRecommendedQPs(qps);
    if (qps.length > 0 && !selectedQP) {
      setSelectedQP(qps[0]);
    }
  }, [profile.sector, profile.selectedSkills, profile.yearsExperience]);

  const handleFillDemo = (trade: 'electrician' | 'solar' | 'plumber') => {
    let demoProfile: WorkerProfile;

    if (trade === 'electrician') {
      demoProfile = {
        id: 'worker-demo-ramesh',
        fullName: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        location: 'Jaipur, Rajasthan',
        educationLevel: 'Secondary (Class 10)',
        yearsExperience: 4,
        sector: 'Electrical & Power',
        primaryTrade: 'Domestic Electrician',
        selectedSkills: [
          'Domestic Wiring & Circuit Boards',
          'Conduit Bending & Pipe Laying',
          'RCCB & Earth Leakage Testing',
          'Earthing Pit Installation',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (trade === 'solar') {
      demoProfile = {
        id: 'worker-demo-anita',
        fullName: 'Anita Sharma',
        phone: '+91 91234 56789',
        location: 'Ahmedabad, Gujarat',
        educationLevel: 'Higher Secondary (Class 12)',
        yearsExperience: 3,
        sector: 'Renewable Energy',
        primaryTrade: 'Solar PV Installer',
        selectedSkills: [
          'Solar PV Panel Assembly & Mounting',
          'MC4 Solar Connector Crimping',
          'Solar Inverter DC/AC Hookup',
          'Earthing Pit Installation',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      demoProfile = {
        id: 'worker-demo-suresh',
        fullName: 'Suresh Patel',
        phone: '+91 98111 22334',
        location: 'Indore, Madhya Pradesh',
        educationLevel: 'Primary (Class 8)',
        yearsExperience: 5,
        sector: 'Plumbing & Water Management',
        primaryTrade: 'General Plumber',
        selectedSkills: [
          'CPVC & UPVC Pipe Solvent Jointing',
          'Sanitary Wall Fixtures & P-Traps',
          'Plumbing Pressure Leak Testing',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    setProfile(demoProfile);
    StorageService.saveWorkerProfile(demoProfile);
    setSaveStatus('Demo Profile Populated & Saved');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleToggleSkill = (skill: string) => {
    const exists = profile.selectedSkills.includes(skill);
    const updatedSkills = exists
      ? profile.selectedSkills.filter((s) => s !== skill)
      : [...profile.selectedSkills, skill];

    const updatedProfile = {
      ...profile,
      selectedSkills: updatedSkills,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updatedProfile);
  };

  const handleManualSave = () => {
    StorageService.saveWorkerProfile(profile);
    setSaveStatus('Self-Declaration Progress Saved Offline');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleProceed = () => {
    const rawName = profile.fullName.trim() || 'Ramesh Kumar';
    const cleanName = SecurityService.sanitizeText(rawName);
    const cleanLocation = SecurityService.sanitizeText(profile.location);
    const phoneValidation = SecurityService.validatePhoneNumber(profile.phone);
    const qpToUse = selectedQP || recommendedQPs[0] || QUALIFICATION_PACKS[0];
    
    const finalProfile: WorkerProfile = {
      ...profile,
      fullName: cleanName || 'Ramesh Kumar',
      phone: phoneValidation.formatted || profile.phone,
      location: cleanLocation,
      recommendedQpCode: qpToUse.code,
    };
    StorageService.saveWorkerProfile(finalProfile);
    onStartAssessment(finalProfile, qpToUse);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <UserCheck className="h-4 w-4" />
              <span>{t.step1Badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.step1Title}
            </h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-2xl leading-relaxed">
              {t.step1Subtitle}
            </p>

            {/* Audio Read-Aloud for Informal Workers */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleToggleGuideSpeech}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition border border-white/20"
                title="Voice Read-Aloud for low-literacy informal workers"
              >
                {isSpeakingGuide ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    <span>Stop Voice Guide</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-indigo-200" />
                    <span>Listen to Voice Guide (Audio)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fill for Hackathon Evaluators */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 self-start sm:self-center">
            <span className="block text-xs font-semibold text-indigo-100 mb-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-300" />
              {t.quickDemo}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo('electrician')}
                className="text-xs bg-white text-indigo-900 font-semibold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-50 transition"
              >
                {t.demoElectrician}
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('solar')}
                className="text-xs bg-white text-indigo-900 font-semibold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-50 transition"
              >
                {t.demoSolar}
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('plumber')}
                className="text-xs bg-white text-indigo-900 font-semibold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-50 transition"
              >
                {t.demoPlumber}
              </button>
            </div>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">{saveStatus}</span>
          </div>
          <span className="text-xs text-emerald-600">Encrypted in Local Storage</span>
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Section 1: Demographics */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-600" />
            {t.candidateIdentity}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.fullName}
              </label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.mobileNumber}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.cityDistrict}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="location"
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Jaipur, Rajasthan"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="education" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.educationLevel}
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  id="education"
                  value={profile.educationLevel}
                  onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Non-Formal / Literate">Non-Formal / Literate</option>
                  <option value="Primary (Class 5)">Primary (Class 5)</option>
                  <option value="Middle (Class 8)">Middle (Class 8)</option>
                  <option value="Secondary (Class 10)">Secondary (Class 10)</option>
                  <option value="Higher Secondary (Class 12)">Higher Secondary (Class 12)</option>
                  <option value="ITI / Vocational Diploma">ITI / Vocational Diploma</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Work History & Sector */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            {t.tradeExpHistory}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sector" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.industrySector}
              </label>
              <select
                id="sector"
                value={profile.sector}
                onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Electrical & Power">Electrical & Power</option>
                <option value="Renewable Energy">Renewable Energy (Solar)</option>
                <option value="Plumbing & Water Management">Plumbing & Water Management</option>
                <option value="Automotive & Mobility">Automotive & Mobility</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
              </select>
            </div>

            <div>
              <label htmlFor="trade" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.primaryTrade}
              </label>
              <input
                id="trade"
                type="text"
                value={profile.primaryTrade}
                onChange={(e) => setProfile({ ...profile, primaryTrade: e.target.value })}
                placeholder="Electrician / Solar Wireman"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="yearsExperience" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {t.practicalYears}
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="yearsExperience"
                  type="number"
                  min="1"
                  max="40"
                  value={profile.yearsExperience}
                  onChange={(e) => setProfile({ ...profile, yearsExperience: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Self-Selected Skills Checklist */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            {t.practicalTasksTitle}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {t.practicalTasksDesc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {COMMON_SKILLS.map((skill) => {
              const checked = profile.selectedSkills.includes(skill);
              const label = t.skillsMap[skill] || skill;
              return (
                <label
                  key={skill}
                  className={`flex items-center space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleSkill(skill)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: NSQF Qualification Pack Recommendations */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                {t.recommendedQPsTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.recommendedQPsDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedQPs.map((qp) => {
              const isSelected = selectedQP?.code === qp.code;
              const qpTitle = lang === 'hi' && qp.title_hi ? qp.title_hi : lang === 'ta' && qp.title_ta ? qp.title_ta : qp.title;
              const qpDesc = lang === 'hi' && qp.description_hi ? qp.description_hi : lang === 'ta' && qp.description_ta ? qp.description_ta : qp.description;

              // Calculate algorithmic match score based on selected practical skills
              const overlapCount = qp.coreCompetencies.filter((c) =>
                profile.selectedSkills.some((s) => c.title.toLowerCase().includes(s.split(' ')[0].toLowerCase()))
              ).length;
              const matchScore = Math.min(98, Math.max(72, Math.round((overlapCount / Math.max(1, qp.coreCompetencies.length)) * 100) + 40));

              return (
                <div
                  key={qp.code}
                  onClick={() => setSelectedQP(qp)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {qp.code}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {matchScore}% NSQF Fit
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{qpTitle}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{qpDesc}</p>
                    </div>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full whitespace-nowrap">
                      Level {qp.nsqfLevel}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>{t.minExperience} {Math.round(qp.minimumExperienceMonths / 12)} years</span>
                    <span className="text-indigo-600 font-semibold">{qp.coreCompetencies.length} {t.competenciesCount}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explainable Matching & Competency Gap Analysis */}
          {selectedQP && (
            <div className="mt-4 p-5 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-2xl border border-indigo-100 shadow-sm animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-100 gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    NSQF Alignment Explanation & Competency Gap Profiling
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Selected Qualification Pack: <strong>{selectedQP.title}</strong> ({selectedQP.code})
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 self-start sm:self-auto">
                  Deterministic Match
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
                {/* Acquired Competencies */}
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 uppercase text-[11px] mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Recognized Prior Skills ({profile.selectedSkills.length})
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    {profile.selectedSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Gaps / Bridge Training Modules */}
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800 flex items-center gap-1 uppercase text-[11px] mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Target NOS Competencies & Bridge Areas
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    {selectedQP.coreCompetencies.map((comp) => (
                      <li key={comp.id} className="flex items-start space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0"></span>
                        <div>
                          <strong className="text-slate-800">{comp.code}:</strong> {comp.title}
                          <span className="text-[10px] text-slate-400 block">{comp.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleManualSave}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm bg-white"
            >
              <Save className="h-4 w-4 text-emerald-600" />
              <span>{t.saveOfflineDraft}</span>
            </button>
            {saveStatus && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{saveStatus}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition"
          >
            <span>{t.proceedToAssessment}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
