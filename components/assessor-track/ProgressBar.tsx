import { otjFillColour, otjTextColour, otjPct } from '@/lib/assessor-track/utils';

interface Props {
  logged: number;
  target: number;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({ logged, target, showLabel = true, height = 6 }: Props) {
  const pct = otjPct(logged, target);
  const fill = otjFillColour(pct);
  const text = otjTextColour(pct);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="at-progress" style={{ flex: 1, height }}>
        <div
          className="at-progress-fill"
          style={{ width: `${Math.min(pct, 100)}%`, background: fill, height }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of OTJ target completed`}
        />
      </div>
      {showLabel && (
        <span style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: text,
          minWidth: 34,
        }}>
          {pct}%
        </span>
      )}
    </div>
  );
}
