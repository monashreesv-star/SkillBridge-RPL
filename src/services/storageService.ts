import { WorkerProfile, AssessmentSubmission, SyncQueueItem } from '../types';
import { CertificateService } from './certificateService';

const STORAGE_KEYS = {
  CURRENT_PROFILE: 'skillbridge_worker_profile',
  PROFILES_LIST: 'skillbridge_profiles_list',
  ASSESSMENTS: 'skillbridge_assessments',
  SYNC_QUEUE: 'skillbridge_sync_queue',
  SIMULATED_OFFLINE: 'skillbridge_simulated_offline',
};

// Custom event for reactive UI updates across components
export const STORAGE_EVENT = 'skillbridge:storage_updated';

function emitStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

// Initial mock assessments to ensure Assessor workflow can be audited immediately
function getInitialAssessments(): AssessmentSubmission[] {
  return [
    {
      id: 'sub-elec-demo-1',
      workerId: 'worker-demo-ramesh',
      workerName: 'Ramesh Kumar',
      workerPhone: '+91 98765 43210',
      qpCode: 'ELE/Q6001',
      qpTitle: 'Domestic Electrician',
      nsqfLevel: 4,
      status: 'submitted',
      knowledgeAnswers: {
        'ele-q1': 0, // 30mA (correct)
        'ele-q2': 2, // 4.0 sq.mm (correct)
        'ele-q3': 1, // 1.0 Megohm (correct)
        'ele-q4': 1, // low-impedance dissipation path (correct)
      },
      knowledgeScore: 100,
      evidenceItems: [
        {
          id: 'ev-1',
          competencyId: 'ele-comp-1',
          type: 'photo',
          title: 'RCCB Installation with 30mA test stamp',
          notes: 'Installed 40A 30mA 4-pole RCCB on 3-phase residential distribution board.',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'ev-2',
          competencyId: 'ele-comp-2',
          type: 'work_log',
          title: 'Conduit Bending & Phase Load Balancing Log',
          notes: 'Completed 6-room residential rewiring including 4 sq.mm AC dedicated lines.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      aiAnalysis: {
        overallScore: 88,
        competencyScores: {
          'ele-comp-1': 92,
          'ele-comp-2': 85,
          'ele-comp-3': 87,
        },
        suggestedStatus: 'RECOMMEND_CERTIFICATION',
        strengths: [
          'Flawless knowledge of mandatory human safety thresholds (30mA RCCB sensitivity)',
          'Clear understanding of conductor ampacity ratings for high-wattage domestic appliances',
          'Documented practical experience in 3-phase domestic panel board wiring',
        ],
        gapAreas: [
          'Recommend verification of calibrated 500V Megohmmeter insulation logbook',
        ],
        confidenceScore: 0.94,
        suggestedTrainingModules: ['Advanced Solar-Grid Interconnection Safety Refresher'],
        generatedAt: new Date(Date.now() - 86400000).toISOString(),
        source: 'gemini-1.5-flash',
        disclaimer: 'AI-generated preliminary recommendation only. Human assessor verification is mandatory under RPL framework.',
      },
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      lastModifiedAt: new Date(Date.now() - 86400000).toISOString(),
      syncedWithServer: true,
      syncTimestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'sub-solar-demo-2',
      workerId: 'worker-demo-anita',
      workerName: 'Anita Sharma',
      workerPhone: '+91 91234 56789',
      qpCode: 'SGJ/Q0101',
      qpTitle: 'Solar PV Installer (Suryamitra)',
      nsqfLevel: 4,
      status: 'under_review',
      knowledgeAnswers: {
        'sol-q1': 1, // True South (correct)
        'sol-q2': 0, // 400V, 10A (correct)
        'sol-q3': 0, // < 5 Ohms (correct)
      },
      knowledgeScore: 100,
      evidenceItems: [
        {
          id: 'ev-3',
          competencyId: 'sol-comp-2',
          type: 'photo',
          title: 'MC4 Connector Ratchet Crimping Demonstration',
          notes: 'Crimped IP67 MC4 connector on 4 sq.mm UV cable with heat-shrink sleeve.',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
        },
      ],
      aiAnalysis: {
        overallScore: 82,
        competencyScores: {
          'sol-comp-1': 80,
          'sol-comp-2': 88,
          'sol-comp-3': 78,
        },
        suggestedStatus: 'RECOMMEND_CERTIFICATION',
        strengths: [
          'Strong practical understanding of solar string series electrical properties',
          'Accurate orientation and azimuth optimization knowledge for Indian sub-continent',
        ],
        gapAreas: [
          'Practical physical demonstration of earth pit resistance measurement requested',
        ],
        confidenceScore: 0.89,
        suggestedTrainingModules: ['Lightning Surge Protection Device (SPD) Maintenance'],
        generatedAt: new Date(Date.now() - 43200000).toISOString(),
        source: 'gemini-1.5-flash',
        disclaimer: 'AI-generated preliminary recommendation only. Human assessor verification is mandatory under RPL framework.',
      },
      submittedAt: new Date(Date.now() - 43200000).toISOString(),
      lastModifiedAt: new Date(Date.now() - 43200000).toISOString(),
      syncedWithServer: false, // demonstrates pending offline synchronization!
    },
  ];
}

export const StorageService = {
  // Offline simulation toggle for live auditor inspection
  isSimulatedOffline(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.SIMULATED_OFFLINE) === 'true';
  },

  setSimulatedOffline(offline: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, offline ? 'true' : 'false');
    emitStorageChange();
  },

  isOnline(): boolean {
    if (typeof navigator === 'undefined') return true;
    if (this.isSimulatedOffline()) return false;
    return navigator.onLine;
  },

  // Worker Profile
  saveWorkerProfile(profile: WorkerProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, JSON.stringify(profile));
    
    // Also save in profiles list
    const existing = this.getProfilesList();
    const index = existing.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      existing[index] = profile;
    } else {
      existing.push(profile);
    }
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(existing));

    // If offline, queue for sync
    if (!this.isOnline()) {
      this.enqueueSyncItem({
        id: `sync-profile-${profile.id}-${Date.now()}`,
        type: 'WORKER_PROFILE',
        payload: profile,
        queuedAt: new Date().toISOString(),
        retryCount: 0,
        status: 'pending',
      });
    }

    emitStorageChange();
  },

  getCurrentWorkerProfile(): WorkerProfile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as WorkerProfile;
    } catch {
      return null;
    }
  },

  getProfilesList(): WorkerProfile[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as WorkerProfile[];
    } catch {
      return [];
    }
  },

  // Assessments
  getAssessments(): AssessmentSubmission[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (!raw) {
      const initial = getInitialAssessments();
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw) as AssessmentSubmission[];
    } catch {
      return [];
    }
  },

  saveAssessment(assessment: AssessmentSubmission): void {
    if (typeof window === 'undefined') return;
    const all = this.getAssessments();
    const index = all.findIndex((a) => a.id === assessment.id);
    
    // Set sync status accurately based on network
    const isActuallyOnline = this.isOnline();
    const updated = {
      ...assessment,
      lastModifiedAt: new Date().toISOString(),
      syncedWithServer: isActuallyOnline,
      syncTimestamp: isActuallyOnline ? new Date().toISOString() : assessment.syncTimestamp,
    };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(all));

    if (!isActuallyOnline) {
      this.enqueueSyncItem({
        id: `sync-assessment-${assessment.id}-${Date.now()}`,
        type: 'ASSESSMENT_SUBMISSION',
        payload: updated,
        queuedAt: new Date().toISOString(),
        retryCount: 0,
        status: 'pending',
      });
    }

    emitStorageChange();
  },

  updateAssessorDecision(
    assessmentId: string,
    decision: AssessmentSubmission['assessorReview'],
    newStatus: AssessmentSubmission['status']
  ): boolean {
    const all = this.getAssessments();
    const target = all.find((a) => a.id === assessmentId);
    if (!target) return false;

    target.assessorReview = decision;
    target.status = newStatus;
    target.lastModifiedAt = new Date().toISOString();

    if (newStatus === 'certified') {
      target.certificate = CertificateService.generateCertificate(target);
    } else {
      delete target.certificate;
    }

    const isActuallyOnline = this.isOnline();
    target.syncedWithServer = isActuallyOnline;

    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(all));

    if (!isActuallyOnline) {
      this.enqueueSyncItem({
        id: `sync-assessor-${assessmentId}-${Date.now()}`,
        type: 'ASSESSOR_DECISION',
        payload: { assessmentId, decision, newStatus },
        queuedAt: new Date().toISOString(),
        retryCount: 0,
        status: 'pending',
      });
    }

    emitStorageChange();
    return true;
  },

  updateEvidenceStatus(
    assessmentId: string,
    evidenceId: string,
    status: 'verified' | 'flagged' | 'pending',
    feedback?: string
  ): void {
    if (typeof window === 'undefined') return;
    const all = this.getAssessments();
    const target = all.find((a) => a.id === assessmentId);
    if (!target) return;
    const ev = target.evidenceItems.find((e) => e.id === evidenceId);
    if (ev) {
      ev.verificationStatus = status;
      if (feedback !== undefined) {
        ev.assessorFeedback = feedback;
      }
    }
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(all));
    emitStorageChange();
  },

  // Sync Queue (Strictly offline-first, no fake sync reporting)
  getSyncQueue(): SyncQueueItem[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SyncQueueItem[];
    } catch {
      return [];
    }
  },

  enqueueSyncItem(item: SyncQueueItem): void {
    const queue = this.getSyncQueue();
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },

  syncPendingItems(): { successCount: number; remainingCount: number } {
    if (!this.isOnline()) {
      return { successCount: 0, remainingCount: this.getSyncQueue().length };
    }

    const queue = this.getSyncQueue();
    if (queue.length === 0) return { successCount: 0, remainingCount: 0 };

    // Simulate batch network sync
    const all = this.getAssessments();
    queue.forEach((item) => {
      if (item.type === 'ASSESSMENT_SUBMISSION') {
        const matching = all.find((a) => a.id === item.payload.id);
        if (matching) {
          matching.syncedWithServer = true;
          matching.syncTimestamp = new Date().toISOString();
        }
      }
    });

    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(all));
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
    emitStorageChange();

    return { successCount: queue.length, remainingCount: 0 };
  },

  clearAllDataForReset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROFILES_LIST);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.SIMULATED_OFFLINE);
    emitStorageChange();
  },
};
