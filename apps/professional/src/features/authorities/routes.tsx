import {type RouteObject} from 'react-router-dom';
import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {priorityLabels,statusLabel} from '@haven/contracts';
import {Panel,Badge,Button,Loading,ErrorState} from '@haven/ui';
import {Access} from '../../session';
function District(){
 const client=useQueryClient();
 const q=useQuery({queryKey:queryKeys.tasks,queryFn:api.authorityTasks});
 const mutation=useMutation({mutationFn:api.acknowledge,onSuccess:()=>client.invalidateQueries()});
 if(q.isPending)return <Loading/>;if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 return <><div className="eyebrow">Maharashtra / Pune</div><h1>District operations</h1><p className="muted">Protection and support tasks requiring a responsible official.</p>{q.data.length===0?<Panel title="No assigned tasks"/>:q.data.map(item=><Panel key={item.task.id} title={item.task.title}><div className="toolbar"><div><Badge>{item.task.priority} · {priorityLabels[item.task.priority]}</Badge><Badge>{statusLabel(item.task.status)}</Badge></div><Button disabled={mutation.isPending||item.task.status!=='SENT'} onClick={()=>mutation.mutate(item.task.id)}>{mutation.isPending?'Acknowledging…':item.task.status==='ACKNOWLEDGED'?'Acknowledged':'Acknowledge task'}</Button></div><p>{item.task.reason}</p><p className="muted">{item.case.docket} · {item.task.owner}</p><h2>Recommended action</h2><p>{item.recommendation.title} · {statusLabel(item.recommendation.status)}</p><p className="muted">Service availability has not been confirmed. Acknowledgement does not mean assistance was delivered.</p></Panel>)}{mutation.isError&&<p role="alert">{mutation.error.message}</p>}{mutation.isSuccess&&<p role="status">Task acknowledged in this browser's demo session.</p>}</>;
}
function Monitoring({scope}:{scope:'state'|'national'}){
 const q=useQuery({queryKey:queryKeys.monitoring(scope),queryFn:()=>api.monitoring(scope)});
 if(q.isPending)return <Loading/>;if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 const d=q.data;
 return <><div className="eyebrow">{scope==='state'?'Maharashtra':'India'} · Aggregate view</div><h1>{scope==='state'?'State':'National'} monitoring</h1><p className="muted">{d.period}</p><div className="grid">{[['Monitored victims',d.monitoredVictims],['Open tasks',d.openTasks],['Acknowledged tasks',d.acknowledgedTasks]].map(([name,value])=><Panel title={String(name)} key={name}><div className="stat">{value}</div></Panel>)}</div><Panel title="Coverage"><div className="table-wrap"><table><caption className="muted">One synthetic case; these are not population statistics.</caption><thead><tr><th scope="col">Region</th><th scope="col">Victims</th><th scope="col">Open tasks</th></tr></thead><tbody>{d.regions.map(r=><tr key={r.name}><th scope="row">{r.name}</th><td>{r.victims}</td><td>{r.openTasks}</td></tr>)}</tbody></table></div></Panel></>;
}
export const authorityRoutes:RouteObject[]=[
 {path:'/authorities/district',element:<Access roles={['district']}><District/></Access>},
 {path:'/authorities/state',element:<Access roles={['state']}><Monitoring scope="state"/></Access>},
 {path:'/authorities/national',element:<Access roles={['national']}><Monitoring scope="national"/></Access>},
];

