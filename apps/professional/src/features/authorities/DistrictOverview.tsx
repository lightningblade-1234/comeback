import {useQuery} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {Panel,Loading,ErrorState} from '@haven/ui';
import {AuthorityPageHeader,taskIsOverdue} from './AuthorityShared';
import {DistrictRiskCharts} from './DistrictRiskCharts';
export function DistrictOverview(){
 const q=useQuery({queryKey:queryKeys.tasks,queryFn:api.authorityTasks});
 if(q.isPending)return <Loading/>;if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 const awaiting=q.data.filter(item=>item.task.status==='SENT').length,acknowledged=q.data.filter(item=>item.task.status==='ACKNOWLEDGED').length,overdue=q.data.filter(taskIsOverdue).length;
 return <><AuthorityPageHeader eyebrow="Maharashtra / Pune · District operational scope" title="District operations">Manage district-scoped authority work. Acknowledgement is distinct from delivered assistance.</AuthorityPageHeader><section aria-label="District summary" className="grid authority-summary-grid"><Panel title="Awaiting acknowledgement"><div className="stat">{awaiting}</div><p className="muted">Sent alerts requiring human acceptance.</p></Panel><Panel title="Open authority tasks"><div className="stat">{q.data.length}</div><p className="muted">Tasks visible in this district scope.</p></Panel><Panel title="Past due"><div className="stat">{overdue}</div><p className="muted">Based on configurable synthetic deadlines.</p></Panel><Panel title="Human acknowledgements"><div className="stat">{acknowledged}</div><p className="muted">Not a measure of delivered assistance.</p></Panel></section><DistrictRiskCharts/><Panel title="Operational boundary"><p>Current mock responses do not provide private counseling transcripts, direct emergency dispatch, or unscoped case records. Unknown data is shown as unknown rather than assumed absent.</p></Panel></>;
}