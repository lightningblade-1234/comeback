import { z } from 'zod';
export const DemoRole=z.enum(['victim','counselor','district','state','national']);
export type DemoRole=z.infer<typeof DemoRole>;
export const CounselorPriority=z.enum(['C0','C1','C2','C3','MONITOR']);
export type CounselorPriority=z.infer<typeof CounselorPriority>;
export const AuthorityPriority=z.enum(['A0','A1','A2','A3','A4','A5']);
export type AuthorityPriority=z.infer<typeof AuthorityPriority>;
export const AlertState=z.enum(['CREATED','SENT','ACKNOWLEDGED','RESPONDER_ASSIGNED','RESPONSE_IN_PROGRESS','HANDED_OFF','CLOSED_BY_HUMAN','DELIVERY_FAILED','ACK_OVERDUE','FALLBACK_SENT','ESCALATION_FAILED']);
export const InterventionState=z.enum(['PROPOSED','AWAITING_REVIEW','APPROVED','DECLINED_BY_OFFICIAL','OFFERED_TO_VICTIM','ACCEPTED_BY_VICTIM','DECLINED_BY_VICTIM','SCHEDULED','IN_PROGRESS','DELIVERED','FAILED','UNAVAILABLE','FOLLOW_UP_VERIFIED','CLOSED_WITH_REASON']);

export const CaseSummary=z.object({id:z.string(),victimId:z.string(),preferredName:z.string(),docket:z.string(),district:z.string(),state:z.string(),stage:z.string()});
export type CaseSummary=z.infer<typeof CaseSummary>;

export const Appointment=z.object({id:z.string(),victimId:z.string(),counselorName:z.string(),startsAt:z.string().datetime(),mode:z.enum(['VOICE','VIDEO','TEXT','IN_PERSON']),status:z.enum(['SCHEDULED','CANCELLED','COMPLETED'])});
export type Appointment=z.infer<typeof Appointment>;

export const Evidence=z.object({id:z.string(),statement:z.string(),recordedAt:z.string().datetime(),source:z.enum(['SELF_REPORT','CASE_EVENT','HUMAN_REVIEW']),uncertainty:z.string().nullable()});
export type Evidence=z.infer<typeof Evidence>;

export const Task=z.object({id:z.string(),caseId:z.string(),title:z.string(),priority:AuthorityPriority,status:AlertState,reason:z.string(),owner:z.string(),dueAt:z.string().datetime()});
export const Recommendation=z.object({id:z.string(),caseId:z.string(),title:z.string(),reason:z.string(),status:InterventionState,serviceAvailable:z.boolean().nullable()});

export const VictimHome=z.object({case:CaseSummary,appointment:Appointment,support:z.array(z.object({id:z.string(),title:z.string(),status:z.string()}))});
export const CounselorCase=z.object({case:CaseSummary,priority:CounselorPriority,reason:z.string(),evidence:z.array(Evidence)});
export type CounselorCase=z.infer<typeof CounselorCase>;

export const UnansweredQuestion=z.object({id:z.string(),question:z.string(),urgency:z.enum(['HIGH','MEDIUM','LOW'])});
export type UnansweredQuestion=z.infer<typeof UnansweredQuestion>;

export const SpeechObservation=z.object({id:z.string(),indicator:z.string(),observation:z.string(),recordedAt:z.string().datetime()});
export type SpeechObservation=z.infer<typeof SpeechObservation>;

export const QuestionnaireResult=z.object({id:z.string(),title:z.string(),scoreSummary:z.string(),completedAt:z.string().datetime(),items:z.array(z.object({question:z.string(),answer:z.string()}))});
export type QuestionnaireResult=z.infer<typeof QuestionnaireResult>;

export const SharedJournalEntry=z.object({id:z.string(),title:z.string(),content:z.string(),sharedAt:z.string().datetime(),category:z.string()});
export type SharedJournalEntry=z.infer<typeof SharedJournalEntry>;

export const SupportPlan=z.object({id:z.string(),goal:z.string(),actions:z.array(z.string()),counselorNotes:z.string(),targetDate:z.string().nullable()});
export type SupportPlan=z.infer<typeof SupportPlan>;

export const ContactRecord=z.object({id:z.string(),timestamp:z.string().datetime(),mode:z.enum(['VOICE','VIDEO','TEXT','IN_PERSON','ATTEMPT_UNSUCCESSFUL']),outcome:z.string(),notes:z.string(),counselorName:z.string()});
export type ContactRecord=z.infer<typeof ContactRecord>;

export const CounselorCaseDetail=z.object({
 case:CaseSummary,
 priority:CounselorPriority,
 reason:z.string(),
 evidence:z.array(Evidence),
 unansweredQuestions:z.array(UnansweredQuestion),
 speechObservations:z.array(SpeechObservation),
 questionnaires:z.array(QuestionnaireResult),
 sharedJournal:z.array(SharedJournalEntry),
 supportPlan:SupportPlan.nullable(),
 contactHistory:z.array(ContactRecord),
 guidanceGiven:z.array(z.object({id:z.string(),givenAt:z.string().datetime(),summary:z.string()})),
 assignedCounselor:z.string().nullable(),
 isEscalated:z.boolean().default(false)
});
export type CounselorCaseDetail=z.infer<typeof CounselorCaseDetail>;

export const PriorityOverridePayload=z.object({newPriority:CounselorPriority,reason:z.string().min(3,'Reason required')});
export type PriorityOverridePayload=z.infer<typeof PriorityOverridePayload>;

export const ContactLogPayload=z.object({mode:z.enum(['VOICE','VIDEO','TEXT','IN_PERSON','ATTEMPT_UNSUCCESSFUL']),outcome:z.string().min(2,'Outcome description required'),notes:z.string()});
export type ContactLogPayload=z.infer<typeof ContactLogPayload>;

export const ClarificationPayload=z.object({question:z.string().min(5,'Question required')});
export type ClarificationPayload=z.infer<typeof ClarificationPayload>;

export const SupportPlanPayload=z.object({goal:z.string().min(3),actions:z.array(z.string()),counselorNotes:z.string(),targetDate:z.string().nullable()});
export type SupportPlanPayload=z.infer<typeof SupportPlanPayload>;

export const EscalationPayload=z.object({targetSupervisor:z.string(),reason:z.string().min(5)});
export type EscalationPayload=z.infer<typeof EscalationPayload>;

export const AuthorityTask=z.object({case:CaseSummary,task:Task,recommendation:Recommendation});
export const Monitoring=z.object({scope:z.enum(['state','national']),period:z.string(),updatedAt:z.string().datetime(),monitoredVictims:z.number().int(),openTasks:z.number().int(),acknowledgedTasks:z.number().int(),regions:z.array(z.object({name:z.string(),victims:z.number().int(),openTasks:z.number().int()}))});

export const DistrictAnalytics=z.object({period:z.string(),updatedAt:z.string().datetime(),timeZone:z.string(),riskTiers:z.array(z.object({tier:AuthorityPriority,count:z.number().int().nonnegative()})),trend:z.array(z.object({period:z.string(),openUrgentTasks:z.number().int().nonnegative(),acknowledgedWithinTarget:z.number().int().nonnegative(),acknowledgementOverdue:z.number().int().nonnegative()})),responseTimes:z.array(z.object({tier:AuthorityPriority,averageAcknowledgementMinutes:z.number().nonnegative().nullable(),targetMinutes:z.number().positive()})),subdivisions:z.array(z.object({name:z.string(),openUrgentTasks:z.number().int().nonnegative(),openTasks:z.number().int().nonnegative()}))});
export const StateAnalytics=z.object({period:z.string(),updatedAt:z.string().datetime(),timeZone:z.string(),districts:z.array(z.object({name:z.string(),monitoredPeople:z.number().int().nonnegative(),openUrgentTasks:z.number().int().nonnegative(),acknowledgementOverdue:z.number().int().nonnegative(),acknowledgedWithinDemoTarget:z.number().int().nonnegative(),capacityStatus:z.enum(['ADEQUATE','CONSTRAINED','GAP_REPORTED']),formalEscalations:z.number().int().nonnegative()})),trend:z.array(z.object({period:z.string(),openUrgentTasks:z.number().int().nonnegative(),formalEscalations:z.number().int().nonnegative(),districtsWithCapacityGap:z.number().int().nonnegative()})),resourceGaps:z.array(z.object({service:z.string(),districtsWithGap:z.number().int().nonnegative(),openTasksAffected:z.number().int().nonnegative(),status:z.enum(['MONITORING','COORDINATION_REQUIRED','ESCALATED'])})),crossDistrictWork:z.array(z.object({workstream:z.string(),districtCount:z.number().int().nonnegative(),openItems:z.number().int().nonnegative(),status:z.enum(['ON_TRACK','AT_RISK','ESCALATED'])}))});
export type StateAnalytics=z.infer<typeof StateAnalytics>;
export const NationalAnalytics=z.object({period:z.string(),updatedAt:z.string().datetime(),timeZone:z.string(),states:z.array(z.object({name:z.string(),monitoredPeople:z.number().int().nonnegative(),openUrgentTasks:z.number().int().nonnegative(),acknowledgementOverdue:z.number().int().nonnegative(),reportingCoveragePercent:z.number().min(0).max(100),systemicGaps:z.number().int().nonnegative(),formalEscalations:z.number().int().nonnegative()})),trend:z.array(z.object({period:z.string(),openUrgentTasks:z.number().int().nonnegative(),acknowledgementOverdue:z.number().int().nonnegative(),reportingStates:z.number().int().nonnegative()})),systemicGaps:z.array(z.object({service:z.string(),statesReportingGap:z.number().int().nonnegative(),openTasksAffected:z.number().int().nonnegative(),status:z.enum(['MONITORING','NATIONAL_COORDINATION','PROGRAMME_REVIEW'])})),performance:z.array(z.object({metric:z.string(),currentValue:z.number().int().nonnegative(),denominator:z.number().int().positive(),label:z.string()}))});
export type NationalAnalytics=z.infer<typeof NationalAnalytics>;
export const priorityLabels:Record<string,string>={C0:'Immediate response',C1:'Urgent unresolved review',C2:'Priority support',C3:'Planned follow-up',MONITOR:'Offer a check-in',A0:'Emergency life safety',A1:'Immediate protection',A2:'Urgent relief or rehabilitation',A3:'Time-bound case action',A4:'Legal-support referral',A5:'Programme review'};
export const statusLabel=(value:string)=>value.toLowerCase().replaceAll('_',' ');


