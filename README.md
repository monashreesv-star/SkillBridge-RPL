# SkillBridge RPL — Recognition of Prior Learning Platform

[![NSQF RPL Aligned](https://img.shields.io/badge/NSQF-Level%203%20%26%204%20Aligned-indigo)](https://www.nsqf.gov.in/)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-emerald)](https://deepmind.google/technologies/gemini/)
[![Offline First](https://img.shields.io/badge/Offline--First-PWA%20Queue-amber)](https://github.com/monashreesv-star/SkillBridge-RPL)
[![Tests](https://img.shields.io/badge/Tests-27%2F27%20Passing-brightgreen)](https://vitest.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

**SkillBridge RPL** is an offline-first, vernacular-enabled, AI-assisted platform designed to formally assess, recognize, and certify informal tradespeople (electricians, solar installers, plumbers, automotive technicians, healthcare assistants) under India's **National Skills Qualifications Framework (NSQF)**.

GitHub Repository: [https://github.com/monashreesv-star/SkillBridge-RPL](https://github.com/monashreesv-star/SkillBridge-RPL)

---

## 1. Chosen Vertical

**Vertical**: *Vocational Skilling, Informal Workforce Formalization, and Recognition of Prior Learning (RPL).*

In India and emerging economies, over 90% of technical tradespeople (electricians, plumbers, solar technicians) operate in the informal economy. Despite possessing decades of practical, hands-on mastery, they lack formal vocational credentials. This blocks them from formal industrial employment, bank credit, government contracts, and international mobility.

SkillBridge RPL provides an accessible, vernacular, mobile-friendly bridge that maps unstructured field experience directly to official NSQF Qualification Packs (QP) and National Occupational Standards (NOS).

---

## 2. Approach and Logic

SkillBridge RPL is built around three foundational architectural principles:

1. **Deterministic NSQF Standards with Responsible AI Advisory**:
   - Skill matching, Qualification Pack recommendations, and scoring rubrics operate on deterministic NSQF rules to prevent hallucinated qualifications.
   - **Google Gemini 1.5 Flash** acts strictly as an advisory diagnostic assistant—extracting hidden skills from informal work descriptions, summarizing workplace portfolios, and identifying competency gaps.
   - **Mandatory Human-in-the-Loop Safeguard**: AI cannot independently certify any candidate. An authorized human assessor must evaluate evidence and confirm the final determination.

2. **Standardized 40/60 Composite Scoring Engine**:
   - Aligned with National Skill Development Corporation (NSDC) RPL guidelines:
     $$\text{Composite Score} = (0.40 \times \text{Technical Knowledge Score}) + (0.60 \times \text{Practical Demonstration Score})$$
   - A composite score of **70%** is the mandatory pass threshold to earn an official Level 3 / Level 4 NSQF Digital Certificate.

3. **Multi-Tier Vernacular Accessibility (Low-Literacy First)**:
   - Complete tri-lingual interface in **English, Hindi (हिंदी), and Tamil (தமிழ்)**.
   - Spoken Audio Read-Aloud engine with natural Indian phonetic pronunciation and real-time visual captions for candidates with limited literacy.

4. **Honest Offline-First Architecture**:
   - Candidates and assessors working in rural or low-connectivity zones can complete full evaluations offline.
   - Submissions are queued in local persistence with explicit non-falsifying sync badges (`Offline Queue` vs. `Synchronized`).

---

## 3. How the Solution Works

### A. Worker Workflow
1. **Identity & Trade Self-Declaration**: Informal workers declare their trade tenure, practical daily activities, and location (with 1-click demo profiles for Electrician, Solar PV, and Plumber).
2. **Explainable NSQF QP Matching**: The algorithm recommends aligned national qualification packs with an explainable fit score (e.g., `94% NSQF Fit`) and breaks down **Recognized Prior Skills** vs. **Target NOS Gap Competencies**.
3. **Audio-Guided Knowledge Quiz**: Technical safety and procedural questions presented in English, Hindi, or Tamil, accompanied by a voice read-aloud button and live caption bar.
4. **Workplace Evidence Collection**: Candidates attach workplace photos, supervisor attestations, and field notes with automated title generation and file size validation.
5. **Offline Drafting**: Progress can be saved locally at any stage without data loss.
6. **Competency Scorecard & Certificate**: Candidates receive an interactive NOS competency scorecard. Certified workers receive a verifiable NSQF Digital Certificate with a cryptographic SHA-256 tamper-proof hash and printable view.

### B. Assessor Workflow
1. **Candidate Roster**: Filterable by status (`Submitted`, `Under Review`, `Certified`, `Not Yet Competent`).
2. **Evidence Verification**: Assessors review uploaded photo artifacts and mark individual evidence items as **"Verify Authentic"** or **"Flag for Clarification"**.
3. **AI Evaluation Insights**: Review Gemini 1.5 Flash diagnostic recommendations, candidate strengths, and suggested bridge training modules.
4. **Interactive 40/60 Composite Scoring**: Adjust practical demonstration scores with dynamic pass threshold verification.
5. **Human Sign-Off & Audit Trail**: Assessor confirms certification with mandatory override justification if diverging from AI advice.

### C. Institutional Analytics & Public Verification
1. **Worker Progression Funnel**: Real-time cohort pipeline tracking candidate advancement.
2. **Competency Gap Analysis**: Identifies difficult NOS units across cohorts to recommend targeted institutional bridge training curricula.
3. **Assessor Consistency Calibration**: Evaluates human assessor variance against standardized benchmarks and Gemini AI baselines to detect grading drift.
4. **Exportable Audit Reports**: One-click **Export CSV** (ledger) and **Export JSON** (tamper-evident archive) with UTF-8 BOM encoding for Excel.
5. **Public Certificate Registry**: Employers and authorities can cryptographically verify any certificate number or hash.

---

## 4. Assumptions Made

1. **Qualification Framework**: Evaluated against official NSQF Level 3 & Level 4 Qualification Packs (`ELE/Q6001`, `SGJ/Q0101`, `PSC/Q0104`, `ASC/Q1402`, `HSS/Q5101`).
2. **Pass Benchmark**: A weighted composite score of **70%** represents the minimum standard for RPL certification. Candidates scoring 50%–69% are referred to modular bridge training.
3. **Verification**: Cryptographic hashes are generated via SHA-256 against candidate metadata, QP code, and assessor credentials to guarantee anti-forgery protection.
4. **Offline Capability**: LocalStorage serves as the client-side database; synchronization queues faithfully record offline state until network reconnection.

---

## Supported Qualification Packs (NSQF)

| QP Code | Job Role | Sector | NSQF Level | Core Competencies |
|---|---|---|:---:|:---:|
| `ELE/Q6001` | Domestic Electrician | Electrical & Power | Level 4 | House Wiring, Earth Resistance, RCCB Testing |
| `SGJ/Q0101` | Solar PV Installer (Suryamitra) | Renewable Energy | Level 4 | Module Mounting, MC4 Crimping, Inverter Hookup |
| `PSC/Q0104` | General Plumber | Plumbing & Water Management | Level 3 | Pipe Jointing, Sanitary Traps, Gradient Drainage |
| `ASC/Q1402` | Automotive Service Technician | Automotive & Mobility | Level 4 | OBD-II Diagnostics, Hydraulic Brakes, Engine Service |
| `HSS/Q5101` | General Duty Healthcare Assistant | Healthcare & Life Sciences | Level 4 | Patient Vitals, Clinical Hygiene, Waste Segregation |

---

## Tech Stack

- **Frontend**: React 18, TypeScript (Strict Mode), Tailwind CSS, Lucide Icons
- **Build & Bundler**: Vite 5
- **Testing**: Vitest, React Testing Library, JSDOM (27 tests passing)
- **AI Integration**: Google Gemini 1.5 Flash REST API + Local Deterministic Engine
- **Voice & Accessibility**: Web Speech API + Indian Phonetic Transliteration Engine + Live Caption Region
- **Security**: Client-side XSS sanitization, MIME validation, 5MB file upload limit, SHA-256 certificate hashing

---

## Getting Started

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### Installation
```bash
git clone https://github.com/monashreesv-star/SkillBridge-RPL.git
cd SkillBridge-RPL
npm install
```

### Run Locally (Development)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Automated Test Suite
```bash
npm test
```
Executes all 27 unit and integration tests across 7 test suites.

### Build for Production
```bash
npm run build
```
Compiles TypeScript and creates optimized production assets in `dist/` (0 errors, 0 warnings).

---

## Hackathon Submission Verification

- **Repository**: Public ([https://github.com/monashreesv-star/SkillBridge-RPL](https://github.com/monashreesv-star/SkillBridge-RPL))
- **Repository Size**: **0.50 MB** (limit: < 10 MB)
- **Branch**: Exactly 1 branch (`main`)
- **Tests Passed**: 27 / 27 (100% pass rate)
- **Build Status**: Succeeded in 9.29s (Clean TypeScript)

---

## License

MIT License. Open-source for skill development and national skilling initiatives.
