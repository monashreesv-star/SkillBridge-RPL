import React, { useState } from 'react';
import { Role, WorkerProfile } from '../../types';
import { StorageService } from '../../services/storageService';
import { SecurityService } from '../../services/securityService';
import { 
  ShieldCheck, 
  X, 
  ArrowRight,
  Lock
} from 'lucide-react';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: Role;
  onLoginSuccess: (role: Role, name: string) => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onLoginSuccess,
}) => {
  const [authTab, setAuthTab] = useState<'worker' | 'assessor'>(
    activeRole === 'assessor' ? 'assessor' : 'worker'
  );

  // Worker Login state
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [workerError, setWorkerError] = useState<string | null>(null);

  // Assessor Login state
  const [assessorIdInput, setAssessorIdInput] = useState('ASSR-REG-2026-904');
  const [assessorNameInput, setAssessorNameInput] = useState('Dr. Anand Varma');
  const [assessorPass, setAssessorPass] = useState('nsqf2026');
  const [assessorError, setAssessorError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    setWorkerError(null);
    const phoneValid = SecurityService.validatePhoneNumber(workerPhone);
    if (!phoneValid.isValid) {
      setWorkerError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setOtpSent(true);
    setOtpCode('7492'); // Simulated OTP for instant verification
  };

  const handleWorkerLogin = () => {
    setWorkerError(null);
    const cleanName = SecurityService.sanitizeText(workerName).trim() || 'Candidate Onboard';
    const phoneValid = SecurityService.validatePhoneNumber(workerPhone);

    if (!phoneValid.isValid) {
      setWorkerError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!otpSent) {
      handleSendOtp();
      return;
    }

    // Save as active worker profile
    const existing = StorageService.getCurrentWorkerProfile();
    const newProfile: WorkerProfile = {
      id: existing?.id || `worker-${Date.now()}`,
      fullName: cleanName,
      phone: phoneValid.formatted,
      location: existing?.location || 'Jaipur, Rajasthan',
      educationLevel: existing?.educationLevel || 'Secondary (Class 10)',
      yearsExperience: existing?.yearsExperience || 3,
      sector: existing?.sector || 'Electrical & Power',
      primaryTrade: existing?.primaryTrade || 'Domestic Electrician',
      selectedSkills: existing?.selectedSkills || ['Domestic Wiring & Circuit Boards'],
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveWorkerProfile(newProfile);
    onLoginSuccess('worker', cleanName);
    onClose();
  };

  const handleQuickWorkerSelect = (name: string, phone: string, trade: string) => {
    setWorkerName(name);
    setWorkerPhone(phone);
    const existing = StorageService.getCurrentWorkerProfile();
    if (existing) {
      StorageService.saveWorkerProfile({
        ...existing,
        fullName: name,
        phone,
        primaryTrade: trade,
      });
    }
    onLoginSuccess('worker', name);
    onClose();
  };

  const handleAssessorLogin = () => {
    setAssessorError(null);
    const cleanId = SecurityService.sanitizeText(assessorIdInput).trim();
    const cleanName = SecurityService.sanitizeText(assessorNameInput).trim();

    if (!cleanId || !cleanName) {
      setAssessorError('Please enter Assessor ID and Full Name.');
      return;
    }

    onLoginSuccess('assessor', cleanName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition p-1 rounded-full hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Platform Session Login</h2>
            <p className="text-xs text-slate-500">NSQF RPL Role-Based Access Control</p>
          </div>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setAuthTab('worker')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authTab === 'worker'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Worker / Candidate Login
          </button>
          <button
            type="button"
            onClick={() => setAuthTab('assessor')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authTab === 'assessor'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assessor Official Login
          </button>
        </div>

        {/* WORKER LOGIN TAB */}
        {authTab === 'worker' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Informal workers authenticate with their mobile number (OTP verification). No complex password needed.
            </p>

            <div>
              <label htmlFor="auth-worker-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Candidate Full Name
              </label>
              <input
                id="auth-worker-name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="auth-worker-phone" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mobile Number (for OTP Login) *
              </label>
              <div className="flex space-x-2">
                <input
                  id="auth-worker-phone"
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition whitespace-nowrap"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 animate-fadeIn">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-indigo-900">Enter 4-Digit OTP:</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Simulated OTP: {otpCode}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-base font-bold py-1.5 border border-indigo-300 rounded-lg bg-white"
                />
              </div>
            )}

            {workerError && (
              <p className="text-xs text-rose-600 font-semibold">{workerError}</p>
            )}

            <button
              type="button"
              onClick={handleWorkerLogin}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <span>{otpSent ? 'Verify & Start Worker Session' : 'Get OTP & Log In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Quick Demo Candidates */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                Or Quick Login as Registered Demo Worker:
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickWorkerSelect('Ramesh Kumar', '+91 98765 43210', 'Domestic Electrician')}
                  className="w-full text-left p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex justify-between items-center text-xs transition"
                >
                  <span className="font-bold text-slate-800">Ramesh Kumar</span>
                  <span className="text-slate-500">Electrician (4 yrs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickWorkerSelect('Anita Sharma', '+91 91234 56789', 'Solar PV Installer')}
                  className="w-full text-left p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex justify-between items-center text-xs transition"
                >
                  <span className="font-bold text-slate-800">Anita Sharma</span>
                  <span className="text-slate-500">Solar PV (5 yrs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickWorkerSelect('Suresh Patel', '+91 98765 00000', 'General Plumber')}
                  className="w-full text-left p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex justify-between items-center text-xs transition"
                >
                  <span className="font-bold text-slate-800">Suresh Patel</span>
                  <span className="text-slate-500">Plumber (3 yrs)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASSESSOR LOGIN TAB */}
        {authTab === 'assessor' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized human assessors log in with their official NSQF assessor credentials to sign off candidate assessments.
            </p>

            <div>
              <label htmlFor="auth-assessor-id" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assessor Registration ID *
              </label>
              <input
                id="auth-assessor-id"
                type="text"
                value={assessorIdInput}
                onChange={(e) => setAssessorIdInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label htmlFor="auth-assessor-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assessor Sign-Off Full Name *
              </label>
              <input
                id="auth-assessor-name"
                type="text"
                value={assessorNameInput}
                onChange={(e) => setAssessorNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="auth-assessor-pass" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Secure Key / PIN
              </label>
              <input
                id="auth-assessor-pass"
                type="password"
                value={assessorPass}
                onChange={(e) => setAssessorPass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {assessorError && (
              <p className="text-xs text-rose-600 font-semibold">{assessorError}</p>
            )}

            <button
              type="button"
              onClick={handleAssessorLogin}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Log In to Official Assessor Desk</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
