import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, queryKeys } from '@haven/api-client';
import { Panel, Badge, Loading, ErrorState } from '@haven/ui';
import { CounselorHeader } from './CounselorHeader';

export function AppointmentsView() {
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const q = useQuery({
    queryKey: queryKeys.counselorAppointments,
    queryFn: api.counselorAppointments
  });

  if (q.isPending) return <Loading />;
  if (q.isError) return <ErrorState message={q.error.message} onRetry={() => void q.refetch()} />;

  const appointments = q.data;

  const filtered = appointments.filter((item) => filterMode === 'ALL' || item.mode === filterMode);

  return (
    <>
      <CounselorHeader />

      <Panel title="Counselor Appointment & Follow-Up Schedule">
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Upcoming scheduled supportive counseling sessions, follow-up calls, and check-ins.
        </p>

        <div className="toolbar" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label htmlFor="mode-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Session Mode:</label>
            <select
              id="mode-select"
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
            >
              <option value="ALL">All Modes ({appointments.length})</option>
              <option value="VOICE">Voice Session</option>
              <option value="VIDEO">Video Call</option>
              <option value="TEXT">Text / Helpline Chat</option>
              <option value="IN_PERSON">In-Person Visit</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="muted">No scheduled appointments match the selected filter.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Scheduled Time</th>
                  <th>Victim ID</th>
                  <th>Session Mode</th>
                  <th>Assigned Counselor</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{new Date(item.startsAt).toLocaleDateString()}</strong>
                      <div className="muted" style={{ fontSize: '0.85rem' }}>
                        {new Date(item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <code>{item.victimId}</code>
                    </td>
                    <td>
                      <Badge>{item.mode}</Badge>
                    </td>
                    <td>{item.counselorName}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: item.status === 'SCHEDULED' ? '#e8f4fd' : '#e6f4ea',
                          color: item.status === 'SCHEDULED' ? '#0b57d0' : '#137333'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to="/counselor"
                        className="button"
                        style={{ minHeight: '32px', padding: '0.3rem 0.65rem', fontSize: '0.825rem' }}
                      >
                        Open Case
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
