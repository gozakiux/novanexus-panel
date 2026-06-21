import type { Nivel } from "../data/types";

const COLOR: Record<Nivel, string> = {
  Alto: "var(--alto)",
  Medio: "var(--medio)",
  Bajo: "var(--bajo)",
};

export function ScoreRing({
  score,
  nivel,
  size = 120,
  stroke = 11,
  showLabel = true,
}: {
  score: number;
  nivel: Nivel;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--card-sunk)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={COLOR[nivel]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 700ms var(--ease)" }}
        />
      </svg>
      {showLabel && (
        <div className="score-ring-center">
          <span className="numeric" style={{ fontSize: size * 0.27 }}>
            {score}
          </span>
          <small>de 100</small>
        </div>
      )}
    </div>
  );
}

export function ScoreBar({ score, nivel }: { score: number; nivel: Nivel }) {
  return (
    <div className="score-bar" title={`${score} / 100`}>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${score}%`, background: COLOR[nivel] }}
        />
      </div>
      <span className="numeric score-bar-num">{score}</span>
    </div>
  );
}
