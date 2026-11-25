import { describe, it, expect } from 'vitest';
import { CertificateService } from '../services/certificateService';
import { LocalizationService } from '../services/localizationService';
import { AssessmentSubmission } from '../types';

describe('CertificateService & LocalizationService (Phase 2)', () => {
  it('generates a valid, secure NSQF RPL digital certificate', () => {
    const mockAssessment: AssessmentSubmission = {
      id: 'sub-test-cert',
      workerId: 'worker-ramesh-1',
      workerName: 'Ramesh Kumar',
      workerPhone: '+91 98765 43210',
      qpCode: 'ELE/Q6001',
      qpTitle: 'Domestic Electrician',
      nsqfLevel: 4,
      status: 'certified',
      knowledgeAnswers: { 'ele-q1': 0 },
      knowledgeScore: 90,
      evidenceItems: [],
      assessorReview: {
        assessorId: 'ASSR-REG-2026-904',
        assessorName: 'Dr. Anand Varma',
        finalDecision: 'CERTIFIED',
        practicalScore: 88,
        compositeScore: 89,
        decisionRationale: 'Candidate demonstrated safe 3-phase wiring procedures.',
        assessorNotes: 'Verified on-site.',
        overrideAI: false,
        reviewedAt: new Date().toISOString(),
      },
      submittedAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: true,
    };

    const cert = CertificateService.generateCertificate(mockAssessment);

    expect(cert).toBeDefined();
    expect(cert.certificateNumber).toContain('NSQF-RPL-ELE-Q6001');
    expect(cert.workerName).toBe('Ramesh Kumar');
    expect(cert.nsqfLevel).toBe(4);
    expect(cert.verificationHash).toContain('SHA256:');
    expect(cert.compositeScore).toBe(89);
    expect(cert.status).toBe('VALID');
  });

  it('supports English, Hindi, and Tamil translations without missing key errors', () => {
    const en = LocalizationService.t('en');
    const hi = LocalizationService.t('hi');
    const ta = LocalizationService.t('ta');

    expect(en.appTitle).toBe('SkillBridge RPL');
    expect(hi.appTitle).toBe('स्किलब्रिज आरपीएल');
    expect(ta.appTitle).toBe('ஸ்கில்பிரிட்ஜ் ஆர்பிஎல்');

    expect(en.workerPortal).toBe('Worker Portal');
    expect(hi.workerPortal).toBe('श्रमिक पोर्टल');
    expect(ta.workerPortal).toBe('தொழிலாளர் தளம்');
  });
});
