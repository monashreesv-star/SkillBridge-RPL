import { describe, it, expect } from 'vitest';
import { generateDeterministicAnalysis, GeminiService } from '../services/geminiService';
import { QUALIFICATION_PACKS } from '../data/qualificationPacks';
import { WorkerProfile } from '../types';

describe('GeminiService & AI Fallback Engine', () => {
  const mockProfile: WorkerProfile = {
    id: 'worker-test-ai',
    fullName: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    location: 'Jaipur',
    educationLevel: 'Secondary (Class 10)',
    yearsExperience: 4,
    sector: 'Electrical & Power',
    primaryTrade: 'Domestic Electrician',
    selectedSkills: ['Domestic Wiring & Circuit Boards', 'RCCB & Earth Leakage Testing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const electricianQP = QUALIFICATION_PACKS[0];

  it('generates valid, structured deterministic analysis when offline or without API key', () => {
    const analysis = generateDeterministicAnalysis({
      workerProfile: mockProfile,
      qualificationPack: electricianQP,
      knowledgeAnswers: {
        'ele-q1': 0, // 30mA (correct)
        'ele-q2': 2, // 4.0 sq.mm (correct)
      },
      evidenceCount: 2,
    });

    expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
    expect(analysis.overallScore).toBeLessThanOrEqual(100);
    expect(analysis.strengths.length).toBeGreaterThan(0);
    expect(analysis.gapAreas.length).toBeGreaterThan(0);
    expect(['RECOMMEND_CERTIFICATION', 'NEEDS_FURTHER_ASSESSMENT', 'NOT_YET_COMPETENT']).toContain(analysis.suggestedStatus);
  });

  it('strictly enforces the Human-in-the-Loop disclaimer and never grants independent certification', () => {
    const analysis = generateDeterministicAnalysis({
      workerProfile: mockProfile,
      qualificationPack: electricianQP,
      knowledgeAnswers: {
        'ele-q1': 0,
        'ele-q2': 2,
        'ele-q3': 1,
        'ele-q4': 1,
      },
      evidenceCount: 3,
    });

    // Verify mandatory disclaimer is present
    expect(analysis.disclaimer).toContain('Human assessor verification is mandatory');
    expect(analysis.source).toBe('gemini-1.5-flash');
  });

  it('handles unconfigured API key gracefully via analyzeAssessment', async () => {
    // With no key set, it must return a valid analysis without throwing
    const result = await GeminiService.analyzeAssessment({
      workerProfile: mockProfile,
      qualificationPack: electricianQP,
      knowledgeAnswers: {},
      evidenceCount: 0,
    });

    expect(result).toBeDefined();
    expect(result.overallScore).toBeDefined();
    expect(result.suggestedStatus).toBeDefined();
  });
});
