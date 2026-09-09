import { http,HttpResponse,delay } from 'msw';
import { type CounselorPriority, type ContactRecord } from '@haven/contracts';
import { caseRecord,appointment,initialAuthorityTask,counselorCaseDetailsStore,counselorAppointmentsList } from './fixtures';
let authorityTask=structuredClone(initialAuthorityTask);
let caseDetailsStore=structuredClone(counselorCaseDetailsStore);

export function resetFixtures(){
 authorityTask=structuredClone(initialAuthorityTask);
 caseDetailsStore=structuredClone(counselorCaseDetailsStore);
}

const roleOf=(request:Request)=>request.headers.get('X-Demo-Role');
const forbidden=()=>HttpResponse.json({message:'This demo role cannot access this resource.'},{status:403});

export const handlers=[
 http.get('*/api/victim/home',async({request})=>{if(roleOf(request)!=='victim')return forbidden();await delay(100);return HttpResponse.json({case:caseRecord,appointment,support:[{id:authorityTask.task.id,title:'Protection support request',status:authorityTask.task.status}]});}),
 
 http.get('*/api/counselor/cases',async({request})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  await delay(100);
  const cases = Object.values(caseDetailsStore).map(item => ({
   case: item.case,
   priority: item.priority,
   reason: item.reason,
   evidence: item.evidence
  }));
  return HttpResponse.json(cases);
 }),

 http.get('*/api/counselor/cases/:caseId',async({request,params})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  await delay(100);
  const caseId = String(params.caseId);
  const detail = caseDetailsStore[caseId];
  if(!detail) return HttpResponse.json({message:'Counselor case not found.'},{status:404});
  return HttpResponse.json(detail);
 }),

 http.post('*/api/counselor/cases/:caseId/override-priority',async({request,params})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  const caseId = String(params.caseId);
  const detail = caseDetailsStore[caseId];
  if(!detail) return HttpResponse.json({message:'Counselor case not found.'},{status:404});
  const body = (await request.json()) as { newPriority: CounselorPriority; reason: string };
  detail.priority = body.newPriority;
  detail.reason = `Human priority correction: ${body.reason}`;
  detail.contactHistory.unshift({
   id: `ch-override-${Date.now()}`,
   timestamp: new Date().toISOString(),
   mode: 'VOICE',
   outcome: `Priority updated to ${body.newPriority}`,
   notes: body.reason,
   counselorName: 'Duty Counselor'
  });
  return HttpResponse.json(detail);
 }),

 http.post('*/api/counselor/cases/:caseId/contact',async({request,params})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  const caseId = String(params.caseId);
  const detail = caseDetailsStore[caseId];
  if(!detail) return HttpResponse.json({message:'Counselor case not found.'},{status:404});
  const body = (await request.json()) as { mode: ContactRecord['mode']; outcome: string; notes: string };
  detail.contactHistory.unshift({
   id: `ch-${Date.now()}`,
   timestamp: new Date().toISOString(),
   mode: body.mode,
   outcome: body.outcome,
   notes: body.notes,
   counselorName: 'Duty Counselor'
  });
  return HttpResponse.json(detail);
 }),


 http.post('*/api/counselor/cases/:caseId/support-plan',async({request,params})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  const caseId = String(params.caseId);
  const detail = caseDetailsStore[caseId];
  if(!detail) return HttpResponse.json({message:'Counselor case not found.'},{status:404});
  const body = (await request.json()) as { goal: string; actions: string[]; counselorNotes: string; targetDate: string | null };
  detail.supportPlan = {
   id: detail.supportPlan?.id ?? `sp-${Date.now()}`,
   goal: body.goal,
   actions: body.actions,
   counselorNotes: body.counselorNotes,
   targetDate: body.targetDate
  };
  return HttpResponse.json(detail);
 }),

 http.post('*/api/counselor/cases/:caseId/clarification',async({request,params})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  const caseId = String(params.caseId);
  const detail = caseDetailsStore[caseId];
  if(!detail) return HttpResponse.json({message:'Counselor case not found.'},{status:404});
  const body = (await request.json()) as { question: string };
  detail.unansweredQuestions.push({
   id: `uq-${Date.now()}`,
   question: body.question,
   urgency: 'HIGH'
  });
  return HttpResponse.json(detail);
 }),

 http.post('*/api/counselor/cases/:caseId/escalate',async({request,params})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  const caseId = String(params.caseId);
  const detail = caseDetailsStore[caseId];
  if(!detail) return HttpResponse.json({message:'Counselor case not found.'},{status:404});
  const body = (await request.json()) as { targetSupervisor: string; reason: string };
  detail.isEscalated = true;
  detail.contactHistory.unshift({
   id: `ch-esc-${Date.now()}`,
   timestamp: new Date().toISOString(),
   mode: 'VOICE',
   outcome: `Escalated to Clinical Supervisor (${body.targetSupervisor})`,
   notes: body.reason,
   counselorName: 'Duty Counselor'
  });
  return HttpResponse.json(detail);
 }),

 http.get('*/api/counselor/appointments',async({request})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  await delay(100);
  return HttpResponse.json(counselorAppointmentsList);
 }),

 http.get('*/api/counselor/supervision',async({request})=>{
  if(roleOf(request)!=='counselor')return forbidden();
  await delay(100);
  const supervised = Object.values(caseDetailsStore).filter(item => item.isEscalated || item.priority === 'C0' || item.priority === 'C1');
  return HttpResponse.json(supervised);
 }),

 http.get('*/api/authority/tasks',async({request})=>{if(roleOf(request)!=='district')return forbidden();await delay(100);return HttpResponse.json([authorityTask]);}),
 http.post('*/api/authority/tasks/:id/acknowledge',({request,params})=>{
  if(roleOf(request)!=='district')return forbidden();
  if(params.id!==authorityTask.task.id)return HttpResponse.json({message:'Task not found.'},{status:404});
  if(authorityTask.task.status!=='SENT')return HttpResponse.json({message:'Task already acknowledged.'},{status:409});
  authorityTask={...authorityTask,task:{...authorityTask.task,status:'ACKNOWLEDGED'}};
  return HttpResponse.json(authorityTask.task);
 }),
 http.get('*/api/monitoring',({request})=>{
  const role=roleOf(request);if(role!=='state'&&role!=='national')return forbidden();
  return HttpResponse.json({scope:role,period:'Synthetic snapshot: 8 September 2026',updatedAt:'2026-09-08T09:00:00.000Z',monitoredVictims:1,openTasks:1,acknowledgedTasks:authorityTask.task.status==='ACKNOWLEDGED'?1:0,regions:[{name:role==='state'?'Pune':'Maharashtra',victims:1,openTasks:1}]});
 }),
];


