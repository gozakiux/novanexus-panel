import type { Student } from "../data/types";
import { pct } from "../lib/format";
import { contarPor, matriculasPorMes, nivelBreakdown } from "../lib/stats";
import { Avatar, KPI, NivelTag } from "./atoms";
import { BandBar, MiniBars, MonthsBar } from "./charts";
import { ScoreBar } from "./ScoreRing";
import { IconSpark } from "./icons";

export function Dashboard({
  students,
  all,
  onOpen,
}: {
  students: Student[];
  all: Student[];
  onOpen: (id: string) => void;
}) {
  const total = students.length;
  const validados = students.filter((s) => s.estadoPago === "Validado").length;
  const recompradores = students.filter((s) => s.recompro).length;
  const bands = nivelBreakdown(students);

  // Candidatos: alumnos de Nueva Sendas con puntaje alto, aún no captados por Nova Nexus.
  const candidatos = all
    .filter((s) => s.marca === "Nueva Sendas" && s.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const porProfesion = contarPor(students, (s) => s.profesion, 6);
  const porDistrito = contarPor(students, (s) => s.distrito, 6);
  const meses = matriculasPorMes(students, 12);

  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Resumen general</p>
          <h1 className="page-title">Buenos días, equipo Sendas</h1>
          <p className="page-sub">
            Hoy es viernes 20 de junio de 2026 · {total} alumnos en vista
          </p>
        </div>
      </header>

      <section className="kpi-row">
        <KPI label="Alumnos totales" value={String(total)} hint="en la marca activa" accent="pine" />
        <KPI
          label="Pago validado"
          value={`${pct(validados, total)}%`}
          hint={`${validados} con comprobante`}
          accent="gold"
        />
        <KPI
          label="Recompra histórica"
          value={`${pct(recompradores, total)}%`}
          hint={`${recompradores} ya recompraron`}
          accent="clay"
        />
        <KPI
          label="Candidatos a Nova Nexus"
          value={String(candidatos.length ? candidatos.length : bands.Alto)}
          hint="propensión alta"
          accent="plum"
        />
      </section>

      <div className="grid-2">
        <section className="card pad">
          <div className="card-head">
            <h3>Matrículas por mes</h3>
            <span className="muted">últimos 12 meses</span>
          </div>
          <MonthsBar data={meses} />
        </section>

        <section className="card pad">
          <div className="card-head">
            <h3>Distribución de propensión</h3>
            <span className="muted">{total} alumnos</span>
          </div>
          <BandBar alto={bands.Alto} medio={bands.Medio} bajo={bands.Bajo} />
          <div className="grid-2 tight" style={{ marginTop: 18 }}>
            <div>
              <p className="mini-title">Por profesión</p>
              <MiniBars data={porProfesion} />
            </div>
            <div>
              <p className="mini-title">Por distrito</p>
              <MiniBars data={porDistrito} />
            </div>
          </div>
        </section>
      </div>

      <section className="card pad candidates">
        <div className="card-head">
          <h3>
            <span className="spark">
              <IconSpark />
            </span>
            Mejores candidatos para el Diplomado TENCA
          </h3>
          <span className="muted">de Nueva Sendas, por propensión a recomprar</span>
        </div>
        <ul className="cand-list">
          {candidatos.map((s) => (
            <li key={s.id} className="cand-item" onClick={() => onOpen(s.id)}>
              <Avatar nombre={s.nombre} marca={s.marca} />
              <div className="cand-main">
                <strong>{s.nombre}</strong>
                <span className="muted">
                  {s.profesion} · {s.distrito}
                </span>
              </div>
              <div className="cand-score">
                <ScoreBar score={s.score} nivel={s.nivel} />
              </div>
              <NivelTag nivel={s.nivel} />
            </li>
          ))}
          {candidatos.length === 0 && (
            <li className="empty">No hay candidatos de alta propensión en esta vista.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
