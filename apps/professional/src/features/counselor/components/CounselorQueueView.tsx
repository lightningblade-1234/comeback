import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api, queryKeys } from '@haven/api-client';
import { type CounselorPriority } from '@haven/contracts';
import { Panel, Loading, ErrorState } from '@haven/ui';
import { CounselorHeader } from './CounselorHeader';
import { PriorityBadge } from './PriorityBadge';
import { useStaggerEntrance } from '../hooks/useStaggerEntrance';
import { useCountUp } from '../hooks/useCountUp';
import '../motion.css';

export function CounselorQueueView() {
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const q = useQuery({ queryKey: queryKeys.counselor, queryFn: api.counselorCases });
  const { containerVariants, itemVariants } = useStaggerEntrance(0.04);

  const cases = q.data ?? [];

  // Raw counts by priority
  const c0Raw = cases.filter((c) => c.priority === 'C0').length;
  const c1Raw = cases.filter((c) => c.priority === 'C1').length;
  const c2Raw = cases.filter((c) => c.priority === 'C2').length;
  const c3Raw = cases.filter((c) => c.priority === 'C3').length;
  const monitorRaw = cases.filter((c) => c.priority === 'MONITOR').length;

  // Animated count-ups called unconditionally
  const c0Count = useCountUp(c0Raw);
  const c1Count = useCountUp(c1Raw);
  const c2Count = useCountUp(c2Raw);
  const c3Count = useCountUp(c3Raw);
  const monitorCount = useCountUp(monitorRaw);

  if (q.isPending) return <Loading />;
  if (q.isError) return <ErrorState message={q.error.message} onRetry={() => void q.refetch()} />;

  const filteredCases = cases.filter((item) => {
    const matchesPriority = selectedPriority === 'ALL' || item.priority === selectedPriority;
    const matchesSearch =
      searchQuery === '' ||
      item.case.preferredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.case.docket.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.case.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <>
      <CounselorHeader />

      {/* Priority Summary Cards */}
      <motion.div
        className="grid"
        style={{ marginBottom: '1.5rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className={`panel ${c0Raw > 0 ? 'c0-active-beacon' : ''}`}
          style={{ cursor: 'pointer', borderLeft: '4px solid #c5221f' }}
          onClick={() => setSelectedPriority(selectedPriority === 'C0' ? 'ALL' : 'C0')}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div className="eyebrow" style={{ color: '#c5221f' }}>C0 · Immediate</div>
          <div className="stat">{c0Count}</div>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Active crisis / danger</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="panel"
          style={{ cursor: 'pointer', borderLeft: '4px solid #b06000' }}
          onClick={() => setSelectedPriority(selectedPriority === 'C1' ? 'ALL' : 'C1')}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div className="eyebrow" style={{ color: '#b06000' }}>C1 · Urgent Unresolved</div>
          <div className="stat">{c1Count}</div>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Missing safety facts</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="panel"
          style={{ cursor: 'pointer', borderLeft: '4px solid #0b57d0' }}
          onClick={() => setSelectedPriority(selectedPriority === 'C2' ? 'ALL' : 'C2')}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div className="eyebrow" style={{ color: '#0b57d0' }}>C2 · Priority Support</div>
          <div className="stat">{c2Count}</div>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Substantial distress</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="panel"
          style={{ cursor: 'pointer', borderLeft: '4px solid #137333' }}
          onClick={() => setSelectedPriority(selectedPriority === 'C3' ? 'ALL' : 'C3')}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div className="eyebrow" style={{ color: '#137333' }}>C3 · Follow-up</div>
          <div className="stat">{c3Count}</div>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Planned support</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="panel"
          style={{ cursor: 'pointer', borderLeft: '4px solid #5f6368' }}
          onClick={() => setSelectedPriority(selectedPriority === 'MONITOR' ? 'ALL' : 'MONITOR')}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div className="eyebrow">Monitor / Check-in</div>
          <div className="stat">{monitorCount}</div>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Unassessed safety</p>
        </motion.div>
      </motion.div>

      {/* Filter and Search Bar */}
      <Panel title="Priority Queue & Assigned Cases">
        <div className="toolbar" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <label htmlFor="priority-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filter Priority:</label>
            <select
              id="priority-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
            >
              <option value="ALL">All Priorities ({cases.length})</option>
              <option value="C0">C0 — Immediate response</option>
              <option value="C1">C1 — Urgent unresolved review</option>
              <option value="C2">C2 — Priority support</option>
              <option value="C3">C3 — Planned follow-up</option>
              <option value="MONITOR">Monitor / Check-in</option>
            </select>
          </div>

          <div style={{ flex: '1', maxWidth: '320px' }}>
            <input
              type="search"
              placeholder="Search by name, docket, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)'
              }}
            />
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }} className="muted">
            <p>No cases match your selected filter criteria.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Preferred Name & Docket</th>
                  <th>District / State</th>
                  <th>Stage</th>
                  <th>Primary Evidence & Safety Concern</th>
                  <th>Action</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="hidden" animate="show">
                <AnimatePresence mode="popLayout">
                  {filteredCases.map((item) => (
                    <motion.tr
                      key={item.case.id}
                      layout
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }}
                    >
                      <td>
                        <PriorityBadge priority={item.priority as CounselorPriority} />
                      </td>
                      <td>
                        <strong>{item.case.preferredName}</strong>
                        <div className="muted" style={{ fontSize: '0.825rem' }}>{item.case.docket}</div>
                      </td>
                      <td>
                        {item.case.district}, {item.case.state}
                      </td>
                      <td>
                        <span className="badge">{item.case.stage}</span>
                      </td>
                      <td style={{ maxWidth: '380px' }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 500 }}>{item.reason}</p>
                        {item.evidence[0] && (
                          <p className="muted" style={{ margin: 0, fontSize: '0.825rem', fontStyle: 'italic' }}>
                            "{item.evidence[0].statement}"
                          </p>
                        )}
                      </td>
                      <td>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
                          <Link
                            to={`/counselor/cases/${item.case.id}`}
                            className="button"
                            style={{ minHeight: '34px', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                          >
                            Open Workspace
                          </Link>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
