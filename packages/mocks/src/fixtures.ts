import { type z } from 'zod';
import { CaseSummary,Appointment,CounselorCase,CounselorCaseDetail,AuthorityTask } from '@haven/contracts';

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


