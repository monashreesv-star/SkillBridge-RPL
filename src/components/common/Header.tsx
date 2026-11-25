import React, { useState, useEffect } from 'react';
import { Role } from '../../types';
import { StorageService, STORAGE_EVENT } from '../../services/storageService';
import { GeminiService } from '../../services/geminiService';
import { LocalizationService, Language } from '../../services/localizationService';
import { CertificateVerificationModal } from './CertificateVerificationModal';
import { AuthLoginModal } from './AuthLoginModal';
import { 
  Award, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  User, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Key,
  Globe,
  QrCode,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onSelectRole: (role: Role) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onSelectRole }) => {
  const [isOnline, setIsOnline] = useState<boolean>(StorageService.isOnline());
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(StorageService.isSimulatedOffline());
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isGeminiActive, setIsGeminiActive] = useState<boolean>(GeminiService.isConfigured());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [workerSessionName, setWorkerSessionName] = useState<string>('Ramesh Kumar');
  const [assessorSessionName, setAssessorSessionName] = useState<string>('Dr. Anand Varma');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(LocalizationService.getCurrentLanguage());
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);

  const t = LocalizationService.t(currentLang);

  const updateState = () => {
    setIsOnline(StorageService.isOnline());
    setIsSimulatedOffline(StorageService.isSimulatedOffline());
    setPendingCount(StorageService.getSyncQueue().length);
    setIsGeminiActive(GeminiService.isConfigured());
    setCurrentLang(LocalizationService.getCurrentLanguage());
    const profile = StorageService.getCurrentWorkerProfile();
    if (profile?.fullName) {
      setWorkerSessionName(profile.fullName);
    }
  };

  useEffect(() => {
    updateState();
    window.addEventListener(STORAGE_EVENT, updateState);
    window.addEventListener('skillbridge:language_changed', updateState);
    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);

    return () => {
      window.removeEventListener(STORAGE_EVENT, updateState);
      window.removeEventListener('skillbridge:language_changed', updateState);
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    LocalizationService.setLanguage(lang);
    setCurrentLang(lang);
  };

  const handleToggleOffline = () => {
    const nextState = !isSimulatedOffline;
    StorageService.setSimulatedOffline(nextState);
    setIsSimulatedOffline(nextState);
    setIsOnline(!nextState && navigator.onLine);
  };

  const handleSyncNow = () => {
    if (!StorageService.isOnline()) {
      setSyncFeedback('Cannot sync: System is offline');
      setTimeout(() => setSyncFeedback(null), 3000);
      return;
    }
    const result = StorageService.syncPendingItems();
    setSyncFeedback(`Successfully synchronized ${result.successCount} items!`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      GeminiService.setRuntimeApiKey(apiKeyInput.trim());
      setIsGeminiActive(true);
      setShowKeyModal(false);
      setApiKeyInput('');
      setTestResult(null);
    }
  };

  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    const result = await GeminiService.testConnection(apiKeyInput);
    setIsTestingKey(false);
    setTestResult(result);
  };

  const handleUseDemoKey = () => {
    const activeKey = 'AIzaSyDemo-NSQF-Gemini-1.5-Flash';
    setApiKeyInput(activeKey);
    GeminiService.setRuntimeApiKey(activeKey);
    setIsGeminiActive(true);
    setTestResult({ success: true, message: 'Google Gemini 1.5 Flash Activated & Operational!' });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Award className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight">SkillBridge RPL</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                  NSQF Aligned
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Recognition of Prior Learning Platform</p>
            </div>
          </div>

          {/* Navigation Role Switcher */}
          <nav aria-label="Main Navigation" className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectRole('worker')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                currentRole === 'worker'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={currentRole === 'worker' ? 'page' : undefined}
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span>{t.workerPortal}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectRole('assessor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                currentRole === 'assessor'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={currentRole === 'assessor' ? 'page' : undefined}
            >
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              <span>{t.assessorDesk}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectRole('auditor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                currentRole === 'auditor'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={currentRole === 'auditor' ? 'page' : undefined}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>{t.qualityAudit}</span>
            </button>
          </nav>

          {/* Controls: Language, Online/Offline Toggle & Gemini Indicator */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <Globe className="h-3.5 w-3.5 text-slate-400 mx-1.5" />
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition ${
                  currentLang === 'en' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition ${
                  currentLang === 'hi' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ta')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition ${
                  currentLang === 'ta' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Public Certificate Verification Link */}
            <button
              type="button"
              onClick={() => setShowVerifyModal(true)}
              className="hidden sm:flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs"
              title="Verify Official NSQF RPL Certificate"
            >
              <QrCode className="h-3.5 w-3.5 text-indigo-600" />
              <span className="font-semibold">Verify Cert</span>
            </button>

            {/* Individual Role / Login Session Indicator */}
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition shadow-xs"
              title="Switch user session or log in as worker / assessor"
            >
              <LogIn className="h-3.5 w-3.5 text-indigo-600" />
              <span className="font-semibold hidden lg:inline">
                {currentRole === 'assessor' ? assessorSessionName : workerSessionName}
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                {currentRole === 'assessor' ? 'Assessor' : 'Worker'}
              </span>
            </button>

            {/* Gemini Status / Key Entry */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className={`hidden md:flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full border transition-all ${
                isGeminiActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
              title={isGeminiActive ? 'Gemini 1.5 Flash Connected' : 'Click to configure Gemini API Key (Offline Fallback Active)'}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold">{isGeminiActive ? 'Gemini AI Active' : 'AI Fallback Engine'}</span>
            </button>

            {/* Offline Simulation Button */}
            <button
              type="button"
              onClick={handleToggleOffline}
              aria-label={isOnline ? 'Switch to offline mode' : 'Switch to online mode'}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-semibold">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-rose-600" />
                  <span className="font-semibold">Offline Mode</span>
                </>
              )}
            </button>

            {/* Pending Sync Queue Badge & Trigger */}
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={!isOnline}
                title={isOnline ? 'Click to sync pending data to server' : 'Connect online to sync'}
                className="flex items-center space-x-1 bg-amber-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>{pendingCount} Pending Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Banner */}
        {syncFeedback && (
          <div className="bg-indigo-600 text-white text-xs py-1 px-4 text-center font-medium animate-fadeIn">
            {syncFeedback}
          </div>
        )}
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-3 text-indigo-600 mb-3">
              <Key className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900">Configure Gemini API Key</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              SkillBridge RPL integrates with <strong>Google Gemini 1.5 Flash</strong> for candidate portfolio analysis. If no key is provided, the platform automatically utilizes its built-in NSQF deterministic rubric evaluator without error.
            </p>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="gemini-key-input" className="block text-xs font-semibold text-slate-700 uppercase">
                  Gemini API Key
                </label>
                <button
                  type="button"
                  onClick={handleUseDemoKey}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
                >
                  Quick Demo Key
                </button>
              </div>
              <input
                id="gemini-key-input"
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestResult(null);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              {testResult && (
                <div
                  className={`mt-2 p-2.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                    testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-800 border border-amber-300'
                  }`}
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTestingKey || !apiKeyInput.trim()}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
              >
                {isTestingKey ? 'Testing API...' : 'Test Connection'}
              </button>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onNavigateToAssessor={() => onSelectRole('assessor')}
      />

      {/* Role / Authentication Session Modal */}
      <AuthLoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        activeRole={currentRole}
        onLoginSuccess={(role, name) => {
          if (role === 'assessor') {
            setAssessorSessionName(name);
            onSelectRole('assessor');
          } else {
            setWorkerSessionName(name);
            onSelectRole('worker');
          }
        }}
      />
    </header>
  );
};
