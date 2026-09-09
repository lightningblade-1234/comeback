import { z } from 'zod';
import { type DemoRole,VictimHome,CounselorCase,AuthorityTask,Task,Monitoring,DistrictAnalytics,StateAnalytics,NationalAnalytics } from '@haven/contracts';
export class ApiError extends Error {constructor(public status:number,message:string){super(message);this.name='ApiError';}}
async function request<T>(path:string,schema:z.ZodType<T>,role:DemoRole,method='GET'):Promise<T>{
 const response=await fetch('/api'+path,{method,headers:{'X-Demo-Role':role}});
 if(!response.ok){const body:unknown=await response.json().catch(()=>null);throw new ApiError(response.status,z.object({message:z.string()}).safeParse(body).data?.message??'Request failed. Please try again.');}
 return schema.parse(await response.json());
}
// Demo headers are not authentication. The future server must verify identity and scope.
export const api={
 victimHome:()=>request('/victim/home',VictimHome,'victim'),
 counselorCases:()=>request('/counselor/cases',z.array(CounselorCase),'counselor'),
 authorityTasks:()=>request('/authority/tasks',z.array(AuthorityTask),'district'),
 acknowledge:(id:string)=>request('/authority/tasks/'+encodeURIComponent(id)+'/acknowledge',Task,'district','POST'),
 districtAnalytics:()=>request('/authority/district-analytics',DistrictAnalytics,'district'),
 stateAnalytics:()=>request('/authority/state-analytics',StateAnalytics,'state'),
 nationalAnalytics:()=>request('/authority/national-analytics',NationalAnalytics,'national'),
 monitoring:(role:'state'|'national')=>request('/monitoring',Monitoring,role),
};
export const queryKeys={victim:['victim','home'] as const,counselor:['counselor','cases'] as const,tasks:['district','tasks'] as const,districtAnalytics:['district','analytics'] as const,stateAnalytics:['state','analytics'] as const,nationalAnalytics:['national','analytics'] as const,monitoring:(role:string)=>[role,'monitoring'] as const};

