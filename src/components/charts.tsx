import type { MesConteo } from "../lib/stats";

export function MonthsBar({ data }: { data: MesConteo[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="months-bar" role="img" aria-label="Matrículas por mes">
      {data.map((d, i) => (
        <div className="months-bar-col" key={i}>
          <div className="months-bar-track">
            <div
              className="months-bar-fill"
              style={{ height: `${(d.value / max) * 100}%`, animationDelay: `${i * 40}ms` }}
            >
              <span className="months-bar-val numeric">{d.value}</span>
            </div>
          </div>
          <span className="months-bar-lbl">{d.etiqueta}</span>
        </div>
      ))}
    </div>
  );
}

export function BandBar({
  alto,
  medio,
  bajo,
}: {
  alto: number;
  medio: number;
  bajo: number;
}) {
  const total = Math.max(1, alto + medio + bajo);
  const segs = [
    { n: alto, c: "var(--alto)", label: "Alto" },
    { n: medio, c: "var(--medio)", label: "Medio" },
    { n: bajo, c: "var(--bajo)", label: "Bajo" },
  ];
  return (
    <div className="bandbar-wrap">
      <div className="bandbar" role="img" aria-label="Distribución de propensión">
        {segs.map((s, i) => (
          <div
            key={i}
            className="bandbar-seg"
            style={{ width: `${(s.n / total) * 100}%`, background: s.c }}
            title={`${s.label}: ${s.n}`}
          />
        ))}
      </div>
      <div className="bandbar-legend">
        {segs.map((s, i) => (
          <span key={i} className="bandbar-leg-item">
            <span className="bandbar-dot" style={{ background: s.c }} />
            {s.label}
            <strong className="numeric">{s.n}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MiniBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="minibars">
      {data.map((d, i) => (
        <li className="minibars-row" key={i}>
          <span className="minibars-lbl">{d.label}</span>
          <span className="minibars-track">
            <span
              className="minibars-fill"
              style={{ width: `${(d.value / max) * 100}%`, animationDelay: `${i * 50}ms` }}
            />
          </span>
          <span className="minibars-val numeric">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}
