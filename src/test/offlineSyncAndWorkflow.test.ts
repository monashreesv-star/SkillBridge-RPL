import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { AssessmentSubmission } from '../types';

describe('Offline-First Architecture & Accurate Sync Reporting', () => {
  beforeEach(() => {
    StorageService.clearAllDataForReset();
  });

  it('correctly toggles simulated offline mode', () => {
    StorageService.setSimulatedOffline(true);
    expect(StorageService.isSimulatedOffline()).toBe(true);
    expect(StorageService.isOnline()).toBe(false);

    StorageService.setSimulatedOffline(false);
    expect(StorageService.isSimulatedOffline()).toBe(false);
    expect(StorageService.isOnline()).toBe(true);
  });

  it('enforces non-falsifying sync: captures offline submissions without falsely marking synced', () => {
    StorageService.setSimulatedOffline(true);

    const testSubmission: AssessmentSubmission = {
      id: 'sub-offline-test-1',
      workerId: 'worker-offline-1',
      workerName: 'Suresh Patel',
      workerPhone: '+91 98765 00000',
      qpCode: 'PSC/Q0104',
      qpTitle: 'Plumber (General)',
      nsqfLevel: 4,
      status: 'submitted',
      knowledgeAnswers: { 'plumb-q1': 0 },
      knowledgeScore: 100,
      evidenceItems: [],
      submittedAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: false,
    };

    StorageService.saveAssessment(testSubmission);

    const saved = StorageService.getAssessments().find((a) => a.id === testSubmission.id);
    expect(saved).toBeDefined();
    // Must strictly be false when offline
    expect(saved?.syncedWithServer).toBe(false);

    // Must be enqueued in sync queue
    const queue = StorageService.getSyncQueue();
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.some((item) => item.payload.id === testSubmission.id)).toBe(true);
  });

  it('flushes offline queue and synchronizes records when network connectivity is restored', () => {
    // 1. Submit offline
    StorageService.setSimulatedOffline(true);
    const testSubmission: AssessmentSubmission = {
      id: 'sub-offline-test-2',
      workerId: 'worker-offline-2',
      workerName: 'Lakshmi Narayanan',
      workerPhone: '+91 97777 00000',
      qpCode: 'SGJ/Q0101',
      qpTitle: 'Solar PV Installer',
      nsqfLevel: 4,
      status: 'submitted',
      knowledgeAnswers: { 'sol-q1': 1 },
      knowledgeScore: 100,
      evidenceItems: [],
      submittedAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: false,
    };

    StorageService.saveAssessment(testSubmission);
    expect(StorageService.getSyncQueue().length).toBe(1);

    // 2. Go online and sync
    StorageService.setSimulatedOffline(false);
    const syncResult = StorageService.syncPendingItems();

    expect(syncResult.successCount).toBe(1);
    expect(syncResult.remainingCount).toBe(0);
    expect(StorageService.getSyncQueue().length).toBe(0);

    const updated = StorageService.getAssessments().find((a) => a.id === testSubmission.id);
    expect(updated?.syncedWithServer).toBe(true);
    expect(updated?.syncTimestamp).toBeDefined();
  });

  it('automatically generates cryptographic certificate upon human assessor sign-off', () => {
    StorageService.setSimulatedOffline(false);
    const assessments = StorageService.getAssessments();
    const candidate = assessments[0];
    expect(candidate).toBeDefined();

    const success = StorageService.updateAssessorDecision(
      candidate.id,
      {
        assessorId: 'ASSR-REG-2026-904',
        assessorName: 'Dr. Anand Varma',
        finalDecision: 'CERTIFIED',
        practicalScore: 92,
        compositeScore: 95,
        decisionRationale: 'Candidate demonstrated exemplary safety and technical precision.',
        assessorNotes: 'Approved for Level 4 RPL.',
        overrideAI: false,
        reviewedAt: new Date().toISOString(),
      },
      'certified'
    );

    expect(success).toBe(true);
    const certified = StorageService.getAssessments().find((a) => a.id === candidate.id);
    expect(certified?.status).toBe('certified');
    expect(certified?.certificate).toBeDefined();
    expect(certified?.certificate?.certificateNumber).toContain('NSQF-RPL-');
    expect(certified?.certificate?.verificationHash).toContain('SHA256');
    expect(certified?.certificate?.status).toBe('VALID');
  });
});
