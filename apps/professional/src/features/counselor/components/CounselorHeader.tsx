import { Link, useLocation } from 'react-router-dom';

export function CounselorHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
      <div className="toolbar" style={{ marginBottom: '1rem' }}>
        <div>
          <div className="eyebrow">Care & Mental Health Workspace</div>
          <h1 style={{ margin: '0.2rem 0' }}>Counselor Workbench</h1>
          <p className="muted" style={{ margin: 0 }}>
            Support duty counselors, assigned counselors, and supervisors in managing evidence-based care.
          </p>
        </div>
        <div>
          <span className="badge" style={{ background: '#e8f4fd', color: '#0b57d0', padding: '0.4rem 0.8rem' }}>
            Role: Duty & Clinical Care
          </span>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        <Link
          to="/counselor"
          className="button"
          style={{
            background: currentPath === '/counselor' ? 'var(--accent)' : 'transparent',
            color: currentPath === '/counselor' ? 'var(--on-accent)' : 'var(--muted)',
            border: '1px solid var(--border)',
            minHeight: '36px',
            padding: '0.4rem 0.9rem',
            fontSize: '0.9rem'
          }}
        >
          Priority Queue
        </Link>
        <Link
          to="/counselor/appointments"
          className="button"
          style={{
            background: currentPath.startsWith('/counselor/appointments') ? 'var(--accent)' : 'transparent',
            color: currentPath.startsWith('/counselor/appointments') ? 'var(--on-accent)' : 'var(--muted)',
            border: '1px solid var(--border)',
            minHeight: '36px',
            padding: '0.4rem 0.9rem',
            fontSize: '0.9rem'
          }}
        >
          Appointments & Follow-up
        </Link>
        <Link
          to="/counselor/supervision"
          className="button"
          style={{
            background: currentPath.startsWith('/counselor/supervision') ? 'var(--accent)' : 'transparent',
            color: currentPath.startsWith('/counselor/supervision') ? 'var(--on-accent)' : 'var(--muted)',
            border: '1px solid var(--border)',
            minHeight: '36px',
            padding: '0.4rem 0.9rem',
            fontSize: '0.9rem'
          }}
        >
          Clinical Supervision
        </Link>
      </nav>
    </div>
  );
}
