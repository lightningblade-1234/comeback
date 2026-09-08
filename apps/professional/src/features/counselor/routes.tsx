import {type RouteObject} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {priorityLabels} from '@haven/contracts';
import {Panel,Badge,Loading,ErrorState} from '@haven/ui';
import {Access} from '../../session';
function CounselorQueue(){
 const q=useQuery({queryKey:queryKeys.counselor,queryFn:api.counselorCases});
 if(q.isPending)return <Loading/>;if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 return <><div className="eyebrow">Care workspace</div><h1>Counselor queue</h1><p className="muted">Review the evidence and unresolved questions for your assigned cases.</p>{q.data.length===0?<Panel title="No assigned cases"><p>Your queue is clear.</p></Panel>:q.data.map(item=><Panel key={item.case.id} title={item.case.preferredName}><Badge>{item.priority} · {priorityLabels[item.priority]}</Badge><p className="muted">{item.case.docket} · {item.case.district}</p><p>{item.reason}</p>{item.evidence.map(e=><div key={e.id}><blockquote>{e.statement}</blockquote><p className="muted">{e.uncertainty}</p></div>)}</Panel>)}</>;
}
export const counselorRoutes:RouteObject[]=[{path:'/counselor',element:<Access roles={['counselor']}><CounselorQueue/></Access>}];

