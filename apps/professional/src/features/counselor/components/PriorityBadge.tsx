import { type CounselorPriority, priorityLabels } from '@haven/contracts';

interface PriorityBadgeProps {
  priority: CounselorPriority;
  showLabel?: boolean;
}

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  const getBadgeStyle = () => {
    switch (priority) {
      case 'C0':
        return { background: '#ffebe9', color: '#c5221f', borderColor: '#f8c4c1' };
      case 'C1':
        return { background: '#fff4e5', color: '#b06000', borderColor: '#ffdfb3' };
      case 'C2':
        return { background: '#e8f4fd', color: '#0b57d0', borderColor: '#c2e7ff' };
      case 'C3':
        return { background: '#e6f4ea', color: '#137333', borderColor: '#ceead6' };
      case 'MONITOR':
      default:
        return { background: '#f1f3f4', color: '#5f6368', borderColor: '#dadce0' };
    }
  };

  const style = getBadgeStyle();
  const label = priorityLabels[priority] || priority;

  return (
    <span
      className="badge"
      style={{
        backgroundColor: style.background,
        color: style.color,
        borderColor: style.borderColor,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem'
      }}
    >
      <strong style={{ letterSpacing: '0.05em' }}>{priority}</strong>
      {showLabel && <span>· {label}</span>}
    </span>
  );
}
