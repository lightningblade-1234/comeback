import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, queryKeys } from '@haven/api-client';
import { type CounselorPriority } from '@haven/contracts';
import { Panel, Badge, Loading, ErrorState } from '@haven/ui';
import { CounselorHeader } from './CounselorHeader';
import { PriorityBadge } from './PriorityBadge';

export function ClinicalSupervisionView() {
  const q = useQuery({
    queryKey: queryKeys.supervisionQueue,
    queryFn: api.supervisionQueue
  });

  if (q.isPending) return <Loading />;
  if (q.isError) return <ErrorState message={q.error.message} onRetry={() => void q.refetch()} />;

  const supervisedCases = q.data;

  return (
    <>
      <CounselorHeader />

      <Panel title="Clinical Supervision & Escalation Review">
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Oversight dashboard for Clinical Supervisors. Reviews high-priority alerts (C0/C1), explicit counselor escalations, and care quality assurance.
        </p>

        <div className="grid" style={{ marginBottom: '1.5rem' }}>
          <div className="panel" style={{ borderLeft: '4px solid #c5221f' }}>
            <div className="eyebrow" style={{ color: '#c5221f' }}>Supervised Cases</div>
            <div className="stat">{supervisedCases.length}</div>
            <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>High-risk or escalated</p>
          </div>

          <div className="panel" style={{ borderLeft: '4px solid #0b57d0' }}>
            <div className="eyebrow" style={{ color: '#0b57d0' }}>Quality Assurance</div>
            <div className="stat">100%</div>
            <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Audited evidence compliance</p>
          </div>
        </div>

        {supervisedCases.length === 0 ? (
          <p className="muted">No cases currently require clinical supervision review.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Preferred Name & Docket</th>
                  <th>District / State</th>
                  <th>Escalation / Clinical Reason</th>
                  <th>Assigned Counselor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {supervisedCases.map((item) => (
                  <tr key={item.case.id}>
                    <td>
                      <PriorityBadge priority={item.priority as CounselorPriority} />
                    </td>
                    <td>
                      <strong>{item.case.preferredName}</strong>
                      <div className="muted" style={{ fontSize: '0.85rem' }}>{item.case.docket}</div>
                    </td>
                    <td>
                      {item.case.district}, {item.case.state}
                    </td>
                    <td style={{ maxWidth: '340px' }}>
                      {item.isEscalated && (
                        <span className="badge" style={{ background: '#ffebe9', color: '#c5221f', marginBottom: '0.3rem' }}>
                          Explicit Escalation
                        </span>
                      )}
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>{item.reason}</p>
                    </td>
                    <td>
                      <Badge>{item.assignedCounselor ?? 'Unassigned'}</Badge>
                    </td>
                    <td>
                      <Link
                        to={`/counselor/cases/${item.case.id}`}
                        className="button"
                        style={{ minHeight: '32px', padding: '0.3rem 0.65rem', fontSize: '0.825rem' }}
                      >
                        Review Case
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
