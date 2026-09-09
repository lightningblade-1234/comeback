import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { api, queryKeys } from '@haven/api-client';
import {
  type CounselorPriority,
  type PriorityOverridePayload,
  type ContactLogPayload,
  type ClarificationPayload,
  type SupportPlanPayload,
  type EscalationPayload
} from '@haven/contracts';
import { Panel, Button, Loading, ErrorState } from '@haven/ui';
import { PriorityBadge } from './PriorityBadge';
import { HoldToConfirmButton } from './HoldToConfirmButton';
import { usePulse } from '../hooks/usePulse';
import { useStaggerEntrance } from '../hooks/useStaggerEntrance';
import '../motion.css';

export function VictimSupportWorkspace() {
  const { caseId } = useParams<{ caseId: string }>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'evidence' | 'observations' | 'journal' | 'plan' | 'contacts'>('evidence');

  // Modals state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  // Form inputs
  const [newPriority, setNewPriority] = useState<CounselorPriority>('C2');
  const [overrideReason, setOverrideReason] = useState('');

  const [contactMode, setContactMode] = useState<'VOICE' | 'VIDEO' | 'TEXT' | 'IN_PERSON' | 'ATTEMPT_UNSUCCESSFUL'>('VOICE');
  const [contactOutcome, setContactOutcome] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  const [clarifyQuestion, setClarifyQuestion] = useState('');

  const [planGoal, setPlanGoal] = useState('');
  const [planActions, setPlanActions] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [planDate, setPlanDate] = useState('');

  const [escSupervisor, setEscSupervisor] = useState('Senior Clinical Supervisor');
  const [escReason, setEscReason] = useState('');

  // Pulse & flash feedback states
  const { trigger: triggerPriorityPulse, pulseStyle: priorityPulseStyle } = usePulse();
  const [flashSection, setFlashSection] = useState<string | null>(null);

  const { containerVariants, itemVariants } = useStaggerEntrance(0.05);

  const triggerSectionFlash = (sectionId: string) => {
    setFlashSection(sectionId);
    setTimeout(() => setFlashSection(null), 700);
  };

  const q = useQuery({
    queryKey: queryKeys.counselorCaseDetail(caseId ?? ''),
    queryFn: () => api.counselorCaseDetail(caseId ?? ''),
    enabled: Boolean(caseId)
  });

  // Mutations
  const overrideMutation = useMutation({
    mutationFn: (payload: PriorityOverridePayload) => api.overridePriority(caseId!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.counselorCaseDetail(caseId!) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.counselor });
      setShowOverrideModal(false);
      setOverrideReason('');
      triggerPriorityPulse();
    }
  });

  const contactMutation = useMutation({
    mutationFn: (payload: ContactLogPayload) => api.recordContact(caseId!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.counselorCaseDetail(caseId!) });
      setShowContactModal(false);
      setContactOutcome('');
      setContactNotes('');
      triggerSectionFlash('contacts');
    }
  });

  const clarifyMutation = useMutation({
    mutationFn: (payload: ClarificationPayload) => api.requestClarification(caseId!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.counselorCaseDetail(caseId!) });
      setShowClarifyModal(false);
      setClarifyQuestion('');
      triggerSectionFlash('evidence');
    }
  });

  const planMutation = useMutation({
    mutationFn: (payload: SupportPlanPayload) => api.updateSupportPlan(caseId!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.counselorCaseDetail(caseId!) });
      setShowPlanModal(false);
      triggerSectionFlash('plan');
    }
  });

  const escalateMutation = useMutation({
    mutationFn: (payload: EscalationPayload) => api.escalateCase(caseId!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.counselorCaseDetail(caseId!) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.supervisionQueue });
      setShowEscalateModal(false);
      setEscReason('');
      triggerPriorityPulse();
    }
  });

  if (q.isPending) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={q.error?.message ?? 'Case not found'} onRetry={() => void q.refetch()} />;

  const detail = q.data;

  const handleOpenPlanModal = () => {
    setPlanGoal(detail.supportPlan?.goal ?? '');
    setPlanActions(detail.supportPlan?.actions.join('\n') ?? '');
    setPlanNotes(detail.supportPlan?.counselorNotes ?? '');
    setPlanDate(detail.supportPlan?.targetDate ? detail.supportPlan.targetDate.substring(0, 10) : '');
    setShowPlanModal(true);
  };

  const tabs = [
    { id: 'evidence', label: `Evidence & Safety (${detail.evidence.length})` },
    { id: 'observations', label: `Speech & Screening (${detail.speechObservations.length + detail.questionnaires.length})` },
    { id: 'journal', label: `Shared Journal (${detail.sharedJournal.length})` },
    { id: 'plan', label: `Support Plan ${detail.supportPlan ? '✓' : '(None)'}` },
    { id: 'contacts', label: `Contact Log (${detail.contactHistory.length})` }
  ] as const;

  return (
    <>
      {/* Top Header & Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ marginBottom: '1.25rem' }}
      >
        <Link to="/counselor" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          ← Back to Priority Queue
        </Link>

        <div className="toolbar" style={{ marginTop: '0.75rem', alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow">Victim Support Workspace</div>
            <h1 style={{ margin: '0.2rem 0 0.4rem 0' }}>{detail.case.preferredName}</h1>
            <p className="muted" style={{ margin: 0 }}>
              Docket: <strong>{detail.case.docket}</strong> · District: <strong>{detail.case.district}, {detail.case.state}</strong> · Stage: <strong>{detail.case.stage}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setShowContactModal(true)}>Log Contact</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setShowClarifyModal(true)} style={{ background: '#f3f6fa', color: 'var(--text)', border: '1px solid var(--border)' }}>
                Ask Clarification
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setShowEscalateModal(true)} style={{ background: '#fff4e5', color: '#b06000', border: '1px solid #ffdfb3' }}>
                Escalate to Supervisor
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Priority Banner Card */}
      <motion.div style={priorityPulseStyle}>
        <Panel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Clinical Priority:</span>
                <motion.div layout>
                  <PriorityBadge priority={detail.priority} />
                </motion.div>
                {detail.isEscalated && (
                  <span className="badge" style={{ background: '#ffebe9', color: '#c5221f' }}>
                    Escalated to Supervision
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{detail.reason}</p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => { setNewPriority(detail.priority); setShowOverrideModal(true); }}>
                Correct Priority Label
              </Button>
            </motion.div>
          </div>
        </Panel>
      </motion.div>

      {/* Workspace Tabs with Sliding Active Indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', position: 'relative' }}>
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                position: 'relative',
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'color 150ms ease-out'
              }}
            >
              {t.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={{
                    position: 'absolute',
                    bottom: '-0.55rem',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'var(--accent)',
                    borderRadius: '2px'
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* 1. Evidence & Safety Tab */}
        {activeTab === 'evidence' && (
          <motion.div
            key="evidence"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className={`grid ${flashSection === 'evidence' ? 'mutation-flash' : ''}`}
          >
            <Panel title="Recorded Statements & Evidence">
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                {detail.evidence.map((ev) => (
                  <motion.div variants={itemVariants} key={ev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                    <blockquote>"{ev.statement}"</blockquote>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }} className="muted">
                      <span>Source: {ev.source}</span>
                      <span>Recorded: {new Date(ev.recordedAt).toLocaleString()}</span>
                    </div>
                    {ev.uncertainty && (
                      <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#b06000' }}>
                        ⚠️ Uncertainty: {ev.uncertainty}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </Panel>

            <Panel title="Unanswered Safety Questions">
              {detail.unansweredQuestions.length === 0 ? (
                <p className="muted">No pending safety questions.</p>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  {detail.unansweredQuestions.map((uq) => (
                    <motion.div variants={itemVariants} key={uq.id} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg)', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span className="badge" style={{ background: uq.urgency === 'HIGH' ? '#ffebe9' : '#fff4e5', color: uq.urgency === 'HIGH' ? '#c5221f' : '#b06000' }}>
                          {uq.urgency} Urgency
                        </span>
                      </div>
                      <p style={{ margin: 0, fontWeight: 500 }}>{uq.question}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button onClick={() => setShowClarifyModal(true)} style={{ marginTop: '0.5rem', width: '100%' }}>
                  + Request New Clarification
                </Button>
              </motion.div>
            </Panel>
          </motion.div>
        )}

        {/* 2. Observations & Screening Tab */}
        {activeTab === 'observations' && (
          <motion.div
            key="observations"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className="grid"
          >
            <Panel title="Speech & Audio Observations">
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                Objective acoustic observations detected by Haven during voice check-ins. Disclosed separately from clinical evaluation.
              </p>
              {detail.speechObservations.length === 0 ? (
                <p className="muted">No speech indicators recorded.</p>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  {detail.speechObservations.map((so) => (
                    <motion.div variants={itemVariants} key={so.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem', marginBottom: '0.6rem' }}>
                      <strong>{so.indicator}</strong>
                      <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>{so.observation}</p>
                      <span className="muted" style={{ fontSize: '0.8rem' }}>Recorded: {new Date(so.recordedAt).toLocaleString()}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Panel>

            <Panel title="Screening Questionnaires">
              {detail.questionnaires.length === 0 ? (
                <p className="muted">No completed questionnaire results.</p>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  {detail.questionnaires.map((qr) => (
                    <motion.div variants={itemVariants} key={qr.id} style={{ marginBottom: '1rem' }}>
                      <h3>{qr.title}</h3>
                      <p className="muted" style={{ fontSize: '0.85rem' }}>{qr.scoreSummary} · {new Date(qr.completedAt).toLocaleDateString()}</p>
                      <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.5rem' }}>
                        {qr.items.map((item, idx) => (
                          <div key={idx} style={{ background: 'var(--bg)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.875rem' }}>
                            <div><strong>Q:</strong> {item.question}</div>
                            <div style={{ color: 'var(--accent)' }}><strong>A:</strong> {item.answer}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Panel>
          </motion.div>
        )}

        {/* 3. Shared Journal Tab */}
        {activeTab === 'journal' && (
          <motion.div
            key="journal"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Panel title="Victim-Shared Journal Entries">
              <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Data Privacy Boundary: Only journal entries explicitly shared by the victim or disclosed under emergency evidence rules appear here.
              </p>
              {detail.sharedJournal.length === 0 ? (
                <p className="muted">No journal entries shared by the victim for this case.</p>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  {detail.sharedJournal.map((sj) => (
                    <motion.div
                      variants={itemVariants}
                      key={sj.id}
                      style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--border)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong>{sj.title}</strong>
                        <span className="badge">{sj.category}</span>
                      </div>
                      <p style={{ margin: '0 0 0.5rem 0', whiteSpace: 'pre-wrap' }}>{sj.content}</p>
                      <span className="muted" style={{ fontSize: '0.8rem' }}>Shared on: {new Date(sj.sharedAt).toLocaleString()}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Panel>
          </motion.div>
        )}

        {/* 4. Support Plan Tab */}
        {activeTab === 'plan' && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className={flashSection === 'plan' ? 'mutation-flash' : ''}
          >
            <Panel title="Human-Reviewed Support & Care Plan">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                    Target Completion Date: {detail.supportPlan?.targetDate ? new Date(detail.supportPlan.targetDate).toLocaleDateString() : 'Ongoing'}
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleOpenPlanModal}>
                    {detail.supportPlan ? 'Edit Support Plan' : '+ Create Support Plan'}
                  </Button>
                </motion.div>
              </div>

              {!detail.supportPlan ? (
                <p className="muted">No active support plan created yet. Click above to create one.</p>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Primary Goal</h3>
                    <p style={{ margin: 0 }}>{detail.supportPlan.goal}</p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Action Items</h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {detail.supportPlan.actions.map((act, idx) => (
                        <li key={idx} style={{ margin: '0.25rem 0' }}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Counselor Clinical Notes</h3>
                    <p className="muted" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{detail.supportPlan.counselorNotes}</p>
                  </div>
                </div>
              )}
            </Panel>
          </motion.div>
        )}

        {/* 5. Contact Log Tab */}
        {activeTab === 'contacts' && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className={flashSection === 'contacts' ? 'mutation-flash' : ''}
          >
            <Panel title="Contact & Interaction Log">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>Recorded contacts with victim.</p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => setShowContactModal(true)}>+ Log Contact</Button>
                </motion.div>
              </div>

              {detail.contactHistory.length === 0 ? (
                <p className="muted">No interactions logged yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Mode</th>
                        <th>Counselor</th>
                        <th>Outcome</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <motion.tbody variants={containerVariants} initial="hidden" animate="show">
                      {detail.contactHistory.map((ch) => (
                        <motion.tr variants={itemVariants} key={ch.id}>
                          <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(ch.timestamp).toLocaleString()}</td>
                          <td>
                            <span className="badge">{ch.mode}</span>
                          </td>
                          <td>{ch.counselorName}</td>
                          <td style={{ fontWeight: 500 }}>{ch.outcome}</td>
                          <td style={{ fontSize: '0.875rem' }} className="muted">{ch.notes}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              )}
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANIMATED MODALS */}
      <AnimatePresence>
        {/* 1. Priority Override Modal */}
        {showOverrideModal && (
          <div className="motion-modal-backdrop" onClick={() => setShowOverrideModal(false)}>
            <motion.div
              className="motion-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h2>Human Priority Correction</h2>
              <p className="muted" style={{ fontSize: '0.875rem' }}>Override engine-calculated classification with professional clinical justification.</p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>New Priority Code:</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as CounselorPriority)} style={{ width: '100%' }}>
                  <option value="C0">C0 — Immediate response</option>
                  <option value="C1">C1 — Urgent unresolved review</option>
                  <option value="C2">C2 — Priority support</option>
                  <option value="C3">C3 — Planned follow-up</option>
                  <option value="MONITOR">MONITOR — Offer a check-in</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Clinical Reason / Justification (Required):</label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  rows={3}
                  placeholder="State reason for priority change..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowOverrideModal(false)} style={{ background: '#f3f6fa', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</Button>
                <Button
                  disabled={overrideReason.trim().length < 3 || overrideMutation.isPending}
                  onClick={() => overrideMutation.mutate({ newPriority, reason: overrideReason })}
                >
                  {overrideMutation.isPending ? 'Saving...' : 'Confirm Priority Override'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. Contact Log Modal */}
        {showContactModal && (
          <div className="motion-modal-backdrop" onClick={() => setShowContactModal(false)}>
            <motion.div
              className="motion-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h2>Record Victim Contact Attempt</h2>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Contact Mode:</label>
                <select value={contactMode} onChange={(e) => setContactMode(e.target.value as 'VOICE' | 'VIDEO' | 'TEXT' | 'IN_PERSON' | 'ATTEMPT_UNSUCCESSFUL')} style={{ width: '100%' }}>
                  <option value="VOICE">Voice Call</option>
                  <option value="VIDEO">Video Session</option>
                  <option value="TEXT">Helpline Messaging / Chat</option>
                  <option value="IN_PERSON">In-Person Support Visit</option>
                  <option value="ATTEMPT_UNSUCCESSFUL">Unsuccessful Contact Attempt</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Summary Outcome:</label>
                <input
                  type="text"
                  value={contactOutcome}
                  onChange={(e) => setContactOutcome(e.target.value)}
                  placeholder="e.g. Completed safety check-in, phone unanswered..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Detailed Notes:</label>
                <textarea
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  rows={3}
                  placeholder="Clinical observation notes..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowContactModal(false)} style={{ background: '#f3f6fa', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</Button>
                <Button
                  disabled={contactOutcome.trim().length < 2 || contactMutation.isPending}
                  onClick={() => contactMutation.mutate({ mode: contactMode, outcome: contactOutcome, notes: contactNotes })}
                >
                  {contactMutation.isPending ? 'Saving...' : 'Save Contact Record'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 3. Ask Clarification Modal */}
        {showClarifyModal && (
          <div className="motion-modal-backdrop" onClick={() => setShowClarifyModal(false)}>
            <motion.div
              className="motion-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h2>Request Safety Clarification</h2>
              <p className="muted" style={{ fontSize: '0.875rem' }}>Send a structured clarification prompt to the victim's Haven app interface.</p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Question Prompt:</label>
                <textarea
                  value={clarifyQuestion}
                  onChange={(e) => setClarifyQuestion(e.target.value)}
                  rows={3}
                  placeholder="e.g. Are you currently in a safe location with secure doors?"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowClarifyModal(false)} style={{ background: '#f3f6fa', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</Button>
                <Button
                  disabled={clarifyQuestion.trim().length < 5 || clarifyMutation.isPending}
                  onClick={() => clarifyMutation.mutate({ question: clarifyQuestion })}
                >
                  {clarifyMutation.isPending ? 'Sending...' : 'Send Clarification Request'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. Edit Support Plan Modal */}
        {showPlanModal && (
          <div className="motion-modal-backdrop" onClick={() => setShowPlanModal(false)}>
            <motion.div
              className="motion-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h2>Update Support & Care Plan</h2>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Primary Goal:</label>
                <input
                  type="text"
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                  placeholder="e.g. Establish safe daily routine and reduce anxiety"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Action Items (One per line):</label>
                <textarea
                  value={planActions}
                  onChange={(e) => setPlanActions(e.target.value)}
                  rows={3}
                  placeholder="Action item 1&#10;Action item 2"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Target Completion Date:</label>
                <input
                  type="date"
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Counselor Clinical Notes:</label>
                <textarea
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  rows={2}
                  placeholder="Internal clinical notes..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowPlanModal(false)} style={{ background: '#f3f6fa', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</Button>
                <Button
                  disabled={planGoal.trim().length < 3 || planMutation.isPending}
                  onClick={() =>
                    planMutation.mutate({
                      goal: planGoal,
                      actions: planActions.split('\n').filter((a) => a.trim() !== ''),
                      counselorNotes: planNotes,
                      targetDate: planDate ? new Date(planDate).toISOString() : null
                    })
                  }
                >
                  {planMutation.isPending ? 'Saving...' : 'Save Support Plan'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 5. Escalate to Supervisor Modal (with Hold-to-Confirm gesture) */}
        {showEscalateModal && (
          <div className="motion-modal-backdrop" onClick={() => setShowEscalateModal(false)}>
            <motion.div
              className="motion-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h2>Escalate to Clinical Supervision</h2>
              <p className="muted" style={{ fontSize: '0.875rem' }}>Reassign or request supervisor guidance for complex/high-risk cases.</p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Select Supervisor:</label>
                <input
                  type="text"
                  value={escSupervisor}
                  onChange={(e) => setEscSupervisor(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Escalation Justification:</label>
                <textarea
                  value={escReason}
                  onChange={(e) => setEscReason(e.target.value)}
                  rows={3}
                  placeholder="State reason for escalating to clinical supervision..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button onClick={() => setShowEscalateModal(false)} style={{ background: '#f3f6fa', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</Button>
                <HoldToConfirmButton
                  disabled={escReason.trim().length < 5}
                  isPending={escalateMutation.isPending}
                  onConfirm={() => escalateMutation.mutate({ targetSupervisor: escSupervisor, reason: escReason })}
                  label="Press & Hold to Confirm Escalation"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
