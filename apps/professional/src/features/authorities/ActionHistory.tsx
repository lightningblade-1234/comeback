import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {Panel,Loading,ErrorState} from '@haven/ui';
import {AuthorityPageHeader,StatusBadge,formatDateTime} from './AuthorityShared';
export function ActionHistory(){
 const q=useQuery({queryKey:queryKeys.tasks,queryFn:api.authorityTasks});
 if(q.isPending)return <Loading/>;if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 return <><AuthorityPageHeader eyebrow="Maharashtra / Pune · District action history" title="Action history">Review current role-filtered task status snapshots. A complete human action timeline requires history events from the shared API contract.</AuthorityPageHeader><Panel title="Current task snapshots">{q.data.length===0?<p className="muted">No task status snapshots are available in this district scope.</p>:<ol className="authority-history-list">{q.data.map(item=><li key={item.task.id}><div><Link className="authority-task-link" to={'/authorities/district/tasks/'+item.task.id}>{item.task.title}</Link><p className="muted">{item.case.docket} · Current owner: {item.task.owner}</p></div><div><StatusBadge value={item.task.status}/><p className="muted">Deadline: {formatDateTime(item.task.dueAt)}</p></div></li>)}</ol>}</Panel><Panel title="What is not yet available"><p className="muted">This fixture does not expose actor names, prior states, transition timestamps, action reasons, previous contact attempts, or closure notes. Add those shared contract fields before building a detailed audit timeline.</p></Panel></>;
}