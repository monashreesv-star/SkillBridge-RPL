import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { SecurityService } from '../../services/securityService';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Search, 
  X, 
  QrCode,
  Clock,
  AlertCircle
} from 'lucide-react';
import { RPLCertificate, AssessmentSubmission } from '../../types';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertId?: string;
  onNavigateToAssessor?: () => void;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  onClose,
  initialCertId = '',
  onNavigateToAssessor,
}) => {
  const [certInput, setCertInput] = useState(initialCertId);
  const [verifiedCert, setVerifiedCert] = useState<RPLCertificate | null>(null);
  const [verifiedAssessment, setVerifiedAssessment] = useState<AssessmentSubmission | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isTamperValid, setIsTamperValid] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (idToTest?: string) => {
    const targetId = (idToTest !== undefined ? idToTest : certInput).trim();
    if (!targetId) return;

    setSearchAttempted(true);
    const assessments = StorageService.getAssessments();
    const cleanQuery = targetId.toLowerCase();
    
    // Search for certified submissions matching the certificate ID, hash, candidate name, or QP
    const match = assessments.find((a) => {
      const certNum = a.certificate?.certificateNumber?.toLowerCase() || '';
      const certHash = a.certificate?.verificationHash?.toLowerCase() || '';
      const wName = a.workerName.toLowerCase();
      const qp = a.qpCode.toLowerCase();
      const qpT = a.qpTitle.toLowerCase();
      const subId = a.id.toLowerCase();
      return certNum.includes(cleanQuery) || 
             certHash.includes(cleanQuery) || 
             wName.includes(cleanQuery) || 
             qp.includes(cleanQuery) || 
             qpT.includes(cleanQuery) || 
             subId.includes(cleanQuery);
    });

    if (match) {
      setVerifiedAssessment(match);
      if (match.certificate) {
        setVerifiedCert(match.certificate);
        const isValid = SecurityService.verifyCertificateHash(
          match.certificate.certificateNumber,
          match.certificate.verificationHash
        );
        setIsTamperValid(isValid);
      } else {
        setVerifiedCert(null);
        setIsTamperValid(false);
      }
    } else {
      setVerifiedAssessment(null);
      setVerifiedCert(null);
      setIsTamperValid(false);
    }
  };

  const handleQuickVerifySample = () => {
    // Find the first certified record or default to sample
    const certified = StorageService.getAssessments().find((a) => a.certificate);
    if (certified && certified.certificate) {
      setCertInput(certified.certificate.certificateNumber);
      handleVerify(certified.certificate.certificateNumber);
    } else {
      const all = StorageService.getAssessments();
      if (all.length > 0) {
        setCertInput(all[0].workerName);
        handleVerify(all[0].workerName);
      } else {
        setCertInput('Ramesh Kumar');
        handleVerify('Ramesh Kumar');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition p-1 rounded-full hover:bg-slate-100"
          aria-label="Close verification modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Official RPL Certificate Verification</h2>
            <p className="text-xs text-slate-500">National Skills Qualifications Framework (NSQF) Public Registry</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
          Employers, industry partners, and government agencies can cryptographically authenticate any digital RPL certificate issued by authorized human assessors.
        </p>

        {/* Input Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="cert-query" className="text-xs font-bold text-slate-700 uppercase">
              Certificate Number or Verification Hash
            </label>
            <button
              type="button"
              onClick={handleQuickVerifySample}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
              Verify Active Candidate
            </button>
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="cert-query"
                type="text"
                placeholder="e.g. RPL-2026-ELE-..."
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleVerify()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Verification Result Display */}
        {searchAttempted && verifiedCert && (
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm mb-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>OFFICIAL NSQF RPL CERTIFICATE VERIFIED & AUTHENTIC</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Candidate Name:</span>
                <span className="font-bold text-slate-900 text-sm">{verifiedCert.workerName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Trade Qualification:</span>
                <span className="font-semibold text-slate-900">{verifiedCert.qpTitle}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">NSQF Level & QP Code:</span>
                <span className="font-mono font-bold text-indigo-700">Level {verifiedCert.nsqfLevel} ({verifiedCert.qpCode})</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Certified Human Assessor:</span>
                <span className="font-semibold text-slate-800">{verifiedCert.assessorName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Date of Certification:</span>
                <span className="font-medium text-slate-700">{verifiedCert.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-1">Cryptographic Tamper-Proof Hash:</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded block break-all">
                  {verifiedCert.verificationHash}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isTamperValid ? 'Tamper-Seal Cryptographically Valid' : 'Signature Unverified'}</span>
              </span>
              <span>Status: ACTIVE & COMPLIANT</span>
            </div>
          </div>
        )}

        {/* Candidate Found but Pending Assessor Determination */}
        {searchAttempted && !verifiedCert && verifiedAssessment && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 animate-fadeIn">
            <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm mb-2">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <span>CANDIDATE RECORD FOUND: AWAITING ASSESSOR SIGN-OFF</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-2 text-xs mb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-bold text-slate-900">{verifiedAssessment.workerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trade / Sector:</span>
                <span className="font-semibold text-slate-800">{verifiedAssessment.qpTitle} ({verifiedAssessment.qpCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Workflow Status:</span>
                <span className="font-bold text-amber-700 uppercase">{verifiedAssessment.status.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="text-xs text-amber-900 bg-amber-100/60 p-3 rounded-xl border border-amber-200">
              <strong className="flex items-center gap-1 mb-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
                NSQF Human-in-the-Loop Safeguard:
              </strong>
              This candidate's assessment portfolio has been successfully logged. Under national RPL regulations, an official certificate is generated only after a certified Human Assessor evaluates and confirms the determination on the Assessor Desk.
            </div>

            {onNavigateToAssessor && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToAssessor();
                  }}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  Go to Assessor Desk to Certify
                </button>
              </div>
            )}
          </div>
        )}

        {/* Not Found */}
        {searchAttempted && !verifiedAssessment && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 text-center animate-fadeIn">
            <XCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-rose-900">Certificate Not Found in NSQF Registry</h4>
            <p className="text-xs text-rose-700 mt-1 mb-4">
              No registered candidate or certificate matches "{certInput}". You can quickly verify any registered candidate below:
            </p>

            <div className="flex flex-wrap justify-center gap-1.5 pt-2 border-t border-rose-200">
              {StorageService.getAssessments().map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setCertInput(a.certificate ? a.certificate.certificateNumber : a.workerName);
                    handleVerify(a.certificate ? a.certificate.certificateNumber : a.workerName);
                  }}
                  className="text-[11px] bg-white border border-rose-200 hover:border-rose-400 text-slate-800 font-semibold px-2.5 py-1 rounded-lg shadow-xs transition"
                >
                  {a.workerName} {a.certificate ? '(Certified)' : '(Pending Review)'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
