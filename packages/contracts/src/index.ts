import { z } from 'zod';
export const DemoRole=z.enum(['victim','counselor','district','state','national']);
export type DemoRole=z.infer<typeof DemoRole>;
export const CounselorPriority=z.enum(['C0','C1','C2','C3','MONITOR']);
export const AuthorityPriority=z.enum(['A0','A1','A2','A3','A4','A5']);
export const AlertState=z.enum(['CREATED','SENT','ACKNOWLEDGED','RESPONDER_ASSIGNED','RESPONSE_IN_PROGRESS','HANDED_OFF','CLOSED_BY_HUMAN','DELIVERY_FAILED','ACK_OVERDUE','FALLBACK_SENT','ESCALATION_FAILED']);
export const InterventionState=z.enum(['PROPOSED','AWAITING_REVIEW','APPROVED','DECLINED_BY_OFFICIAL','OFFERED_TO_VICTIM','ACCEPTED_BY_VICTIM','DECLINED_BY_VICTIM','SCHEDULED','IN_PROGRESS','DELIVERED','FAILED','UNAVAILABLE','FOLLOW_UP_VERIFIED','CLOSED_WITH_REASON']);
export const CaseSummary=z.object({id:z.string(),victimId:z.string(),preferredName:z.string(),docket:z.string(),district:z.string(),state:z.string(),stage:z.string()});
export const Appointment=z.object({id:z.string(),victimId:z.string(),counselorName:z.string(),startsAt:z.string().datetime(),mode:z.enum(['VOICE','VIDEO','TEXT','IN_PERSON']),status:z.enum(['SCHEDULED','CANCELLED','COMPLETED'])});
export const Evidence=z.object({id:z.string(),statement:z.string(),recordedAt:z.string().datetime(),source:z.enum(['SELF_REPORT','CASE_EVENT','HUMAN_REVIEW']),uncertainty:z.string().nullable()});
export const Task=z.object({id:z.string(),caseId:z.string(),title:z.string(),priority:AuthorityPriority,status:AlertState,reason:z.string(),owner:z.string(),dueAt:z.string().datetime()});
export const Recommendation=z.object({id:z.string(),caseId:z.string(),title:z.string(),reason:z.string(),status:InterventionState,serviceAvailable:z.boolean().nullable()});
export const VictimHome=z.object({case:CaseSummary,appointment:Appointment,support:z.array(z.object({id:z.string(),title:z.string(),status:z.string()}))});
export const CounselorCase=z.object({case:CaseSummary,priority:CounselorPriority,reason:z.string(),evidence:z.array(Evidence)});
export const AuthorityTask=z.object({case:CaseSummary,task:Task,recommendation:Recommendation});
export const Monitoring=z.object({scope:z.enum(['state','national']),period:z.string(),updatedAt:z.string().datetime(),monitoredVictims:z.number().int(),openTasks:z.number().int(),acknowledgedTasks:z.number().int(),regions:z.array(z.object({name:z.string(),victims:z.number().int(),openTasks:z.number().int()}))});
export const priorityLabels:Record<string,string>={C0:'Immediate response',C1:'Urgent unresolved review',C2:'Priority support',C3:'Planned follow-up',MONITOR:'Offer a check-in',A0:'Emergency life safety',A1:'Immediate protection',A2:'Urgent relief or rehabilitation',A3:'Time-bound case action',A4:'Legal-support referral',A5:'Programme review'};
export const statusLabel=(value:string)=>value.toLowerCase().replaceAll('_',' ');

