import {useEffect,useMemo,useState} from 'react';
import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {statusLabel} from '@haven/contracts';
import {Panel,Loading,ErrorState} from '@haven/ui';
import {AuthorityPageHeader,PriorityBadge,formatDateTime} from './AuthorityShared';

type Assistance=Awaited<ReturnType<(typeof api)['districtAssistance']>>[number];
type AssistanceStatus=Assistance['status'];

const actions:Record<string,{next:AssistanceStatus;label:string}[]>={
 AWAITING_REVIEW:[{next:'APPROVED',label:'Approve for coordination'},{next:'DECLINED_BY_OFFICIAL',label:'Decline request'}],
 APPROVED:[{next:'SCHEDULED',label:'Schedule assistance'},{next:'UNAVAILABLE',label:'Record unavailable service'}],
 SCHEDULED:[{next:'IN_PROGRESS',label:'Mark assistance in progress'},{next:'UNAVAILABLE',label:'Record unavailable service'}],
 IN_PROGRESS:[{next:'DELIVERED',label:'Record delivered assistance'},{next:'FAILED',label:'Record failed assistance'}]
};

const label=(value:string)=>statusLabel(value).replaceAll('_',' ');
const supportLabel=(value:string)=>value.toLowerCase().replaceAll('_',' ');

function AssistanceCard({item}:{item:Assistance}){
 const client=useQueryClient();
 const choices=actions[item.status]??[];
 const [next,setNext]=useState<AssistanceStatus|''>(choices[0]?.next??'');
 const [note,setNote]=useState('');

 useEffect(()=>setNext(choices[0]?.next??''),[item.status]);

 const mutation=useMutation({
  mutationFn:()=>api.updateDistrictAssistance(item.id,{state:next as AssistanceStatus,note}),
  onSuccess:()=>{void client.invalidateQueries({queryKey:queryKeys.districtAssistance});setNote('');},
  onError:()=>undefined
 });

 return <Panel title={item.title}>
  <div className="assistance-meta"><PriorityBadge value={item.priority}/><span className="badge">{label(item.status)}</span></div>
  <p className="muted">{item.description}</p>
  <dl className="authority-definition-list authority-definition-list-compact">
   <div><dt>Docket</dt><dd>{item.docket}</dd></div>
   <div><dt>Requested support</dt><dd>{supportLabel(item.category)}</dd></div>
   <div><dt>Service availability</dt><dd>{item.serviceAvailable===null?'Not yet confirmed':item.serviceAvailable?'Available in demo':'Unavailable in demo'}</dd></div>
   <div><dt>Coordination deadline</dt><dd>{formatDateTime(item.dueAt)}</dd></div>
  </dl>
  {item.lastHumanNote?<div className="assistance-note"><strong>Latest human note</strong><p>{item.lastHumanNote}</p></div>:null}
  {choices.length===0
   ?<p className="muted assistance-closed-note">No further demo transition is available. Review action history or use an approved escalation pathway where appropriate.</p>
   :<form className="authority-action-form" onSubmit={event=>{event.preventDefault();mutation.mutate();}}>
     <label>Next action
      <select value={next} onChange={event=>setNext(event.target.value as AssistanceStatus)}>
       {choices.map(choice=><option value={choice.next} key={choice.next}>{choice.label}</option>)}
      </select>
     </label>
     <label>Human decision or coordination note
      <textarea required minLength={3} value={note} onChange={event=>setNote(event.target.value)} placeholder="Record the basis for this decision or coordination update."/>
     </label>
     {mutation.isError?<p className="authority-form-error">The update was not saved. Check the current state and try again.</p>:null}
     <button className="button" type="submit" disabled={mutation.isPending}>{mutation.isPending?'Saving update...':'Confirm update'}</button>
    </form>}
 </Panel>;
}

export function DistrictAssistance(){
 const q=useQuery({queryKey:queryKeys.districtAssistance,queryFn:api.districtAssistance});
 const [category,setCategory]=useState('ALL');
 const [state,setState]=useState('ALL');

 const data=q.data??[];
 const visible=useMemo(()=>data.filter(item=>(category==='ALL'||item.category===category)&&(state==='ALL'||item.status===state)),[category,data,state]);
 const awaiting=data.filter(item=>item.status==='AWAITING_REVIEW').length;
 const active=data.filter(item=>['APPROVED','SCHEDULED','IN_PROGRESS'].includes(item.status)).length;
 const unavailable=data.filter(item=>['UNAVAILABLE','FAILED'].includes(item.status)).length;
 const nextDeadline=[...data].sort((a,b)=>a.dueAt.localeCompare(b.dueAt))[0];

 if(q.isPending)return <Loading/>;
 if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;

 return <>
  <AuthorityPageHeader eyebrow="Maharashtra / Pune - District service coordination" title="Assistance coordination">
   Coordinate practical, role-scoped help after human review: protection, court transport or accompaniment, safe accommodation, relief, legal aid, medical assessment, and rehabilitation. This is a synthetic demo; no real provider is contacted.
  </AuthorityPageHeader>

  <section aria-label="Assistance coordination summary" className="grid authority-summary-grid">
   <Panel title="Awaiting human review"><div className="stat">{awaiting}</div><p className="muted">Requests requiring a documented district decision.</p></Panel>
   <Panel title="Active coordination"><div className="stat">{active}</div><p className="muted">Approved, scheduled, or currently in-progress support.</p></Panel>
   <Panel title="Unavailable or failed"><div className="stat">{unavailable}</div><p className="muted">Capacity or delivery issue requiring follow-up or escalation.</p></Panel>
   <Panel title="Next coordination deadline"><div className="assistance-deadline">{nextDeadline?formatDateTime(nextDeadline.dueAt):'No open deadline'}</div><p className="muted">Configurable demo timing, not a statutory deadline.</p></Panel>
  </section>

  <section className="assistance-guidance" aria-labelledby="assistance-guidance-title">
   <p className="eyebrow">District response workflow</p>
   <h2 id="assistance-guidance-title">Move practical support from review to verified follow-up</h2>
   <ol className="assistance-steps">
    <li><strong>Review the request</strong><span>Confirm the scope, urgency, available service and approved purpose.</span></li>
    <li><strong>Coordinate responsibly</strong><span>Record approval, scheduling, an unavailable service, or an in-progress update with a human note.</span></li>
    <li><strong>Verify before closure</strong><span>Delivery status is not evidence that help reached a person. Record follow-up through the approved process.</span></li>
   </ol>
  </section>

  <section aria-labelledby="assistance-request-list">
   <div className="authority-toolbar assistance-toolbar">
    <div>
     <p className="eyebrow">Role-scoped requests</p>
     <h2 id="assistance-request-list">District assistance requests</h2>
     <p className="muted">Showing {visible.length} of {data.length} synthetic requests. Filters affect the full list below.</p>
    </div>
    <div className="authority-filters" aria-label="Assistance request filters">
     <label>Support type
      <select value={category} onChange={event=>setCategory(event.target.value)}>
       <option value="ALL">All support types</option>
       {[...new Set(data.map(item=>item.category))].map(value=><option key={value} value={value}>{supportLabel(value)}</option>)}
      </select>
     </label>
     <label>Coordination state
      <select value={state} onChange={event=>setState(event.target.value)}>
       <option value="ALL">All coordination states</option>
       {[...new Set(data.map(item=>item.status))].map(value=><option key={value} value={value}>{label(value)}</option>)}
      </select>
     </label>
    </div>
   </div>

   {visible.length
    ?<div className="grid assistance-request-grid">{visible.map(item=><AssistanceCard item={item} key={item.id}/>)}</div>
    :<Panel title="No matching assistance requests"><p className="muted">Try clearing a filter to view the district's synthetic assistance coordination requests.</p></Panel>}
  </section>

  <Panel title="Operational boundary">
   <p className="muted">A recorded approval, availability, or delivery update is an operational status only. It does not prove that assistance reached a person. Human notes are required and unsupported transitions are blocked.</p>
  </Panel>
 </>;
}
