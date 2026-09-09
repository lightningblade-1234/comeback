import { z } from 'zod';
import { type DemoRole,VictimHome,CounselorCase,CounselorCaseDetail,Appointment,AuthorityTask,Task,Monitoring,PriorityOverridePayload,ContactLogPayload,ClarificationPayload,SupportPlanPayload,EscalationPayload } from '@haven/contracts';
export class ApiError extends Error {constructor(public status:number,message:string){super(message);this.name='ApiError';}}
async function request<T>(path:string,schema:z.ZodType<T>,role:DemoRole,method='GET',body?:unknown):Promise<T>{
 const options:RequestInit={method,headers:{'X-Demo-Role':role,'Content-Type':'application/json'}};
 if(body!==undefined)options.body=JSON.stringify(body);
 const response=await fetch('/api'+path,options);
 if(!response.ok){const resBody:unknown=await response.json().catch(()=>null);throw new ApiError(response.status,z.object({message:z.string()}).safeParse(resBody).data?.message??'Request failed. Please try again.');}
 return schema.parse(await response.json());
}
// Demo headers are not authentication. The future server must verify identity and scope.
export const api={
 victimHome:()=>request('/victim/home',VictimHome,'victim'),
 counselorCases:()=>request('/counselor/cases',z.array(CounselorCase),'counselor'),
 counselorCaseDetail:(caseId:string)=>request('/counselor/cases/'+encodeURIComponent(caseId),CounselorCaseDetail,'counselor'),
 overridePriority:(caseId:string,payload:PriorityOverridePayload)=>request('/counselor/cases/'+encodeURIComponent(caseId)+'/override-priority',CounselorCaseDetail,'counselor','POST',payload),
 recordContact:(caseId:string,payload:ContactLogPayload)=>request('/counselor/cases/'+encodeURIComponent(caseId)+'/contact',CounselorCaseDetail,'counselor','POST',payload),
 updateSupportPlan:(caseId:string,payload:SupportPlanPayload)=>request('/counselor/cases/'+encodeURIComponent(caseId)+'/support-plan',CounselorCaseDetail,'counselor','POST',payload),
 requestClarification:(caseId:string,payload:ClarificationPayload)=>request('/counselor/cases/'+encodeURIComponent(caseId)+'/clarification',CounselorCaseDetail,'counselor','POST',payload),
 escalateCase:(caseId:string,payload:EscalationPayload)=>request('/counselor/cases/'+encodeURIComponent(caseId)+'/escalate',CounselorCaseDetail,'counselor','POST',payload),
 counselorAppointments:()=>request('/counselor/appointments',z.array(Appointment),'counselor'),
 supervisionQueue:()=>request('/counselor/supervision',z.array(CounselorCaseDetail),'counselor'),
 authorityTasks:()=>request('/authority/tasks',z.array(AuthorityTask),'district'),
 acknowledge:(id:string)=>request('/authority/tasks/'+encodeURIComponent(id)+'/acknowledge',Task,'district','POST'),
 monitoring:(role:'state'|'national')=>request('/monitoring',Monitoring,role),
};
export const queryKeys={
 victim:['victim','home'] as const,
 counselor:['counselor','cases'] as const,
 counselorCaseDetail:(caseId:string)=>['counselor','cases',caseId] as const,
 counselorAppointments:['counselor','appointments'] as const,
 supervisionQueue:['counselor','supervision'] as const,
 tasks:['district','tasks'] as const,
 monitoring:(role:string)=>[role,'monitoring'] as const
};


