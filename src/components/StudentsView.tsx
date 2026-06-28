import { useMemo, useState } from "react";
import type { Student } from "../data/types";
import { fechaCorta } from "../lib/format";
import { Avatar, BrandTag, NivelTag, PagoTag } from "./atoms";
import { ScoreBar } from "./ScoreRing";
import { IconExport, IconSearch } from "./icons";
import { exportarAlumnosCSV } from "../lib/exportCsv";

const TODOS = "Todos";
const MAX_FILAS = 300;

const SEG_LABEL: Record<string, string> = {
  "con-correo": "Contactables por correo",
  "sin-correo": "Sin correo (solo teléfono)",
  recompradores: "Recompradores (2+)",
  recurrentes: "Muy recurrentes (3+)",
  alto: "Propensión alta",
  "nova-nexus": "Guardados en Nova Nexus",
  pago: "Pago validado",
  todos: "Todos",
};

function unique(students: Student[], key: (s: Student) => string): string[] {
  const vals = [...new Set(students.map(key).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es-PE")
  );
  return [TODOS, ...vals];
}

export function StudentsView({
  students,
  onOpen,
  isReal = false,
  prefilter = null,
  onClearPrefilter,
}: {
  students: Student[];
  onOpen: (id: string) => void;
  isReal?: boolean;
  prefilter?: string | null;
  onClearPrefilter?: () => void;
}) {
  const [q, setQ] = useState("");
  const [distrito, setDistrito] = useState(TODOS);
  const [profesion, setProfesion] = useState(TODOS);
  const [nivel, setNivel] = useState(TODOS);
  const [pago, setPago] = useState(TODOS);
  const [genero, setGenero] = useState(TODOS);
  const [recompra, setRecompra] = useState(TODOS);

  const distritos = useMemo(() => (isReal ? [TODOS] : unique(students, (s) => s.distrito)), [students, isReal]);
  const profesiones = useMemo(() => (isReal ? [TODOS] : unique(students, (s) => s.profesion)), [students, isReal]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return students.filter((s) => {
      if (term && !`${s.nombre} ${s.dni} ${s.correo} ${s.celular}`.toLowerCase().includes(term)) return false;
      if (nivel !== TODOS && s.nivel !== nivel) return false;
      if (prefilter === "con-correo" && !s.correo.includes("@")) return false;
      if (prefilter === "recompradores" && !s.recompro) return false;
      if (prefilter === "alto" && s.nivel !== "Alto") return false;
      if (prefilter === "pago" && s.estadoPago !== "Validado") return false;
      if (prefilter === "recurrentes" && s.numeroCompras < 3) return false;
      if (prefilter === "sin-correo" && s.correo.includes("@")) return false;
      if (prefilter === "nova-nexus" && s.marca !== "Nova Nexus") return false;
      if (isReal) {
        if (recompra === "Recompradores" && !s.recompro) return false;
        if (recompra === "Una compra" && s.recompro) return false;
      } else {
        if (distrito !== TODOS && s.distrito !== distrito) return false;
        if (profesion !== TODOS && s.profesion !== profesion) return false;
        if (pago !== TODOS && s.estadoPago !== pago) return false;
        if (genero !== TODOS && s.genero !== genero) return false;
      }
      return true;
    });
  }, [students, q, distrito, profesion, nivel, pago, genero, recompra, isReal, prefilter]);

  const visible = filtered.slice(0, MAX_FILAS);

  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Base de datos {isReal ? "· Nueva Sendas" : ""}</p>
          <h1 className="page-title">Directorio de alumnos</h1>
          <p className="page-sub">
            {filtered.length.toLocaleString("es-PE")} de{" "}
            {students.length.toLocaleString("es-PE")} alumnos · clic en una fila para ver la ficha
          </p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => exportarAlumnosCSV("alumnos", filtered)}
        >
          <IconExport /> Exportar a Excel
        </button>
      </header>

      {prefilter && prefilter !== "todos" && (
        <div className="seg-active">
          <span>
            Mostrando: <strong>{SEG_LABEL[prefilter] ?? prefilter}</strong> ·{" "}
            {filtered.length.toLocaleString("es-PE")}
          </span>
          {onClearPrefilter && (
            <button onClick={onClearPrefilter} aria-label="Quitar segmento">
              ✕
            </button>
          )}
        </div>
      )}

      <div className="filters">
        <label className="search">
          <IconSearch />
          <input
            placeholder="Buscar por nombre, correo, celular o DNI…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <Select label="Nivel" value={nivel} setValue={setNivel} opts={[TODOS, "Alto", "Medio", "Bajo"]} />
        {isReal ? (
          <Select
            label="Recompra"
            value={recompra}
            setValue={setRecompra}
            opts={[TODOS, "Recompradores", "Una compra"]}
          />
        ) : (
          <>
            <Select label="Distrito" value={distrito} setValue={setDistrito} opts={distritos} />
            <Select label="Profesión" value={profesion} setValue={setProfesion} opts={profesiones} />
            <Select label="Pago" value={pago} setValue={setPago} opts={[TODOS, "Validado", "Pendiente", "Sin pago"]} />
            <Select label="Género" value={genero} setValue={setGenero} opts={[TODOS, "Femenino", "Masculino"]} />
          </>
        )}
      </div>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>{isReal ? "Programa" : "Profesión"}</th>
              <th>{isReal ? "Años" : "Distrito"}</th>
              <th>{isReal ? "N.° prog." : "Matrícula"}</th>
              <th>Marca</th>
              <th>{isReal ? "Recompra" : "Pago"}</th>
              <th className="th-score">Propensión</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id} tabIndex={0} onClick={() => onOpen(s.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(s.id); } }}>
                <td>
                  <div className="cell-name">
                    <Avatar nombre={s.nombre} marca={s.marca} size={34} />
                    <div>
                      <strong>{s.nombre}</strong>
                      <span className="muted small">
                        {isReal ? (s.correo || "Sin correo") : s.genero}
                      </span>
                    </div>
                  </div>
                </td>
                <td title={isReal ? s.programasRaw : undefined}>
                  {isReal ? s.programa : s.profesion || "—"}
                </td>
                <td className="muted">{isReal ? s.aniosRaw || "—" : s.distrito || "—"}</td>
                <td className="muted numeric">
                  {isReal ? s.numeroCompras : s.fechaMatricula ? fechaCorta(s.fechaMatricula) : "—"}
                </td>
                <td><BrandTag marca={s.marca} /></td>
                <td>
                  {isReal ? (
                    <span className={`tag ${s.recompro ? "tag-alto" : "tag-bajo"}`}>
                      {s.recompro ? "Recompró" : "1 programa"}
                    </span>
                  ) : (
                    <PagoTag estado={s.estadoPago} />
                  )}
                </td>
                <td>
                  <div className="cell-score">
                    <ScoreBar score={s.score} nivel={s.nivel} />
                    <NivelTag nivel={s.nivel} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty pad">Ningún alumno coincide con esos filtros.</div>
        )}
        {filtered.length > MAX_FILAS && (
          <div className="table-foot">
            Mostrando {MAX_FILAS} de {filtered.length.toLocaleString("es-PE")} · refiná con la
            búsqueda o los filtros para acotar.
          </div>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  setValue,
  opts,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  opts: string[];
}) {
  return (
    <label className="select">
      <span>{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
