import { type z } from 'zod';
import { CaseSummary,Appointment,CounselorCase,CounselorCaseDetail,AuthorityTask,DistrictAnalytics,DistrictAssistanceRequest,StateAnalytics,NationalAnalytics } from '@haven/contracts';

export const caseRecord:z.infer<typeof CaseSummary>={id:'case-demo-001',victimId:'victim-demo-001',preferredName:'Riya',docket:'DEMO-NHAA-001',district:'Pune',state:'Maharashtra',stage:'Investigation'};

export const appointment:z.infer<typeof Appointment>={id:'appointment-demo-001',victimId:caseRecord.victimId,counselorName:'Duty Counselor',startsAt:'2026-09-10T09:00:00.000Z',mode:'VOICE',status:'SCHEDULED'};

export const counselorAppointmentsList:z.infer<typeof Appointment>[]=[
 appointment,
 {id:'appointment-demo-002',victimId:'victim-demo-002',counselorName:'Duty Counselor',startsAt:'2026-09-10T11:30:00.000Z',mode:'VIDEO',status:'SCHEDULED'},
 {id:'appointment-demo-003',victimId:'victim-demo-004',counselorName:'Duty Counselor',startsAt:'2026-09-11T14:00:00.000Z',mode:'TEXT',status:'SCHEDULED'}
];

export const counselorCase:z.infer<typeof CounselorCase>={case:caseRecord,priority:'C2',reason:'Difficulty sleeping following reported intimidation. Current immediate safety has not been assessed.',evidence:[{id:'evidence-demo-001',statement:'I have been finding it difficult to sleep since the threatening calls.',recordedAt:'2026-09-08T08:30:00.000Z',source:'SELF_REPORT',uncertainty:'Current threat immediacy requires clarification.'}]};

export const initialAuthorityTask:z.infer<typeof AuthorityTask>={case:caseRecord,task:{id:'task-demo-001',caseId:caseRecord.id,title:'Review reported intimidation',priority:'A1',status:'SENT',reason:'Repeated threats were reported. A protection review is requested; current location safety is unresolved.',owner:'Demo district protection desk',dueAt:'2026-09-08T10:00:00.000Z'},recommendation:{id:'recommendation-demo-001',caseId:caseRecord.id,title:'Protection review',reason:'Clarify reported threats and consider appropriate protection measures.',status:'AWAITING_REVIEW',serviceAvailable:null}};

export const counselorCaseDetailsStore: Record<string, z.infer<typeof CounselorCaseDetail>> = {
 'case-demo-001': {
  case: caseRecord,
  priority: 'C2',
  reason: 'Difficulty sleeping following reported intimidation. Current immediate safety has not been assessed.',
  evidence: [
   {id:'evidence-demo-001',statement:'I have been finding it difficult to sleep since the threatening calls.',recordedAt:'2026-09-08T08:30:00.000Z',source:'SELF_REPORT',uncertainty:'Current threat immediacy requires clarification.'},
   {id:'evidence-demo-002',statement:'A person came near my house yesterday evening and shouted.',recordedAt:'2026-09-08T19:15:00.000Z',source:'SELF_REPORT',uncertainty:'Identity of individual unconfirmed.'}
  ],
  unansweredQuestions: [
   {id:'uq-001',question:'Are you currently in a safe location with secure doors?',urgency:'HIGH'},
   {id:'uq-002',question:'Do you have a trusted family member or neighbor staying with you tonight?',urgency:'MEDIUM'}
  ],
  speechObservations: [
   {id:'so-001',indicator:'Hesitant speech rate',observation:'Frequent pauses observed when discussing evening events.',recordedAt:'2026-09-08T08:31:00.000Z'},
   {id:'so-002',indicator:'Elevated vocal tension',observation:'Slight pitch variation during mention of phone calls.',recordedAt:'2026-09-08T08:32:00.000Z'}
  ],
  questionnaires: [
   {id:'qr-001',title:'GAD-7 Anxiety Screening',scoreSummary:'Moderate anxiety indicators (11/21)',completedAt:'2026-09-07T10:00:00.000Z',items:[
    {question:'Feeling nervous, anxious or on edge',answer:'Nearly every day'},
    {question:'Not being able to stop or control worrying',answer:'Several days'},
    {question:'Trouble relaxing',answer:'More than half the days'}
   ]}
  ],
  sharedJournal: [
   {id:'sj-001',title:'Evening Thoughts',content:'Felt anxious after 8 PM when the street got quiet. Recorded my breathing exercise.',sharedAt:'2026-09-08T20:00:00.000Z',category:'EMOTIONAL_CHECKIN'}
  ],
  supportPlan: {
   id:'sp-001',
   goal:'Establish safe daily routine and reduce acute nighttime anxiety.',
   actions:['Daily evening voice check-in at 7 PM','Review grounding techniques','Coordinate district protection status'],
   counselorNotes:'Victim responds well to structured grounding exercises. Recommended legal support referral.',
   targetDate:'2026-09-15T00:00:00.000Z'
  },
  contactHistory: [
   {id:'ch-001',timestamp:'2026-09-08T09:00:00.000Z',mode:'VOICE',outcome:'Completed safety check-in. Guided through breathing exercises.',notes:'Riya confirmed she is indoors.',counselorName:'Duty Counselor'}
  ],
  guidanceGiven: [
   {id:'gg-001',givenAt:'2026-09-08T08:35:00.000Z',summary:'Shared grounding exercise and direct helpline emergency callback guidance.'}
  ],
  assignedCounselor: 'Duty Counselor',
  isEscalated: false
 },
 'case-demo-002': {
  case: {id:'case-demo-002',victimId:'victim-demo-002',preferredName:'Sunita',docket:'DEMO-NHAA-002',district:'Nagpur',state:'Maharashtra',stage:'Protection Request'},
  priority: 'C0',
  reason:'Definite current danger statement received during chat session.',
  evidence: [
   {id:'evidence-003',statement:'They are outside my door right now shouting and banging.',recordedAt:'2026-09-09T08:00:00.000Z',source:'SELF_REPORT',uncertainty:null}
  ],
  unansweredQuestions: [
   {id:'uq-003',question:'Is there an alternate safe room or exit available?',urgency:'HIGH'}
  ],
  speechObservations: [
   {id:'so-003',indicator:'Rapid breathing and tremor',observation:'Severe vocal tremor recorded in audio snippet.',recordedAt:'2026-09-09T08:01:00.000Z'}
  ],
  questionnaires: [],
  sharedJournal: [],
  supportPlan: {
   id:'sp-002',
   goal:'Immediate emergency dispatch and safe shelter transfer.',
   actions:['Dispatch ERSS unit','Maintain live open channel','Alert Nagpur district police desk'],
   counselorNotes:'Immediate active crisis mode.',
   targetDate:'2026-09-09T12:00:00.000Z'
  },
  contactHistory: [
   {id:'ch-002',timestamp:'2026-09-09T08:02:00.000Z',mode:'VOICE',outcome:'Active crisis call in progress.',notes:'ERSS 112 payload dispatched.',counselorName:'Duty Counselor'}
  ],
  guidanceGiven: [
   {id:'gg-002',givenAt:'2026-09-09T08:01:00.000Z',summary:'Advised staying behind locked door, muted ringer.'}
  ],
  assignedCounselor: 'Duty Counselor',
  isEscalated: true
 },
 'case-demo-003': {
  case: {id:'case-demo-003',victimId:'victim-demo-003',preferredName:'Akash',docket:'DEMO-NHAA-003',district:'Thane',state:'Maharashtra',stage:'Relief Review'},
  priority: 'C1',
  reason:'Urgent concern regarding missing medication and physical harassment facts.',
  evidence: [
   {id:'evidence-004',statement:'I was pushed on the road yesterday and lost my bag with medical documents.',recordedAt:'2026-09-08T14:20:00.000Z',source:'SELF_REPORT',uncertainty:'Injuries unassessed.'}
  ],
  unansweredQuestions: [
   {id:'uq-004',question:'Do you require medical evaluation today for physical injuries?',urgency:'HIGH'}
  ],
  speechObservations: [],
  questionnaires: [],
  sharedJournal: [],
  supportPlan: null,
  contactHistory: [],
  guidanceGiven: [],
  assignedCounselor: null,
  isEscalated: false
 },
 'case-demo-004': {
  case: {id:'case-demo-004',victimId:'victim-demo-004',preferredName:'Priya',docket:'DEMO-NHAA-004',district:'Nashik',state:'Maharashtra',stage:'Counseling Support'},
  priority: 'C3',
  reason:'Continuing planned bi-weekly counseling for trauma recovery.',
  evidence: [
   {id:'evidence-005',statement:'Feeling much calmer after starting the weekly support sessions.',recordedAt:'2026-09-06T11:00:00.000Z',source:'SELF_REPORT',uncertainty:null}
  ],
  unansweredQuestions: [],
  speechObservations: [],
  questionnaires: [],
  sharedJournal: [
   {id:'sj-002',title:'Weekly Progress',content:'Managed to attend community meeting with family support.',sharedAt:'2026-09-06T15:00:00.000Z',category:'RECOVERY_MILESTONE'}
  ],
  supportPlan: {
   id:'sp-004',
   goal:'Bi-weekly supportive counseling and community integration.',
   actions:['Follow up call next Tuesday'],
   counselorNotes:'Stable progress.',
   targetDate:'2026-09-20T00:00:00.000Z'
  },
  contactHistory: [
   {id:'ch-004',timestamp:'2026-09-06T11:00:00.000Z',mode:'VOICE',outcome:'Completed planned session.',notes:'Mood positive.',counselorName:'Assigned Counselor'}
  ],
  guidanceGiven: [],
  assignedCounselor: 'Assigned Counselor',
  isEscalated: false
 },
 'case-demo-005': {
  case: {id:'case-demo-005',victimId:'victim-demo-005',preferredName:'Rajesh',docket:'DEMO-NHAA-005',district:'Kolhapur',state:'Maharashtra',stage:'Intake'},
  priority: 'MONITOR',
  reason:'Indirect evidence of stress reported via intake form. Safety unassessed.',
  evidence: [
   {id:'evidence-006',statement:'Submitted intake form mentioning general distress.',recordedAt:'2026-09-07T16:00:00.000Z',source:'SELF_REPORT',uncertainty:'Safety status unassessed.'}
  ],
  unansweredQuestions: [
   {id:'uq-005',question:'Would you like to schedule a introductory conversation with a counselor?',urgency:'LOW'}
  ],
  speechObservations: [],
  questionnaires: [],
  sharedJournal: [],
  supportPlan: null,
  contactHistory: [],
  guidanceGiven: [],
  assignedCounselor: null,
  isEscalated: false
 }
};



export const districtAnalytics:z.infer<typeof DistrictAnalytics>={period:'Synthetic operational replay: 5–9 September 2026',updatedAt:'2026-09-09T01:00:00.000Z',timeZone:'Asia/Kolkata',riskTiers:[{tier:'A0',count:0},{tier:'A1',count:1},{tier:'A2',count:0},{tier:'A3',count:0},{tier:'A4',count:0},{tier:'A5',count:0}],trend:[{period:'5 Sep',openUrgentTasks:0,acknowledgedWithinTarget:0,acknowledgementOverdue:0},{period:'6 Sep',openUrgentTasks:1,acknowledgedWithinTarget:1,acknowledgementOverdue:0},{period:'7 Sep',openUrgentTasks:1,acknowledgedWithinTarget:1,acknowledgementOverdue:0},{period:'8 Sep',openUrgentTasks:1,acknowledgedWithinTarget:0,acknowledgementOverdue:1},{period:'9 Sep',openUrgentTasks:1,acknowledgedWithinTarget:0,acknowledgementOverdue:1}],responseTimes:[{tier:'A0',averageAcknowledgementMinutes:null,targetMinutes:15},{tier:'A1',averageAcknowledgementMinutes:32,targetMinutes:30},{tier:'A2',averageAcknowledgementMinutes:null,targetMinutes:120},{tier:'A3',averageAcknowledgementMinutes:null,targetMinutes:480},{tier:'A4',averageAcknowledgementMinutes:null,targetMinutes:1440},{tier:'A5',averageAcknowledgementMinutes:null,targetMinutes:2880}],subdivisions:[{name:'Block North',openUrgentTasks:1,openTasks:1},{name:'Block Central',openUrgentTasks:0,openTasks:0},{name:'Block Rural',openUrgentTasks:0,openTasks:0}]};

export const stateAnalytics:z.infer<typeof StateAnalytics>={period:'Synthetic state operational replay: 5-9 September 2026',updatedAt:'2026-09-09T01:00:00.000Z',timeZone:'Asia/Kolkata',districts:[{name:'Pune',monitoredPeople:12,openUrgentTasks:3,acknowledgementOverdue:1,acknowledgedWithinDemoTarget:2,capacityStatus:'CONSTRAINED',formalEscalations:1},{name:'Nashik',monitoredPeople:9,openUrgentTasks:1,acknowledgementOverdue:0,acknowledgedWithinDemoTarget:1,capacityStatus:'ADEQUATE',formalEscalations:0},{name:'Nagpur',monitoredPeople:11,openUrgentTasks:2,acknowledgementOverdue:1,acknowledgedWithinDemoTarget:1,capacityStatus:'GAP_REPORTED',formalEscalations:1},{name:'Kolhapur',monitoredPeople:7,openUrgentTasks:1,acknowledgementOverdue:0,acknowledgedWithinDemoTarget:1,capacityStatus:'ADEQUATE',formalEscalations:0}],trend:[{period:'5 Sep',openUrgentTasks:4,formalEscalations:0,districtsWithCapacityGap:1},{period:'6 Sep',openUrgentTasks:5,formalEscalations:1,districtsWithCapacityGap:1},{period:'7 Sep',openUrgentTasks:6,formalEscalations:1,districtsWithCapacityGap:2},{period:'8 Sep',openUrgentTasks:7,formalEscalations:2,districtsWithCapacityGap:2},{period:'9 Sep',openUrgentTasks:7,formalEscalations:2,districtsWithCapacityGap:2}],resourceGaps:[{service:'Safe accommodation and transport',districtsWithGap:2,openTasksAffected:3,status:'ESCALATED'},{service:'Legal-support referral capacity',districtsWithGap:1,openTasksAffected:2,status:'COORDINATION_REQUIRED'},{service:'Rehabilitation follow-up',districtsWithGap:1,openTasksAffected:1,status:'MONITORING'}],crossDistrictWork:[{workstream:'Protection coordination',districtCount:2,openItems:2,status:'AT_RISK'},{workstream:'Relief and rehabilitation coordination',districtCount:3,openItems:3,status:'ESCALATED'},{workstream:'Legal-support referral pathway',districtCount:2,openItems:1,status:'ON_TRACK'}]};

export const nationalAnalytics:z.infer<typeof NationalAnalytics>={period:'Synthetic national operational replay: 5-9 September 2026',updatedAt:'2026-09-09T01:00:00.000Z',timeZone:'Asia/Kolkata',states:[{name:'Maharashtra',monitoredPeople:39,openUrgentTasks:7,acknowledgementOverdue:2,reportingCoveragePercent:96,systemicGaps:2,formalEscalations:2},{name:'Karnataka',monitoredPeople:31,openUrgentTasks:4,acknowledgementOverdue:1,reportingCoveragePercent:94,systemicGaps:1,formalEscalations:1},{name:'Tamil Nadu',monitoredPeople:28,openUrgentTasks:3,acknowledgementOverdue:0,reportingCoveragePercent:98,systemicGaps:1,formalEscalations:0},{name:'Telangana',monitoredPeople:22,openUrgentTasks:2,acknowledgementOverdue:1,reportingCoveragePercent:89,systemicGaps:2,formalEscalations:1}],trend:[{period:'5 Sep',openUrgentTasks:11,acknowledgementOverdue:2,reportingStates:4},{period:'6 Sep',openUrgentTasks:13,acknowledgementOverdue:2,reportingStates:4},{period:'7 Sep',openUrgentTasks:15,acknowledgementOverdue:3,reportingStates:4},{period:'8 Sep',openUrgentTasks:16,acknowledgementOverdue:4,reportingStates:4},{period:'9 Sep',openUrgentTasks:16,acknowledgementOverdue:4,reportingStates:4}],systemicGaps:[{service:'Safe accommodation and transport',statesReportingGap:3,openTasksAffected:6,status:'NATIONAL_COORDINATION'},{service:'Legal-support referral capacity',statesReportingGap:2,openTasksAffected:4,status:'PROGRAMME_REVIEW'},{service:'Rehabilitation follow-up',statesReportingGap:2,openTasksAffected:3,status:'MONITORING'}],performance:[{metric:'Reporting coverage',currentValue:377,denominator:400,label:'377 of 400 configured reporting units'},{metric:'Acknowledgements within demo target',currentValue:12,denominator:16,label:'12 of 16 open urgent tasks'}]};

export const initialDistrictAssistance:z.infer<typeof DistrictAssistanceRequest>[]=[{id:'assist-demo-001',docket:'DEMO-NHAA-001',title:'Protection response coordination',category:'PROTECTION',priority:'A1',status:'AWAITING_REVIEW',description:'Reported intimidation requires a human protection review. Current safety and responder availability must be confirmed.',serviceAvailable:null,dueAt:'2026-09-10T10:00:00.000Z',lastHumanNote:null},{id:'assist-demo-002',docket:'DEMO-NHAA-002',title:'Court transport and accompaniment',category:'COURT_TRANSPORT',priority:'A3',status:'APPROVED',description:'A victim reports feeling unsafe travelling alone for a scheduled court appearance. Coordinate a suitable transport or accompaniment option after human review.',serviceAvailable:true,dueAt:'2026-09-11T07:30:00.000Z',lastHumanNote:'Approval recorded for demo coordination.'},{id:'assist-demo-003',docket:'DEMO-NHAA-003',title:'Temporary safe accommodation review',category:'SAFE_ACCOMMODATION',priority:'A2',status:'UNAVAILABLE',description:'Temporary safe accommodation was requested while a relocation review is considered. The current demo service capacity is unavailable.',serviceAvailable:false,dueAt:'2026-09-10T18:00:00.000Z',lastHumanNote:'No demo capacity available; use an approved escalation pathway.'}];
