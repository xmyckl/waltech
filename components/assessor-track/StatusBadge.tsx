import { statusBadgeClass } from '@/lib/assessor-track/utils';

interface Props {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: Props) {
  return (
    <span className={`at-badge ${statusBadgeClass(status)} ${className}`.trim()}>
      {status}
    </span>
  );
}
