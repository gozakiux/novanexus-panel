import type { Student } from "../data/types";
import { pct } from "../lib/format";
import { contarPor, matriculasPorAnio, nivelBreakdown } from "../lib/stats";
import { Avatar, KPI, NivelTag } from "./atoms";
import { BandBar, MiniBars, MonthsBar } from "./charts";
import { ScoreBar } from "./ScoreRing";
import { IconSpark } from "./icons";

export function Dashboard({
  students,
  all,
  onOpen,
  onSegment,
  isReal = false,
}: {
  students: Student[];
  all: Student[];
  onOpen: (id: string) => void;
  onSegment: (key: string) => void;
  isReal?: boolean;
}) {
  const hoy = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const total = students.length;
  const validados = students.filter((s) => s.estadoPago === "Validado").length;
  const conCorreo = students.filter((s) => s.correo.includes("@")).length;
  const recompradores = students.filter((s) => s.recompro).length;
  const bands = nivelBreakdown(students);

  // Candidatos: alumnos de Nueva Sendas con puntaje alto, aún no captados por Nova Nexus.
  const candidatos = all
    .filter((s) => s.marca === "Nueva Sendas" && s.nivel === "Alto")
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const porPrograma = contarPor(
    students.filter((s) => s.programa),
    (s) => s.programa,
    7
  );
  const porAnio = matriculasPorAnio(students);

  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Resumen general</p>
          <h1 className="page-title">Buenos días, equipo Sendas</h1>
          <p className="page-sub">
            Hoy es {hoy} · {total.toLocaleString("es-PE")} alumnos en vista
          </p>
        </div>
      </header>

      <section className="kpi-row">
        <KPI
          label="Alumnos totales"
          value={total.toLocaleString("es-PE")}
          hint="en la marca activa"
          accent="pine"
          onClick={() => onSegment("todos")}
        />
        {isReal ? (
          <KPI
            label="Contactables por correo"
            value={`${pct(conCorreo, total)}%`}
            hint={`${conCorreo.toLocaleString("es-PE")} con correo`}
            accent="gold"
            onClick={() => onSegment("con-correo")}
          />
        ) : (
          <KPI
            label="Pago validado"
            value={`${pct(validados, total)}%`}
            hint={`${validados} con comprobante`}
            accent="gold"
            onClick={() => onSegment("pago")}
          />
        )}
        <KPI
          label="Recompra histórica"
          value={`${pct(recompradores, total)}%`}
          hint={`${recompradores.toLocaleString("es-PE")} ya recompraron`}
          accent="clay"
          onClick={() => onSegment("recompradores")}
        />
        <KPI
          label="Candidatos a Nova Nexus"
          value={bands.Alto.toLocaleString("es-PE")}
          hint="propensión alta"
          accent="plum"
          onClick={() => onSegment("alto")}
        />
      </section>

      <div className="grid-2">
        <section className="card pad">
          <div className="card-head">
            <h3>Matrículas por año</h3>
            <span className="muted">{porAnio.length} años</span>
          </div>
          <MonthsBar data={porAnio} label="Matrículas por año" />
        </section>

        <section className="card pad">
          <div className="card-head">
            <h3>Distribución de propensión</h3>
            <span className="muted">{total.toLocaleString("es-PE")} alumnos</span>
          </div>
          <BandBar alto={bands.Alto} medio={bands.Medio} bajo={bands.Bajo} />
          <div style={{ marginTop: 18 }}>
            <p className="mini-title">Programas más llevados</p>
            <MiniBars data={porPrograma} />
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
            <li
              key={s.id}
              className="cand-item"
              tabIndex={0}
              role="button"
              onClick={() => onOpen(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(s.id);
                }
              }}
            >
              <Avatar nombre={s.nombre} marca={s.marca} />
              <div className="cand-main">
                <strong>{s.nombre}</strong>
                <span className="muted">
                  {isReal
                    ? `${s.programa}${s.aniosRaw ? " · " + s.aniosRaw : ""}`
                    : `${s.profesion} · ${s.distrito}`}
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
