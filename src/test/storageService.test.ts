import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { WorkerProfile, AssessmentSubmission } from '../types';

describe('StorageService (Offline-First Persistence & Sync Queue)', () => {
  beforeEach(() => {
    StorageService.clearAllDataForReset();
  });

  it('saves and retrieves worker profile correctly', () => {
    const profile: WorkerProfile = {
      id: 'worker-test-1',
      fullName: 'Sunil Rao',
      phone: '+91 99999 88888',
      location: 'Bangalore, Karnataka',
      educationLevel: 'Secondary (Class 10)',
      yearsExperience: 5,
      sector: 'Electrical & Power',
      primaryTrade: 'Electrician',
      selectedSkills: ['Domestic Wiring & Circuit Boards'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveWorkerProfile(profile);
    const retrieved = StorageService.getCurrentWorkerProfile();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.fullName).toBe('Sunil Rao');
    expect(retrieved?.yearsExperience).toBe(5);
  });

  it('correctly tracks pending sync queue when offline', () => {
    StorageService.setSimulatedOffline(true);
    expect(StorageService.isOnline()).toBe(false);

    const submission: AssessmentSubmission = {
      id: 'sub-offline-test',
      workerId: 'worker-test-1',
      workerName: 'Sunil Rao',
      workerPhone: '+91 99999 88888',
      qpCode: 'ELE/Q6001',
      qpTitle: 'Domestic Electrician',
      nsqfLevel: 4,
      status: 'submitted',
      knowledgeAnswers: { 'ele-q1': 0 },
      knowledgeScore: 100,
      evidenceItems: [],
      submittedAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: false,
    };

    StorageService.saveAssessment(submission);

    // Verify it is NOT falsely reported as synced
    const assessments = StorageService.getAssessments();
    const target = assessments.find((a) => a.id === 'sub-offline-test');
    expect(target).toBeDefined();
    expect(target?.syncedWithServer).toBe(false);

    // Verify item is queued in sync queue
    const queue = StorageService.getSyncQueue();
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.some((item) => item.type === 'ASSESSMENT_SUBMISSION')).toBe(true);
  });

  it('syncs pending items once back online', () => {
    StorageService.setSimulatedOffline(true);
    const submission: AssessmentSubmission = {
      id: 'sub-to-sync',
      workerId: 'worker-test-1',
      workerName: 'Sunil Rao',
      workerPhone: '+91 99999 88888',
      qpCode: 'ELE/Q6001',
      qpTitle: 'Domestic Electrician',
      nsqfLevel: 4,
      status: 'submitted',
      knowledgeAnswers: {},
      knowledgeScore: 90,
      evidenceItems: [],
      submittedAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: false,
    };
    StorageService.saveAssessment(submission);

    // Now go back online
    StorageService.setSimulatedOffline(false);
    expect(StorageService.isOnline()).toBe(true);

    const syncResult = StorageService.syncPendingItems();
    expect(syncResult.successCount).toBeGreaterThan(0);
    expect(StorageService.getSyncQueue().length).toBe(0);

    const target = StorageService.getAssessments().find((a) => a.id === 'sub-to-sync');
    expect(target?.syncedWithServer).toBe(true);
  });

  it('updates evidence verification status and assessor feedback correctly', () => {
    const assessments = StorageService.getAssessments();
    const firstWithEvidence = assessments.find((a) => a.evidenceItems.length > 0);
    expect(firstWithEvidence).toBeDefined();

    if (firstWithEvidence) {
      const evId = firstWithEvidence.evidenceItems[0].id;
      StorageService.updateEvidenceStatus(
        firstWithEvidence.id,
        evId,
        'verified',
        'Verified on-site demonstration'
      );

      const updated = StorageService.getAssessments().find((a) => a.id === firstWithEvidence.id);
      const updatedEv = updated?.evidenceItems.find((e) => e.id === evId);
      expect(updatedEv?.verificationStatus).toBe('verified');
      expect(updatedEv?.assessorFeedback).toBe('Verified on-site demonstration');
    }
  });
});
