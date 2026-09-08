import { http,HttpResponse,delay } from 'msw';
import { caseRecord,appointment,counselorCase,initialAuthorityTask } from './fixtures';
let authorityTask=structuredClone(initialAuthorityTask);
export function resetFixtures(){authorityTask=structuredClone(initialAuthorityTask);}
const roleOf=(request:Request)=>request.headers.get('X-Demo-Role');
const forbidden=()=>HttpResponse.json({message:'This demo role cannot access this resource.'},{status:403});
export const handlers=[
 http.get('*/api/victim/home',async({request})=>{if(roleOf(request)!=='victim')return forbidden();await delay(100);return HttpResponse.json({case:caseRecord,appointment,support:[{id:authorityTask.task.id,title:'Protection support request',status:authorityTask.task.status}]});}),
 http.get('*/api/counselor/cases',async({request})=>{if(roleOf(request)!=='counselor')return forbidden();await delay(100);return HttpResponse.json([counselorCase]);}),
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

