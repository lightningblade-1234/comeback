import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {Panel,Loading,ErrorState} from '@haven/ui';
import {AuthorityPageHeader,StatusBadge} from './AuthorityShared';
const availability=(value:boolean|null)=>value===null?'NOT_CONFIRMED':value?'AVAILABLE':'UNAVAILABLE';
export function ServiceCapacity(){
 const q=useQuery({queryKey:queryKeys.tasks,queryFn:api.authorityTasks});
 if(q.isPending)return <Loading/>;if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 return <><AuthorityPageHeader eyebrow="Maharashtra / Pune · District service capacity" title="Service capacity">Review the availability stated in district intervention responses. Unknown availability is kept distinct from unavailable service.</AuthorityPageHeader><Panel title="Availability in current intervention responses">{q.data.length===0?<p className="muted">No intervention responses are available in this district scope.</p>:<div className="table-wrap" tabIndex={0}><table><caption>Service availability from role-filtered task responses</caption><thead><tr><th scope="col">Recommended intervention</th><th scope="col">Availability</th><th scope="col">Reason</th><th scope="col">Task</th></tr></thead><tbody>{q.data.map(item=><tr key={item.recommendation.id}><th scope="row">{item.recommendation.title}</th><td><StatusBadge value={availability(item.recommendation.serviceAvailable)}/></td><td>{item.recommendation.reason}</td><td><Link className="authority-inline-link" to={'/authorities/district/tasks/'+item.task.id}>{item.task.title}</Link></td></tr>)}</tbody></table></div>}</Panel><Panel title="District-wide capacity"><p className="muted">Shelter, transport, medical assessment, legal aid, rehabilitation, and other district-wide capacity totals are not supplied by the current mock contract. They are not shown as zero or available.</p></Panel></>;
}