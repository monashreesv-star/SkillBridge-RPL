import { describe, it, expect } from 'vitest';
import { SecurityService } from '../services/securityService';
import { SpeechService } from '../services/speechService';
import { LocalizationService } from '../services/localizationService';

describe('SecurityService & Input Sanitization', () => {
  it('strips malicious script tags and raw HTML to prevent XSS attacks', () => {
    const maliciousInput = '<script>alert("hacked")</script>Ramesh Kumar<b>Installer</b>';
    const sanitized = SecurityService.sanitizeText(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).not.toContain('<b>');
    expect(sanitized).toBe('Ramesh KumarInstaller');
  });

  it('validates and formats valid Indian phone numbers', () => {
    const valid1 = SecurityService.validatePhoneNumber('9876543210');
    expect(valid1.isValid).toBe(true);
    expect(valid1.formatted).toBe('+91 9876543210');

    const valid2 = SecurityService.validatePhoneNumber('+91 98765 43210');
    expect(valid2.isValid).toBe(true);

    const invalid = SecurityService.validatePhoneNumber('12345');
    expect(invalid.isValid).toBe(false);
  });

  it('rejects files exceeding 5MB or invalid MIME types', () => {
    const mockFileTooLarge = new File([''], 'huge.png', { type: 'image/png' });
    Object.defineProperty(mockFileTooLarge, 'size', { value: 6 * 1024 * 1024 }); // 6 MB

    const resultLarge = SecurityService.validateEvidenceFile(mockFileTooLarge);
    expect(resultLarge.isValid).toBe(false);
    expect(resultLarge.error).toContain('exceeds maximum threshold');

    const mockExecutableFile = new File([''], 'malware.exe', { type: 'application/x-msdownload' });
    const resultExe = SecurityService.validateEvidenceFile(mockExecutableFile);
    expect(resultExe.isValid).toBe(false);
    expect(resultExe.error).toContain('Invalid file type');

    const mockValidFile = new File([''], 'evidence.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockValidFile, 'size', { value: 500 * 1024 }); // 500 KB
    const resultValid = SecurityService.validateEvidenceFile(mockValidFile);
    expect(resultValid.isValid).toBe(true);
  });

  it('verifies tamper-evident certificate hashes', () => {
    expect(SecurityService.verifyCertificateHash(
      'RPL-CERT-2026-ELE-91823',
      'SHA256:4b8c9d2e1f0a3b5c7e9d'
    )).toBe(true);

    expect(SecurityService.verifyCertificateHash('', '')).toBe(false);
  });
});

describe('SpeechService & Multi-Language Accessibility', () => {
  it('handles speech synthesis requests without throwing in testing environment', () => {
    expect(() => SpeechService.stop()).not.toThrow();
    expect(SpeechService.isSpeaking()).toBe(false);
  });

  it('provides complete translations for all supported languages (en, hi, ta)', () => {
    const en = LocalizationService.t('en');
    const hi = LocalizationService.t('hi');
    const ta = LocalizationService.t('ta');

    expect(en.appTitle).toBe('SkillBridge RPL');
    expect(hi.appTitle).toBe('स्किलब्रिज आरपीएल');
    expect(ta.appTitle).toBe('ஸ்கில்பிரிட்ஜ் ஆர்பிஎல்');

    // Confirm that trade skills are translated into Hindi and Tamil
    expect(hi.skillsMap['Domestic Wiring & Circuit Boards']).toBe('घरेलू वायरिंग एवं वितरण बोर्ड स्थापना');
    expect(ta.skillsMap['Domestic Wiring & Circuit Boards']).toBe('வீட்டு வயரிங் & சர்க்யூட் பலகைகள்');
  });

  it('supports voice lookup and safe speech fallback for Tamil, Hindi, and English', () => {
    // Calling speak with Tamil text handles gracefully without throwing
    expect(() => SpeechService.speak('டெஸ்ட்', 'ta')).not.toThrow();
    expect(() => SpeechService.speak('परीक्षण', 'hi')).not.toThrow();
    expect(() => SpeechService.stop()).not.toThrow();
  });
});
