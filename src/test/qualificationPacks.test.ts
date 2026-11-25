import { describe, it, expect } from 'vitest';
import { QUALIFICATION_PACKS, getQualificationPackByCode, recommendQualificationPacks } from '../data/qualificationPacks';

describe('Qualification Packs & NSQF RPL Standards', () => {
  it('loads valid qualification packs with competencies and knowledge questions', () => {
    expect(QUALIFICATION_PACKS.length).toBeGreaterThanOrEqual(4);
    
    QUALIFICATION_PACKS.forEach((qp) => {
      expect(qp.code).toBeDefined();
      expect(qp.title).toBeDefined();
      expect(qp.nsqfLevel).toBeGreaterThanOrEqual(3);
      expect(qp.coreCompetencies.length).toBeGreaterThan(0);
      expect(qp.knowledgeQuestions.length).toBeGreaterThan(0);
      expect(qp.practicalRubric.length).toBeGreaterThan(0);

      // Verify each knowledge question has valid correct option index
      qp.knowledgeQuestions.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctOptionIndex).toBeLessThan(q.options.length);
      });
    });
  });

  it('retrieves specific qualification pack by code case-insensitively', () => {
    const qp = getQualificationPackByCode('ele/q6001');
    expect(qp).toBeDefined();
    expect(qp?.title).toBe('Domestic Electrician');
  });

  it('algorithmically recommends relevant qualification packs based on declared trade & skills', () => {
    const recommendations = recommendQualificationPacks('Electrical & Power', ['Domestic Wiring & Circuit Boards'], 36);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.some((qp) => qp.code === 'ELE/Q6001')).toBe(true);
  });
});
