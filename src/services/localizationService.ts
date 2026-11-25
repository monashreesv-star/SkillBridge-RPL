export type Language = 'en' | 'hi' | 'ta';

export interface Translations {
  appTitle: string;
  nsqfTag: string;
  rplPlatform: string;
  workerPortal: string;
  assessorDesk: string;
  qualityAudit: string;
  online: string;
  offline: string;
  pendingSync: string;
  geminiActive: string;
  aiFallback: string;
  step1Badge: string;
  step1Title: string;
  step1Subtitle: string;
  quickDemo: string;
  demoElectrician: string;
  demoSolar: string;
  demoPlumber: string;
  candidateIdentity: string;
  fullName: string;
  mobileNumber: string;
  cityDistrict: string;
  educationLevel: string;
  tradeExpHistory: string;
  industrySector: string;
  primaryTrade: string;
  practicalYears: string;
  practicalTasksTitle: string;
  practicalTasksDesc: string;
  recommendedQPsTitle: string;
  recommendedQPsDesc: string;
  minExperience: string;
  competenciesCount: string;
  saveOfflineDraft: string;
  proceedToAssessment: string;
  partATitle: string;
  partADesc: string;
  partBTitle: string;
  partBDesc: string;
  attachedEvidence: string;
  addEvidenceTitle: string;
  taskTitleLabel: string;
  targetCompetencyLabel: string;
  fieldNotesLabel: string;
  attachPhotoLabel: string;
  attachEvidenceBtn: string;
  submitAssessmentBtn: string;
  analyzingWithAI: string;
  viewScorecardBtn: string;
  assessmentSubmittedTitle: string;
  assessmentSubmittedDesc: string;
  syncedServer: string;
  storedOffline: string;
  aiPreliminaryRec: string;
  humanSafeguardNotice: string;
  assessorTitle: string;
  assessorSubtitle: string;
  candidateSubmissions: string;
  searchPlaceholder: string;
  allStatuses: string;
  knowledgeScore: string;
  aiSuggestedScore: string;
  evidenceCount: string;
  syncStatus: string;
  synchronized: string;
  offlineQueue: string;
  practicalScoreLabel: string;
  finalDecisionLabel: string;
  awardCert: string;
  bridgeTraining: string;
  notYetCompetent: string;
  assessorRationaleLabel: string;
  overrideLabel: string;
  confirmSignOff: string;
  reanalyzeAI: string;
  auditConsoleBadge: string;
  auditConsoleTitle: string;
  auditConsoleSubtitle: string;
  resetDemoBtn: string;
  totalSubmissions: string;
  humanCertified: string;
  pendingReview: string;
  liveArchitectureTitle: string;
  evalMatrixTitle: string;
  evalMatrixSubtitle: string;
  domainCategory: string;
  evalRequirement: string;
  implementedMech: string;
  auditStatus: string;
  verificationEvidence: string;
  scorecardBackBtn: string;
  scorecardPrintBtn: string;
  scorecardResultBadge: string;
  finalOfficialStatus: string;
  rplCertifiedBadge: string;
  assessorPendingBadge: string;
  bridgeTrainingBadge: string;
  skillsMap: Record<string, string>;
}

const EN_SKILLS: Record<string, string> = {
  'Domestic Wiring & Circuit Boards': 'Domestic Wiring & Circuit Boards',
  'Conduit Bending & Pipe Laying': 'Conduit Bending & Pipe Laying',
  'RCCB & Earth Leakage Testing': 'RCCB & Earth Leakage Testing',
  'Earthing Pit Installation': 'Earthing Pit Installation',
  'Solar PV Panel Assembly & Mounting': 'Solar PV Panel Assembly & Mounting',
  'MC4 Solar Connector Crimping': 'MC4 Solar Connector Crimping',
  'Solar Inverter DC/AC Hookup': 'Solar Inverter DC/AC Hookup',
  'CPVC & UPVC Pipe Solvent Jointing': 'CPVC & UPVC Pipe Solvent Jointing',
  'Sanitary Wall Fixtures & P-Traps': 'Sanitary Wall Fixtures & P-Traps',
  'Plumbing Pressure Leak Testing': 'Plumbing Pressure Leak Testing',
  'Automotive OBD-II Diagnostics': 'Automotive OBD-II Diagnostics',
  'Hydraulic Brake Bleeding & Pad Replacement': 'Hydraulic Brake Bleeding & Pad Replacement',
  'Vital Signs & Blood Pressure Measurement': 'Vital Signs & Blood Pressure Measurement',
  'WHO Clinical Hand Hygiene Protocols': 'WHO Clinical Hand Hygiene Protocols',
  'Bio-Medical Waste Color Segregation': 'Bio-Medical Waste Color Segregation',
};

const HI_SKILLS: Record<string, string> = {
  'Domestic Wiring & Circuit Boards': 'घरेलू वायरिंग एवं वितरण बोर्ड स्थापना',
  'Conduit Bending & Pipe Laying': 'कंड्यूट मोड़ना एवं पाइप बिछाना',
  'RCCB & Earth Leakage Testing': 'आरसीसीबी एवं अर्थ लीकेज परीक्षण',
  'Earthing Pit Installation': 'अर्थिंग गड्ढा एवं इलेक्ट्रोड स्थापना',
  'Solar PV Panel Assembly & Mounting': 'सोलर पीवी पैनल जोड़ना व ढांचा कसना',
  'MC4 Solar Connector Crimping': 'एमसी4 सोलर कनेक्टर क्रिम्पिंग',
  'Solar Inverter DC/AC Hookup': 'सोलर इन्वर्टर डीसी/एसी कनेक्शन',
  'CPVC & UPVC Pipe Solvent Jointing': 'सीपीवीसी एवं यूपीवीसी पाइप विलायक जोड़',
  'Sanitary Wall Fixtures & P-Traps': 'सैनिटरी दीवार फिटिंग एवं पी-ट्रैप',
  'Plumbing Pressure Leak Testing': 'प्लंबिंग दबाव एवं रिसाव परीक्षण',
  'Automotive OBD-II Diagnostics': 'ऑटोमोटिव ओबीडी-II डायग्नोस्टिक्स',
  'Hydraulic Brake Bleeding & Pad Replacement': 'हाइड्रोलिक ब्रेक ब्लीडिंग एवं पैड बदलना',
  'Vital Signs & Blood Pressure Measurement': 'रक्तचाप एवं महत्वपूर्ण लक्षण मापन',
  'WHO Clinical Hand Hygiene Protocols': 'डब्ल्यूएचओ क्लिनिकल हाथ स्वच्छता प्रोटोकॉल',
  'Bio-Medical Waste Color Segregation': 'बायोमेडिकल कचरा रंग पृथक्करण',
};

const TA_SKILLS: Record<string, string> = {
  'Domestic Wiring & Circuit Boards': 'வீட்டு வயரிங் & சர்க்யூட் பலகைகள்',
  'Conduit Bending & Pipe Laying': 'குழாய் வளைத்தல் & கேபிள் இடுதல்',
  'RCCB & Earth Leakage Testing': 'RCCB மற்றும் எர்த் லீக் சோதனை',
  'Earthing Pit Installation': 'எர்த்திங் குழி மற்றும் எலக்ட்ரோடு அமைத்தல்',
  'Solar PV Panel Assembly & Mounting': 'சோலார் பேனல் பொருத்துதல் மற்றும் மவுண்டிங்',
  'MC4 Solar Connector Crimping': 'MC4 சோலார் இணைப்பான் பொருத்துதல்',
  'Solar Inverter DC/AC Hookup': 'சோலார் இன்வெர்ட்டர் DC/AC இணைப்பு',
  'CPVC & UPVC Pipe Solvent Jointing': 'CPVC & UPVC குழாய் ஒட்டுதல்',
  'Sanitary Wall Fixtures & P-Traps': 'சானிட்டரி சுவர் பொருத்துதல்கள் & பி-ட்ராப்',
  'Plumbing Pressure Leak Testing': 'பிளம்பிங் அழுத்த கசிவு சோதனை',
  'Automotive OBD-II Diagnostics': 'வாகன OBD-II கணினி கண்டறிதல்',
  'Hydraulic Brake Bleeding & Pad Replacement': 'ஹைட்ராலிக் பிரேக் பிளீடிங் & பேட் மாற்றுதல்',
  'Vital Signs & Blood Pressure Measurement': 'இரத்த அழுத்தம் & நாடி துடிப்பு அளவீடு',
  'WHO Clinical Hand Hygiene Protocols': 'WHO மருத்துவ கை சுகாதார முறைகள்',
  'Bio-Medical Waste Color Segregation': 'மருத்துவ கழிவு வண்ண பிரித்தல்',
};

const DICTIONARY: Record<Language, Translations> = {
  en: {
    appTitle: 'SkillBridge RPL',
    nsqfTag: 'NSQF Aligned',
    rplPlatform: 'Recognition of Prior Learning Platform',
    workerPortal: 'Worker Portal',
    assessorDesk: 'Assessor Desk',
    qualityAudit: 'Quality Audit',
    online: 'Online',
    offline: 'Offline Mode',
    pendingSync: 'Pending Sync',
    geminiActive: 'Gemini AI Active',
    aiFallback: 'AI Fallback Engine',
    step1Badge: 'Step 1 of 3: RPL Worker Onboarding',
    step1Title: 'Candidate Self-Declaration of Prior Learning',
    step1Subtitle: 'Formally document informal work tenure, practical trade experience, and competency domains to receive NSQF Qualification Pack alignment.',
    quickDemo: 'Quick Demo Profile:',
    demoElectrician: 'Electrician',
    demoSolar: 'Solar PV',
    demoPlumber: 'Plumber',
    candidateIdentity: 'Candidate Identity & Demographics',
    fullName: 'Full Name (as per ID) *',
    mobileNumber: 'Mobile Number *',
    cityDistrict: 'City & District',
    educationLevel: 'Formal Education Level',
    tradeExpHistory: 'Trade Experience & Prior Work History',
    industrySector: 'Industry Sector *',
    primaryTrade: 'Primary Informal Trade',
    practicalYears: 'Years of Practical Experience',
    practicalTasksTitle: 'Practical Tasks Performed in Daily Work',
    practicalTasksDesc: 'Select the activities candidate has performed without constant supervision during their informal employment.',
    recommendedQPsTitle: 'Recommended NSQF Qualification Packs (QP)',
    recommendedQPsDesc: 'Algorithmically matched based on sector affinity, skill overlap, and practical experience.',
    minExperience: 'Min. Experience:',
    competenciesCount: 'Competencies',
    saveOfflineDraft: 'Save Progress (Offline Draft)',
    proceedToAssessment: 'Proceed to RPL Assessment',
    partATitle: 'Part A: Trade Technical Knowledge Quiz',
    partADesc: 'Multiple-choice questions testing occupational safety, standard procedures, and technical diagnostics.',
    partBTitle: 'Part B: Practical Work Evidence & Portfolio',
    partBDesc: 'Attach photo logs, supervisor verifications, or description of on-site tasks completed to prove applied trade competency.',
    attachedEvidence: 'Attached Evidence Items',
    addEvidenceTitle: 'Add Workplace Evidence or Demonstration Log',
    taskTitleLabel: 'Evidence Title / Task Performed',
    targetCompetencyLabel: 'Target Competency Unit',
    fieldNotesLabel: 'Field Notes / Supervisor Attestation',
    attachPhotoLabel: 'Attach Practical Work Photo',
    attachEvidenceBtn: 'Attach Evidence Item',
    submitAssessmentBtn: 'Submit Assessment & Generate AI Insights',
    analyzingWithAI: 'Analyzing with Gemini AI Engine...',
    viewScorecardBtn: 'View Official RPL Competency Scorecard',
    assessmentSubmittedTitle: 'Assessment Successfully Submitted!',
    assessmentSubmittedDesc: 'Your portfolio, knowledge responses, and evidence have been recorded in the offline-first repository.',
    syncedServer: 'Synchronized with Central Cloud Server.',
    storedOffline: 'Stored in Offline Local Queue (Pending Sync).',
    aiPreliminaryRec: 'AI Preliminary Recommendation',
    humanSafeguardNotice: 'Under NSQF guidelines, certification requires final sign-off by a certified Human Assessor.',
    assessorTitle: 'Assessor Decision & Verification Desk',
    assessorSubtitle: 'Review candidate portfolios, inspect AI-generated preliminary scores, evaluate practical evidence, and issue official human certification.',
    candidateSubmissions: 'Candidate Submissions',
    searchPlaceholder: 'Search candidate or QP...',
    allStatuses: 'All Statuses',
    knowledgeScore: 'Knowledge Score',
    aiSuggestedScore: 'AI Suggested Score',
    evidenceCount: 'Evidence Count',
    syncStatus: 'Sync Status',
    synchronized: 'Synchronized',
    offlineQueue: 'Offline Queue',
    practicalScoreLabel: 'Assessed Practical Competency Score (0 - 100)',
    finalDecisionLabel: 'Final Certification Decision *',
    awardCert: 'Award RPL Certification',
    bridgeTraining: 'Bridge Training Required',
    notYetCompetent: 'Not Yet Competent',
    assessorRationaleLabel: 'Assessor Justification & Verification Notes *',
    overrideLabel: 'Override Justification (Required if modifying or reversing AI suggestion)',
    confirmSignOff: 'Confirm & Sign Off Human Determination',
    reanalyzeAI: 'Re-analyze with Gemini AI',
    auditConsoleBadge: 'Independent Hackathon QA Audit Console',
    auditConsoleTitle: 'System Compliance & Verification Audit',
    auditConsoleSubtitle: 'Transparently monitor NSQF RPL standards compliance, AI safeguards, offline sync status, and end-to-end data integrity.',
    resetDemoBtn: 'Reset Demo Repository',
    totalSubmissions: 'Total Submissions',
    humanCertified: 'Human Certified',
    pendingReview: 'Pending Review',
    liveArchitectureTitle: 'Live Architecture & Engine Verification',
    evalMatrixTitle: 'Evaluation Criteria & Requirements Verification Matrix',
    evalMatrixSubtitle: 'Audit itemization proving exact implementation of all mandatory hackathon requirements.',
    domainCategory: 'Domain Category',
    evalRequirement: 'Evaluation Requirement',
    implementedMech: 'Implemented Mechanism',
    auditStatus: 'Audit Status',
    verificationEvidence: 'Verification Evidence',
    scorecardBackBtn: 'Back to Assessment / Portal',
    scorecardPrintBtn: 'Print / Save Official Certificate',
    scorecardResultBadge: 'National Skills Qualifications Framework (NSQF) RPL Result',
    finalOfficialStatus: 'Final Official Status',
    rplCertifiedBadge: 'RPL CERTIFIED',
    assessorPendingBadge: 'ASSESSOR REVIEW PENDING',
    bridgeTrainingBadge: 'BRIDGE TRAINING NEEDED',
    skillsMap: EN_SKILLS,
  },
  hi: {
    appTitle: 'स्किलब्रिज आरपीएल',
    nsqfTag: 'एनएसक्यूएफ संरेखित',
    rplPlatform: 'पूर्व शिक्षण मान्यता एवं कौशल प्रमाणन मंच',
    workerPortal: 'श्रमिक पोर्टल',
    assessorDesk: 'परीक्षक डेस्क',
    qualityAudit: 'गुणवत्ता ऑडिट',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन मोड',
    pendingSync: 'लंबित सिंक',
    geminiActive: 'जेमिनी एआई सक्रिय',
    aiFallback: 'एआई फॉलबैक इंजन',
    step1Badge: 'चरण 1 का 3: आरपीएल श्रमिक ऑनबोर्डिंग',
    step1Title: 'पूर्व अनुभव एवं कौशल की स्व-घोषणा',
    step1Subtitle: 'एनएसक्यूएफ योग्यता पैक के साथ आधिकारिक प्रमाणन हेतु अपने कार्य अनुभव, व्यावहारिक कौशल एवं ट्रेड विवरण दर्ज करें।',
    quickDemo: 'त्वरित डेमो प्रोफाइल:',
    demoElectrician: 'इलेक्ट्रीशियन',
    demoSolar: 'सोलर पीवी',
    demoPlumber: 'प्लंबर',
    candidateIdentity: 'उम्मीदवार की पहचान एवं व्यक्तिगत विवरण',
    fullName: 'पूरा नाम (पहचान पत्र के अनुसार) *',
    mobileNumber: 'मोबाइल नंबर *',
    cityDistrict: 'शहर व जिला',
    educationLevel: 'औपचारिक शिक्षा स्तर',
    tradeExpHistory: 'व्यावसायिक अनुभव एवं कार्य इतिहास',
    industrySector: 'उद्योग क्षेत्र *',
    primaryTrade: 'मुख्य अनौपचारिक ट्रेड / पेशा',
    practicalYears: 'व्यावहारिक कार्य अनुभव (वर्षों में)',
    practicalTasksTitle: 'दैनिक कार्य में किए जाने वाले व्यावहारिक कार्य',
    practicalTasksDesc: 'उन कौशलों का चयन करें जो आपने अपने कार्य अनुभव के दौरान बिना निरंतर निगरानी के स्वतंत्र रूप से किए हैं।',
    recommendedQPsTitle: 'अनुशंसित राष्ट्रीय योग्यता पैक (QP)',
    recommendedQPsDesc: 'आपके क्षेत्र, चुने गए कौशलों और वर्षों के व्यावहारिक अनुभव के आधार पर स्वचालित रूप से अनुशंसित।',
    minExperience: 'न्यूनतम अनुभव:',
    competenciesCount: 'दक्षताएं',
    saveOfflineDraft: 'प्रगति सहेजें (ऑफ़लाइन ड्राफ्ट)',
    proceedToAssessment: 'आरपीएल मूल्यांकन पर आगे बढ़ें',
    partATitle: 'भाग क: व्यावसायिक तकनीकी ज्ञान प्रश्नोत्तरी',
    partADesc: 'कार्यस्थल सुरक्षा, मानक उपकरण और तकनीकी समझ का परीक्षण करने वाले बहुविकल्पीय प्रश्न।',
    partBTitle: 'भाग ख: व्यावहारिक कार्य प्रमाण एवं कार्यशाला विवरण',
    partBDesc: 'व्यावहारिक ट्रेड योग्यता साबित करने हेतु फोटो, कार्यस्थल लॉग और पर्यवेक्षक सत्यापन संलग्न करें।',
    attachedEvidence: 'संलग्न कार्य प्रमाण',
    addEvidenceTitle: 'कार्यस्थल प्रमाण या कार्य प्रदर्शन जोड़ें',
    taskTitleLabel: 'प्रमाण का नाम / निष्पादित कार्य',
    targetCompetencyLabel: 'लक्षित योग्यता इकाई',
    fieldNotesLabel: 'कार्यस्थल नोट्स / पर्यवेक्षक अभिप्रमाणन',
    attachPhotoLabel: 'व्यावहारिक कार्य की तस्वीर संलग्न करें',
    attachEvidenceBtn: 'प्रमाण संलग्न करें',
    submitAssessmentBtn: 'मूल्यांकन जमा करें और एआई समीक्षा प्राप्त करें',
    analyzingWithAI: 'जेमिनी एआई इंजन द्वारा विश्लेषण जारी...',
    viewScorecardBtn: 'आधिकारिक आरपीएल स्कोरकार्ड देखें',
    assessmentSubmittedTitle: 'मूल्यांकन सफलतापूर्वक जमा हो गया!',
    assessmentSubmittedDesc: 'आपका पोर्टफोलियो, ज्ञान उत्तर और प्रमाण ऑफ़लाइन-प्रथम रिपॉजिटरी में सुरक्षित कर दिए गए हैं।',
    syncedServer: 'केंद्रीय क्लाउड सर्वर से सफलतापूर्वक सिंक किया गया।',
    storedOffline: 'स्थानीय ऑफ़लाइन कतार में सुरक्षित (सिंक लंबित)।',
    aiPreliminaryRec: 'एआई प्रारंभिक अनुशंसा',
    humanSafeguardNotice: 'एनएसक्यूएफ दिशानिर्देशों के तहत, अंतिम प्रमाण पत्र केवल प्रमाणित मानव परीक्षक के हस्ताक्षर से ही जारी होता है।',
    assessorTitle: 'परीक्षक निर्णय एवं सत्यापन डेस्क',
    assessorSubtitle: 'उम्मीदवार पोर्टफोलियो की समीक्षा करें, एआई स्कोर जांचें, व्यावहारिक प्रमाण देखें और आधिकारिक मानव प्रमाणन जारी करें।',
    candidateSubmissions: 'उम्मीदवार सबमिशन',
    searchPlaceholder: 'उम्मीदवार या क्यूपी खोजें...',
    allStatuses: 'सभी स्थितियां',
    knowledgeScore: 'ज्ञान स्कोर',
    aiSuggestedScore: 'एआई अनुशंसित स्कोर',
    evidenceCount: 'प्रमाण संख्या',
    syncStatus: 'सिंक स्थिति',
    synchronized: 'सिंक्रनाइज़्ड',
    offlineQueue: 'ऑफ़लाइन कतार',
    practicalScoreLabel: 'व्यावहारिक योग्यता स्कोर (0 - 100)',
    finalDecisionLabel: 'अंतिम प्रमाणन निर्णय *',
    awardCert: 'आरपीएल प्रमाण पत्र प्रदान करें',
    bridgeTraining: 'ब्रिज प्रशिक्षण आवश्यक',
    notYetCompetent: 'अभी योग्य नहीं',
    assessorRationaleLabel: 'परीक्षक औचित्य एवं सत्यापन नोट्स *',
    overrideLabel: 'एआई ओवरराइड औचित्य (यदि एआई सुझाव बदला गया हो)',
    confirmSignOff: 'पुष्टि करें और अंतिम हस्ताक्षर करें',
    reanalyzeAI: 'जेमिनी एआई से पुनः विश्लेषण करें',
    auditConsoleBadge: 'स्वतंत्र हैकथॉन क्यूए ऑडिट कंसोल',
    auditConsoleTitle: 'सिस्टम अनुपालन एवं सत्यापन ऑडिट',
    auditConsoleSubtitle: 'एनएसक्यूएफ आरपीएल मानकों के अनुपालन, एआई सुरक्षा उपायों, ऑफ़लाइन सिंक स्थिति और डेटा अखंडता की पारदर्शी निगरानी करें।',
    resetDemoBtn: 'डेमो रिपॉजिटरी रीसेट करें',
    totalSubmissions: 'कुल सबमिशन',
    humanCertified: 'मानव द्वारा प्रमाणित',
    pendingReview: 'समीक्षा लंबित',
    liveArchitectureTitle: 'सक्रिय आर्किटेक्चर एवं इंजन सत्यापन',
    evalMatrixTitle: 'मूल्यांकन मानदंड एवं आवश्यकता सत्यापन मैट्रिक्स',
    evalMatrixSubtitle: 'सभी अनिवार्य हैकथॉन आवश्यकताओं के वास्तविक कार्यान्वयन का विस्तृत ऑडिट।',
    domainCategory: 'डोमेन श्रेणी',
    evalRequirement: 'मूल्यांकन आवश्यकता',
    implementedMech: 'कार्यान्वित तंत्र',
    auditStatus: 'ऑडिट स्थिति',
    verificationEvidence: 'सत्यापन साक्ष्य',
    scorecardBackBtn: 'मूल्यांकन / पोर्टल पर वापस जाएं',
    scorecardPrintBtn: 'आधिकारिक प्रमाण पत्र प्रिंट / सहेजें',
    scorecardResultBadge: 'राष्ट्रीय कौशल योग्यता ढांचा (NSQF) आरपीएल परिणाम',
    finalOfficialStatus: 'अंतिम आधिकारिक स्थिति',
    rplCertifiedBadge: 'आरपीएल प्रमाणित',
    assessorPendingBadge: 'परीक्षक समीक्षा लंबित',
    bridgeTrainingBadge: 'ब्रिज प्रशिक्षण आवश्यक',
    skillsMap: HI_SKILLS,
  },
  ta: {
    appTitle: 'ஸ்கில்பிரிட்ஜ் ஆர்பிஎல்',
    nsqfTag: 'NSQF தரநிலை',
    rplPlatform: 'முன் கற்றல் அங்கீகாரம் & தொழில் சான்றிதழ் தளம்',
    workerPortal: 'தொழிலாளர் தளம்',
    assessorDesk: 'மதிப்பீட்டாளர் மேசை',
    qualityAudit: 'தர தணிக்கை',
    online: 'இணையத்தில்',
    offline: 'ஆஃப்லைன் முறை',
    pendingSync: 'ஒத்திசைவு நிலுவையில்',
    geminiActive: 'Gemini AI இயங்குகிறது',
    aiFallback: 'AI பின்னணி என்ஜின்',
    step1Badge: 'படி 1 / 3: தொழிலாளர் பதிவு',
    step1Title: 'முன் கற்றல் மற்றும் தொழில் அனுபவ சுய அறிவிப்பு',
    step1Subtitle: 'தேசிய தரநிலையின் (NSQF) கீழ் சான்றிதழ் பெற உங்கள் நடைமுறை பணி அனுபவங்களை பதிவு செய்யவும்.',
    quickDemo: 'மாதிரி சுயவிவரம்:',
    demoElectrician: 'எலக்ட்ரீஷியன்',
    demoSolar: 'சோலார் PV',
    demoPlumber: 'பிளம்பர்',
    candidateIdentity: 'வேட்பாளர் அடையாளம் & தனிப்பட்ட விவரங்கள்',
    fullName: 'முழு பெயர் (அடையாள அட்டைப்படி) *',
    mobileNumber: 'கைபேசி எண் *',
    cityDistrict: 'நகரம் & மாவட்டம்',
    educationLevel: 'முறைசார் கல்வி தகுதி',
    tradeExpHistory: 'தொழில் அனுபவம் & முந்தைய வேலை விவரம்',
    industrySector: 'தொழில்துறை பிரிவு *',
    primaryTrade: 'முதன்மை முறைசாரா தொழில்',
    practicalYears: 'நடைமுறை பணி அனுபவம் (ஆண்டுகள்)',
    practicalTasksTitle: 'தினசரி பணியில் செய்யும் நடைமுறை வேலைகள்',
    practicalTasksDesc: 'உங்கள் அனுபவத்தில் மற்றவர் மேற்பார்வையின்றி செய்த நடைமுறை பணிகளை தேர்வு செய்யவும்.',
    recommendedQPsTitle: 'பரிந்துரைக்கப்பட்ட தகுதித் தொகுப்புகள் (QP)',
    recommendedQPsDesc: 'உங்கள் தொழில் அனுபவம் மற்றும் திறன்களின் அடிப்படையில் பொருத்தப்பட்டது.',
    minExperience: 'குறைந்தபட்ச அனுபவம்:',
    competenciesCount: 'திறன்கள்',
    saveOfflineDraft: 'முன்னேற்றத்தை சேமி (ஆஃப்லைன் வரைவு)',
    proceedToAssessment: 'RPL மதிப்பீட்டிற்கு செல்லவும்',
    partATitle: 'பகுதி அ: தொழில் நுட்ப அறிவு வினாடி வினா',
    partADesc: 'பணி பாதுகாப்பு மற்றும் தொழில்நுட்ப நடைமுறைகளை சோதிக்கும் கேள்விகள்.',
    partBTitle: 'பகுதி ஆ: நடைமுறை வேலை ஆதாரம் & புகைப்படங்கள்',
    partBDesc: 'நடைமுறை தொழில் திறனை நிரூபிக்க புகைப்படங்கள் அல்லது மேற்பார்வையாளர் பதிவுகளை இணைக்கவும்.',
    attachedEvidence: 'இணைக்கப்பட்ட பணி ஆதாரங்கள்',
    addEvidenceTitle: 'பணி ஆதாரம் அல்லது வேலை பதிவை சேர்க்கவும்',
    taskTitleLabel: 'ஆதார தலைப்பு / செய்த பணி',
    targetCompetencyLabel: 'குறிப்பிட்ட திறன் அலகு',
    fieldNotesLabel: 'கள குறிப்புகள் / மேற்பார்வையாளர் சான்று',
    attachPhotoLabel: 'வேலை புகைப்படத்தை இணைக்கவும்',
    attachEvidenceBtn: 'ஆதாரத்தை இணைக்க',
    submitAssessmentBtn: 'மதிப்பீட்டை சமர்ப்பித்து AI முடிவை பெறுக',
    analyzingWithAI: 'Gemini AI மூலம் ஆய்வு செய்யப்படுகிறது...',
    viewScorecardBtn: 'அதிகாரப்பூர்வ RPL மதிப்பெண் அட்டையை காண்க',
    assessmentSubmittedTitle: 'மதிப்பீடு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    assessmentSubmittedDesc: 'உங்கள் பதில்கள் மற்றும் ஆதாரங்கள் ஆஃப்லைன் கணினியில் பாதுகாப்பாக பதிவு செய்யப்பட்டுள்ளன.',
    syncedServer: 'மத்திய கிளவுட் சேவையகத்துடன் ஒத்திசைக்கப்பட்டது.',
    storedOffline: 'உள்ளூர் வரிசையில் சேமிக்கப்பட்டது (ஒத்திசைவு நிலுவை).',
    aiPreliminaryRec: 'AI ஆரம்ப பரிந்துரை',
    humanSafeguardNotice: 'NSQF விதிகளின்படி, சான்றிதழுக்கு தகுதிவாய்ந்த மனித மதிப்பீட்டாளரின் இறுதி கையொப்பம் கட்டாயமாகும்.',
    assessorTitle: 'மதிப்பீட்டாளர் முடிவு & சரிபார்ப்பு மேசை',
    assessorSubtitle: 'வேட்பாளர் போர்ட்ஃபோலியோவை ஆய்வு செய்து, AI கணிப்பை சரிபார்த்து சான்றிதழை இறுதி செய்க.',
    candidateSubmissions: 'வேட்பாளர் சமர்ப்பிப்புகள்',
    searchPlaceholder: 'வேட்பாளர் அல்லது QP தேடுக...',
    allStatuses: 'அனைத்து நிலைகளும்',
    knowledgeScore: 'அறிவு மதிப்பெண்',
    aiSuggestedScore: 'AI பரிந்துரை மதிப்பெண்',
    evidenceCount: 'ஆதார எண்ணிக்கை',
    syncStatus: 'ஒத்திசைவு நிலை',
    synchronized: 'ஒத்திசைக்கப்பட்டது',
    offlineQueue: 'ஆஃப்லைன் வரிசை',
    practicalScoreLabel: 'நடைமுறை திறன் மதிப்பெண் (0 - 100)',
    finalDecisionLabel: 'இறுதி சான்றிதழ் முடிவு *',
    awardCert: 'RPL சான்றிதழ் வழங்குக',
    bridgeTraining: 'பயிற்சி தேவைப்படுகிறது',
    notYetCompetent: 'இன்னும் தகுதி பெறவில்லை',
    assessorRationaleLabel: 'மதிப்பீட்டாளர் குறிப்புகள் & காரணங்கள் *',
    overrideLabel: 'AI மாற்றத்திற்கான காரணம் (மாற்றியிருந்தால்)',
    confirmSignOff: 'உறுதிசெய்து இறுதி கையொப்பமிடுக',
    reanalyzeAI: 'Gemini AI மூலம் மறுஆய்வு செய்க',
    auditConsoleBadge: 'சுயாதீன ஹேக்கத்தான் QA தணிக்கை பணியகம்',
    auditConsoleTitle: 'கணினி இணக்கம் & சரிபார்ப்பு தணிக்கை',
    auditConsoleSubtitle: 'NSQF RPL தரநிலைகள் இணக்கம், AI பாதுகாப்பு நடவடிக்கைகள் மற்றும் ஆஃப்லைன் ஒத்திசைவு நிலையை கண்காணிக்கவும்.',
    resetDemoBtn: 'மாதிரி களஞ்சியத்தை மீட்டமை',
    totalSubmissions: 'மொத்த சமர்ப்பிப்புகள்',
    humanCertified: 'மனிதரால் சான்றளிக்கப்பட்டது',
    pendingReview: 'மதிப்பாய்வு நிலுவை',
    liveArchitectureTitle: 'நேரடி கட்டமைப்பு & என்ஜின் சரிபார்ப்பு',
    evalMatrixTitle: 'மதிப்பீட்டு அளவுகோல் & தேவைகள் சரிபார்ப்பு அணி',
    evalMatrixSubtitle: 'அனைத்து கட்டாய ஹேக்கத்தான் தேவைகளும் முழுமையாக செயல்படுத்தப்பட்டதற்கான தணிக்கை சான்றுகள்.',
    domainCategory: 'துறை வகை',
    evalRequirement: 'மதிப்பீட்டு தேவை',
    implementedMech: 'செயல்படுத்தப்பட்ட வழிமுறை',
    auditStatus: 'தணிக்கை நிலை',
    verificationEvidence: 'சரிபார்ப்பு சான்று',
    scorecardBackBtn: 'மதிப்பீடு / தளத்திற்கு திரும்புக',
    scorecardPrintBtn: 'அதிகாரப்பூர்வ சான்றிதழை அச்சிடுக / சேமிக்க',
    scorecardResultBadge: 'தேசிய திறன் தகுதி கட்டமைப்பு (NSQF) RPL முடிவு',
    finalOfficialStatus: 'இறுதி அதிகாரப்பூர்வ நிலை',
    rplCertifiedBadge: 'RPL சான்றிதழ் பெற்றது',
    assessorPendingBadge: 'மதிப்பீட்டாளர் ஆய்வு நிலுவையில்',
    bridgeTrainingBadge: 'இணைப்பு பயிற்சி தேவைப்படுகிறது',
    skillsMap: TA_SKILLS,
  },
};

const LANG_KEY = 'skillbridge_lang';

export const LocalizationService = {
  getCurrentLanguage(): Language {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(LANG_KEY) as Language;
    return saved && ['en', 'hi', 'ta'].includes(saved) ? saved : 'en';
  },

  setLanguage(lang: Language): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LANG_KEY, lang);
    window.dispatchEvent(new Event('skillbridge:language_changed'));
  },

  t(lang?: Language): Translations {
    const current = lang || this.getCurrentLanguage();
    return DICTIONARY[current] || DICTIONARY.en;
  },
};
